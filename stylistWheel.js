// Глобальное состояние выбора и фильтров
let lastChosenIndex = null;
let currentFilters = { style: "", season: "" };

const colors = [
  // 🌸 Весна — яркие и светлые
  { color: "#ffb07c", text: "Яркий персик", tone: "тёплый", style: "романтический", season: "весна", textureHint: "Шифон, шелк" },
  { color: "#ffff99", text: "Светло-жёлтый", tone: "тёплый", style: "повседневный", season: "весна", textureHint: "Хлопок" },
  { color: "#adff2f", text: "Салатовый", tone: "тёплый", style: "повседневный", season: "весна", textureHint: "Лен, хлопок" },
  { color: "#fffacd", text: "Солнечный жёлтый", tone: "тёплый", style: "романтический", season: "весна", textureHint: "Лёгкие ткани" },

  // ☀️ Лето — мягкие пастели
  { color: "#87ceeb", text: "Голубой", tone: "холодный", style: "романтический", season: "лето", textureHint: "Пастельные ткани" },
  { color: "#ffc0cb", text: "Розовый", tone: "тёплый", style: "романтический", season: "лето", textureHint: "Шифон, шелк" },
  { color: "#ffe4e1", text: "Светло-розовый", tone: "тёплый", style: "романтический", season: "лето", textureHint: "Лёгкие ткани" },
  { color: "#98ff98", text: "Мятный", tone: "холодный", style: "повседневный", season: "лето", textureHint: "Хлопок, лен" },

  // 🍂 Осень — насыщенные и золотистые
  { color: "#7b3f00", text: "Коричнево-рыжий кирпич", tone: "тёплый", style: "повседневный", season: "осень", textureHint: "Плотные ткани, кожа" },
  { color: "#a34f2d", text: "Рыжий, ржавчина", tone: "тёплый", style: "креативный", season: "осень", textureHint: "Деним, шерсть" },
  { color: "#cc7722", text: "Охра", tone: "тёплый", style: "деловой", season: "осень", textureHint: "Шерсть, твид" },
  { color: "#ffd700", text: "Золотистый", tone: "тёплый", style: "деловой", season: "осень", textureHint: "Кашемир, бархат" },

  // ❄️ Зима — холодные и светлые
  { color: "#00008b", text: "Тёмно-синий", tone: "холодный", style: "деловой", season: "зима", textureHint: "Шерсть, твид" },
  { color: "#8b0000", text: "Красный бархат", tone: "тёплый", style: "деловой", season: "зима", textureHint: "Бархат, плотный трикотаж" },
  { color: "#e0ffff", text: "Ледяной голубой", tone: "холодный", style: "деловой", season: "зима", textureHint: "Шёлк, атлас" },
  { color: "#c0c0c0", text: "Серебристый", tone: "нейтральный", style: "универсальный", season: "зима", textureHint: "Металлизированные ткани" }
];


