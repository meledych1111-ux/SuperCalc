// ================== Конвертер единиц ==================

// словари единиц
const units = {
  temperature: ["C", "F", "K"],
  mass: ["kg", "g", "mg", "t", "lb"], // ✅ расширено
  length: ["m", "cm", "km", "mile"],
  area: ["m2", "cm2", "ha", "km2"],   // ✅ гектары и кв.км
  volume: ["l", "ml", "cup", "tbsp", "tsp"],
  cubic: ["m3", "cm3", "l"]           // ✅ кубические единицы
};

// отображаемые подписи
const unitLabels = {
  m2: "кв.м",
  cm2: "кв.см",
  ha: "гектар",
  km2: "кв.км",
  m3: "куб.м",
  cm3: "куб.см",
  m: "м",
  cm: "см",
  km: "км",
  mile: "миля",
  kg: "кг",
  g: "г",
  mg: "мг",
  t: "тонна",
  lb: "фунт",
  C: "°C",
  F: "°F",
  K: "K",
  l: "литр",
  ml: "мл",
  cup: "стакан (250 мл)",
  tbsp: "ст. ложка (15 мл)",
  tsp: "ч. ложка (5 мл)"
};

// заполнение списков при выборе категории
document.getElementById("category").addEventListener("change", function() {
  const cat = this.value;
  const from = document.getElementById("fromUnit");
  const to = document.getElementById("toUnit");
  from.innerHTML = "";
  to.innerHTML = "";

  units[cat].forEach(u => {
    const label = unitLabels[u] || u;
    from.innerHTML += `<option value="${u}">${label}</option>`;
    to.innerHTML += `<option value="${u}">${label}</option>`;
  });
});

// конвертация
document.getElementById("convertBtn").addEventListener("click", function() {
  const cat = document.getElementById("category").value;
  const from = document.getElementById("fromUnit").value;
  const to = document.getElementById("toUnit").value;
  const val = parseFloat(document.getElementById("valueInput").value);

  if (Number.isNaN(val)) {
    document.getElementById("convertResult").textContent = "Введите число";
    return;
  }

  // Если единицы совпадают — ничего не делаем
  if (from === to) {
    const fromLabel = unitLabels[from] || from;
    document.getElementById("convertResult").textContent = `${val} ${fromLabel} = ${val} ${fromLabel}`;
    return;
  }

  let result = val;

  // =============== Температура ===============
  if (cat === "temperature") {
    if (from === "C" && to === "F") result = val * 9/5 + 32;
    else if (from === "F" && to === "C") result = (val - 32) * 5/9;
    else if (from === "C" && to === "K") result = val + 273.15;
    else if (from === "K" && to === "C") result = val - 273.15;
    else if (from === "F" && to === "K") result = (val - 32) * 5/9 + 273.15;
    else if (from === "K" && to === "F") result = (val - 273.15) * 9/5 + 32;
  }

  // =============== Масса ===============
  else if (cat === "mass") {
    // Приведём всё к граммам, потом в целевую единицу
    let grams;
    if (from === "kg") grams = val * 1000;
    else if (from === "g") grams = val;
    else if (from === "mg") grams = val / 1000;
    else if (from === "t") grams = val * 1000000;
    else if (from === "lb") grams = val * 453.59237;

    if (to === "kg") result = grams / 1000;
    else if (to === "g") result = grams;
    else if (to === "mg") result = grams * 1000;
    else if (to === "t") result = grams / 1000000;
    else if (to === "lb") result = grams / 453.59237;
  }

  // =============== Длина ===============
  else if (cat === "length") {
    // Приведём всё к метрам
    let meters;
    if (from === "m") meters = val;
    else if (from === "cm") meters = val / 100;
    else if (from === "km") meters = val * 1000;
    else if (from === "mile") meters = val * 1609.34;

    if (to === "m") result = meters;
    else if (to === "cm") result = meters * 100;
    else if (to === "km") result = meters / 1000;
    else if (to === "mile") result = meters / 1609.34;
  }

  // =============== Площадь ===============
  else if (cat === "area") {
    // Приведём всё к кв. метрам
    let m2;
    if (from === "m2") m2 = val;
    else if (from === "cm2") m2 = val / 10000;
    else if (from === "ha") m2 = val * 10000;
    else if (from === "km2") m2 = val * 1000000;

    if (to === "m2") result = m2;
    else if (to === "cm2") result = m2 * 10000;
    else if (to === "ha") result = m2 / 10000;
    else if (to === "km2") result = m2 / 1000000;
  }

  // =============== Объём (кулинарный) ===============
  else if (cat === "volume") {
    // Приведём всё к миллилитрам
    let ml;
    if (from === "ml") ml = val;
    else if (from === "l") ml = val * 1000;
    else if (from === "cup") ml = val * 250;
    else if (from === "tbsp") ml = val * 15;
    else if (from === "tsp") ml = val * 5;

    if (to === "ml") result = ml;
    else if (to === "l") result = ml / 1000;
    else if (to === "cup") result = ml / 250;
    else if (to === "tbsp") result = ml / 15;
    else if (to === "tsp") result = ml / 5;
  }

  // =============== Кубические единицы ===============
  else if (cat === "cubic") {
    // Приведём всё к куб. сантиметрам (см³ = мл)
    let cm3;
    if (from === "cm3") cm3 = val;
    else if (from === "m3") cm3 = val * 1000000;
    else if (from === "l") cm3 = val * 1000;

    if (to === "cm3") result = cm3;
    else if (to === "m3") result = cm3 / 1000000;
    else if (to === "l") result = cm3 / 1000;
  }

  const fromLabel = unitLabels[from] || from;
  const toLabel = unitLabels[to] || to;
  const formatted = parseFloat(result.toFixed(6)).toString();

  document.getElementById("convertResult").textContent =
    `${val} ${fromLabel} = ${formatted} ${toLabel}`;
});

// инициализация при загрузке
document.getElementById("category").dispatchEvent(new Event("change"));
