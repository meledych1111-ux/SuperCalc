 // ================== Класс дробей ==================
function gcd(a, b) { return b ? gcd(b, a % b) : a; }

class Fraction {
  constructor(num, den = 1) {
    if (den === 0) throw new Error("Знаменатель не может быть равен 0");
    this.num = num;
    this.den = den;
    this.reduce();
  }
  reduce() {
    const g = gcd(Math.abs(this.num), Math.abs(this.den));
    this.num /= g;
    this.den /= g;
    if (this.den < 0) { this.num *= -1; this.den *= -1; }
  }
  add(f) { return new Fraction(this.num * f.den + f.num * this.den, this.den * f.den); }
  sub(f) { return new Fraction(this.num * f.den - f.num * this.den, this.den * f.den); }
  mul(f) { return new Fraction(this.num * f.num, this.den * f.den); }
  div(f) { return new Fraction(this.num * f.den, this.den * f.num); }
  toString() { return this.den === 1 ? `${this.num}` : `${this.num}/${this.den}`; }
  toDecimal() { return this.num / this.den; }
}

// ================== Экран, память и история ==================
const display = document.getElementById("display");
let currentInput = "";
let memoryValue = 0;
let history = [];

function updateDisplay(val) { display.textContent = val; }

function renderHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;
  historyList.innerHTML = history.map(item => `<li>${item}</li>`).join("");
}

function addToHistory(expr, res) {
  history.unshift(`${expr} → ${res}`);
  if (history.length > 10) history.pop();
  renderHistory();
}

function clearHistory() { history = []; renderHistory(); }
document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);

// ================== Настройки округления ==================
let roundingMode = "fixed";     // "fixed" | "scientific" | "precise"
let roundingDigits = 6;         // количество знаков

// ================== Форматирование десятичной части ==================
function formatDecimal(value) {
  if (Number.isInteger(value)) return String(value);

  if (roundingMode === "fixed") {
    return Number(value).toFixed(roundingDigits);
  }
  if (roundingMode === "scientific") {
    const prec = Number(value).toPrecision(roundingDigits);
    return Number(prec).toExponential(Math.max(0, roundingDigits - 1));
  }
  return String(value); // precise
}

// ================== Форматирование результата дроби ==================
function formatFractionResult(frac) {
  const decimal = frac.toDecimal();
  const decimalStr = formatDecimal(decimal);
  const exact = frac.toString();
  return `${decimalStr} ≈ ${exact}`;
}

// ================== Парсер выражений ==================
function calculateExpression(expr) {
  try {
    expr = String(expr || "").trim();
    if (!expr) return "0";

    expr = expr.replace(/\^/g, "**");

    // единицы площади
    if (/^\d+(\.\d+)?\s*cm2$/i.test(expr)) {
      const val = parseFloat(expr);
      const res = `${val} см² = ${(val / 10000).toFixed(4)} м²`;
      addToHistory(expr, res);
      return res;
    }
    if (/^\d+(\.\d+)?\s*m2$/i.test(expr)) {
      const val = parseFloat(expr);
      const res = `${val} м² = ${(val * 10000).toFixed(0)} см²`;
      addToHistory(expr, res);
      return res;
    }

    const hasProperFractions = /\b\d+\s*\/\s*\d+\b/.test(expr);
    if (!hasProperFractions) {
      const jsExpr = expr.replace(/÷/g, "/");
      const numResult = (new Function("return " + jsExpr))();
      const res = formatDecimal(numResult);
      addToHistory(expr, res);
      return res;
    }

    const frac = evaluateFractionExpression(expr);
    const res = formatFractionResult(frac);
    addToHistory(expr, res);
    return res;

  } catch {
    return "Ошибка";
  }
}

function evaluateFractionExpression(expr) {
  expr = String(expr || "").trim();

  // обработка скобок
  while (expr.includes("(")) {
    const before = expr;
    expr = expr.replace(/\([^()]+\)/g, (sub) => {
      const inner = sub.slice(1, -1).trim();
      const f = evaluateFractionExpression(inner);
      return f.toString();
    });
    if (expr === before) break;
  }

  expr = expr.replace(/\s+/g, "")
           .replace(/\+\-/g, "-")
           .replace(/\-\+/g, "-")
           .replace(/\-\-/g, "+")
           .replace(/\+\+/g, "+");

// ВАЖНО: убираем "/" из списка операторов
const raw = expr.split(/([+\-*÷])/).filter(t => t.length);

const tokens = [];
for (let i = 0; i < raw.length; i++) {
  const t = raw[i];
  if ((t === "+" || t === "-") && (i === 0 || /[+\-*÷]/.test(raw[i - 1]))) {
    const next = raw[i + 1];
    tokens.push(t + next);
    i++;
  } else {
    tokens.push(t);
  }
}


  if (tokens.length === 0) return new Fraction(0, 1);

  let result = parseTokenToFraction(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const right = parseTokenToFraction(tokens[i + 1]);

    if (op === "+") result = result.add(right);
    else if (op === "-") result = result.sub(right);
    else if (op === "*") result = result.mul(right);
else if (op === "/" || op === "÷") result = result.div(right);
    else throw new Error("Неизвестный оператор: " + op);
  }

  return result;
}