// Универсальный рендер с учётом фильтров
function renderWheel(ctx, cx, cy, radius, step) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();

  colors.forEach((seg, i) => {
    const start = i * step;
    const end = (i + 1) * step;

    // Комбинированная фильтрация: стиль + сезон
    const styleOk = !currentFilters.style || seg.style === currentFilters.style;
    const seasonOk = !currentFilters.season || seg.season === currentFilters.season;
    const visible = styleOk && seasonOk;

    // Сектор
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.globalAlpha = visible ? 1 : 0.25;
    ctx.fill();

    // Подписываем всегда, но приглушаем вместе с сектором
    const angle = (i + 0.5) * step;
    ctx.fillStyle = "#000";
    ctx.globalAlpha = visible ? 1 : 0.4;
    ctx.font = "9px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(seg.text, cx + Math.cos(angle) * 110, cy + Math.sin(angle) * 110);
  });

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawStylistColorWheel() {
  const canvas = document.getElementById("stylistColorWheel");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // DPI корректировка
  const dpr = window.devicePixelRatio || 1;
  const cssW = 300, cssH = 300;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cx = cssW / 2;
  const cy = cssH / 2;
  const radius = Math.min(cx, cy);
  const step = (2 * Math.PI) / colors.length;

  // Первый рендер
  renderWheel(ctx, cx, cy, radius, step);

  // Клик по кругу
  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - cx;
    const dy = y - cy;
    const angle = (Math.atan2(dy, dx) + 2 * Math.PI) % (2 * Math.PI);
    const index = Math.floor(angle / step);
    lastChosenIndex = index;

    const chosen = colors[index];
    const opposite = colors[(index + Math.floor(colors.length / 2)) % colors.length];
    const left = colors[(index - 1 + colors.length) % colors.length];
    const right = colors[(index + 1) % colors.length];

    const result = document.getElementById("stylistColorResult");
    if (result) {
      result.innerHTML = `
        <div style="display:flex;gap:8px;margin-bottom:6px;">
          <div style="width:30px;height:30px;background:${chosen.color};border:1px solid #000;"></div>
          <div style="width:30px;height:30px;background:${opposite.color};border:1px solid #000;"></div>
        </div>
        <strong>Выбранный:</strong> ${chosen.text} (${chosen.tone}, ${chosen.style}, ${chosen.season})<br>
        <em>${chosen.textureHint}</em><br>
        <strong>Соседние:</strong> ${left.text}, ${right.text}<br>
        <strong>Комплементарный:</strong> ${opposite.text} (${opposite.tone}, ${opposite.style}, ${opposite.season})<br>
        <em>${opposite.textureHint}</em>
      `;
    }
  });

  // Храним ссылку на параметры для перерисовки из фильтров/схем
  canvas._renderParams = { ctx, cx, cy, radius, step };
}

// Публичные API фильтров — они обновляют состояние и заново рисуют
function highlightByStyle(style) {
  currentFilters.style = style || "";
  const canvas = document.getElementById("stylistColorWheel");
  if (!canvas || !canvas._renderParams) return;
  const { ctx, cx, cy, radius, step } = canvas._renderParams;
  renderWheel(ctx, cx, cy, radius, step);
}

function highlightBySeason(season) {
  currentFilters.season = season || "";
  const canvas = document.getElementById("stylistColorWheel");
  if (!canvas || !canvas._renderParams) return;
  const { ctx, cx, cy, radius, step } = canvas._renderParams;
  renderWheel(ctx, cx, cy, radius, step);
}

// Схемы: аналоговая, комплементарная, триада
function showScheme(type) {
  const result = document.getElementById("stylistColorResult");
  if (!result || lastChosenIndex === null) return;

  let schemeColors = [];
  if (type === "analog") {
    schemeColors = [
      colors[(lastChosenIndex - 1 + colors.length) % colors.length],
      colors[lastChosenIndex],
      colors[(lastChosenIndex + 1) % colors.length]
    ];
  } else if (type === "complement") {
    schemeColors = [
      colors[lastChosenIndex],
      colors[(lastChosenIndex + Math.floor(colors.length / 2)) % colors.length]
    ];
  } else if (type === "triad") {
    schemeColors = [
      colors[lastChosenIndex],
      colors[(lastChosenIndex + Math.floor(colors.length / 3)) % colors.length],
      colors[(lastChosenIndex + 2 * Math.floor(colors.length / 3)) % colors.length]
    ];
  } else {
    return;
  }

  result.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:6px;">
      ${schemeColors.map(c => `<div style="width:30px;height:30px;background:${c.color};border:1px solid #000;"></div>`).join("")}
    </div>
    <strong>Схема (${type}):</strong> ${schemeColors.map(c => c.text + " (" + c.tone + ", " + c.style + ", " + c.season + ")").join(", ")}<br>
    <em>Подсказки:</em> ${schemeColors.map(c => c.textureHint).join(" | ")}
  `;
}

// Инициализация после загрузки
window.addEventListener("load", drawStylistColorWheel);
