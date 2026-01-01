// calc.js — полная версия: калькулятор, решатель уравнений, градусы
document.addEventListener('DOMContentLoaded', () => {
  // =============== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===============
  let currentInput = "";
  let memoryValue = 0;
  let history = [];
  let roundingMode = "fixed";
  let roundingDigits = 6;
  let angleMode = "rad"; // "rad" или "deg"

  // =============== DOM ===============
  const display = document.getElementById("display");
  const toggleSciBtn = document.getElementById("toggleSciBtn");
  const sciBlock = document.getElementById("sciFunctions");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const historyList = document.getElementById("historyList");

  // =============== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===============
  function updateDisplay(val) {
    display.textContent = val === "" ? "0" : val;
  }

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

  function formatNumber(value) {
    if (typeof value !== 'number' || !isFinite(value)) return "Ошибка";
    if (Number.isInteger(value)) return String(value);
    if (roundingMode === "fixed") return value.toFixed(roundingDigits);
    if (roundingMode === "scientific") return value.toExponential(Math.max(0, roundingDigits - 1));
    return String(value);
  }

  // =============== НАУЧНЫЕ ФУНКЦИИ С ГРАДУСАМИ ===============
  const mathFunctions = {
    sin: x => Math.sin(angleMode === "deg" ? x * Math.PI / 180 : x),
    cos: x => Math.cos(angleMode === "deg" ? x * Math.PI / 180 : x),
    tan: x => Math.tan(angleMode === "deg" ? x * Math.PI / 180 : x),
    asin: x => {
      const res = Math.asin(x);
      return angleMode === "deg" ? res * 180 / Math.PI : res;
    },
    acos: x => {
      const res = Math.acos(x);
      return angleMode === "deg" ? res * 180 / Math.PI : res;
    },
    atan: x => {
      const res = Math.atan(x);
      return angleMode === "deg" ? res * 180 / Math.PI : res;
    },
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

  // =============== ВЫЧИСЛИТЕЛЬ ===============
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
      } else if (i < expr.length - 1 && char === '*' && expr[i + 1] === '*') {
        if (current !== "") tokens.push(current);
        tokens.push("**");
        i++;
        current = "";
      } else if (char === '*' || char === '/') {
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

    // **
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

    // * и /
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

  function safeEvaluate(expr) {
    expr = expr.trim();
    if (!expr) return 0;

    expr = expr
      .replace(/÷/g, "/")
      .replace(/π/g, "pi")
      .replace(/\bpi\b/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E))
      .replace(/\bx\b/g, "NaN");

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

  function calculateExpression(expr) {
    try {
      expr = expr.trim();
      if (!expr) return "0";

      expr = expr.replace(/\^/g, "**");

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

      const numResult = safeEvaluate(expr);
      if (!isFinite(numResult)) throw new Error("Недопустимый результат");
      return formatNumber(numResult);
    } catch (e) {
      return "Ошибка";
    }
  }

  function applyRounding() {
    let exprToUse = currentInput.trim();
    if (!exprToUse && history.length > 0) {
      const last = history[0];
      const match = last.match(/^(.+) = .+$/);
      if (match) exprToUse = match[1];
    }
    if (exprToUse) {
      const result = calculateExpression(exprToUse);
      updateDisplay(result);
      if (currentInput.trim()) {
        addToHistory(exprToUse, result);
        currentInput = "";
      } else {
        if (history.length > 0) {
          history[0] = `${exprToUse} = ${result}`;
          renderHistory();
        }
      }
    }
  }

  // =============== ОБРАБОТКА КНОПОК КАЛЬКУЛЯТОРА ===============
  function handleButtonClick(btn) {
    const val = btn.dataset.value;
    const func = btn.dataset.func;

    if (btn.classList.contains("memory")) {
      const num = parseFloat(currentInput || "0") || 0;
      switch (func) {
        case "MC": memoryValue = 0; return;
        case "MR": currentInput = String(memoryValue); updateDisplay(currentInput); return;
        case "M+": memoryValue += num; return;
        case "M-": memoryValue -= num; return;
      }
    }

    if (btn.classList.contains("equal")) {
      if (!currentInput.trim()) return;
      let exprToCalc = currentInput;
      if (exprToCalc.includes("sqrt(") && !exprToCalc.endsWith(")")) {
        const lastSqrt = exprToCalc.lastIndexOf("sqrt(");
        if (lastSqrt !== -1) {
          const before = exprToCalc.substring(0, lastSqrt + 5);
          const after = exprToCalc.substring(lastSqrt + 5);
          exprToCalc = before + after + ")";
        }
      }
      const result = calculateExpression(exprToCalc);
      addToHistory(currentInput, result);
      updateDisplay(result);
      currentInput = "";
      return;
    }

    if (func === "fixed2") { roundingMode = "fixed"; roundingDigits = 2; applyRounding(); return; }
    if (func === "fixed6") { roundingMode = "fixed"; roundingDigits = 6; applyRounding(); return; }
    if (func === "sci") { roundingMode = "scientific"; roundingDigits = 6; applyRounding(); return; }
    if (func === "precise") { roundingMode = "precise"; applyRounding(); return; }

    if (func === "toggleDeg") {
      angleMode = angleMode === "deg" ? "rad" : "deg";
      const degBtn = document.querySelector('.btn[data-func="toggleDeg"]');
      if (degBtn) {
        degBtn.textContent = angleMode === "deg" ? "Градусы ✓" : "Градусы";
      }
      return;
    }

    if (func === "sqrt") {
      currentInput += "sqrt(";
      updateDisplay(currentInput);
      return;
    }

    if (func === "square") { if (currentInput !== "") currentInput += "^2"; updateDisplay(currentInput); return; }
    if (func === "cube") { if (currentInput !== "") currentInput += "^3"; updateDisplay(currentInput); return; }

    const sciFuncs = ["sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh",
      "log10", "ln", "log2", "exp", "abs", "ceil", "floor", "round", "factorial"];
    if (func && sciFuncs.includes(func)) {
      currentInput += func + "(";
      updateDisplay(currentInput);
      return;
    }

    if (btn.classList.contains("const")) {
      const last = currentInput.slice(-1);
      const needsMult = last !== '' && !"+-*/(".includes(last);
      currentInput += (needsMult ? "*" : "") + (val === "pi" ? "pi" : "e");
      updateDisplay(currentInput);
      return;
    }

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

    if (btn.classList.contains("backspace")) {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput);
      return;
    }

    if (btn.classList.contains("clear")) {
      currentInput = "";
      updateDisplay("0");
      return;
    }

    if (val) {
      currentInput += val;
      updateDisplay(currentInput);
      return;
    }
  }

  // =============== РЕШАТЕЛЬ УРАВНЕНИЙ ===============
  // Квадратные уравнения
  function solveQuadratic() {
    const a = parseFloat(document.getElementById("eqA").value);
    const b = parseFloat(document.getElementById("eqB").value);
    const c = parseFloat(document.getElementById("eqC").value);
    const resultDiv = document.getElementById("equationResult");

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      resultDiv.textContent = "Ошибка: введите числа";
      return;
    }

    if (Math.abs(a) < 1e-12) {
      resultDiv.textContent = "Ошибка: a ≠ 0";
      return;
    }

    const D = b * b - 4 * a * c;
    if (D > 0) {
      const x1 = (-b + Math.sqrt(D)) / (2 * a);
      const x2 = (-b - Math.sqrt(D)) / (2 * a);
      resultDiv.textContent = `D = ${D}\nx₁ = ${x1.toFixed(6)}\nx₂ = ${x2.toFixed(6)}`;
    } else if (Math.abs(D) < 1e-12) {
      const x = -b / (2 * a);
      resultDiv.textContent = `D = 0\nx = ${x.toFixed(6)}`;
    } else {
      const real = -b / (2 * a);
      const imag = Math.sqrt(-D) / (2 * a);
      resultDiv.textContent = `D = ${D} < 0\nКомплексные корни:\nx = ${real.toFixed(6)} ± ${imag.toFixed(6)}i`;
    }
  }

  function clearQuadratic() {
    document.getElementById("eqA").value = "1";
    document.getElementById("eqB").value = "0";
    document.getElementById("eqC").value = "0";
    document.getElementById("equationResult").textContent = "—";
  }

  // Кубические уравнения — простой численный метод (для целых корней)
  function solveCubic() {
    const a = parseFloat(document.getElementById("cA").value);
    const b = parseFloat(document.getElementById("cB").value);
    const c = parseFloat(document.getElementById("cC").value);
    const d = parseFloat(document.getElementById("cD").value);
    const resultDiv = document.getElementById("cubicResult");

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
      resultDiv.textContent = "Ошибка: введите числа";
      return;
    }

    if (Math.abs(a) < 1e-12) {
      resultDiv.textContent = "Ошибка: a ≠ 0";
      return;
    }

    // Попробуем найти целый корень методом подбора
    const roots = [];
    const possible = [];
    for (let i = -100; i <= 100; i++) {
      if (i === 0) continue;
      if (Math.abs(d % i) < 1e-9) possible.push(i);
    }
    possible.push(0);
    for (let r of possible) {
      const val = a * r**3 + b * r**2 + c * r + d;
      if (Math.abs(val) < 1e-9) {
        roots.push(r);
        break;
      }
    }

    if (roots.length > 0) {
      const r1 = roots[0];
      // Деление многочлена
      const A = a;
      const B = b + A * r1;
      const C = c + B * r1;
      // Решаем квадратное уравнение
      const D = B * B - 4 * A * C;
      if (D >= 0) {
        const r2 = (-B + Math.sqrt(D)) / (2 * A);
        const r3 = (-B - Math.sqrt(D)) / (2 * A);
        resultDiv.textContent = `Корни:\nx₁ = ${r1}\nx₂ = ${r2.toFixed(6)}\nx₃ = ${r3.toFixed(6)}`;
      } else {
        const real = -B / (2 * A);
        const imag = Math.sqrt(-D) / (2 * A);
        resultDiv.textContent = `Один вещественный корень:\nx₁ = ${r1}\nКомплексные:\nx = ${real.toFixed(6)} ± ${imag.toFixed(6)}i`;
      }
    } else {
      resultDiv.textContent = "Не найдено целых корней. Используйте численные методы.";
    }
  }

  function clearCubic() {
    document.getElementById("cA").value = "1";
    document.getElementById("cB").value = "0";
    document.getElementById("cC").value = "0";
    document.getElementById("cD").value = "0";
    document.getElementById("cubicResult").textContent = "—";
  }

  // Система 2x2
  function solveSystem2() {
    const a1 = parseFloat(document.getElementById("sA1").value);
    const b1 = parseFloat(document.getElementById("sB1").value);
    const c1 = parseFloat(document.getElementById("sC1").value);
    const a2 = parseFloat(document.getElementById("sA2").value);
    const b2 = parseFloat(document.getElementById("sB2").value);
    const c2 = parseFloat(document.getElementById("sC2").value);
    const resultDiv = document.getElementById("system2Result");

    if (isNaN(a1) || isNaN(b1) || isNaN(c1) || isNaN(a2) || isNaN(b2) || isNaN(c2)) {
      resultDiv.textContent = "Ошибка: введите числа";
      return;
    }

    const det = a1 * b2 - a2 * b1;
    if (Math.abs(det) < 1e-12) {
      resultDiv.textContent = "Система не имеет единственного решения (Δ = 0)";
    } else {
      const x = (c1 * b2 - c2 * b1) / det;
      const y = (a1 * c2 - a2 * c1) / det;
      resultDiv.textContent = `Δ = ${det.toFixed(6)}\nx = ${x.toFixed(6)}\ny = ${y.toFixed(6)}`;
    }
  }

  function clearSystem2() {
    ["sA1", "sB1", "sC1", "sA2", "sB2", "sC2"].forEach(id => {
      document.getElementById(id).value = "";
    });
    document.getElementById("system2Result").textContent = "—";
  }

  // =============== ИНИЦИАЛИЗАЦИЯ ===============
  // Калькулятор
  document.querySelectorAll("#calc .btn").forEach(btn => {
    btn.addEventListener("click", () => handleButtonClick(btn));
  });

  if (toggleSciBtn && sciBlock) {
    toggleSciBtn.addEventListener("click", () => {
      sciBlock.classList.toggle("hidden");
      toggleSciBtn.textContent = sciBlock.classList.contains("hidden")
        ? "Научные функции ⬇"
        : "Научные функции ⬆";
    });
  }

  // Решатель уравнений
  document.getElementById("solveQuadratic")?.addEventListener("click", solveQuadratic);
  document.getElementById("clearQuadratic")?.addEventListener("click", clearQuadratic);
  document.getElementById("solveCubic")?.addEventListener("click", solveCubic);
  document.getElementById("clearCubic")?.addEventListener("click", clearCubic);
  document.getElementById("solveSystem2")?.addEventListener("click", solveSystem2);
  document.getElementById("clearSystem2")?.addEventListener("click", clearSystem2);

  // Градусы
  const degBtn = document.querySelector('.btn[data-func="toggleDeg"]');
  if (degBtn) degBtn.textContent = "Градусы";

  updateDisplay("0");
});
