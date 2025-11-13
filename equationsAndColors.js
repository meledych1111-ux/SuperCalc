function drawHairColorWheel() {
  const canvas = document.getElementById("hairColorWheel");
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
    { color: "#ff7f00", text: "Оранжевый" },
    { color: "#ffff00", text: "Жёлтый" },
    { color: "#00ff00", text: "Зелёный" },
    { color: "#0000ff", text: "Синий" },
    { color: "#8b00ff", text: "Фиолетовый" }
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
    ctx.font = "12px Arial";
    const angle = (i + 0.5) * step;
    ctx.fillText(seg.text, cx + Math.cos(angle) * 100, cy + Math.sin(angle) * 100);
  });
}
