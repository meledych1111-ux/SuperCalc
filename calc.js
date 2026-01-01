// calc.js — безопасный калькулятор без eval, с поддержкой дробей и научных функций

document.addEventListener('DOMContentLoaded', () => {
  // === Глобальное состояние ===
  let currentInput = "";
  let memoryValue = 0;
  let history = [];
  let roundingMode = "fixed";     // "fixed" | "scientific" | "precise"
  let roundingDigits = 6;

  // === DOM элементы ===
  const display = document.getElementById("display");
  const toggleSciBtn = document.getElementById("toggleSciBtn");
  const sciFunctions = document.getElementById("sciFunctions");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const historyList = document.getElementById("historyList");

  // === Вспомогательные функции ===
  function updateDisplay(val) {
    display.textContent = val === "" ? "0" : val;
  }

  function renderHistory() {
    if (historyList) {
      historyList.innerHTML = history.map(item => `<li>${item}</li>`).join("");
    }
  }

  function addToHistory(expr, res) {
    if (res === "Ошибка") return;
    history.unshift(`${expr} = ${res}`);
    if (history.length > 10) history.pop();
    renderHistory();
  }

  function clearHistory() {
    history = [];
    renderHistory();
  }

  function formatDecimal(value) {
    if (typeof value !== 'number' || !isFinite(value)) return "Ошибка";
    if (Number.isInteger(value)) return String(value);
    if (roundingMode === "fixed") {
      return value.toFixed(roundingDigits);
    }
    if (roundingMode === "scientific") {
      return value.toExponential(Math.max(0, roundingDigits - 1));
    }
    return String(value);
  }

  function formatFractionResult(frac) {
    const decimal = frac.toDecimal();
    const decimalStr = formatDecimal(decimal);
    const exact = frac.toString();
    return `${decimalStr} ≈ ${exact}`;
  }

  // === Безопасные математические функции ===
  const mathFunctions = {
    sin: x => Math.sin(x),
    cos: x => Math.cos(x),
    tan: x => Math.tan(x),
    asin: x => Math.asin(x),
    acos: x => Math.acos(x),
    atan: x => Math.atan(x),
    sinh: x => Math.sinh(x),
    cosh: x => Math.cosh(x),
    tanh: x => Math.tanh(x),
    sqrt: x => Math.sqrt(x),
    log10: x => Math.log10(x),
    ln: x => Math.log(x),
    log2: x => Math.log2(x),
    exp: x => Math.exp(x),
    abs: x => Math.abs(x),
    ceil: x => Math.ceil(x),
    floor: x => Math.floor(x),
    round: x => Math.round(x),
    factorial: x => {
      if (x < 0 || !Number.isInteger(x)) return NaN;
      let res = 1;
      for (let i = 2; i <= x; i++) res *= i;
      return res;
    }
  };

  // === Простой вычислитель выражений (без скобок и функций) ===
  function evaluateSimple(expr) {
    try {
      expr = expr.trim().replace(/\s+/g, "");
      if (!expr) return 0;

      expr = expr
        .replace(/\+\-/g, "-")
        .replace(/\-\+/g, "-")
        .replace(/\-\-/g, "+")
        .replace(/\+\+/g, "+");

      const tokens = [];
      let current = "";
      for (let char of expr) {
        if ("+-*/".includes(char)) {
          if (current !== "") tokens.push(current);
          tokens.push(char);
          current = "";
        } else {
          current += char;
        }
      }
      if (current !== "") tokens.push(current);

      if (tokens.length === 0) return 0;
      if (tokens.length === 1) return parseFloat(tokens[0]);

      if (tokens[0] === "+" || tokens[0] === "-") {
        tokens[1] = tokens[0] + tokens[1];
        tokens.shift();
      }

      // * и /
      let i = 1;
      while (i < tokens.length) {
        if (tokens[i] === "*") {
          tokens[i - 1] = parseFloat(tokens[i - 1]) * parseFloat(tokens[i + 1]);
          tokens.splice(i, 2);
        } else if (tokens[i] === "/") {
          const d = parseFloat(tokens[i + 1]);
          if (d === 0) return NaN;
          tokens[i - 1] = parseFloat(tokens[i - 1]) / d;
          tokens.splice(i, 2);
        } else {
          i += 2;
        }
      }

      // + и -
      let result = parseFloat(tokens[0]);
      for (let j = 1; j < tokens.length; j += 2) {
        const op = tokens[j];
        const num = parseFloat(tokens[j + 1]);
        if (op === "+") result += num;
        else if (op === "-") result -= num;
        else return NaN;
      }
      return result;
    } catch (e) {
      return NaN;
    }
  }

  // === Рекурсивный вычислитель с функциями и скобками ===
  function safeEvaluate(expr) {
    expr = expr.trim();
    if (!expr) return 0;

    expr = expr
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")
      .replace(/π/g, "pi")
      .replace(/\bpi\b/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E));

    let changed;
    do {
      changed = false;
      // Функции: sin(1.57) → 1
      expr = expr.replace(/\b([a-z]+)\(([^()]*)\)/g, (match, fn, argStr) => {
        if (!mathFunctions[fn]) return match;
        changed = true;
        const arg = parseFloat(argStr);
        if (!isFinite(arg)) return "NaN";
        const res = mathFunctions[fn](arg);
        return isFinite(res) ? String(res) : "NaN";
      });

      // Скобки: (2+3) → 5
      expr = expr.replace(/\(([^()]*)\)/g, (match, inner) => {
        changed = true;
        const res = safeEvaluate(inner);
        return isFinite(res) ? String(res) : "NaN";
      });
    } while (changed && expr.includes("("));

    const result = evaluateSimple(expr);
    return result;
  }

  // === Парсер дробей (если Fraction доступен) ===
  function evaluateFractionExpression(expr) {
    if (typeof window.Fraction !== 'function') {
      throw new Error("Fraction не определён");
    }

    expr = expr.trim()
      .replace(/\s+/g, "")
      .replace(/÷/g, "/");

    // Обработка скобок
    while (expr.includes("(")) {
      let changed = false;
      expr = expr.replace(/\([^()]+\)/g, (sub) => {
        const inner = sub.slice(1, -1);
        const frac = evaluateFractionExpression(inner);
        changed = true;
        return `${frac.num}/${frac.den}`;
      });
      if (!changed) break;
    }

    const raw = expr.split(/([+\-*\/])/).filter(t => t);
    const tokens = [];
    for (let i = 0; i < raw.length; i++) {
      const t = raw[i];
      if ((t === "+" || t === "-") && (i === 0 || /[+\-*\/]/.test(raw[i - 1]))) {
        tokens.push(t + (raw[i + 1] || "0"));
        i++;
      } else {
        tokens.push(t);
      }
    }

    if (tokens.length === 0) return new Fraction(0);
    let result = parseTokenToFraction(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const right = parseTokenToFraction(tokens[i + 1]);
      if (op === "+") result = result.add(right);
      else if (op === "-") result = result.sub(right);
      else if (op === "*") result = result.mul(right);
      else if (op === "/") result = result.div(right);
      else throw new Error("Неизвестный оператор");
    }
    return result;
  }

  function parseTokenToFraction(str) {
    if (str.includes("/")) {
      const [n, d] = str.split("/");
      return new Fraction(parseFloat(n), parseFloat(d));
    }
    return new Fraction(parseFloat(str));
  }

  // === Основная функция вычисления ===
  function calculateExpression(expr) {
    try {
      expr = (expr || "").trim();
      if (!expr) return "0";

      // Проверка на дробь: содержит "a/b", но не "log2(" и т.п.
      const hasFraction = /(?<!\w)\d+\s*\/\s*\d+(?!\w)/.test(expr);

      if (hasFraction && typeof window.Fraction === 'function') {
        const frac = evaluateFractionExpression(expr);
        return formatFractionResult(frac);
      }

      const numResult = safeEvaluate(expr);
      if (!isFinite(numResult)) throw new Error("Недопустимый результат");
      return formatDecimal(numResult);

    } catch (e) {
      return "Ошибка";
    }
  }

  // === Обработка кнопок ===
  function handleButtonClick(btn) {
    const val = btn.dataset.value;
    const func = btn.dataset.func;

    // Память
    if (btn.classList.contains("memory")) {
      const num = parseFloat(currentInput || "0") || 0;
      switch (func) {
        case "MC": memoryValue = 0; return;
        case "MR": currentInput = String(memoryValue); updateDisplay(currentInput); return;
        case "M+": memoryValue += num; return;
        case "M-": memoryValue -= num; return;
      }
    }

    // Равно
    if (btn.classList.contains("equal")) {
      if (!currentInput.trim()) return;
      const result = calculateExpression(currentInput);
      addToHistory(currentInput, result);
      display.textContent = result.includes("≈") ? result : `${currentInput} = ${result}`;
      currentInput = result;
      return;
    }

    // Научные функции
    const sciFuncs = ["sin","cos","tan","asin","acos","atan","sinh","cosh","tanh","sqrt","log10","ln","log2","exp","abs","ceil","floor","round","factorial"];
    if (func && sciFuncs.includes(func)) {
      currentInput += func + '(';
      updateDisplay(currentInput);
      return;
    }

    // Константы
    if (btn.classList.contains("const")) {
      const last = currentInput.slice(-1);
      const needsMult = last !== '' && !"+-*/(".includes(last);
      currentInput += (needsMult ? "*" : "") + (val === "pi" ? "pi" : "e");
      updateDisplay(currentInput);
      return;
    }

    // Смена знака
    if (btn.classList.contains("sign")) {
      currentInput = String(-parseFloat(currentInput || "0"));
      updateDisplay(currentInput);
      return;
    }

    // Backspace
    if (btn.classList.contains("backspace")) {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput);
      return;
    }

    // Очистка
    if (btn.classList.contains("clear")) {
      currentInput = "";
      updateDisplay("0");
      return;
    }

    // Округление
    if (func === "fixed2") { roundingMode = "fixed"; roundingDigits = 2; }
    else if (func === "fixed6") { roundingMode = "fixed"; roundingDigits = 6; }
    else if (func === "sci") { roundingMode = "scientific"; roundingDigits = 6; }
    else if (func === "precise") { roundingMode = "precise"; }
    else if (val) {
      currentInput += val;
      updateDisplay(currentInput);
      return;
    }

    // Применить округление к текущему результату
    if (["fixed2","fixed6","sci","precise"].includes(func) && currentInput) {
      const expr = currentInput;
      const result = calculateExpression(expr);
      addToHistory(expr, result);
      display.textContent = result;
      current = result;
    }
  }

  // === Инициализация обработчиков ===
  document.querySelectorAll("#calc .btn").forEach(btn => {
    btn.addEventListener("click", () => handleButtonClick(btn));
  });

  // === Научные функции: переключатель ===
  if (toggleSciBtn && sciFunctions) {
    toggleSciBtn.addEventListener("click", () => {
      sciFunctions.classList.toggle("hidden");
      toggleSciBtn.textContent = sciFunctions.classList.contains("hidden")
        ? "Научные функции ⬇"
        : "Научные функции ⬆";
    });
  }

  // === История ===
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", clearHistory);
  }

  // === Старт ===
  updateDisplay("0");
});
