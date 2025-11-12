const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const plotBtn = document.getElementById("plotBtn");
const funcInput = document.getElementById("funcInput");
const legendDiv = document.getElementById("legend");

// нормализация выражений
function normalizeExpr(expr) {
  return expr
    .replace(/\bpi\b/g, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bsin\b/g, "Math.sin")
    .replace(/\bcos\b/g, "Math.cos")
    .replace(/\btan\b/g, "Math.tan")
    .replace(/\basin\b/g, "Math.asin")
    .replace(/\bacos\b/g, "Math.acos")
    .replace(/\batan\b/g, "Math.atan")
    .replace(/\blog10\b/g, "Math.log10")
    .replace(/\bln\b/g, "Math.log")
    .replace(/\bexp\b/g, "Math.exp")
    .replace(/\babs\b/g, "Math.abs")
    .replace(/\^/g, "**");
}

function evalY(expr, x) {
  try {
    const f = new Function("x", "return " + normalizeExpr(expr));
    return f(x);
  } catch {
    return NaN;
  }
}

function evalParam(xExpr, yExpr, t) {
  try {
    const xx = new Function("t", "return " + normalizeExpr(xExpr))(t);
    const yy = new Function("t", "return " + normalizeExpr(yExpr))(t);
    return { x: xx, y: yy };
  } catch {
    return { x: NaN, y: NaN };
  }
}

function clearCanvas(W, H) {
  ctx.fillStyle = "#091226";
  ctx.fillRect(0, 0, W, H);
}

// оси + деления
function drawAxes(W, H, x0, y0, scaleX, scaleY, minY, maxY) {
  // оси
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(0, y0);
  ctx.lineTo(W, y0);
  ctx.moveTo(x0, 0);
  ctx.lineTo(x0, H);
  ctx.stroke();

  ctx.fillStyle = "#aaa";
  ctx.font = "12px Arial";

  // сетка по X
  for (let i = -10; i <= 10; i++) {
    const px = (i + 10) * scaleX;
    ctx.strokeStyle = "#222"; // тонкая сетка
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, H);
    ctx.stroke();

    ctx.strokeStyle = "#888"; // деления
    ctx.beginPath();
    ctx.moveTo(px, y0 - 5);
    ctx.lineTo(px, y0 + 5);
    ctx.stroke();
    ctx.fillText(i.toString(), px - 8, y0 + 15);
  }

  // сетка по Y
  const stepY = Math.round((maxY - minY) / 10) || 1;
  for (let j = minY; j <= maxY; j += stepY) {
    const py = H - (j - minY) * scaleY;
    ctx.strokeStyle = "#222"; // тонкая сетка
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(W, py);
    ctx.stroke();

    ctx.strokeStyle = "#888"; // деления
    ctx.beginPath();
    ctx.moveTo(x0 - 5, py);
    ctx.lineTo(x0 + 5, py);
    ctx.stroke();
    ctx.fillText(j.toFixed(1), x0 + 8, py + 4);
  }
}

function drawFunctions(exprRaw) {
  const W = canvas.width = canvas.clientWidth;
  const H = canvas.height = 300;
  clearCanvas(W, H);

  const expressions = exprRaw.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length);
  const series = expressions.map(expr => {
    const points = [];
    let isConstant = true;
    let prevY = null;

    for (let x = -10; x <= 10; x += 0.05) {
      const y = evalY(expr, x);
      if (Number.isFinite(y)) {
        points.push({ x, y });
        if (prevY !== null && Math.abs(y - prevY) > 1e-12) {
          isConstant = false;
        }
        prevY = y;
      }
    }

    if (isConstant && points.length > 0) {
      const yConst = points[0].y;
      points.length = 0;
      for (let x = -10; x <= 10; x += 0.05) {
        points.push({ x, y: yConst });
      }
    }

    return { expr, points };
  });

  if (series.every(s => s.points.length === 0)) return;

  const allY = series.flatMap(s => s.points.map(p => p.y));
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const scaleX = W / 20;
  const scaleY = H / (maxY - minY || 1);

  const x0 = (0 + 10) * scaleX;
  const y0 = H - (0 - minY) * scaleY;
  drawAxes(W, H, x0, y0, scaleX, scaleY, minY, maxY);

  const colors = ["#4facfe", "#ff6ec7", "#f9d423", "#c471ed", "#00e5ff"];
  legendDiv.innerHTML = "";

  series.forEach((s, idx) => {
    const col = colors[idx % colors.length];
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.beginPath();
    s.points.forEach((p, i) => {
      const px = (p.x + 10) * scaleX;
      const py = H - (p.y - minY) * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    const item = document.createElement("div");
    item.className = "legend-item";
    const colorBox = document.createElement("div");
    colorBox.className = "legend-color";
    colorBox.style.background = col;
    const label = document.createElement("span");
    label.textContent = s.expr;
    item.appendChild(colorBox);
    item.appendChild(label);
    legendDiv.appendChild(item);
  });
}

function drawParametric(exprRaw) {
  const W = canvas.width = canvas.clientWidth;
  const H = canvas.height = 300;
  clearCanvas(W, H);

  const parts = exprRaw.split(";").map(s => s.trim());
  if (parts.length < 2) return;

  const xExpr = parts[0];
  const yExpr = parts[1];
  const tMin = parts[2] ? parseFloat(parts[2]) : 0;
  const tMax = parts[3] ? parseFloat(parts[3]) : 2 * Math.PI;
  const tStep = parts[4] ? parseFloat(parts[4]) : 0.01;

  const points = [];
  for (let t = tMin; t <= tMax; t += tStep) {
    const { x, y } = evalParam(xExpr, yExpr, t);
    if (Number.isFinite(x) && Number.isFinite(y)) points.push({ x, y });
  }
  if (points.length === 0) return;

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));
  const padX = (maxX - minX) * 0.05 || 1;
  const padY = (maxY - minY) * 0.05 || 1;

  const scaleX = W / (maxX - minX + 2 * padX);
  const scaleY = H / (maxY - minY + 2 * padY);

  const x0 = (-minX + padX) * scaleX;
  const y0 = H - (-minY + padY) * scaleY;
  drawAxes(W, H, x0, y0, scaleX, scaleY, minY, maxY);

  const col = "#ff6ec7";
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((p, i) => {
    const px = (p.x - (minX - padX)) * scaleX;
    const py = H - (p.y - (minY - padY)) * scaleY;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

    legendDiv.innerHTML = "";
  const item = document.createElement("div");
  item.className = "legend-item";
  const colorBox = document.createElement("div");
  colorBox.className = "legend-color";
  colorBox.style.background = col;
  const label = document.createElement("span");
  label.textContent = `${xExpr}; ${yExpr}`;
  item.appendChild(colorBox);
  item.appendChild(label);
  legendDiv.appendChild(item);
}

function drawGraph() {
  const raw = funcInput.value.trim();
  if (!raw) return;

  if (raw.includes(";") && raw.includes("t")) {
    drawParametric(raw);
  } else {
    drawFunctions(raw);
  }
}

plotBtn.addEventListener("click", drawGraph);

// обработка примеров
document.querySelectorAll("#examples .example").forEach(btn => {
  btn.addEventListener("click", () => {
    funcInput.value = btn.dataset.func;
    drawGraph(); // сразу строим график
  });
});

