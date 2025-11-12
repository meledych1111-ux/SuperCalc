async function calcDays() {
  const startInput = document.getElementById("startDate").value;
  const endInput = document.getElementById("endDate").value;
  const resultDiv = document.getElementById("daysResult");

  if (!startInput || !endInput) {
    resultDiv.textContent = "Выберите обе даты.";
    return;
  }

  const start = new Date(startInput);
  const end = new Date(endInput);

  if (end < start) {
    resultDiv.textContent = "Дата окончания должна быть позже даты начала.";
    return;
  }

  // Загружаем праздники для года начала
  const holidays = await fetchHolidays(start.getFullYear());

  // календарные дни
  const diffTime = end - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // рабочие дни
  let workDays = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay(); // 0=вс, 6=сб
    const isoDate = d.toISOString().split("T")[0];
    if (day !== 0 && day !== 6 && !holidays.includes(isoDate)) {
      workDays++;
    }
  }

  resultDiv.innerHTML = `
    📅 Календарные дни: <b>${diffDays}</b><br>
    💼 Рабочие дни (с учётом праздников РФ): <b>${workDays}</b>
  `;
}

document.getElementById("calcDaysBtn").addEventListener("click", calcDays);
