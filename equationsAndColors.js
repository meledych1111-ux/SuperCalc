// ====== Парикмахерский цветовой круг ======
function drawHairColorWheel() {
  const canvas = document.getElementById("hairColorWheel");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const radius = canvas.width / 2;
  const toRad = Math.PI / 180;

  // рисуем круг по секторам
  for (let angle = 0; angle < 360; angle++) {
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle * toRad, (angle + 1) * toRad);
    ctx.closePath();
    ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
    ctx.fill();
  }

  // подписи основных парикмахерских оттенков
  const labels = [
    { text: "Красный", angle: 0 },
    { text: "Оранжевый", angle: 30 },
    { text: "Жёлтый", angle: 60 },
    { text: "Зелёный", angle: 120 },
    { text: "Синий", angle: 240 },
    { text: "Фиолетовый", angle: 300 }
  ];

  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  labels.forEach(l => {
    const x = radius + (radius - 30) * Math.cos(l.angle * toRad);
    const y = radius + (radius - 30) * Math.sin(l.angle * toRad);
    ctx.fillText(l.text, x - 20, y);
  });
}

// ✅ запуск только после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  drawHairColorWheel();

  const canvas = document.getElementById("hairColorWheel");
  if (!canvas) return;

  // выбор цвета по клику
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
