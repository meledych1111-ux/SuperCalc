// ====== История ======
const calcHistory = [];

function addToHistory(type, input, output) {
  calcHistory.unshift({ type, input, output });
  if (calcHistory.length > 10) calcHistory.pop();
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById("history");
  if (!container) return;
  container.innerHTML = "";

  calcHistory.forEach(entry => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <div><b>${entry.type}</b></div>
      <div><code>${entry.input}</code></div>
      <div style="margin-left:10px">${entry.output}</div>
    `;
    container.appendChild(item);
  });
}

function clearHistory() {
  calcHistory.length = 0;
  renderHistory();
}

// ====== Квадратные уравнения ======
document.getElementById("solveQuadratic").addEventListener("click", () => {
  const a = parseFloat(eqA.value), b = parseFloat(eqB.value), c = parseFloat(eqC.value);
  const D = b*b - 4*a*c;
  const steps = [];

  steps.push(`Уравнение: ${a}x² + ${b}x + ${c} = 0`);
  steps.push(`Дискриминант: D = b² - 4ac = ${b}² - 4·${a}·${c} = ${D}`);

  let res;
  if (D < 0) {
    res = "Нет действительных корней";
    steps.push(res);
  } else if (D === 0) {
    const x = -b/(2*a);
    res = `x = ${x}`;
    steps.push(`D = 0 → один корень: x = -b/(2a) = ${x}`);
  } else {
    const sqrtD = Math.sqrt(D);
    const x1 = (-b+sqrtD)/(2*a);
    const x2 = (-b-sqrtD)/(2*a);
    res = `x₁ = ${x1}, x₂ = ${x2}`;
    steps.push(`√D = ${sqrtD}`);
    steps.push(`x₁ = (-b + √D)/(2a) = ${x1}`);
    steps.push(`x₂ = (-b - √D)/(2a) = ${x2}`);
  }

  equationResult.innerHTML = steps.join("<br>");
  addToHistory("Квадратное уравнение", `${a}x² + ${b}x + ${c} = 0`, steps.join("<br>"));
});

document.getElementById("clearQuadratic").addEventListener("click", () => {
  eqA.value = 1; eqB.value = 0; eqC.value = 0;
  equationResult.textContent = "—";
});

// ====== Кубические уравнения (Кардано) ======
function solveCubic(a, b, c, d) {
  if (a === 0) return ["Не кубическое"];
  const p = (3*a*c - b*b) / (3*a*a);
  const q = (2*b*b*b - 9*a*b*c + 27*a*a*d) / (27*a*a*a);
  const D = (q*q)/4 + (p*p*p)/27;
  if (D > 0) {
    const u = Math.cbrt(-q/2 + Math.sqrt(D));
    const v = Math.cbrt(-q/2 - Math.sqrt(D));
    return [u+v - b/(3*a)];
  } else if (D === 0) {
    const u = Math.cbrt(-q/2);
    return [2*u - b/(3*a), -u - b/(3*a)];
  } else {
    const r = Math.sqrt(-(p*p*p)/27);
    const phi = Math.acos(-q/(2*r));
    const m = 2*Math.cbrt(r);
    return [
      m*Math.cos(phi/3) - b/(3*a),
      m*Math.cos((phi+2*Math.PI)/3) - b/(3*a),
      m*Math.cos((phi+4*Math.PI)/3) - b/(3*a)
    ];
  }
}

document.getElementById("solveCubic").addEventListener("click", () => {
  const a = parseFloat(cA.value), b = parseFloat(cB.value), c = parseFloat(cC.value), d = parseFloat(cD.value);
  const steps = [];
  steps.push(`Уравнение: ${a}x³ + ${b}x² + ${c}x + ${d} = 0`);

  const roots = solveCubic(a, b, c, d);
  steps.push(`Корни: ${roots.join(", ")}`);

  cubicResult.innerHTML = steps.join("<br>");
  addToHistory("Кубическое уравнение", `${a}x³ + ${b}x² + ${c}x + ${d} = 0`, steps.join("<br>"));
});

document.getElementById("clearCubic").addEventListener("click", () => {
  cA.value = 1; cB.value = 0; cC.value = 0; cD.value = 0;
  cubicResult.textContent = "—";
});

// ====== Система 2×2 ======
document.getElementById("solveSystem2").addEventListener("click", () => {
  const a1 = parseFloat(sA1.value), b1 = parseFloat(sB1.value), c1 = parseFloat(sC1.value);
  const a2 = parseFloat(sA2.value), b2 = parseFloat(sB2.value), c2 = parseFloat(sC2.value);

  if ([a1,b1,c1,a2,b2,c2].some(v => isNaN(v))) {
    system2Result.textContent = "Введите все коэффициенты!";
    return;
  }

  const steps = [];
  steps.push(`Система: ${a1}x + ${b1}y = ${c1}; ${a2}x + ${b2}y = ${c2}`);

  const det = a1*b2 - a2*b1;
  steps.push(`Определитель Δ = a₁b₂ - a₂b₁ = ${det}`);

  let res;
  if (det === 0) {
    res = "Δ = 0 → либо нет решений, либо бесконечно много";
    steps.push(res);
  } else {
    const x = (c1*b2 - c2*b1) / det;
    const y = (a1*c2 - a2*c1) / det;
    res = `x = ${x}, y = ${y}`;
    steps.push(`Dx = ${c1*b2 - c2*b1}, Dy = ${a1*c2 - a2*c1}`);
    steps.push(`x = Dx/Δ = ${x}, y = Dy/Δ = ${y}`);
  }

  system2Result.innerHTML = steps.join("<br>");
  addToHistory("Система 2x2", `${a1}x + ${b1}y = ${c1}; ${a2}x + ${b2}y = ${c2}`, steps.join("<br>"));
});

document.getElementById("clearSystem2").addEventListener("click", () => {
  sA1.value = ""; sB1.value = ""; sC1.value = "";
  sA2.value = ""; sB2.value = ""; sC2.value = "";
  system2Result.textContent = "—";
});

// ====== Справочник ======
const handbook = {
  quadratic: {
    title: "Квадратные уравнения",
    formula: "ax² + bx + c = 0",
    rules: [
      "Коэффициент a ≠ 0",
      "Дискриминант D = b² - 4ac",
      "Если D < 0 → нет действительных корней",
      "Если D = 0 → один корень x = -b/(2a)",
      "Если D > 0 → два корня x₁, x₂"
    ],
    example: "Пример: x² - 3x + 2 = 0 → корни: 1 и 2"
  },
  cubic: {
    title: "Кубические уравнения",
    formula: "ax³ + bx² + cx + d = 0",
    rules: [
      "Коэффициент a ≠ 0",
      "Решение ищется по формулам Кардано",
      "Возможны 1, 2 или 3 действительных корня"
    ],
    example: "Пример: x³ - 6x² + 11x - 6 = 0 → корни: 1, 2, 3"
  },
    system2: {
    title: "Система 2×2",
    formula: "a₁x + b₁y = c₁; a₂x + b₂y = c₂",
    rules: [
      "Определитель Δ = a₁b₂ - a₂b₁",
      "Если Δ = 0 → либо нет решений, либо бесконечно много",
      "Если Δ ≠ 0 → решение по формулам Крамера"
    ],
    example: "Пример: 2x + y = 5; x - y = 1 → решение: x=2, y=1"
  }
};

// Функция для вывода справочника
function showHandbook(section) {
  const h = handbook[section];
  if (!h) return;
  let text = `${h.title}\nФормула: ${h.formula}\n\nПравила:\n`;
  h.rules.forEach(r => text += `• ${r}\n`);
  text += `\n${h.example}`;
  alert(text); // можно заменить на вывод в отдельный <div>
}

// Привязка кнопок "Справочник"
document.getElementById("handbookQuadratic").addEventListener("click", () => showHandbook("quadratic"));
document.getElementById("handbookCubic").addEventListener("click", () => showHandbook("cubic"));
document.getElementById("handbookSystem2").addEventListener("click", () => showHandbook("system2"));
