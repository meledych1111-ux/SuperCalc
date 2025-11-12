// Загружаем праздники РФ через Nager.Date API
async function fetchHolidays(year) {
  const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/RU`);
  const data = await response.json();
  // возвращаем массив дат в формате YYYY-MM-DD
  return data.map(h => h.date);
}
