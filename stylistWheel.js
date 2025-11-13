function drawStylistColorWheel() {
  const canvas = document.getElementById("stylistColorWheel");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  canvas.width = 300 * dpr;
  canvas.height = 300 * dpr;
  canvas.style.width = "300px";
  canvas.style.height = "300px";
  ctx.scale(dpr, dpr);

  const cx = 150, cy = 150, radius = 150;
  const colors = [
    { color: "#ff0000", text: "Красный" },
    { color: "#ff4000", text: "Красно-оранжевый" },
    { color: "#ff7f00", text: "Оранжевый" },
    { color: "#ffbf00", text: "Жёлто-оранжевый" },
    { color: "#ffff00", text: "Жёлтый" },
    { color: "#80ff00", text: "Жёлто-зелёный" },
    { color: "#00ff00", text: "Зелёный" },
    { color: "#00ff80", text: "Сине-зелёный" },
    { color: "#00ffff", text: "Бирюзовый" },
    { color: "#0000ff", text: "Синий" },
    { color: "#4000ff", text: "Сине-фиолетовый" },
    { color: "#8b00ff", text: "Фиолетовый" },
    { color: "#ff00ff", text: "Красно-фиолетовый" }
  ];

  const step = (2 * Math.PI) / colors.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  colors.forEach((seg, i) => {
    const start = i * step;
    const end = (i + 1) * step;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.font = "11px Arial";
    const angle = (i + 0.5) * step;
    ctx.fillText(seg.text, cx + Math.cos(angle) * 100, cy + Math.sin(angle) * 100);
  });

  // обработка клика
  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - cx;
    const dy = y - cy;
    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;

    let chosenIndex = 0;
    for (let i = 0; i < colors.length; i++) {
      const nextAngle = (i + 1 < colors.length ? (i + 1) * (360 / colors.length) : 360);
      if (angle >= i * (360 / colors.length) && angle < nextAngle) {
        chosenIndex = i;
        break;
      }
    }

    const chosen = colors[chosenIndex].text;
    const oppositeIndex = (chosenIndex + Math.floor(colors.length / 2)) % colors.length;
    const opposite = colors[oppositeIndex].text;

    const result = document.getElementById("stylistColorResult");
    if (result) {
      result.textContent = `Выбранный цвет: ${chosen}, комплементарный: ${opposite}`;
      result.style.color = colors[chosenIndex].color;
    }
  });
}
