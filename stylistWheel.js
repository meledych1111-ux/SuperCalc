
// ЦВЕТОВАЯ БАЗА ДАННЫХ (полная)
// ==========================

let lastChosenIndex = null;
let currentFilters = { style: "", season: "", colortype: "" };

// === ФУНКЦИЯ ДЛЯ ВЫЧИСЛЕНИЯ HUE ===
function calculateHue(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  
  if (max !== min) {
    if (max === r) {
      hue = ((g - b) / (max - min)) * 60;
    } else if (max === g) {
      hue = (2 + (b - r) / (max - min)) * 60;
    } else {
      hue = (4 + (r - g) / (max - min)) * 60;
    }
  }
  
  if (hue < 0) hue += 360;
  return Math.round(hue);
}

// === ФУНКЦИЯ SHADECOLOR ===
function shadeColor(color, percent) {
    let f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = Math.abs(percent),
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 +
        (Math.round((t - R) * p / 100) + R) * 0x10000 +
        (Math.round((t - G) * p / 100) + G) * 0x100 +
        (Math.round((t - B) * p / 100) + B)).toString(16).slice(1);
}

// === ПОЛНЫЙ БАЛАНСИРОВАННЫЙ МАССИВ ЦВЕТОВ ===
let colors = [
  // КРАСНЫЕ (0-15°)
  { id:"br1", color:"#ff0000", text:"Ярко‑красный", tone:"тёплый", style:"контрастный", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Помада красная", makeupSet:{ lips:"Красная", eyes:"Тёмные", blush:"Охра", eyeliner:"Чёрная", style:"Контрастный" }, hue: 0 },
  { id:"wi8", color:"#8b0000", text:"Красный бархат", tone:"тёплый", style:"деловой", season:"зима", colortype:"зима", textureHint:"Бархат", makeupHint:"Помада красная", makeupSet:{ lips:"Красная бархатная", eyes:"Тёмно‑синие", blush:"Охра", eyeliner:"Чёрная", style:"Деловой вечер" }, hue: 0 },
  { id:"au2", color:"#800000", text:"Бордовый", tone:"тёплый", style:"деловой", season:"осень", colortype:"осень", textureHint:"Твид", makeupHint:"Помада бордовая", makeupSet:{ lips:"Бордовая", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Чёрная", style:"Деловой" }, hue: 0 },
  { id:"dk2", color:"#5c0a0a", text:"Тёмно‑бордовый", tone:"тёплый", style:"вечерний", season:"осень", colortype:"осень", textureHint:"Бархат", makeupHint:"Помада бордовая", makeupSet:{ lips:"Бордовая", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Чёрная", style:"Вечерний" }, hue: 0 },
  { id:"bal5", color:"#ff7f50", text:"Кораллово-оранжевый", tone:"тёплый", style:"яркий", season:"осень", colortype:"осень", textureHint:"Шёлк", makeupHint:"Помада коралловая", makeupSet:{ lips:"Коралловая", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Коричневая", style:"Яркий" }, hue: 16 },

  // КРАСНО-ОРАНЖЕВЫЕ (16-30°)
  { id:"aub2", color:"#ff4500", text:"Ярко‑терракотовый", tone:"тёплый", style:"контрастный", season:"осень", colortype:"осень", textureHint:"Атлас", makeupHint:"Тени ярко‑терракотовые", makeupSet:{ lips:"Ярко‑терракотовая", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Чёрная", style:"Контрастный" }, hue: 16 },
  { id:"spb1", color:"#ff4500", text:"Ярко‑персиковый", tone:"тёплый", style:"яркий", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Румяна ярко‑персиковые", makeupSet:{ lips:"Ярко‑персиковая", eyes:"Золотистые", blush:"Яркие", eyeliner:"Коричневая", style:"Яркий" }, hue: 16 },
  { id:"bal6", color:"#ff6347", text:"Томатный", tone:"тёплый", style:"повседневный", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Румяна тёплые", makeupSet:{ lips:"Терракотовая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 9 },

  // ОРАНЖЕВЫЕ (31-45°)
  { id:"br2", color:"#ff6600", text:"Ярко‑оранжевый", tone:"тёплый", style:"креативный", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Румяна тёплые", makeupSet:{ lips:"Оранжевая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Коричневая", style:"Креативный" }, hue: 24 },
  { id:"aub1", color:"#ff8c00", text:"Ярко‑оранжевый", tone:"тёплый", style:"яркий", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Румяна ярко‑оранжевые", makeupSet:{ lips:"Оранжевая", eyes:"Коричневые", blush:"Ярко‑оранжевые", eyeliner:"Коричневая", style:"Яркий" }, hue: 33 },
  { id:"bal7", color:"#ffa500", text:"Оранжевый", tone:"тёплый", style:"энергичный", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Румяна оранжевые", makeupSet:{ lips:"Оранжевая", eyes:"Золотистые", blush:"Оранжевые", eyeliner:"Коричневая", style:"Энергичный" }, hue: 39 },

  // ОРАНЖЕВО-ЖЕЛТЫЕ (46-60°)
  { id:"sp1", color:"#ffb07c", text:"Персиковый", tone:"тёплый", style:"романтический", season:"весна", colortype:"весна", textureHint:"Шифон, лёгкий хлопок", makeupHint:"Румяна персиковые", makeupSet:{ lips:"Персиковая", eyes:"Золотистые", blush:"Персиковые", eyeliner:"Коричневая", style:"романтический" }, hue: 23 },
  { id:"sp9", color:"#ffdab9", text:"Персиковый светлый", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Румяна персиковые", makeupSet:{ lips:"Персиковая", eyes:"Бежевые", blush:"Персиковые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 28 },
  { id:"sp7", color:"#ffe4b5", text:"Абрикосовый", tone:"тёплый", style:"романтический", season:"весна", colortype:"весна", textureHint:"Шёлк", makeupHint:"Румяна абрикосовые", makeupSet:{ lips:"Абрикосовая", eyes:"Бежевые", blush:"Абрикосовые", eyeliner:"Коричневая", style:"романтический" }, hue: 35 },
  { id:"au7", color:"#cc7722", text:"Охра", tone:"тёплый", style:"повседневный", season:"осень", colortype:"осень", textureHint:"Шерсть", makeupHint:"Румяна охра", makeupSet:{ lips:"Нюдовая", eyes:"Коричневые", blush:"Охра", eyeliner:"Коричневая", style:"Повседневный" }, hue: 30 },
  { id:"au6", color:"#d2691e", text:"Медный", tone:"тёплый", style:"креативный", season:"осень", colortype:"осень", textureHint:"Твид", makeupHint:"Тени медные", makeupSet:{ lips:"Нюдовая", eyes:"Медные", blush:"Тёплые", eyeliner:"Коричневая", style:"Креативный" }, hue: 28 },

  // ЖЕЛТЫЕ (61-75°)
  { id:"aub5", color:"#ffd700", text:"Ярко‑золотой", tone:"тёплый", style:"акцентный", season:"осень", colortype:"осень", textureHint:"Металлизированные ткани", makeupHint:"Хайлайтер золотой", makeupSet:{ lips:"Красная", eyes:"Золотые", blush:"Тёплые", eyeliner:"Коричневая", style:"Акцентный" }, hue: 51 },
  { id:"bal8", color:"#ffeb3b", text:"Лимонно-жёлтый", tone:"тёплый", style:"яркий", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }, hue: 56 },
  { id:"aub3", color:"#ffef00", text:"Ярко‑жёлтый", tone:"тёплый", style:"энергичный", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Хайлайтер ярко‑жёлтый", makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Энергичный" }, hue: 56 },

  // ЖЕЛТЫЕ (76-90°)
  { id:"sp4", color:"#ffff99", text:"Лимонный", tone:"тёплый", style:"яркий", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }, hue: 60 },
  { id:"un11", color:"#fffacd", text:"Лимонный крем", tone:"тёплый", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Хлопок", makeupHint:"Румяна лимонные", makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }, hue: 60 },
  { id:"br3", color:"#ffff00", text:"Ярко‑жёлтый", tone:"тёплый", style:"яркий", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }, hue: 60 },

  // ЖЕЛТО-ЗЕЛЕНЫЕ (91-105°)
  { id:"bal1", color:"#adff2f", text:"Зеленовато-желтый", tone:"тёплый", style:"свежий", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени салатовые", makeupSet:{ lips:"Нюдовая", eyes:"Салатовые", blush:"Светлые", eyeliner:"Коричневая", style:"Свежий" }, hue: 84 },
  { id:"bal2", color:"#9acd32", text:"Желто-зеленый", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Тени желто-зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Жёлто-зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 80 },

  // ЗЕЛЕНО-ЖЕЛТЫЕ (106-120°)
  { id:"au3", color:"#808000", text:"Оливковый", tone:"тёплый", style:"универсальный", season:"осень", colortype:"осень", textureHint:"Лён", makeupHint:"Тени оливковые", makeupSet:{ lips:"Нюдовая", eyes:"Оливковые", blush:"Персиковые", eyeliner:"Коричневая", style:"Универсальный" }, hue: 60 },
  { id:"aud3", color:"#556b2f", text:"Тёмно‑оливковый", tone:"тёплый", style:"деловой", season:"осень", colortype:"осень", textureHint:"Лён", makeupHint:"Тени тёмно‑оливковые", makeupSet:{ lips:"Нюдовая", eyes:"Тёмно‑оливковые", blush:"Персиковые", eyeliner:"Коричневая", style:"Деловой" }, hue: 82 },
  { id:"bal9", color:"#7cfc00", text:"Зелёно-салатовый", tone:"тёплый", style:"свежий", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени салатовые", makeupSet:{ lips:"Нюдовая", eyes:"Салатовые", blush:"Светлые", eyeliner:"Коричневая", style:"Свежий" }, hue: 90 },

  // ЗЕЛЕНЫЕ (121-135°)
  { id:"sp5", color:"#98fb98", text:"Светло‑зелёный", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Персиковые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 120 },
  { id:"br5", color:"#00ff00", text:"Ярко‑зелёный", tone:"свежий", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 120 },
  { id:"spb4", color:"#32cd32", text:"Ярко‑зелёный", tone:"свежий", style:"креативный", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени ярко‑зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Ярко‑зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Креативный" }, hue: 120 },

  // ЗЕЛЕНЫЕ (136-150°)
  { id:"spd3", color:"#228b22", text:"Тёмно‑зелёный", tone:"тёплый", style:"универсальный", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени тёмно‑зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Тёмно‑зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Универсальный" }, hue: 120 },
  { id:"dk5", color:"#013220", text:"Тёмно‑зелёный", tone:"холодный", style:"универсальный", season:"осень", colortype:"осень", textureHint:"Шерсть", makeupHint:"Тени зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Тёплые", eyeliner:"Коричневая", style:"Универсальный" }, hue: 150 },
  { id:"wid1", color:"#50c878", text:"Тёмно‑изумрудный", tone:"холодный", style:"вечерний", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени тёмно‑изумрудные", makeupSet:{ lips:"Красная", eyes:"Тёмно‑изумрудные", blush:"Холодные", eyeliner:"Чёрная", style:"Вечерний" }, hue: 140 },

  // ЗЕЛЕНО-ГОЛУБЫЕ (151-165°)
  { id:"su4", color:"#98ff98", text:"Мятный", tone:"холодный", style:"свежий", season:"лето", colortype:"лето", textureHint:"Хлопок", makeupHint:"Тени мятные", makeupSet:{ lips:"Нюдовая", eyes:"Мятные", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }, hue: 120 },
  { id:"bal10", color:"#00fa9a", text:"Морская волна", tone:"холодный", style:"свежий", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени бирюзовые", makeupSet:{ lips:"Нюдовая", eyes:"Бирюзовые", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }, hue: 157 },

  // БИРЮЗОВЫЕ (166-180°)
  { id:"sp3", color:"#40e0d0", text:"Бирюзовый", tone:"холодный", style:"креативный", season:"весна", colortype:"весна", textureHint:"Шёлк", makeupHint:"Тени бирюзовые", makeupSet:{ lips:"Нюдовая", eyes:"Бирюзовые", blush:"Светлые", eyeliner:"Чёрная", style:"Креативный" }, hue: 174 },
  { id:"wi4", color:"#00ced1", text:"Изумрудный", tone:"холодный", style:"деловой", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени изумрудные", makeupSet:{ lips:"Красная", eyes:"Изумрудные", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }, hue: 181 },

  // ГОЛУБЫЕ (181-195°)
  { id:"wid4", color:"#b0e0e6", text:"Тёмно‑ледяной", tone:"холодный", style:"свежий", season:"зима", colortype:"зима", textureHint:"Шёлк", makeupHint:"Тени тёмно‑ледяные", makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }, hue: 187 },
  { id:"bal11", color:"#87ceeb", text:"Небесно-голубой", tone:"холодный", style:"повседневный", season:"лето", colortype:"лето", textureHint:"Хлопок", makeupHint:"Тени голубые", makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Светлые", eyeliner:"Серая", style:"Повседневный" }, hue: 197 },

  // СИНЕ-ГОЛУБЫЕ (196-210°)
  { id:"su2", color:"#add8e6", text:"Небесно‑голубой", tone:"холодный", style:"повседневный", season:"лето", colortype:"лето", textureHint:"Хлопок", makeupHint:"Тени голубые", makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Светлые", eyeliner:"Чёрная", style:"Повседневный" }, hue: 203 },
  { id:"su5", color:"#87cefa", text:"Голубой яркий", tone:"холодный", style:"повседневный", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени голубые", makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Розовые", eyeliner:"Чёрная", style:"Повседневный" }, hue: 203 },
  { id:"sud2", color:"#4682b4", text:"Тёмно‑голубой", tone:"холодный", style:"деловой", season:"лето", colortype:"лето", textureHint:"Хлопок", makeupHint:"Тени тёмно‑голубые", makeupSet:{ lips:"Нюдовая", eyes:"Тёмно‑голубые", blush:"Светлые", eyeliner:"Чёрная", style:"Деловой" }, hue: 207 },

  // СИНИЕ (211-225°)
  { id:"wib4", color:"#0066ff", text:"Ярко‑синий", tone:"холодный", style:"свежий", season:"зима", colortype:"зима", textureHint:"Шёлк", makeupHint:"Тени ярко‑синие", makeupSet:{ lips:"Нюдовая", eyes:"Ярко‑синие", blush:"Светлые", eyeliner:"Чёрная", style:"Свежий" }, hue: 210 },
  { id:"wib5", color:"#1e90ff", text:"Ярко‑голубой", tone:"холодный", style:"свежий", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени ярко‑голубые", makeupSet:{ lips:"Нюдовая", eyes:"Ярко‑голубые", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }, hue: 210 },
  { id:"bal12", color:"#4169e1", text:"Королевский синий", tone:"холодный", style:"деловой", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени синие", makeupSet:{ lips:"Красная", eyes:"Синие", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }, hue: 225 },

  // СИНИЕ (226-240°)
  { id:"br4", color:"#0000ff", text:"Ярко‑синий", tone:"холодный", style:"свежий", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени синие", makeupSet:{ lips:"Нюдовая", eyes:"Синие", blush:"Светлые", eyeliner:"Чёрная", style:"Свежий" }, hue: 240 },
  { id:"wi1", color:"#00008b", text:"Тёмно‑синий", tone:"холодный", style:"деловой", season:"зима", colortype:"зима", textureHint:"Атлас, шерсть", makeupHint:"Тени тёмно‑синие", makeupSet:{ lips:"Красная", eyes:"Тёмно‑синие", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }, hue: 240 },
  { id:"wi5", color:"#191970", text:"Сапфировый", tone:"холодный", style:"вечерний", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени сапфировые", makeupSet:{ lips:"Красная", eyes:"Сапфировые", blush:"Холодные", eyeliner:"Чёрная", style:"Вечерний" }, hue: 240 },

  // СИНИЕ (241-255°)
  { id:"dk4", color:"#000033", text:"Тёмно‑синий", tone:"холодный", style:"деловой", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени синие", makeupSet:{ lips:"Красная", eyes:"Синие", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }, hue: 240 },
  { id:"wid3", color:"#082567", text:"Тёмно‑сапфировый", tone:"холодный", style:"деловой", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени тёмно‑сапфировые", makeupSet:{ lips:"Красная", eyes:"Тёмно‑сапфировые", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }, hue: 244 },
  { id:"bal13", color:"#191970", text:"Полуночный синий", tone:"холодный", style:"вечерний", season:"зима", colortype:"зима", textureHint:"Бархат", makeupHint:"Тени тёмно-синие", makeupSet:{ lips:"Красная", eyes:"Тёмно-синие", blush:"Холодные", eyeliner:"Чёрная", style:"Вечерний" }, hue: 240 },

  // СИНЕ-ФИОЛЕТОВЫЕ (256-270°)
  { id:"su1", color:"#e6e6fa", text:"Лавандовый", tone:"холодный", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шифон", makeupHint:"Тени лавандовые", makeupSet:{ lips:"Розовая", eyes:"Лавандовые", blush:"Розовые", eyeliner:"Серая", style:"романтический" }, hue: 240 },
  { id:"bal4", color:"#9370db", text:"Средне-фиолетовый", tone:"холодный", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени фиолетовые", makeupSet:{ lips:"Розовая", eyes:"Фиолетовые", blush:"Холодные", eyeliner:"Серая", style:"романтический" }, hue: 260 },
  { id:"sud1", color:"#9370db", text:"Тёмно‑лавандовый", tone:"холодный", style:"вечерний", season:"лето", colortype:"лето", textureHint:"Атлас", makeupHint:"Тени тёмно‑лавандовые", makeupSet:{ lips:"Розовая", eyes:"Тёмно‑лавандовые", blush:"Холодные", eyeliner:"Серая", style:"Вечерний" }, hue: 260 },

  // ФИОЛЕТОВЫЕ (271-285°)
  { id:"dk3", color:"#2e0854", text:"Тёмно‑фиолетовый", tone:"холодный", style:"креативный", season:"зима", colortype:"зима", textureHint:"Шёлк", makeupHint:"Тени фиолетовые", makeupSet:{ lips:"Фуксия", eyes:"Фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }, hue: 270 },
  { id:"wi3", color:"#4b0082", text:"Фиолетовый", tone:"холодный", style:"романтический", season:"зима", colortype:"зима", textureHint:"Шёлк", makeupHint:"Тени фиолетовые", makeupSet:{ lips:"Нюдовая", eyes:"Фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"романтический" }, hue: 271 },
  { id:"wid5", color:"#4b0082", text:"Тёмно‑фиолетовый", tone:"холодный", style:"романтический", season:"зима", colortype:"зима", textureHint:"Бархат", makeupHint:"Тени тёмно‑фиолетовые", makeupSet:{ lips:"Фуксия", eyes:"Тёмно‑фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"романтический" }, hue: 271 },

  // ФИОЛЕТОВЫЕ (286-300°)
  { id:"sud3", color:"#8a2be2", text:"Тёмно‑сиреневый", tone:"холодный", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени тёмно‑сиреневые", makeupSet:{ lips:"Фуксия", eyes:"Тёмно‑сиреневые", blush:"Холодные", eyeliner:"Чёрная", style:"Романтический" }, hue: 271 },
  { id:"wib1", color:"#9b30ff", text:"Ярко‑фиолетовый", tone:"холодный", style:"креативный", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени ярко‑фиолетовые", makeupSet:{ lips:"Фуксия", eyes:"Ярко‑фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }, hue: 272 },
  { id:"bal3", color:"#8a2be2", text:"Фиолетово-синий", tone:"холодный", style:"креативный", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени фиолетовые", makeupSet:{ lips:"Фуксия", eyes:"Фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }, hue: 271 },

  // СИРЕНЕВЫЕ (301-315°)
  { id:"su3", color:"#dda0dd", text:"Сиреневый", tone:"холодный", style:"креативный", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени сиреневые", makeupSet:{ lips:"Фуксия", eyes:"Сиреневые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }, hue: 300 },
  { id:"sub3", color:"#dda0dd", text:"Ярко‑сиреневый", tone:"холодный", style:"креативный", season:"лето", colortype:"лето", textureHint:"Атлас", makeupHint:"Тени ярко‑сиреневые", makeupSet:{ lips:"Фуксия", eyes:"Ярко‑сиреневые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }, hue: 300 },
  { id:"wi2", color:"#ff00ff", text:"Фуксия", tone:"холодный", style:"креативный", season:"зима", colortype:"зима", textureHint:"Бархат, шёлк", makeupHint:"Помада фуксия", makeupSet:{ lips:"Фуксия", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Креативный" }, hue: 300 },

  // РОЗОВО-ФИОЛЕТОВЫЕ (316-330°)
  { id:"sp6", color:"#ff69b4", text:"Ярко‑розовый", tone:"тёплый", style:"креативный", season:"весна", colortype:"весна", textureHint:"Шифон", makeupHint:"Помада розовая", makeupSet:{ lips:"Ярко‑розовая", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Креативный" }, hue: 330 },
  { id:"br6", color:"#ff1493", text:"Ярко‑розовый", tone:"тёплый", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шифон", makeupHint:"Помада розовая", makeupSet:{ lips:"Ярко‑розовая", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"романтический" }, hue: 328 },
  { id:"sub4", color:"#ff1493", text:"Ярко‑розовый", tone:"тёплый", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шифон", makeupHint:"Помада ярко‑розовая", makeupSet:{ lips:"Ярко‑розовая", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Романтический" }, hue: 328 },

  // РОЗОВЫЕ (331-345°)
  { id:"spd5", color:"#c71585", text:"Тёмно‑розовый", tone:"тёплый", style:"креативный", season:"весна", colortype:"весна", textureHint:"Атлас", makeupHint:"Помада тёмно‑розовая", makeupSet:{ lips:"Тёмно‑розовая", eyes:"Серебристые", blush:"Тёмные", eyeliner:"Чёрная", style:"Креативный" }, hue: 322 },
  { id:"bal14", color:"#ff1493", text:"Глубокий розовый", tone:"тёплый", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Помада розовая", makeupSet:{ lips:"Розовая", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Романтический" }, hue: 328 },
  { id:"aub4", color:"#dc143c", text:"Ярко‑красный", tone:"тёплый", style:"праздничный", season:"осень", colortype:"осень", textureHint:"Бархат", makeupHint:"Помада ярко‑красная", makeupSet:{ lips:"Ярко‑красная", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Чёрная", style:"Праздничный" }, hue: 348 },

  // РОЗОВЫЕ (346-360°)
  { id:"wib2", color:"#c71585", text:"Ярко‑красный", tone:"тёплый", style:"контрастный", season:"зима", colortype:"зима", textureHint:"Бархат", makeupHint:"Помада ярко‑красная", makeupSet:{ lips:"Ярко‑красная", eyes:"Тёмные", blush:"Охра", eyeliner:"Чёрная", style:"Контрастный" }, hue: 322 },
  { id:"su7", color:"#ffc0cb", text:"Розовый", tone:"тёплый", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шифон", makeupHint:"Помада, румяна", makeupSet:{ lips:"Розовая", eyes:"Светло‑голубые", blush:"Розовые", eyeliner:"Тонкая чёрная", style:"романтический" }, hue: 350 },
  { id:"su8", color:"#ffe4e1", text:"Светло‑розовый", tone:"тёплый", style:"повседневный", season:"лето", colortype:"лето", textureHint:"Пастельные ткани", makeupHint:"Румяна, хайлайтер", makeupSet:{ lips:"Светло‑розовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Серая", style:"Повседневный" }, hue: 5 },
  { id:"sud4", color:"#d8bfd8", text:"Тёмно‑розовый", tone:"холодный", style:"повседневный", season:"лето", colortype:"лето", textureHint:"Пастельные ткани", makeupHint:"Помада тёмно‑розовая", makeupSet:{ lips:"Тёмно‑розовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Серая", style:"Повседневный" }, hue: 300 },

  // НЕЙТРАЛЬНЫЕ - ЧЕРНЫЕ И СЕРЫЕ
  { id:"dk1", color:"#000000", text:"Чёрный", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Классика, вечер", makeupHint:"Подводка чёрная", makeupSet:{ lips:"Красная", eyes:"Смоки айс", blush:"Нейтральные", eyeliner:"Чёрная", style:"Классический вечер" }, hue: 0 },
  { id:"un2", color:"#dcdcdc", text:"Светло‑серый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Трикотаж", makeupHint:"Тени серые", makeupSet:{ lips:"Нюдовая", eyes:"Серые", blush:"Светлые", eyeliner:"Чёрная", style:"Универсальный" }, hue: 0 },
  { id:"dk6", color:"#2f2f2f", text:"Графитовый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Трикотаж", makeupHint:"Тени серые", makeupSet:{ lips:"Нюдовая", eyes:"Серые", blush:"Нейтральные", eyeliner:"Чёрная", style:"Базовый" }, hue: 0 },
  { id:"wid2", color:"#2f2f2f", text:"Тёмно‑графитовый", tone:"нейтральный", style:"универсальный", season:"зима", colortype:"зима", textureHint:"Шерсть", makeupHint:"Тени тёмно‑графитовые", makeupSet:{ lips:"Нюдовая", eyes:"Тёмно‑графитовые", blush:"Нейтральные", eyeliner:"Чёрная", style:"Универсальный" }, hue: 0 },

  // НЕЙТРАЛЬНЫЕ - БЕЛЫЕ
  { id:"wib3", color:"#ffffff", text:"Ярко‑белый", tone:"нейтральный", style:"универсальный", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Хайлайтер ярко‑белый", makeupSet:{ lips:"Нюдовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Чёрная", style:"Универсальный" }, hue: 0 },
  { id:"un4", color:"#f0f8ff", text:"Алиссиновый белый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Шифон", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Серая", style:"Базовый" }, hue: 208 },
  { id:"un5", color:"#fafafa", text:"Молочный", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Трикотаж", makeupHint:"Тени светлые", makeupSet:{ lips:"Нюдовая", eyes:"Светлые", blush:"Светлые", eyeliner:"Коричневая", style:"Универсальный" }, hue: 0 },
  { id:"un8", color:"#f8f8ff", text:"Призрачный белый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Шифон", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Серая", style:"Базовый" }, hue: 240 },
  { id:"un9", color:"#fffafa", text:"Снежный", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Атлас", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Чёрная", style:"Классический" }, hue: 0 },

  // НЕЙТРАЛЬНЫЕ - ТЕПЛЫЕ БЕЖЕВЫЕ
  { id:"un1", color:"#faf0e6", text:"Льняной", tone:"нейтральный", style:"повседневный", season:"все", colortype:"универсальный", textureHint:"Лён", makeupHint:"Тени светлые", makeupSet:{ lips:"Нюдовая", eyes:"Светлые", blush:"Светлые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 30 },
  { id:"un3", color:"#ffe4c4", text:"Бисквитный", tone:"тёплый", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Хлопок", makeupHint:"Румяна бежевые", makeupSet:{ lips:"Нюдовая", eyes:"Бежевые", blush:"Светлые", eyeliner:"Коричневая", style:"Универсальный" }, hue: 33 },
  { id:"un7", color:"#fff5ee", text:"Сливочный", tone:"тёплый", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Хлопок", makeupHint:"Румяна светлые", makeupSet:{ lips:"Нюдовая", eyes:"Бежевые", blush:"Светлые", eyeliner:"Коричневая", style:"Универсальный" }, hue: 25 },
  { id:"sud5", color:"#f5deb3", text:"Тёмно‑бежевый", tone:"нейтральный", style:"универсальный", season:"лето", colortype:"лето", textureHint:"Хлопок", makeupHint:"Тени тёмно‑бежевые", makeupSet:{ lips:"Нюдовая", eyes:"Тёмно‑бежевые", blush:"Светлые", eyeliner:"Коричневая", style:"Универсальный" }, hue: 39 },
  { id:"un6", color:"#fdf5e6", text:"Слоновая кость", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Атлас", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Светлые", blush:"Светлые", eyeliner:"Коричневая", style:"Классический" }, hue: 45 },
  { id:"un10", color:"#f0fff0", text:"Мятный белый", tone:"холодный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Хлопок", makeupHint:"Тени мятные", makeupSet:{ lips:"Нюдовая", eyes:"Мятные", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }, hue: 120 },

  // ОСЕННИЕ ДОПОЛНИТЕЛЬНЫЕ
  { id:"au1", color:"#cd5c5c", text:"Терракотовый", tone:"тёплый", style:"повседневный", season:"осень", colortype:"осень", textureHint:"Шерсть", makeupHint:"Помада терракотовая", makeupSet:{ lips:"Терракотовая", eyes:"Коричневые", blush:"Бронзовые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 0 },
  { id:"au4", color:"#a0522d", text:"Шоколадный", tone:"тёплый", style:"вечерний", season:"осень", colortype:"осень", textureHint:"Бархат", makeupHint:"Помада шоколадная", makeupSet:{ lips:"Шоколадная", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Чёрная", style:"Вечерний" }, hue: 25 },
  { id:"au5", color:"#b8860b", text:"Золотисто‑коричневый", tone:"тёплый", style:"деловой", season:"осень", colortype:"осень", textureHint:"Шерсть", makeupHint:"Тени золотистые", makeupSet:{ lips:"Бордовая", eyes:"Золотистые", blush:"Бронзовые", eyeliner:"Чёрная", style:"Деловой" }, hue: 43 },
  { id:"au8", color:"#8b4513", text:"Каштановый", tone:"тёплый", style:"универсальный", season:"осень", colortype:"осень", textureHint:"Кожа", makeupHint:"Помада каштановая", makeupSet:{ lips:"Каштановая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Чёрная", style:"Универсальный" }, hue: 30 },
  { id:"aud1", color:"#a0522d", text:"Тёмно‑терракотовый", tone:"тёплый", style:"повседневный", season:"осень", colortype:"осень", textureHint:"Шерсть", makeupHint:"Помада тёмно‑терракотовая", makeupSet:{ lips:"Тёмно‑терракотовая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 25 },
  { id:"aud4", color:"#654321", text:"Тёмно‑коричневый", tone:"тёплый", style:"универсальный", season:"осень", colortype:"осень", textureHint:"Твид", makeupHint:"Тени тёмно‑коричневые", makeupSet:{ lips:"Нюдовая", eyes:"Тёмно‑коричневые", blush:"Тёплые", eyeliner:"Коричневая", style:"Универсальный" }, hue: 30 },
  { id:"aud5", color:"#cc7722", text:"Тёмно‑охра", tone:"тёплый", style:"креативный", season:"осень", colortype:"осень", textureHint:"Шерсть", makeupHint:"Румяна тёмная охра", makeupSet:{ lips:"Нюдовая", eyes:"Коричневые", blush:"Тёмная охра", eyeliner:"Коричневая", style:"Креативный" }, hue: 30 },

  // ВЕСЕННИЕ ДОПОЛНИТЕЛЬНЫЕ
  { id:"spd1", color:"#d2691e", text:"Тёмно‑коралловый", tone:"тёплый", style:"вечерний", season:"весна", colortype:"весна", textureHint:"Шерсть", makeupHint:"Помада тёмно‑коралловая", makeupSet:{ lips:"Тёмно‑коралловая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Коричневая", style:"Вечерний" }, hue: 25 },
  { id:"spd2", color:"#ff6347", text:"Тёмно‑персиковый", tone:"тёплый", style:"деловой", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Румяна тёмно‑персиковые", makeupSet:{ lips:"Нюдовая", eyes:"Персиковые", blush:"Тёмно‑персиковые", eyeliner:"Коричневая", style:"Деловой" }, hue: 9 },
  { id:"spd4", color:"#cd5c5c", text:"Тёмно‑абрикосовый", tone:"тёплый", style:"романтический", season:"весна", colortype:"весна", textureHint:"Шифон", makeupHint:"Румяна тёмно‑абрикосовые", makeupSet:{ lips:"Тёмно‑абрикосовая", eyes:"Бежевые", blush:"Тёмно‑абрикосовые", eyeliner:"Коричневая", style:"романтический" }, hue: 0 },
  { id:"sp2", color:"#ffa07a", text:"Коралловый", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Хлопок, лен", makeupHint:"Помада коралловая", makeupSet:{ lips:"Коралловая", eyes:"Бежевые", blush:"Абрикосовые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 15 },
  { id:"spb2", color:"#ff6b8b", text:"Ярко‑коралловый", tone:"тёплый", style:"контрастный", season:"весна", colortype:"весна", textureHint:"Шифон", makeupHint:"Помада ярко‑коралловая", makeupSet:{ lips:"Ярко‑коралловая", eyes:"Бежевые", blush:"Коралловые", eyeliner:"Чёрная", style:"Контрастный" }, hue: 348 }
];

// === АВТОМАТИЧЕСКИ ДОБАВЛЯЕМ HUE ===
colors = colors.map(color => ({
  ...color,
  hue: calculateHue(color.color)
}));

// === СОРТИРУЕМ ПО ЦВЕТОВОМУ КРУГУ ===
colors.sort((a, b) => a.hue - b.hue);


// === ВСЕ ЦВЕТОВЫЕ СХЕМЫ ===
const schemeGenerators = {
  // Аналоговая - соседние цвета в круге
  analog: (i, colors = colors) => {
    return [
      colors[(i - 1 + colors.length) % colors.length],
      colors[i],
      colors[(i + 1) % colors.length]
    ].filter(Boolean);
  },

  // Комплементарная - противоположный цвет
  complement: (i, colors = colors) => {
    const compIndex = (i + Math.floor(colors.length / 2)) % colors.length;
    return [colors[i], colors[compIndex]].filter(Boolean);
  },

  // Триада - три равноудаленных цвета
  triad: (i, colors = colors) => {
    const third = Math.floor(colors.length / 3);
    return [
      colors[i],
      colors[(i + third) % colors.length],
      colors[(i + 2 * third) % colors.length]
    ].filter(Boolean);
  },

  // Раздельно-комплементарная
  splitComplement: (i, colors = colors) => {
    const half = Math.floor(colors.length / 2);
    return [
      colors[i],
      colors[(i + half - 1) % colors.length],
      colors[(i + half + 1) % colors.length]
    ].filter(Boolean);
  },

  // Тетрадическая - 4 цвета через 90°
  tetradic: (i, colors = colors) => {
    const quarter = Math.floor(colors.length / 4);
    return [
      colors[i],
      colors[(i + quarter) % colors.length],
      colors[(i + 2 * quarter) % colors.length],
      colors[(i + 3 * quarter) % colors.length]
    ].filter(Boolean);
  },

  // Монохроматическая - оттенки одного цвета
  monochrome: (i, colors = colors) => {
    const baseColor = colors[i];
    const dark = {
      ...baseColor,
      id: baseColor.id + "_dark",
      color: shadeColor(baseColor.color, -30),
      text: baseColor.text + " тёмный"
    };
    const light = {
      ...baseColor, 
      id: baseColor.id + "_light",
      color: shadeColor(baseColor.color, 30),
      text: baseColor.text + " светлый"
    };
    return [baseColor, dark, light];
  },

  // Акцентная комплементарная
  accentComplement: (i, colors = colors) => {
    const half = Math.floor(colors.length / 2);
    return [
      colors[i],
      colors[(i - 1 + colors.length) % colors.length],
      colors[(i + 1) % colors.length],
      colors[(i + half) % colors.length]
    ].filter(Boolean);
  },

  // Двойная комплементарная
  dyad: (i, colors = colors) => {
    const eighth = Math.floor(colors.length / 8);
    return [
      colors[i],
      colors[(i + eighth) % colors.length],
      colors[(i - eighth + colors.length) % colors.length]
    ].filter(Boolean);
  },

  // Нейтральная схема
  neutral: (i, colors = colors) => {
    const baseColor = colors[i];
    const neutralColors = colors.filter(color => 
      color.tone === "нейтральный" && color.id !== baseColor.id
    );
    return [baseColor, ...neutralColors.slice(0, 2)];
  },

  tonal: (i, colors = colors) => {
  const baseColor = colors[i];
  
  // Берем соседние цвета в круге (в пределах 2 позиций)
  const neighbors = [
    colors[(i - 2 + colors.length) % colors.length],
    colors[(i - 1 + colors.length) % colors.length],
    colors[(i + 1) % colors.length],
    colors[(i + 2) % colors.length]
  ].filter(color => color && color.id !== baseColor.id);
  
  // Фильтруем по тональной близости (hue в пределах 30°)
  const baseHue = baseColor.hue;
  const tonalColors = neighbors.filter(color => {
    const hueDiff = Math.min(
      Math.abs(color.hue - baseHue),
      Math.abs(color.hue - baseHue - 360),
      Math.abs(color.hue - baseHue + 360)
    );
    return hueDiff <= 30;
  });
  
  // Если нашли подходящие - берем 2 самых близких
  if (tonalColors.length >= 2) {
    tonalColors.sort((a, b) => {
      const diffA = Math.min(Math.abs(a.hue - baseHue), Math.abs(a.hue - baseHue - 360), Math.abs(a.hue - baseHue + 360));
      const diffB = Math.min(Math.abs(b.hue - baseHue), Math.abs(b.hue - baseHue - 360), Math.abs(b.hue - baseHue + 360));
      return diffA - diffB;
    });
    return [baseColor, ...tonalColors.slice(0, 2)];
  }
  
  // Если не нашли - используем ближайших соседей
  return [baseColor, ...neighbors.slice(0, 2)];
},

 
  // Пентадическая - 5 цветов
  pentadic: (i, colors = colors) => {
    const step = Math.floor(colors.length / 5);
    const result = [];
    for (let k = 0; k < 5; k++) {
      result.push(colors[(i + k * step) % colors.length]);
    }
    return result.filter(Boolean);
  },

  // Акцентная триада
  accentTriad: (i, colors = colors) => {
    const sixth = Math.floor(colors.length / 6);
    return [
      colors[i],
      colors[(i + sixth) % colors.length],
      colors[(i - sixth + colors.length) % colors.length]
    ].filter(Boolean);
  },

  // Контрастная аналоговая
  contrastAnalogous: (i, colors = colors) => {
    const third = Math.floor(colors.length / 3);
    return [
      colors[i],
      colors[(i - 1 + colors.length) % colors.length],
      colors[(i + third) % colors.length]
    ].filter(Boolean);
  },

  // Оттеночная комплементарная
  tintedComplement: (i, colors = colors) => {
    const compIndex = (i + Math.floor(colors.length / 2)) % colors.length;
    return [
      colors[i],
      colors[(compIndex - 1 + colors.length) % colors.length],
      colors[(compIndex + 1) % colors.length]
    ].filter(Boolean);
  },

  // Также хорошие сочетания
  alsoGood: (i, colors = colors) => {
    return [
      colors[(i - 2 + colors.length) % colors.length],
      colors[(i - 1 + colors.length) % colors.length],
      colors[(i + 1) % colors.length],
      colors[(i + 2) % colors.length]
    ].filter(Boolean);
  },

  // Неудачные сочетания
  notGood: (i, colors = colors) => {
    const baseColor = colors[i];
    const conflictingIndexes = [
      (i + 5) % colors.length,
      (i - 5 + colors.length) % colors.length,
      (i + Math.floor(colors.length / 2) - 5 + colors.length) % colors.length,
      (i + Math.floor(colors.length / 2) + 5) % colors.length,
      (i + Math.floor(colors.length * 0.4)) % colors.length
    ];
    return conflictingIndexes
      .map(index => colors[index])
      .filter(color => color && color.id !== baseColor.id)
      .slice(0, 5);
  },

  // Мягкая гармония
  soft: (i, colors = colors) => {
    const baseColor = colors[i];
    const analog = [
      colors[(i - 1 + colors.length) % colors.length],
      colors[(i + 1) % colors.length]
    ].filter(Boolean);
    const neutral = colors.find(color => color.tone === "нейтральный" && color.id !== baseColor.id);
    return [baseColor, ...analog, neutral].filter(Boolean);
  },

  
  // Разделенная триада
  splitTriad: (i, colors = colors) => {
    const third = Math.floor(colors.length / 3);
    return [
      colors[i],
      colors[(i + third - 1) % colors.length],
      colors[(i + 2 * third + 1) % colors.length]
    ].filter(Boolean);
  },

  // === УЛУЧШЕННЫЕ СТИЛЕВЫЕ СХЕМЫ ===

  // Вечерняя схема с темными оттенками
evening: (i, colors = colors) => {
    const baseColor = colors[i];
    
    // Берем цвета со стилем "вечерний", черные и темные оттенки
    const eveningColors = colors
        .filter(color => 
            (color.style === "вечерний" || 
             color.text.toLowerCase().includes("черный") || 
             color.text.toLowerCase().includes("тёмный") ||
             color.text.toLowerCase().includes("темный")) && 
            color.id !== baseColor.id
        )
        .sort(() => Math.random() - 0.5);
    
    console.log("Найдено вечерних цветов:", eveningColors.length);
    
    // Если вечерних цветов мало, создаем затемненные версии других цветов
    if (eveningColors.length < 2) {
        // Затемняем случайные цвета на 40-60%
        const darkColors = colors
            .filter(color => 
                color.id !== baseColor.id && 
                !eveningColors.includes(color) &&
                !color.text.toLowerCase().includes("светлый") &&
                !color.text.toLowerCase().includes("пастельный")
            )
            .sort(() => Math.random() - 0.5)
            .slice(0, 2 - eveningColors.length)
            .map(color => {
                const darkenPercent = 40 + Math.floor(Math.random() * 20); // 40-60%
                const darkenedColor = shadeColor(color.color, -darkenPercent);
                
                return {
                    ...color,
                    color: darkenedColor,
                    text: color.text + " (тёмный)",
                    id: color.id + "_dark"
                };
            });
        
        return [baseColor, ...eveningColors, ...darkColors];
    }
    
    return [baseColor, ...eveningColors.slice(0, 2)];
},

// Альтернативная версия с глубоким затемнением
evening: (i, colors = colors) => {
    const baseColor = colors[i];
    
    const eveningColors = colors
        .filter(color => 
            color.style === "вечерний" && 
            color.id !== baseColor.id
        )
        .sort(() => Math.random() - 0.5);
    
    // Создаем глубоко затемненные версии для драматичного эффекта
    const darkenedColors = eveningColors.slice(0, 2).map(color => {
        const darkenPercent = 50 + Math.floor(Math.random() * 30); // 50-80%
        const darkenedColor = shadeColor(color.color, -darkenPercent);
        
        return {
            ...color,
            color: darkenedColor,
            text: color.text + " (вечерний)",
            id: color.id + "_evening"
        };
    });
    
    return [baseColor, ...darkenedColors];
},

// Версия с черным как базовым акцентом
evening: (i, colors = colors) => {
    const baseColor = colors[i];
    
    // Ищем черный цвет
    const blackColor = colors.find(color => 
        color.text.toLowerCase().includes("черный") || 
        color.color.toLowerCase() === "#000000"
    );
    
    // Остальные вечерние цвета
    const otherEveningColors = colors
        .filter(color => 
            color.style === "вечерний" && 
            color.id !== baseColor.id &&
            color !== blackColor
        )
        .sort(() => Math.random() - 0.5);
    
    const selectedColors = [];
    
    // Добавляем черный, если нашли
    if (blackColor && blackColor.id !== baseColor.id) {
        selectedColors.push(blackColor);
    }
    
    // Добавляем другие вечерние цвета
    selectedColors.push(...otherEveningColors.slice(0, 2 - selectedColors.length));
    
    // Если все еще мало цветов, добавляем глубокие темные
    if (selectedColors.length < 2) {
        const deepColors = colors
            .filter(color => 
                color.id !== baseColor.id && 
                !selectedColors.includes(color)
            )
            .sort(() => Math.random() - 0.5)
            .slice(0, 2 - selectedColors.length)
            .map(color => {
                const darkenedColor = shadeColor(color.color, -60);
                return {
                    ...color,
                    color: darkenedColor,
                    text: color.text + " (ночной)",
                    id: color.id + "_night"
                };
            });
        
        selectedColors.push(...deepColors);
    }
    
    return [baseColor, ...selectedColors];
},


  // Повседневная универсальная схема с осветлением
casual: (i, colors = colors) => {
    const baseColor = colors[i];
    
    // Берем цвета со стилями "повседневный" и "универсальный"
    const casualUniversalColors = colors
        .filter(color => 
            (color.style === "повседневный" || color.style === "универсальный") && 
            color.id !== baseColor.id
        )
        .sort(() => Math.random() - 0.5);
    
    console.log("Найдено повседневных/универсальных цветов:", casualUniversalColors.length);
    
    // Создаем осветленные версии выбранных цветов
    const lightenedColors = casualUniversalColors.slice(0, 2).map(color => {
        // Осветляем цвет на 20%
        const lightenedColor = shadeColor(color.color, 20);
        return {
            ...color,
            color: lightenedColor,
            text: color.text + " (осветленный)",
            id: color.id + "_light"
        };
    });
    
    return [baseColor, ...lightenedColors];
},

// Альтернативная версия с разной степенью осветления
casual: (i, colors = colors) => {
    const baseColor = colors[i];
    
    const casualUniversalColors = colors
        .filter(color => 
            (color.style === "повседневный" || color.style === "универсальный") && 
            color.id !== baseColor.id
        )
        .sort(() => Math.random() - 0.5);
    
    // Разная степень осветления для вариативности
    const lighteningPercentages = [15, 25, 30]; // разные уровни осветления
    
    const lightenedColors = casualUniversalColors.slice(0, 2).map((color, index) => {
        const lightenPercent = lighteningPercentages[index] || 20;
        const lightenedColor = shadeColor(color.color, lightenPercent);
        
        return {
            ...color,
            color: lightenedColor,
            text: `${color.text} (светлый ${lightenPercent}%)`,
            id: color.id + `_light${lightenPercent}`
        };
    });
    
    return [baseColor, ...lightenedColors];
},

// Версия с выбором: оригинал или осветленный
casual: (i, colors = colors) => {
    const baseColor = colors[i];
    
    const casualUniversalColors = colors
        .filter(color => 
            (color.style === "повседневный" || color.style === "универсальный") && 
            color.id !== baseColor.id
        )
        .sort(() => Math.random() - 0.5);
    
    const selectedColors = casualUniversalColors.slice(0, 2).map(color => {
        // Случайно решаем осветлить цвет или оставить оригинальным
        const shouldLighten = Math.random() > 0.5;
        
        if (shouldLighten) {
            const lightenedColor = shadeColor(color.color, 20);
            return {
                ...color,
                color: lightenedColor,
                text: color.text + " (светлый)",
                id: color.id + "_light"
            };
        }
        
        return color; // Оставляем оригинальный
    });
    
    return [baseColor, ...selectedColors];
  },

  // Деловая схема с бежевыми оттенками
business: (i, colors = colors) => {
    const baseColor = colors[i];
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Берем цвета со стилем "деловой" и бежевые оттенки
    const businessColors = colors
        .filter(color => 
            (color.style === "деловой" || 
             color.text.toLowerCase().includes("бежевый") ||
             color.text.toLowerCase().includes("белый") ||
             color.text.toLowerCase().includes("серый") ||
             color.text.toLowerCase().includes("коричневый")) && 
            color.id !== baseColor.id
        )
        .sort(() => Math.random() - 0.5);
    
    console.log("Найдено деловых цветов:", businessColors.length);
    
    // Фильтруем цвета, чтобы они гармонировали с базовым
    const harmoniousBusinessColors = businessColors.filter(color => {
        const colorHue = color.hue || calculateHue(color.color);
        const hueDiff = Math.min(
            Math.abs(colorHue - baseHue),
            360 - Math.abs(colorHue - baseHue)
        );
        
        // Берем цвета в гармоничном диапазоне или нейтральные
        return hueDiff <= 60 || 
               color.style === "деловой" ||
               color.text.toLowerCase().includes("бежевый") ||
               color.text.toLowerCase().includes("серый");
    });
    
    // Если гармоничных цветов мало, используем все доступные деловые
    const finalColors = harmoniousBusinessColors.length >= 2 ? 
        harmoniousBusinessColors : businessColors;
    
    return [baseColor, ...finalColors.slice(0, 2)];
},

// Альтернативная версия с приоритетом бежевых оттенков
business: (i, colors = colors) => {
    const baseColor = colors[i];
    
    // Разделяем цвета по категориям
    const businessStyleColors = colors.filter(color => 
        color.style === "деловой" && color.id !== baseColor.id
    );
    
    const beigeColors = colors.filter(color => 
        color.text.toLowerCase().includes("бежевый") && 
        color.id !== baseColor.id
    );
    
    const neutralColors = colors.filter(color => 
        (color.text.toLowerCase().includes("белый") ||
         color.text.toLowerCase().includes("серый") ||
         color.text.toLowerCase().includes("коричневый")) && 
        color.id !== baseColor.id
    );
    
    // Собираем случайную комбинацию
    const selectedColors = [];
    
    // Сначала пытаемся добавить бежевый
    if (beigeColors.length > 0) {
        const randomBeige = beigeColors[Math.floor(Math.random() * beigeColors.length)];
        selectedColors.push(randomBeige);
    }
    
    // Затем добавляем деловые цвета
    const shuffledBusiness = [...businessStyleColors].sort(() => Math.random() - 0.5);
    for (let businessColor of shuffledBusiness) {
        if (selectedColors.length >= 2) break;
        if (!selectedColors.includes(businessColor)) {
            selectedColors.push(businessColor);
        }
    }
    
    // Если все еще мало, добавляем нейтральные
    if (selectedColors.length < 2) {
        const shuffledNeutral = [...neutralColors].sort(() => Math.random() - 0.5);
        for (let neutralColor of shuffledNeutral) {
            if (selectedColors.length >= 2) break;
            if (!selectedColors.includes(neutralColor)) {
                selectedColors.push(neutralColor);
            }
        }
    }
    
    return [baseColor, ...selectedColors.slice(0, 2)];
},

// Яркая схема с насыщенными и интенсивными цветами
bright: (i, colors = colors) => {
    const baseColor = colors[i];
    
    // Ищем яркие и насыщенные цвета
    const brightColors = colors
        .filter(color => {
            if (color.id === baseColor.id) return false;
            
            // Критерии яркости:
            const isBrightStyle = color.style === "яркий" || color.style === "контрастный";
            const isBrightColor = color.text.toLowerCase().includes("яркий") || 
                                 color.text.toLowerCase().includes("неоновый") ||
                                 color.text.toLowerCase().includes("кислотный");
            
            // Проверяем насыщенность цвета через вычисления
            const hex = color.color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max * 100;
            
            return isBrightStyle || isBrightColor || saturation > 70;
        })
        .sort(() => Math.random() - 0.5);
    
    console.log("Найдено ярких цветов:", brightColors.length);
    
    // Усиливаем насыщенность выбранных цветов
    const intensifiedColors = brightColors.slice(0, 2).map(color => {
        // Увеличиваем насыщенность на 20%
        const hex = color.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Простое усиление цвета (упрощенный метод)
        const intensify = (channel) => Math.min(255, channel + 50);
        
        const intensifiedColor = `#${intensify(r).toString(16).padStart(2, '0')}${intensify(g).toString(16).padStart(2, '0')}${intensify(b).toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: intensifiedColor,
            text: color.text + " (усиленный)",
            id: color.id + "_bright"
        };
    });
    
    return [baseColor, ...intensifiedColors];
},

// Альтернативная версия с неоновыми акцентами
bright: (i, colors = colors) => {
    const baseColor = colors[i];
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Предопределенные неоновые оттенки для гарантированной яркости
    const neonHues = [
        {hue: 0, name: "неоново-красный", color: "#FF073A"},    // Ярко-красный
        {hue: 35, name: "неоново-оранжевый", color: "#FF5F00"}, // Оранжевый
        {hue: 60, name: "неоново-желтый", color: "#FFFF00"},    // Желтый
        {hue: 120, name: "неоново-зеленый", color: "#39FF14"},  // Зеленый
        {hue: 180, name: "неоново-бирюзовый", color: "#00F5FF"}, // Бирюзовый
        {hue: 240, name: "неоново-синий", color: "#0047FF"},    // Синий
        {hue: 300, name: "неоново-розовый", color: "#FF00FF"}   // Розовый
    ];
    
    // Выбираем 2 случайных неоновых цвета
    const shuffledNeons = [...neonHues].sort(() => Math.random() - 0.5).slice(0, 2);
    
    const neonColors = shuffledNeons.map(neon => ({
        color: neon.color,
        text: neon.name,
        tone: "яркий",
        style: "яркий",
        id: `neon_${neon.hue}`,
        hue: neon.hue
    }));
    
    return [baseColor, ...neonColors];
},

// Упрощенная яркая схема
bright: (i, colors = colors) => {
    const baseColor = colors[i];
    
    const brightColors = colors
        .filter(color => 
            (color.style === "яркий" || 
             color.tone === "яркий" ||
             color.text.toLowerCase().includes("яркий") ||
             color.text.toLowerCase().includes("неоновый")) && 
            color.id !== baseColor.id
        )
        .sort(() => Math.random() - 0.5);
    
    // Если ярких цветов мало, создаем яркие версии обычных цветов
    if (brightColors.length < 2) {
        const saturatedColors = colors
            .filter(color => 
                color.id !== baseColor.id && 
                !brightColors.includes(color)
            )
            .sort(() => Math.random() - 0.5)
            .slice(0, 2 - brightColors.length)
            .map(color => {
                // Создаем более насыщенную версию
                const hex = color.color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                
                const boost = (channel) => {
                    if (channel < 128) return Math.max(0, channel - 30);
                    return Math.min(255, channel + 30);
                };
                
                const brightColor = `#${boost(r).toString(16).padStart(2, '0')}${boost(g).toString(16).padStart(2, '0')}${boost(b).toString(16).padStart(2, '0')}`;
                
                return {
                    ...color,
                    color: brightColor,
                    text: color.text + " (яркий)",
                    id: color.id + "_saturated"
                };
            });
        
        return [baseColor, ...brightColors, ...saturatedColors];
    }
    
    return [baseColor, ...brightColors.slice(0, 2)];
},

//креативная схема
  // Креативная схема с яркими и неожиданными сочетаниями
creative: (i, colors = colors) => {
    const baseColor = colors[i];
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Ищем контрастные и неожиданные сочетания
    const creativeColors = colors
        .filter(color => {
            if (color.id === baseColor.id) return false;
            
            const colorHue = color.hue || calculateHue(color.color);
            const hueDiff = Math.min(
                Math.abs(colorHue - baseHue),
                360 - Math.abs(colorHue - baseHue)
            );
            
            // Выбираем цвета с большим контрастом по hue (90-270 градусов)
            // или очень яркие и насыщенные цвета
            return (hueDiff >= 90 && hueDiff <= 270) ||
                   color.style === "яркий" ||
                   color.style === "контрастный" ||
                   (Math.random() > 0.7); // Добавляем элемент случайности
        })
        .sort(() => Math.random() - 0.5);
    
    // Создаем неожиданные комбинации
    const selectedColors = creativeColors.slice(0, 2);
    
    // Если нужно добавить больше креатива, модифицируем цвета
    const modifiedColors = selectedColors.map((color, index) => {
        // Случайно решаем модифицировать цвет
        if (Math.random() > 0.5) {
            const modificationType = Math.floor(Math.random() * 3);
            let modifiedColor, newText;
            
            switch(modificationType) {
                case 0: // Осветлить
                    modifiedColor = shadeColor(color.color, 30);
                    newText = color.text + " (пастельный)";
                    break;
                case 1: // Затемнить
                    modifiedColor = shadeColor(color.color, -30);
                    newText = color.text + " (глубокий)";
                    break;
                case 2: // Сделать более насыщенным
                    modifiedColor = color.color;
                    newText = color.text + " (неоновый)";
                    break;
                default:
                    modifiedColor = color.color;
                    newText = color.text;
            }
            
            return {
                ...color,
                color: modifiedColor,
                text: newText,
                id: color.id + "_creative" + index
            };
        }
        
        return color;
    });
    
    return [baseColor, ...modifiedColors];
},

   // Свежая схема
 // ЛУЧШАЯ ВЕРСИЯ - ПРОСТАЯ И ЭФФЕКТИВНАЯ
fresh: (i, colors = colors) => {
    const baseColor = colors[i];
    
    const freshColors = colors
        .filter(color => color.style === "свежий" && color.id !== baseColor.id)
        .sort(() => Math.random() - 0.5);
    
    return [baseColor, ...freshColors.slice(0, 2)];
},
 // Романтическая схема
// Романтическая схема СО СЛУЧАЙНЫМИ ЦВЕТАМИ
romantic: (i, colors = colors) => {
    const baseColor = colors[i];
    
    const romanticColors = colors
        .filter(color => 
            color.style === "романтический" && color.id !== baseColor.id
        )
        .sort(() => Math.random() - 0.5); // Добавляем случайность
    
    return [baseColor, ...romanticColors.slice(0, 2)];
},

// Дополнительно: если романтических цветов мало, можно добавить мягкие пастельные
romantic: (i, colors = colors) => {
    const baseColor = colors[i];
    
    let romanticColors = colors
        .filter(color => 
            color.style === "романтический" && color.id !== baseColor.id
        )
        .sort(() => Math.random() - 0.5);
    
    // Если романтических цветов мало, добавляем пастельные
    if (romanticColors.length < 2) {
        const pastelColors = colors
            .filter(color => 
                color.id !== baseColor.id && 
                !romanticColors.includes(color) &&
                (color.style === "пастельный" || color.lightness > 70) // светлые цвета
            )
            .sort(() => Math.random() - 0.5)
            .slice(0, 2 - romanticColors.length);
        
        romanticColors = [...romanticColors, ...pastelColors];
    }
    
    return [baseColor, ...romanticColors.slice(0, 2)];
},
}

// === ИНФОРМАЦИЯ О ВСЕХ СХЕМАХ ===
const schemeInfo = {
  analog: {
    name: "Аналоговая",
    description: "Соседние цвета на круге, мягкая гармония.",
    makeup: "Мягкие переходы оттенков: нюдовые губы, дневные тени и плавный румянец.",
    clothingStyle: "Повседневный, офисный, романтичный.",
    hint: "Усиливает гармонию, делает образ мягким и спокойным.",
    tips: { clothing: "Платья и костюмы в близких оттенках.", accessories: "Пастельные украшения, лёгкие шарфы." },
    season: "Лето",
    psychology: "Спокойствие, гармония.",
    occasion: "Офис, повседневные встречи.",
    hairTips: "Используй мягкие тона для окрашивания, избегай резких контрастов.",
    interior: "Гармоничные переходы в текстиле и отделке.",
    paletteRule: "Выбираются два соседних цвета от базового."
  },

  complement: {
    name: "Комплементарная", 
    description: "Противоположные цвета, яркий контраст.",
    makeup: "Яркие тени и подводка, акцентные губы.",
    clothingStyle: "Вечерний, праздничный.",
    hint: "Усиливает контраст, подчёркивает основной цвет.",
    tips: { clothing: "Контрастные платья, смелые костюмы.", accessories: "Яркие сумки, обувь, украшения." },
    season: "Зима",
    psychology: "Энергия, внимание.",
    occasion: "Праздники, вечерние выходы.",
    hairTips: "Используй противоположные оттенки для акцентных прядей.",
    interior: "Акцентные стены и декор в противоположных цветах.",
    paletteRule: "Выбирается противоположный цвет на круге (180°)."
  },

  triad: {
    name: "Триада",
    description: "Три равноудаленных цвета, сбалансированный контраст.",
    makeup: "Сбалансированные тени, умеренные акценты на губах.",
    clothingStyle: "Универсальный, творческий.",
    hint: "Создает динамичный, но гармоничный образ.",
    tips: { clothing: "Комбинированные наряды, многослойность.", accessories: "Разноцветные аксессуары." },
    season: "Весна",
    psychology: "Баланс, творчество.",
    occasion: "Творческие встречи, свидания.",
    hairTips: "Мелирование или окрашивание в три гармоничных оттенка.",
    interior: "Сбалансированные цветовые акценты в интерьере.",
    paletteRule: "Три цвета через равные интервалы (120°)."
  },

  splitComplement: {
    name: "Раздельно-комплементарная",
    description: "Основной цвет + два соседних к противоположному.",
    makeup: "Сбалансированные акценты, умеренная яркость.",
    clothingStyle: "Универсальный, офисный.",
    hint: "Менее резкий контраст, чем у комплементарной схемы.",
    tips: { clothing: "Элегантные комбинации, деловые костюмы.", accessories: "Сдержанные украшения." },
    season: "Осень", 
    psychology: "Уравновешенность, элегантность.",
    occasion: "Деловые встречи, официальные мероприятия.",
    hairTips: "Основной цвет волос с акцентными прядями соседних оттенков.",
    interior: "Элегантные цветовые сочетания в мебели и текстиле.",
    paletteRule: "Основной цвет + два цвета по сторонам от противоположного."
  },

  tetradic: {
    name: "Тетрадическая",
    description: "Четыре цвета через равные интервалы, богатая палитра.",
    makeup: "Сложные комбинации теней, акцентные детали.",
    clothingStyle: "Творческий, эклектичный.",
    hint: "Создает сложные и интересные комбинации.",
    tips: { clothing: "Многослойные образы, смелые комбинации.", accessories: "Разнообразные аксессуары." },
    season: "Все сезоны",
    psychology: "Богатство, разнообразие.",
    occasion: "Творческие мероприятия, фестивали.",
    hairTips: "Сложное окрашивание с несколькими гармонирующими оттенками.",
    interior: "Богатые цветовые решения в декоре.",
    paletteRule: "Четыре цвета через интервалы 90°."
  },

  monochrome: {
    name: "Монохроматическая",
    description: "Оттенки одного цвета, глубина и насыщенность.",
    makeup: "Естественные тона, градиентные переходы.",
    clothingStyle: "Минималистичный, элегантный.",
    hint: "Создает целостный и утонченный образ.",
    tips: { clothing: "Тотал лук, монохромные костюмы.", accessories: "Тон в тон." },
    season: "Все сезоны",
    psychology: "Целостность, утонченность.",
    occasion: "Официальные мероприятия, деловые встречи.",
    hairTips: "Омбре или балаяж в пределах одного цветового семейства.",
    interior: "Монохромные интерьеры с разной насыщенностью.",
    paletteRule: "Темный, средний и светлый оттенки одного цвета."
  },

  tonal: {
    name: "Тональная гармония",
    description: "Близкие оттенки в цветовом круге, мягкие переходы.",
    makeup: "Естественные румяна, мягкие тени, нюдовые губы.",
    clothingStyle: "Повседневный, романтичный.",
    hint: "Создает нежный и гармоничный образ.",
    tips: { clothing: "Платья пастельных тонов, легкие ткани.", accessories: "Деликатные украшения." },
    season: "Весна",
    psychology: "Нежность, гармония.",
    occasion: "Свидания, прогулки, встречи с друзьями.",
    hairTips: "Мягкое окрашивание в близких тонах.",
    interior: "Нежные переходы в текстиле и отделке.",
    paletteRule: "Цвета в пределах 20-30° от базового."
  },

  // Новые схемы
  soft: {
    name: "Мягкая гармония",
    description: "Аналоговые цвета с добавлением нейтрального оттенка.",
    makeup: "Естественные тона, минимальный макияж, светлые румяна.",
    clothingStyle: "Повседневный, комфортный, минималистичный.",
    hint: "Создает уютный и расслабляющий образ.",
    tips: { clothing: "Удобная одежда, натуральные ткани.", accessories: "Минималистичные украшения." },
    season: "Лето",
    psychology: "Комфорт, расслабление.",
    occasion: "Повседневная носка, отдых, прогулки.",
    hairTips: "Естественные оттенки, минимальное окрашивание.",
    interior: "Спокойные нейтральные интерьеры с мягкими акцентами.",
    paletteRule: "Аналоговые цвета + нейтральный (бежевый, серый, белый)."
  },

  splitTriad: {
    name: "Разделенная триада", 
    description: "Модификация триады с смещенными позициями.",
    makeup: "Сбалансированные акценты, умеренная яркость.",
    clothingStyle: "Творческий, нестандартный.",
    hint: "Создает интересные и неожиданные сочетания.",
    tips: { clothing: "Экспериментальные комбинации.", accessories: "Необычные аксессуары." },
    season: "Весна",
    psychology: "Креативность, оригинальность.",
    occasion: "Творческие мероприятия, арт-вечеринки.",
    hairTips: "Нестандартное окрашивание со смещенными акцентами.",
    interior: "Креативные цветовые решения в декоре.",
    paletteRule: "Основной цвет + два цвета со смещением от триадных позиций."
  },

  fresh: {
    name: "Свежая схема",
    description: "Холодные и свежие оттенки, освежающий эффект.",
    makeup: "Светлые тени, прозрачные губы, хайлайтер.",
    clothingStyle: "Спортивный, летний, активный.",
    hint: "Создает ощущение свежести и чистоты.",
    tips: { clothing: "Легкие ткани, спортивный стиль.", accessories: "Спортивные аксессуары." },
    season: "Лето",
    psychology: "Свежесть, энергия, чистота.",
    occasion: "Спорт, активный отдых, летние мероприятия.",
    hairTips: "Холодные оттенки блонда, пепельные тона.",
    interior: "Свежие и чистые интерьеры с холодными акцентами.",
    paletteRule: "Холодные тона и оттенки со стилем 'свежий'."
  },

  romantic: {
    name: "Романтическая схема",
    description: "Нежные и чувственные оттенки, романтичное настроение.",
    makeup: "Розовые румяна, блестящие тени, нежные губы.",
    clothingStyle: "Романтичный, вечерний, свидания.",
    hint: "Создает нежное и привлекательное настроение.",
    tips: { clothing: "Платья, юбки, кружева.", accessories: "Цветочные акценты, жемчуг." },
    season: "Весна",
    psychology: "Романтика, нежность, чувственность.",
    occasion: "Свидания, романтические ужины, свадьбы.",
    hairTips: "Мягкие волны, романтичные прически.",
    interior: "Романтичные интерьеры с цветочными мотивами.",
    paletteRule: "Цвета со стилем 'романтический'."
  },

  bright: {
    name: "Яркая схема", 
    description: "Яркие и насыщенные цвета, энергичное сочетание.",
    makeup: "Яркие тени, насыщенные губы, контрастная подводка.",
    clothingStyle: "Праздничный, клубный, летний.",
    hint: "Привлекает внимание, создает праздничное настроение.",
    tips: { clothing: "Яркие наряды, смелые принты.", accessories: "Броские украшения." },
    season: "Лето",
    psychology: "Энергия, радость, праздник.",
    occasion: "Вечеринки, фестивали, праздники.",
    hairTips: "Яркое окрашивание, неоновые акценты.",
    interior: "Яркие акцентные стены, праздничный декор.",
    paletteRule: "Цвета со стилем 'яркий'."
  },

  casual: {
    name: "Повседневная схема",
    description: "Удобные и практичные цвета, повседневный стиль.",
    makeup: "Минимальный макияж, естественные тона.",
    clothingStyle: "Повседневный, комфортный, уличный.",
    hint: "Идеально для ежедневного использования.",
    tips: { clothing: "Джинсы, футболки, удобная обувь.", accessories: "Практичные сумки, кепки." },
    season: "Все сезоны",
    psychology: "Комфорт, практичность, естественность.",
    occasion: "Повседневная жизнь, прогулки, шопинг.",
    hairTips: "Естественные прически, минимальная укладка.",
    interior: "Практичные и комфортные интерьеры.",
    paletteRule: "Цвета со стилем 'повседневный'."
  },

  evening: {
    name: "Вечерняя схема",
    description: "Элегантные и глубокие цвета, вечерний шик.",
    makeup: "Смоки айс, насыщенные губы, контур.",
    clothingStyle: "Вечерний, официальный, гламурный.",
    hint: "Создает элегантный и запоминающийся образ.",
    tips: { clothing: "Вечерние платья, костюмы.", accessories: "Элегантные украшения, клатчи." },
    season: "Зима",
    psychology: "Элегантность, роскошь, таинственность.",
    occasion: "Вечерние мероприятия, гала-ужины, премьеры.",
    hairTips: "Вечерние прически, укладки с лаком.",
    interior: "Роскошные вечерние интерьеры с драпировками.",
    paletteRule: "Цвета со стилем 'вечерний'."
  },

  business: {
    name: "Деловая схема",
    description: "Строгие и сдержанные цвета, профессиональный вид.",
    makeup: "Сдержанный макияж, аккуратная подводка.",
    clothingStyle: "Деловой, официальный, офисный.",
    hint: "Создает профессиональное и уверенное впечатление.",
    tips: { clothing: "Костюмы, блузки, классические брюки.", accessories: "Дорогие часы, кожаные аксессуары." },
    season: "Осень",
    psychology: "Профессионализм, уверенность, стабильность.",
    occasion: "Работа, деловые встречи, переговоры.",
    hairTips: "Аккуратные стрижки, собранные прически.",
    interior: "Строгие офисные интерьеры, кабинеты.",
    paletteRule: "Цвета со стилем 'деловой'."
  },

  creative: {
    name: "Креативная схема",
    description: "Нестандартные и экспериментальные сочетания.",
    makeup: "Яркие тени, художественная подводка, необычные текстуры.",
    clothingStyle: "Творческий, авангардный, арт.",
    hint: "Выражает индивидуальность и творческий подход.",
    tips: { clothing: "Нестандартные фасоны, смелые комбинации.", accessories: "Художественные украшения." },
    season: "Все сезоны",
    psychology: "Творчество, индивидуальность, смелость.",
    occasion: "Творческие проекты, выставки, перформансы.",
    hairTips: "Экспериментальные стрижки, яркое окрашивание.",
    interior: "Креативные пространства, арт-объекты.",
    paletteRule: "Цвета со стилем 'креативный'."
  },



  // ДОБАВЛЯЕМ НЕДОСТАЮЩИЕ СХЕМЫ
  accentComplement: {
    name: "Акцентная комплементарная",
    description: "Аналоговые цвета с добавлением комплементарного акцента.",
    makeup: "Естественная база с ярким акцентом на губах или глазах.",
    clothingStyle: "Универсальный, с акцентами.",
    hint: "Баланс между гармонией и контрастом.",
    tips: { clothing: "Нейтральная основа с одним ярким элементом.", accessories: "Акцентный аксессуар." },
    season: "Все сезоны",
    psychology: "Баланс, внимание к деталям.",
    occasion: "Повседневность с изюминкой.",
    hairTips: "Основной цвет с акцентной прядью контрастного оттенка.",
    interior: "Нейтральный интерьер с яркими акцентами.",
    paletteRule: "Аналоговые цвета + комплементарный акцент."
  },

  dyad: {
    name: "Диада", 
    description: "Два противоположных цвета с небольшим смещением.",
    makeup: "Сбалансированные акценты на глазах и губах.",
    clothingStyle: "Элегантный, сдержанный.",
    hint: "Утонченный контраст без резкости.",
    tips: { clothing: "Двухцветные комбинации.", accessories: "Парные аксессуары." },
    season: "Осень",
    psychology: "Уравновешенность, элегантность.",
    occasion: "Деловые встречи, ужины.",
    hairTips: "Контрастное окрашивание с плавными переходами.",
    interior: "Сбалансированные двухцветные интерьеры.",
    paletteRule: "Два цвета с интервалом 60° от базового."
  },

  neutral: {
    name: "Нейтральная схема",
    description: "Нейтральные цвета с мягкими акцентами.",
    makeup: "Естественные тона, минимальный макияж.",
    clothingStyle: "Минималистичный, элегантный.",
    hint: "Создает спокойный и утонченный образ.",
    tips: { clothing: "Базовый гардероб, качественные ткани.", accessories: "Дорогие минималистичные украшения." },
    season: "Все сезоны",
    psychology: "Спокойствие, утонченность, надежность.",
    occasion: "Офис, повседневность, деловые встречи.",
    hairTips: "Натуральные оттенки, аккуратные стрижки.",
    interior: "Минималистичные интерьеры в нейтральных тонах.",
    paletteRule: "Нейтральные цвета (бежевый, серый, белый) + мягкий акцент."
  },

  pentadic: {
    name: "Пентадическая",
    description: "Пять цветов через равные интервалы, богатая палитра.",
    makeup: "Сложные комбинации, художественный подход.",
    clothingStyle: "Творческий, эклектичный, арт.",
    hint: "Для смелых и творческих личностей.",
    tips: { clothing: "Многослойность, смелые комбинации.", accessories: "Разнообразные аксессуары." },
    season: "Все сезоны",
    psychology: "Богатство, разнообразие, творчество.",
    occasion: "Фестивали, творческие мероприятия, карнавалы.",
    hairTips: "Сложное окрашивание с множеством оттенков.",
    interior: "Яркие и разнообразные интерьеры.",
    paletteRule: "Пять цветов через равные интервалы (72°)."
  },

  accentTriad: {
    name: "Акцентная триада",
    description: "Триада с дополнительным акцентным цветом.",
    makeup: "Сбалансированные тени с ярким акцентом.",
    clothingStyle: "Творческий, с акцентами.",
    hint: "Динамика с выделяющимся элементом.",
    tips: { clothing: "Трехцветные комбинации с акцентом.", accessories: "Яркий акцентный аксессуар." },
    season: "Весна",
    psychology: "Динамика, внимание, творчество.",
    occasion: "Творческие встречи, презентации.",
    hairTips: "Три основных оттенка с акцентной прядью.",
    interior: "Сбалансированный интерьер с акцентной стеной.",
    paletteRule: "Триадные цвета + дополнительный акцент."
  },

  contrastAnalogous: {
    name: "Контрастная аналоговая", 
    description: "Аналоговые цвета с контрастным элементом.",
    makeup: "Мягкие тени с контрастной подводкой.",
    clothingStyle: "Современный, с контрастами.",
    hint: "Гармония с элементом неожиданности.",
    tips: { clothing: "Гармоничные комбинации с контрастной деталью.", accessories: "Контрастный аксессуар." },
    season: "Осень",
    psychology: "Баланс, неожиданность, современность.",
    occasion: "Современные мероприятия, коктейли.",
    hairTips: "Гармоничное окрашивание с контрастными прядями.",
    interior: "Гармоничные интерьеры с контрастными акцентами.",
    paletteRule: "Аналоговые цвета + контрастный элемент."
  },

  tintedComplement: {
    name: "Оттеночная комплементарная",
    description: "Основной цвет с оттенками комплементарного.",
    makeup: "Основной макияж с оттенками контрастного цвета.",
    clothingStyle: "Утонченный, с нюансами.",
    hint: "Изысканный подход к контрасту.",
    tips: { clothing: "Сложные цветовые комбинации.", accessories: "Многослойные украшения." },
    season: "Зима",
    psychology: "Утонченность, сложность, изысканность.",
    occasion: "Вечерние мероприятия, гала-ужины.",
    hairTips: "Сложное окрашивание с переливами оттенков.",
    interior: "Богатые интерьеры с сложными цветовыми решениями.",
    paletteRule: "Основной цвет + оттенки комплементарного."
  },

  alsoGood: {
    name: "Также хорошие сочетания",
    description: "Проверенные гармоничные комбинации.",
    makeup: "Сбалансированный макияж без рисков.",
    clothingStyle: "Универсальный, безопасный.",
    hint: "Надежные сочетания для любого случая.",
    tips: { clothing: "Классические комбинации.", accessories: "Универсальные аксессуары." },
    season: "Все сезоны",
    psychology: "Надежность, уверенность, стабильность.",
    occasion: "Любые мероприятия, где важна уверенность.",
    hairTips: "Классическое окрашивание без экспериментов.",
    interior: "Традиционные интерьеры с проверенными сочетаниями.",
    paletteRule: "Соседние цвета в круге (±2 позиции)."
  },

  notGood: {
    name: "Неудачные сочетания",
    description: "Цвета, которые могут конфликтовать между собой.",
    makeup: "Рискованные комбинации, требующие осторожности.",
    clothingStyle: "Экспериментальный, авангардный.",
    hint: "Для смелых экспериментов и художественных образов.",
    tips: { clothing: "Смелые комбинации для особых случаев.", accessories: "Необычные аксессуары." },
    season: "Особые случаи",
    psychology: "Смелость, эксперимент, вызов.",
    occasion: "Арт-проекты, перформансы, карнавалы.",
    hairTips: "Экстремальное окрашивание для смелых образов.",
    interior: "Авангардные интерьеры для творческих пространств.",
    paletteRule: "Цвета с дисгармоничными интервалами."
  }
};








// === ОСНОВНЫЕ ФУНКЦИИ ===

// Проверка видимости цвета по фильтрам - ЗАМЕНИТЬ
function isColorVisible(color) {
    // Если фильтры не установлены - все цвета видны
    if (!currentFilters.style && !currentFilters.season && !currentFilters.colortype) {
        return true;
    }
    
    // Проверяем каждый фильтр (более гибкая проверка)
    const styleOk = !currentFilters.style || 
                   (color.style && color.style.includes(currentFilters.style));
    
    const seasonOk = !currentFilters.season || 
                    (color.season && color.season.includes(currentFilters.season));
    
    const typeOk = !currentFilters.colortype || 
                  (color.colortype && color.colortype.includes(currentFilters.colortype));
    
    return styleOk && seasonOk && typeOk;
}

// Функция применения фильтров - ЗАМЕНИТЬ
function applyFilters() {
    renderColorWheel();
    updateFilterBadge();
    
    // Обновляем информацию если цвет выбран (НЕ сбрасываем выбор)
    if (lastChosenIndex !== null) {
        const chosenColor = colors[lastChosenIndex];
        updateColorInfo(chosenColor);
        
        // Показываем предупреждение если выбранный цвет не соответствует фильтрам
        if (!isColorVisible(chosenColor)) {
            showFilterWarning(chosenColor);
        }
    }
}

// Функция для сворачивания/разворачивания фильтров
function toggleFilter(element) {
    const content = element.nextElementSibling;
    const toggle = element.querySelector('.filter-toggle');
    
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        toggle.textContent = '▲';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▼';
    }
}

// Установка фильтра
function setFilter(type, value) {
    currentFilters[type] = value;
    applyFilters();
}

// Сброс всех фильтров
function resetFilters() {
    currentFilters = { style: "", season: "", colortype: "" };
    
    // Сбрасываем значения select'ов
    document.querySelectorAll('.filter-content select').forEach(select => {
        select.value = "";
    });
    
    applyFilters();
}
// Сброс фильтров
function resetFilters() {
    currentFilters = { style: "", season: "", colortype: "" };
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    applyFilters();
}

// Обновление бейджа фильтров
function updateFilterBadge() {
    const badge = document.getElementById('filterBadge');
    if (badge) {
        const activeCount = Object.values(currentFilters).filter(val => val !== "").length;
        badge.textContent = activeCount;
        badge.style.display = activeCount > 0 ? 'flex' : 'none';
    }
}

// === БОЛЬШОЙ КРУГ С GLOW ЭФФЕКТОМ ===
function renderColorWheel() {
    const canvas = document.getElementById('stylistColorWheel');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Черный фон для контраста
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const segmentAngle = (2 * Math.PI) / colors.length;
    
    // Рисуем все сегменты
    colors.forEach((color, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;
        
        const visible = isColorVisible(color);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = color.color;
        ctx.globalAlpha = visible ? 1 : 0.15;
        ctx.fill();
        
        // Подсветка видимых цветов при фильтрации
        if (visible && (currentFilters.style || currentFilters.season || currentFilters.colortype)) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 5, startAngle, endAngle);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.globalAlpha = 0.8;
            ctx.stroke();
        }
    });
    
    // Сбрасываем эффекты
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    // GLOW эффект для выбранного цвета
    if (lastChosenIndex !== null && colors[lastChosenIndex]) {
    const chosenColor = colors[lastChosenIndex];
    const startAngle = lastChosenIndex * segmentAngle;
    const endAngle = (lastChosenIndex + 1) * segmentAngle;
        
        const chosenVisible = isColorVisible(chosenColor);
        
        if (chosenVisible) {
            // 1. Мощное внешнее цветное свечение
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 25, startAngle, endAngle);
            ctx.lineWidth = 15;
            ctx.strokeStyle = chosenColor.color;
            ctx.shadowColor = chosenColor.color;
            ctx.shadowBlur = 30;
            ctx.globalAlpha = 0.8;
            ctx.stroke();
            
            // 2. Яркое белое внешнее свечение
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 15, startAngle, endAngle);
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 25;
            ctx.globalAlpha = 0.9;
            ctx.stroke();
            
            // 3. Основная белая обводка
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 8, startAngle, endAngle);
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 20;
            ctx.globalAlpha = 1;
            ctx.stroke();
            
            // 4. Внутренняя подсветка
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 5, startAngle, endAngle);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.globalAlpha = 1;
            ctx.stroke();
            
            // Сбрасываем эффекты
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }
    
    // Внешняя белая обводка всего круга
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
}
// === СТИЛЬНЫЕ ПРЯМОУГОЛЬНЫЕ КАРТОЧКИ ===
function createColorCard(colorData, options = {}) {
    const { 
        width = 90, 
        height = 70, 
        showText = true, 
        showDetails = true,
        interactive = true
    } = options;
    
    const card = document.createElement("div");
    
    // Основные стили карточки
    card.style.width = width + 'px';
    card.style.height = height + 'px';
    card.style.background = colorData.color;
    card.style.borderRadius = '12px';
    card.style.border = '3px solid #fff';
    card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)';
    card.style.cursor = interactive ? 'pointer' : 'default';
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.margin = '6px';
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.style.fontFamily = 'Arial, sans-serif';
    
    // Градиентный оверлей для лучшей читаемости
    card.style.background = `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%), ${colorData.color}`;
    
    if (showText) {
        const textColor = getContrastColor(colorData.color);
        
        const textElement = document.createElement('div');
        textElement.style.color = textColor;
        textElement.style.fontWeight = 'bold';
        textElement.style.fontSize = '12px';
        textElement.style.textAlign = 'center';
        textElement.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
        textElement.style.padding = '6px 8px';
        textElement.style.background = 'rgba(0,0,0,0.3)';
        textElement.style.borderRadius = '8px';
        textElement.style.backdropFilter = 'blur(4px)';
        textElement.style.lineHeight = '1.2';
        textElement.style.maxWidth = '85%';
        textElement.textContent = colorData.text;
        
        card.appendChild(textElement);
        
        if (showDetails) {
            const detailsElement = document.createElement('div');
            detailsElement.style.color = textColor;
            detailsElement.style.fontSize = '10px';
            detailsElement.style.marginTop = '4px';
            detailsElement.style.opacity = '0.9';
            detailsElement.style.textShadow = '0 1px 1px rgba(0,0,0,0.3)';
            detailsElement.style.textAlign = 'center';
            detailsElement.textContent = `${colorData.season} • ${colorData.tone}`;
            card.appendChild(detailsElement);
        }
    }
    
    card.title = `${colorData.text} | ${colorData.tone} | ${colorData.season} | ${colorData.style}`;
    
    // Эффекты при наведении для интерактивных карточек
    if (interactive) {
        card.addEventListener("mouseenter", function() {
            this.style.transform = "scale(1.08) translateY(-2px)";
            this.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.15)";
            this.style.borderColor = "rgba(255,255,255,0.9)";
        });
        
        card.addEventListener("mouseleave", function() {
            this.style.transform = "scale(1) translateY(0)";
            this.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)";
            this.style.borderColor = "#fff";
        });
    }
    
    return card;
}

// === ОТОБРАЖЕНИЕ СХЕМ ===
function showScheme(type) {
    const result = document.getElementById("schemeGuide");
    if (!result || lastChosenIndex === null || colors.length === 0) {
        result.innerHTML = "<div style='color:#666; text-align:center; padding:30px; background:#f8f9fa; border-radius:10px;'>🎨 Выберите цвет на круге для просмотра схем</div>";
        return;
    }

    const generator = schemeGenerators[type];
    const scheme = schemeInfo[type];

    if (!generator || !scheme) {
        result.innerHTML = "<div style='color:red; padding:20px; text-align:center; background:#ffe6e6; border-radius:10px;'>❌ Схема не найдена</div>";
        return;
    }

    const schemeColors = generator(lastChosenIndex, colors);
    const chosenColor = colors[lastChosenIndex];

    // Создаем контейнер для карточек схемы
    const cardsContainer = document.createElement("div");
    cardsContainer.style.display = 'flex';
    cardsContainer.style.flexWrap = 'wrap';
    cardsContainer.style.gap = '15px';
    cardsContainer.style.justifyContent = 'center';
    cardsContainer.style.alignItems = 'center';
    cardsContainer.style.marginBottom = '25px';
    cardsContainer.style.padding = '20px';
    cardsContainer.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
    cardsContainer.style.borderRadius = '15px';
    cardsContainer.style.border = '2px solid #e9ecef';

    // Создаем карточки для каждого цвета схемы
    schemeColors.forEach((colorData, index) => {
        const isMainColor = index === 0; // Первый цвет - основной
        const card = createColorCard(colorData, { 
            width: isMainColor ? 100 : 85, 
            height: isMainColor ? 80 : 65,
            showText: true,
            showDetails: true,
            interactive: false
        });
        
        if (isMainColor) {
            card.style.border = '4px solid #fff';
            card.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
        }
        
        cardsContainer.appendChild(card);
    });

    // Собираем HTML схемы
    result.innerHTML = `
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding:25px; border-radius:15px; margin-bottom:25px; color:white; text-align:center;">
            <h3 style="margin:0 0 10px 0; font-size:22px; font-weight:bold;">${scheme.name}</h3>
            <div style="font-size:15px; opacity:0.9; line-height:1.4;">${scheme.description}</div>
        </div>
        
        <div style="background:#fff; padding:15px; border-radius:12px; margin-bottom:20px; border-left:4px solid #667eea;">
            <h4 style="margin:0 0 15px 0; color:#333; font-size:16px;">🎨 Цветовая палитра схемы</h4>
        </div>
    `;
    
    // Добавляем карточки в результат
    result.appendChild(cardsContainer);
    
    // Добавляем детали схемы
    const detailsHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin-top: 20px;">
            <div style="background:linear-gradient(135deg,#e8f4fd 0%,#d1ecf1 100%); padding:20px; border-radius:12px; border-left:4px solid #17a2b8;">
                <div style="font-weight:bold; color:#138496; margin-bottom:10px; font-size:14px;">💄 МАКИЯЖ</div>
                <div style="color:#333; font-size:14px; line-height:1.5;">${scheme.makeup}</div>
            </div>
            
            <div style="background:linear-gradient(135deg,#fff5f5 0%,#ffe6e6 100%); padding:20px; border-radius:12px; border-left:4px solid #dc3545;">
                <div style="font-weight:bold; color:#c82333; margin-bottom:10px; font-size:14px;">👗 СТИЛЬ ОДЕЖДЫ</div>
                <div style="color:#333; font-size:14px; line-height:1.5;">${scheme.clothingStyle}</div>
            </div>
            
            <div style="background:linear-gradient(135deg,#f5fff5 0%,#e6ffe6 100%); padding:20px; border-radius:12px; border-left:4px solid #28a745;">
                <div style="font-weight:bold; color:#218838; margin-bottom:10px; font-size:14px;">🎀 АКСЕССУАРЫ</div>
                <div style="color:#333; font-size:14px; line-height:1.5;">${scheme.tips?.accessories || "Классические аксессуары"}</div>
            </div>
            
            <div style="background:linear-gradient(135deg,#fffbf0 0%,#fff5e6 100%); padding:20px; border-radius:12px; border-left:4px solid #fd7e14;">
                <div style="font-weight:bold; color:#e66200; margin-bottom:10px; font-size:14px;">💇 ВОЛОСЫ</div>
                <div style="color:#333; font-size:14px; line-height:1.5;">${scheme.hairTips || "Универсальные рекомендации по окрашиванию"}</div>
            </div>
        </div>
        
        <div style="background:linear-gradient(135deg,#6a11cb 0%,#2575fc 100%); padding:20px; border-radius:12px; margin-top:20px; color:white;">
            <div style="display: flex; justify-content: space-around; text-align:center; flex-wrap:wrap; gap:20px;">
                <div>
                    <div style="font-size:12px; opacity:0.9; margin-bottom:5px;">🌸 СЕЗОН</div>
                    <div style="font-weight:bold; font-size:16px; background:rgba(255,255,255,0.2); padding:8px 16px; border-radius:20px;">${scheme.season}</div>
                </div>
                <div>
                    <div style="font-size:12px; opacity:0.9; margin-bottom:5px;">🧠 ПСИХОЛОГИЯ</div>
                    <div style="font-weight:bold; font-size:16px; background:rgba(255,255,255,0.2); padding:8px 16px; border-radius:20px;">${scheme.psychology}</div>
                </div>
                <div>
                    <div style="font-size:12px; opacity:0.9; margin-bottom:5px;">🎉 СЛУЧАЙ</div>
                    <div style="font-weight:bold; font-size:16px; background:rgba(255,255,255,0.2); padding:8px 16px; border-radius:20px;">${scheme.occasion}</div>
                </div>
            </div>
        </div>
        
        ${scheme.paletteRule ? `
            <div style="background:#2c3e50; padding:15px; border-radius:10px; margin-top:15px; color:white; text-align:center;">
                <div style="font-size:12px; opacity:0.8; margin-bottom:5px;">🎨 ПРАВИЛО ПАЛИТРЫ</div>
                <div style="font-size:13px; font-style:italic;">${scheme.paletteRule}</div>
            </div>
        ` : ''}
    `;
    
    result.insertAdjacentHTML("beforeend", detailsHTML);
}

// === ОБНОВЛЕНИЕ ИНФОРМАЦИИ О ЦВЕТЕ ===
function updateColorInfo() {
    if (lastChosenIndex === null || colors.length === 0) return;
    
    const chosenColor = colors[lastChosenIndex];
    const resultDiv = document.getElementById('stylistColorResult');
    
    // Находим противоположный и соседние цвета
    const oppositeIndex = (lastChosenIndex + Math.floor(colors.length / 2)) % colors.length;
    const leftIndex = (lastChosenIndex - 1 + colors.length) % colors.length;
    const rightIndex = (lastChosenIndex + 1) % colors.length;
    
    const oppositeColor = colors[oppositeIndex];
    const leftColor = colors[leftIndex];
    const rightColor = colors[rightIndex];
    
    resultDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px;">
            <div style="width: 70px; height: 70px; background: ${chosenColor.color}; border-radius: 10px; border: 3px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"></div>
            <div style="flex: 1;">
                <h3 style="margin: 0 0 5px 0; color: #333; font-size: 18px;">${chosenColor.text}</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">${chosenColor.tone} • ${chosenColor.style} • ${chosenColor.season}</p>
                <p style="margin: 5px 0 0 0; color: #888; font-size: 12px;">Цветотип: ${chosenColor.colortype}</p>
            </div>
        </div>
        
        <div style="background: #fff; padding: 10px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #17a2b8;">
            <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">💄 ${chosenColor.makeupHint || 'Универсальный макияж'}</p>
            <p style="margin: 0; color: #666; font-size: 10px;"><strong>👗 Текстуры:</strong> ${chosenColor.textureHint || 'Различные текстуры'}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 12px 0; color: #333; font-size: 14px;">🎨 Гармоничные сочетания</h4>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <div style="width: 50px; height: 50px; background: ${leftColor.color}; border-radius: 8px; border: 2px solid #fff; margin-bottom: 5px;"></div>
                    <div style="font-size: 11px; color: #666;">${leftColor.text}</div>
                </div>
                <div style="text-align: center;">
                    <div style="width: 50px; height: 50px; background: ${rightColor.color}; border-radius: 8px; border: 2px solid #fff; margin-bottom: 5px;"></div>
                    <div style="font-size: 11px; color: #666;">${rightColor.text}</div>
                </div>
                <div style="text-align: center;">
                    <div style="width: 50px; height: 50px; background: ${oppositeColor.color}; border-radius: 8px; border: 2px solid #fff; margin-bottom: 5px;"></div>
                    <div style="font-size: 11px; color: #666;">${oppositeColor.text}</div>
                </div>
            </div>
        </div>
        
        <div style="background: #fff5f5; padding: 15px; border-radius: 10px;">
            <h4 style="margin: 0 0 12px 0; color: #333; font-size: 14px;">🎨 Макияж сет</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                <div><strong>💋 Губы:</strong> ${chosenColor.makeupSet?.lips || "—"}</div>
                <div><strong>👁 Тени:</strong> ${chosenColor.makeupSet?.eyes || "—"}</div>
                <div><strong>😊 Румяна:</strong> ${chosenColor.makeupSet?.blush || "—"}</div>
                <div><strong>✒ Подводка:</strong> ${chosenColor.makeupSet?.eyeliner || "—"}</div>
            </div>
            ${chosenColor.makeupSet?.style ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.1);"><strong>Стиль макияжа:</strong> ${chosenColor.makeupSet.style}</div>` : ''}
        </div>
    `;
}

// === ИНИЦИАЛИЗАЦИЯ И УТИЛИТЫ ДЛЯ HTML ===
function initializeBeautifulFilters() {
    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer) return;
    
    // Добавляем бейдж фильтров
    const badge = document.createElement('div');
    badge.id = 'filterBadge';
    badge.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff4757;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        z-index: 10;
    `;
    filterContainer.style.position = 'relative';
    filterContainer.appendChild(badge);
}

function initializeResetButton() {
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

function initializeWheelContainer() {
    const container = document.querySelector('.wheel-container');
    if (container) {
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.padding = '20px';
    }
}
// === ФУНКЦИИ ФИЛЬТРОВ ===

// Функция для сворачивания/разворачивания фильтров
function toggleFilter(element) {
    const content = element.nextElementSibling;
    const toggle = element.querySelector('.filter-toggle');
    
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        toggle.textContent = '▲';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▼';
    }
}

// Установка фильтра (для select элементов)
function setFilter(type, value) {
    currentFilters[type] = value;
    applyFilters();
}

// Сброс всех фильтров
function resetFilters() {
    currentFilters = { style: "", season: "", colortype: "" };
    
    // Сбрасываем значения select'ов
    document.querySelectorAll('.filter-content select').forEach(select => {
        select.value = "";
    });
    
    applyFilters();
}

// === ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация компонентов
    initializeBeautifulFilters();
    initializeResetButton();
    initializeWheelContainer();
    
    // Получаем цвета из HTML (предполагается, что colors уже определен в HTML)
    if (typeof window.colors !== 'undefined') {
        colors = window.colors;
    }
    
    // Создаем canvas для цветового круга
    const wheelContainer = document.getElementById('stylistColorWheelContainer');
    if (wheelContainer && !document.getElementById('stylistColorWheel')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'stylistColorWheel';
        canvas.width = 500;
        canvas.height = 500;
        canvas.style.cssText = `
            max-width: 100%;
            height: auto;
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        wheelContainer.appendChild(canvas);
    }
    
    // Обработчик клика по кругу
    const canvas = document.getElementById('stylistColorWheel');
    if (canvas) {
        canvas.addEventListener('click', function(event) {
            if (colors.length === 0) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            const clickX = x - centerX;
            const clickY = y - centerY;
            const distance = Math.sqrt(clickX * clickX + clickY * clickY);
            const radius = Math.min(centerX, centerY) - 10;
            
            // Проверяем, что клик внутри круга
            if (distance > radius) return;
            
            const angle = Math.atan2(clickY, clickX);
            const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
            const segmentIndex = Math.floor(normalizedAngle / (2 * Math.PI / colors.length));
            
            // Проверяем, видим ли выбранный цвет с текущими фильтрами
            const chosenColor = colors[segmentIndex];
            const chosenVisible = isColorVisible(chosenColor);
            
            if (chosenVisible) {
                lastChosenIndex = segmentIndex;
                renderColorWheel();
                updateColorInfo();
                
                // Показываем первую схему по умолчанию
                showScheme('analog');
            }
        });
    }
    
    // Обработчики для кнопок схем
    document.querySelectorAll('.scheme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showScheme(this.dataset.scheme);
        });
    });
    
    // Обработчики для кнопок фильтров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setFilter(this.dataset.filterType, this.dataset.filterValue);
        });
    });
    
    // Первоначальная отрисовка
    if (colors && colors.length > 0) {
        renderColorWheel();
        updateFilterBadge();
    }
});

// Автоматическая инициализация при загрузке
window.addEventListener('load', function() {
    if (colors && colors.length > 0) {
        renderColorWheel();
    }
});

// Функция выделения круга по фильтрам
function isColorVisible(color) {
    if (!currentFilters.style && !currentFilters.season && !currentFilters.colortype) {
        return true;
    }
    
    const styleMatch = !currentFilters.style || 
                      (color.style && color.style.toLowerCase().includes(currentFilters.style.toLowerCase()));
    
    const seasonMatch = !currentFilters.season || 
                       (color.season && color.season.toLowerCase().includes(currentFilters.season.toLowerCase()));
    
    const colortypeMatch = !currentFilters.colortype || 
                          (color.colortype && color.colortype.toLowerCase().includes(currentFilters.colortype.toLowerCase()));
    
    return styleMatch && seasonMatch && colortypeMatch;
}

// Функция применения фильтров
function applyFilters() {
    renderColorWheel();
    updateFilterBadge();
    
    if (lastChosenIndex !== null) {
        updateColorInfo(); // Эта функция останется вашей оригинальной
    }
}
