// calc.js — исправленный, полностью рабочий калькулятор
document.addEventListener('DOMContentLoaded', () => {
  let currentInput = "";
  let memoryValue = 0;
  let history = [];
  let roundingMode = "fixed"; // "fixed" | "scientific" | "precise"
  let roundingDigits = 6;

  // DOM
  const display = document.getElementById("display");
  const toggleSciBtn = document.getElementById("toggleSciBtn");
  const sciBlock = document.getElementById("sciFunctions");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const historyList = document.getElementById("historyList");

  // Обновление дисплея
  function updateDisplay(val) {
    display.textContent = val === "" ? "0" : val;
  }

  // История
  function renderHistory() {
    if (historyList) {
      historyList.innerHTML = history.map(item => `<li>${item}</li>`).join("");
    }
  }

  function addToHistory(expr, res) {
    if (res !== "Ошибка" && expr.trim()) {
      history.unshift(`${expr} = ${res}`);
      if (history.length > 10) history.pop();
      renderHistory();
    }
  }

  function clearHistory() {
    history = [];
    renderHistory();
  }
  if (clearHistoryBtn) clearHistoryBtn.addEventListener("click", clearHistory);

  // Форматирование числа
  function formatNumber(value) {
    if (typeof value !== 'number' || !isFinite(value)) return "Ошибка";
    if (Number.isInteger(value)) return String(value);
    if (roundingMode === "fixed") return value.toFixed(roundingDigits);
    if (roundingMode === "scientific") return value.toExponential(Math.max(0, roundingDigits - 1));
    return String(value);
  }

  // Математические функции
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

  // Простой вычислитель с приоритетом
  function evaluateSimple(expr) {
    if (!expr) return 0;
    expr = expr.replace(/\s+/g, "");
    if (!expr) return 0;

    expr = expr
      .replace(/\+\+/g, "+")
      .replace(/\+-/g, "-")
      .replace(/--/g, "+")
      .replace(/-\+/g, "-");

    const tokens = [];
    let current = "";
    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];
      if (char === '+' || char === '-') {
        if (i === 0 || "+-*/(".includes(expr[i - 1])) {
          current += char;
        } else {
          if (current !== "") tokens.push(current);
          tokens.push(char);
          current = "";
        }
      } else if (char === '*' || char === '/' || char === '**') {
        if (current !== "") tokens.push(current);
        // Обработка **
        if (char === '*' && expr[i + 1] === '*') {
          tokens.push("**");
          i++; // пропустить второй *
        } else {
          tokens.push(char);
        }
        current = "";
      } else {
        current += char;
      }
    }
    if (current !== "") tokens.push(current);

    if (tokens.length === 0) return 0;
    if (tokens.length === 1) return parseFloat(tokens[0]);

    // Сначала **
    let i = 1;
    while (i < tokens.length) {
      if (tokens[i] === "**") {
        const left = parseFloat(tokens[i - 1]);
        const right = parseFloat(tokens[i + 1]);
        tokens[i - 1] = left ** right;
        tokens.splice(i, 2);
      } else {
        i += 2;
      }
    }

    // Потом * и /
    i = 1;
    while (i < tokens.length) {
      if (tokens[i] === "*") {
        const left = parseFloat(tokens[i - 1]);
        const right = parseFloat(tokens[i + 1]);
        tokens[i - 1] = left * right;
        tokens.splice(i, 2);
      } else if (tokens[i] === "/") {
        const left = parseFloat(tokens[i - 1]);
        const right = parseFloat(tokens[i + 1]);
        if (right === 0) return NaN;
        tokens[i - 1] = left / right;
        tokens.splice(i, 2);
      } else {
        i += 2;
      }
    }

    // Потом + и -
    let result = parseFloat(tokens[0]);
    for (let j = 1; j < tokens.length; j += 2) {
      const op = tokens[j];
      const num = parseFloat(tokens[j + 1]);
      if (op === "+") result += num;
      else if (op === "-") result -= num;
      else return NaN;
    }
    return result;
  }

  // Рекурсивный вычислитель
  function safeEvaluate(expr) {
    expr = expr.trim();
    if (!expr) return 0;

    expr = expr
      .replace(/÷/g, "/")
      .replace(/π/g, "pi")
      .replace(/\bpi\b/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E));

    let changed;
    do {
      changed = false;
      expr = expr.replace(/\b([a-z]+)\(([^()]*)\)/g, (match, fn, argStr) => {
        if (!mathFunctions[fn]) return match;
        changed = true;
        const arg = parseFloat(argStr);
        if (!isFinite(arg)) return "NaN";
        const res = mathFunctions[fn](arg);
        return isFinite(res) ? String(res) : "NaN";
      });

      expr = expr.replace(/\(([^()]*)\)/g, (match, inner) => {
        changed = true;
        const res = safeEvaluate(inner);
        return isFinite(res) ? String(res) : "NaN";
      });
    } while (changed && expr.includes("("));

    return evaluateSimple(expr);
  }

  // Парсер чистых дробей (без степеней и функций)
  function evaluateFractionExpression(expr) {
    if (typeof window.Fraction !== 'function') return null;
    try {
      expr = expr.replace(/\s+/g, "");
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
      let result = parseToFraction(tokens[0]);
      for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        const right = parseToFraction(tokens[i + 1]);
        if (op === "+") result = result.add(right);
        else if (op === "-") result = result.sub(right);
        else if (op === "*") result = result.mul(right);
        else if (op === "/") result = result.div(right);
      }
      return result;
    } catch (e) {
      return null;
    }
  }

  function parseToFraction(str) {
    if (str.includes("/")) {
      const [n, d] = str.split("/");
      return new Fraction(parseFloat(n), parseFloat(d));
    }
    return new Fraction(parseFloat(str));
  }

  // ОСНОВНАЯ ФУНКЦИЯ
  function calculateExpression(expr) {
    try {
      expr = expr.trim();
      if (!expr) return "0";

      // Замена ^ на ** ВЕЗДЕ
      expr = expr.replace(/\^/g, "**");

      // Проверка: чисто дроби? (без **, без функций)
      const isPureFraction = 
        !expr.includes("**") &&
        !expr.match(/\b[a-z]+\(/) &&
        /^\s*\d+\s*\/\s*\d+\s*([+\-*\/]\s*\d+\s*\/\s*\d+\s*)*$/g.test(expr.replace(/\s+/g, ""));

      if (isPureFraction && typeof window.Fraction === 'function') {
        const frac = evaluateFractionExpression(expr);
        const dec = frac.toDecimal();
        const decStr = formatNumber(dec);
        return `${decStr} ≈ ${frac.toString()}`;
      }

      // Всё остальное — через десятичный вычислитель
      const numResult = safeEvaluate(expr);
      if (!isFinite(numResult)) throw new Error("Недопустимый результат");
      return formatNumber(numResult);
    } catch (e) {
      return "Ошибка";
    }
  }

  // Обработка кнопок
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
      // Автоматически закрываем незакрытые sqrt
      let exprToCalc = currentInput;
      if (exprToCalc.includes("sqrt(") && !exprToCalc.endsWith(")")) {
        // Находим последний sqrt( и закрываем его
        const lastSqrt = exprToCalc.lastIndexOf("sqrt(");
        if (lastSqrt !== -1) {
          const before = exprToCalc.substring(0, lastSqrt + 5);
          const after = exprToCalc.substring(lastSqrt + 5);
          // Закрываем скобку в конце
          exprToCalc = before + after + ")";
        }
      }
      const result = calculateExpression(exprToCalc);
      addToHistory(currentInput, result);
      updateDisplay(result);
      currentInput = "";
      return;
    }

    // Корень — вставляем sqrt(
    if (func === "sqrt") {
      currentInput += "sqrt(";
      updateDisplay(currentInput);
      return;
    }

    // x², x³
    if (func === "square") {
      if (currentInput !== "") currentInput += "^2";
      updateDisplay(currentInput);
      return;
    }
    if (func === "cube") {
      if (currentInput !== "") currentInput += "^3";
      updateDisplay(currentInput);
      return;
    }

    // Научные функции
    const sciFuncs = ["sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh",
      "log10", "ln", "log2", "exp", "abs", "ceil", "floor", "round", "factorial"];
    if (func && sciFuncs.includes(func)) {
      currentInput += func + "(";
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
      if (currentInput === "") return;
      const parts = currentInput.split(/([+\-*\/^()])/);
      let last = parts[parts.length - 1];
      if (last === "") return;
      if (last.startsWith("-")) last = last.slice(1);
      else last = "-" + last;
      parts[parts.length - 1] = last;
      currentInput = parts.join("");
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
  }

  // Назначение обработчиков
  document.querySelectorAll("#calc .btn").forEach(btn => {
    btn.addEventListener("click", () => handleButtonClick(btn));
  });

  // Научные функции
  if (toggleSciBtn && sciBlock) {
    toggleSciBtn.addEventListener("click", () => {
      sciBlock.classList.toggle("hidden");
      toggleSciBtn.textContent = sciBlock.classList.contains("hidden")
        ? "Научные функции ⬇"
        : "Научные функции ⬆";
    });
  }

  updateDisplay("0");
});