function parseTokenToFraction(str) {
  const s = String(str).trim();
  if (s === "") throw new Error("Пустой токен");

  if (!s.includes("/")) {
    const n = Number(s);
    if (!Number.isFinite(n)) throw new Error("Некорректное число: " + s);
    return new Fraction(n, 1);
  }

  const parts = s.split("/");
  if (parts.length !== 2) throw new Error("Некорректная дробь: " + s);
  const n = Number(parts[0]);
  const d = Number(parts[1]);
  if (!Number.isFinite(n) || !Number.isFinite(d)) throw new Error("Некорректная дробь: " + s);
  return new Fraction(n, d);
}

// ================== Привязка кнопок округления ==================
document.querySelectorAll(".btn[data-func]").forEach(btn => {
  btn.addEventListener("click", () => {
    const func = btn.dataset.func;
    if (func === "fixed2") {
      roundingMode = "fixed";
      roundingDigits = 2;
    } else if (func === "fixed6") {
      roundingMode = "fixed";
      roundingDigits = 6;
    } else if (func === "sci") {
      roundingMode = "scientific";
      roundingDigits = 6;
    } else if (func === "precise") {
      roundingMode = "precise";
    }
    if (currentInput) {
      updateDisplay(calculateExpression(currentInput));
    }
  });
});

// ================== Научные функции ==================
function factorial(n) {
  if (n < 0) return NaN;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function applyFunction(func, value) {
  switch(func) {
    case "sqrt": return Math.sqrt(value);
    case "square": return Math.pow(value, 2);
    case "cube": return Math.pow(value, 3);
    case "factorial": return factorial(value);
    case "sin": return Math.sin(value);
    case "cos": return Math.cos(value);
    case "tan": return Math.tan(value);
    case "asin": return Math.asin(value);
    case "acos": return Math.acos(value);
    case "atan": return Math.atan(value);
    case "sinh": return Math.sinh(value);
    case "cosh": return Math.cosh(value);
    case "tanh": return Math.tanh(value);
    case "abs": return Math.abs(value);
    case "round": return Math.round(value);
    case "floor": return Math.floor(value);
    case "ceil": return Math.ceil(value);
    case "log10": return Math.log10(value);
    case "ln": return Math.log(value);
    case "log2": return Math.log2(value);
    case "exp": return Math.exp(value);
    case "percent": return value / 100;
    case "fixed2": return parseFloat(value.toFixed(2));
    case "fixed6": return parseFloat(value.toFixed(6));
    case "sci": {
      const num = Number(value);
      return (num >= 1e6 || num <= 1e-6) ? num.toExponential(6) : num.toString();
    }
    case "precise": return Number(value).toPrecision(15);
    default: return value;
  }
}

// ================== Обработка кнопок ==================
document.querySelectorAll("#calc .btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    const func = btn.dataset.func;

    // память
    if (btn.classList.contains("memory")) {
      switch (func) {
        case "MC": memoryValue = 0; break;
        case "MR": currentInput = memoryValue.toString(); updateDisplay(currentInput); break;
        case "M+": memoryValue += parseFloat(currentInput || "0"); break;
        case "M-": memoryValue -= parseFloat(currentInput || "0"); break;
      }
      return;
    }

    // "="
    if (btn.classList.contains("equal")) {
      const expr = currentInput.trim() || display.textContent.trim() || "0";
      const result = calculateExpression(expr);
      display.textContent = `${expr} = ${result}`;
      currentInput = result.includes("≈") ? result.split(" ≈ ")[0] : result;

      // сохраняем в историю максимум 10 последних
      history.push(`${expr} = ${result}`);
      if (history.length > 10) {
        history.shift();
      }
      renderHistory();

      return; // ← важно
    }

    // функции
    if (func) {
      const num = parseFloat(currentInput || "0");
      const result = applyFunction(func, num);
      currentInput = result.toString();
      updateDisplay(currentInput);
      return;
    }

    // константы
    if (btn.classList.contains("const")) {
      if (val === "pi") currentInput += "*" + Math.PI;
      if (val === "e") currentInput += "*" + Math.E;
      updateDisplay(currentInput);
      return;
    }

        // смена знака
    if (btn.classList.contains("sign")) {
      currentInput = String(-parseFloat(currentInput || "0"));
      updateDisplay(currentInput);
      return;
    }

    // backspace
    if (btn.classList.contains("backspace")) {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
      return;
    }

    // очистка
    if (btn.classList.contains("clear")) {
      currentInput = "";
      updateDisplay("0");
      return;
    }

    // добавление символа
    if (val) {
      currentInput += val;
      updateDisplay(currentInput);
      return;
    }
  });
});

// переключатель научных функций
document.getElementById("toggleSciBtn").addEventListener("click", () => {
  const sciBlock = document.getElementById("sciFunctions");
  sciBlock.classList.toggle("hidden");

  const btn = document.getElementById("toggleSciBtn");
  btn.textContent = sciBlock.classList.contains("hidden")
    ? "Научные функции ⬇"
    : "Научные функции ⬆";
});
