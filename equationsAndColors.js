// ====== Парикмахерский цветовой круг ======
function drawHairColorWheel() {
  const canvas = document.getElementById("hairColorWheel");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const radius = canvas.width / 2;
  const toRad = Math.PI / 180;

  const rybColors = [
    { color: "#ff0000", text: "Красный", angle: 0 },
    { color: "#ff4000", text: "Красно-оранжевый", angle: 30 },
    { color: "#ff7f00", text: "Оранжевый", angle: 60 },
    { color: "#ffff00", text: "Жёлтый", angle: 120 },
    { color: "#80ff00", text: "Жёлто-зелёный", angle: 150 },
    { color: "#00ff00", text: "Зелёный", angle: 180 },
    { color: "#00ffff", text: "Бирюзовый", angle: 210 },
    { color: "#0000ff", text: "Синий", angle: 240 },
    { color: "#4000ff", text: "Сине-фиолетовый", angle: 270 },
    { color: "#8b00ff", text: "Фиолетовый", angle: 300 },
    { color: "#ff00ff", text: "Пурпурный", angle: 330 }
  ];

  // рисуем сектора
  for (let i = 0; i < rybColors.length; i++) {
    const start = rybColors[i].angle * toRad;
    const end = ((i + 1) < rybColors.length ? rybColors[i + 1].angle : 360) * toRad;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = rybColors[i].color;
    ctx.fill();
  }

  // подписи
  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  rybColors.forEach(l => {
    const x = radius + (radius - 30) * Math.cos(l.angle * toRad);
    const y = radius + (radius - 30) * Math.sin(l.angle * toRad);
    ctx.fillText(l.text, x - 30, y);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  drawHairColorWheel();

  const canvas = document.getElementById("hairColorWheel");
  if (!canvas) return;

  canvas.addEventListener("click", e => {
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

    const result = document.getElementById("hairColorResult");
    result.textContent = `Выбранный цвет: ${color}`;
    result.style.color = color;
  });
});
