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

  let result = val;

  // Температура
  if (cat === "temperature") {
    if (from === "C" && to === "F") result = val * 9/5 + 32;
    else if (from === "F" && to === "C") result = (val - 32) * 5/9;
    else if (from === "C" && to === "K") result = val + 273.15;
    else if (from === "K" && to === "C") result = val - 273.15;
    else if (from === "F" && to === "K") result = (val - 32) * 5/9 + 273.15;
    else if (from === "K" && to === "F") result = (val - 273.15) * 9/5 + 32;
  }

  // Масса
  if (cat === "mass") {
    if (from === "kg" && to === "g") result = val * 1000;
    else if (from === "g" && to === "kg") result = val / 1000;
    else if (from === "g" && to === "mg") result = val * 1000;
    else if (from === "mg" && to === "g") result = val / 1000;
    else if (from === "kg" && to === "mg") result = val * 1000000;
    else if (from === "mg" && to === "kg") result = val / 1000000;
    else if (from === "kg" && to === "t") result = val / 1000;
    else if (from === "t" && to === "kg") result = val * 1000;
    else if (from === "g" && to === "t") result = val / 1000000;
    else if (from === "t" && to === "g") result = val * 1000000;
    else if (from === "kg" && to === "lb") result = val * 2.20462;
    else if (from === "lb" && to === "kg") result = val / 2.20462;
    else if (from === "g" && to === "lb") result = val / 453.59237;
    else if (from === "lb" && to === "g") result = val * 453.59237;
  }

  // Длина
  if (cat === "length") {
    if (from === "m" && to === "cm") result = val * 100;
    else if (from === "cm" && to === "m") result = val / 100;
    else if (from === "m" && to === "km") result = val / 1000;
    else if (from === "km" && to === "m") result = val * 1000;
    else if (from === "m" && to === "mile") result = val / 1609.34;
    else if (from === "mile" && to === "m") result = val * 1609.34;
    else if (from === "cm" && to === "km") result = val / 100000;
    else if (from === "km" && to === "cm") result = val * 100000;
  }

  // Площадь
  if (cat === "area") {
    if (from === "m2" && to === "cm2") result = val * 10000;
    else if (from === "cm2" && to === "m2") result = val / 10000;
    else if (from === "ha" && to === "m2") result = val * 10000;
    else if (from === "m2" && to === "ha") result = val / 10000;
    else if (from === "km2" && to === "m2") result = val * 1000000;
    else if (from === "m2" && to === "km2") result = val / 1000000;
    else if (from === "ha" && to === "km2") result = val / 100;
    else if (from === "km2" && to === "ha") result = val * 100;
  }

  // Объём (кулинарный)
  if (cat === "volume") {
    if (from === "l" && to === "ml") result = val * 1000;
    else if (from === "ml" && to === "l") result = val / 1000;
    else if (from === "cup" && to === "ml") result = val * 250;
    else if (from === "ml" && to === "cup") result = val / 250;
    else if (from === "tbsp" && to === "ml") result = val * 15;
    else if (from === "ml" && to === "tbsp") result = val / 15;
    else if (from === "tsp" && to === "ml") result = val * 5;
    else if (from === "ml" && to === "tsp") result = val / 5;
  }

  // Кубические единицы
  if (cat === "cubic") {
    if (from === "m3" && to === "cm3") result = val * 1000000;
    else if (from === "cm3" && to === "m3") result = val / 1000000;
    else if (from === "m3" && to === "l") result = val * 1000;
    else if (from === "l" && to === "m3") result = val / 1000;
    else if (from === "cm3" && to === "l") result = val / 1000;
    else if (from === "l" && to === "cm3") result = val * 1000;
  }

  const fromLabel = unitLabels[from] || from;
  const toLabel = unitLabels[to] || to;
  const formatted = parseFloat(result.toFixed(6)).toString();

  document.getElementById("convertResult").textContent =
    `${val} ${fromLabel} = ${formatted} ${toLabel}`;
});


// инициализация при загрузке
document.getElementById("category").dispatchEvent(new Event("change"));


 
