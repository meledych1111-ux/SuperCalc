
// ЦВЕТОВАЯ БАЗА ДАННЫХ (полная)
// ==========================

let lastChosenIndex = null;
let currentFilters = { style: "", season: "", colortype: "" };

// === ФУНКЦИЯ ДЛЯ ВЫЧИСЛЕНИЯ HUE ===
function calculateHue(hexColor) {
    // Убираем # если есть
    hexColor = hexColor.replace(/^#/, '');
    
    // Преобразуем hex в RGB
    let r, g, b;
    if (hexColor.length === 3) {
        r = parseInt(hexColor[0] + hexColor[0], 16);
        g = parseInt(hexColor[1] + hexColor[1], 16);
        b = parseInt(hexColor[2] + hexColor[2], 16);
    } else {
        r = parseInt(hexColor.substring(0, 2), 16);
        g = parseInt(hexColor.substring(2, 4), 16);
        b = parseInt(hexColor.substring(4, 6), 16);
    }
    
    // Нормализуем значения RGB к диапазону 0-1
    r /= 255;
    g /= 255;
    b /= 255;
    
    // Находим максимальное и минимальное значение
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let hue = 0;
    
    // Если все цвета одинаковые (оттенки серого)
    if (delta === 0) {
        hue = 0;
    } else {
        // Вычисляем hue в зависимости от того, какой канал максимальный
        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }
        
        // Преобразуем hue в градусы (0-360)
        hue = hue * 60;
        if (hue < 0) {
            hue += 360;
        }
    }
    
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
// === ОПТИМИЗИРОВАННАЯ ПАЛИТРА С РАВНОМЕРНЫМ РАСПРЕДЕЛЕНИЕМ ===
let colors = [
  // СЕКТОР 0-30°: КРАСНЫЕ
  { id:"br1", color:"#ff0000", text:"Ярко‑красный", tone:"тёплый", style:"контрастный", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Помада красная", makeupSet:{ lips:"Красная", eyes:"Тёмные", blush:"Охра", eyeliner:"Чёрная", style:"Контрастный" }, hue: 0 },
  { id:"red_add1", color:"#cc0000", text:"Насыщенный красный", tone:"тёплый", style:"энергичный", season:"зима", colortype:"зима", textureHint:"Шёлк", makeupHint:"Помада яркая", makeupSet:{ lips:"Красная", eyes:"Чёрные", blush:"Яркие", eyeliner:"Чёрная", style:"Энергичный" }, hue: 0 },
  { id:"wi8", color:"#8b0000", text:"Красный бархат", tone:"тёплый", style:"деловой", season:"зима", colortype:"зима", textureHint:"Бархат", makeupHint:"Помада красная", makeupSet:{ lips:"Красная бархатная", eyes:"Тёмно‑синие", blush:"Охра", eyeliner:"Чёрная", style:"Деловой вечер" }, hue: 0 },
  { id:"aub4", color:"#dc143c", text:"Малиновый", tone:"тёплый", style:"праздничный", season:"осень", colortype:"осень", textureHint:"Бархат", makeupHint:"Помада ярко‑красная", makeupSet:{ lips:"Ярко‑красная", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Чёрная", style:"Праздничный" }, hue: 348 },

  // СЕКТОР 30-60°: КРАСНО-ОРАНЖЕВЫЕ
  { id:"aub2", color:"#ff4500", text:"Ярко‑терракотовый", tone:"тёплый", style:"контрастный", season:"осень", colortype:"осень", textureHint:"Атлас", makeupHint:"Тени ярко‑терракотовые", makeupSet:{ lips:"Ярко‑терракотовая", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Чёрная", style:"Контрастный" }, hue: 16 },
  { id:"red_or_add1", color:"#ff5500", text:"Огненный", tone:"тёплый", style:"яркий", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Румяна тёплые", makeupSet:{ lips:"Оранжевая", eyes:"Коричневые", blush:"Персиковые", eyeliner:"Коричневая", style:"Яркий" }, hue: 20 },
  { id:"bal5", color:"#ff7f50", text:"Кораллово-оранжевый", tone:"тёплый", style:"яркий", season:"осень", colortype:"осень", textureHint:"Шёлк", makeupHint:"Помада коралловая", makeupSet:{ lips:"Коралловая", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Коричневая", style:"Яркий" }, hue: 16 },
  { id:"bal6", color:"#ff6347", text:"Томатный", tone:"тёплый", style:"повседневный", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Румяна тёплые", makeupSet:{ lips:"Терракотовая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 9 },
  { id:"sp2", color:"#ffa07a", text:"Коралловый", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Хлопок, лен", makeupHint:"Помада коралловая", makeupSet:{ lips:"Коралловая", eyes:"Бежевые", blush:"Абрикосовые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 15 },

  // СЕКТОР 60-90°: ОРАНЖЕВЫЕ
  { id:"br2", color:"#ff6600", text:"Ярко‑оранжевый", tone:"тёплый", style:"креативный", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Румяна тёплые", makeupSet:{ lips:"Оранжевая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Коричневая", style:"Креативный" }, hue: 24 },
  { id:"orange_add1", color:"#ff7700", text:"Насыщенный оранжевый", tone:"тёплый", style:"энергичный", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Румяна оранжевые", makeupSet:{ lips:"Оранжевая", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Коричневая", style:"Энергичный" }, hue: 28 },
  { id:"aub1", color:"#ff8c00", text:"Ярко‑оранжевый", tone:"тёплый", style:"яркий", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Румяна ярко‑оранжевые", makeupSet:{ lips:"Оранжевая", eyes:"Коричневые", blush:"Ярко‑оранжевые", eyeliner:"Коричневая", style:"Яркий" }, hue: 33 },
  { id:"bal7", color:"#ffa500", text:"Оранжевый", tone:"тёплый", style:"энергичный", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Румяна оранжевые", makeupSet:{ lips:"Оранжевая", eyes:"Золотистые", blush:"Оранжевые", eyeliner:"Коричневая", style:"Энергичный" }, hue: 39 },

  // СЕКТОР 90-120°: ОРАНЖЕВО-ЖЕЛТЫЕ
  { id:"sp1", color:"#ffb07c", text:"Персиковый", tone:"тёплый", style:"романтический", season:"весна", colortype:"весна", textureHint:"Шифон, лёгкий хлопок", makeupHint:"Румяна персиковые", makeupSet:{ lips:"Персиковая", eyes:"Золотистые", blush:"Персиковые", eyeliner:"Коричневая", style:"романтический" }, hue: 23 },
  { id:"orange_ye_add1", color:"#ffc080", text:"Светло-персиковый", tone:"тёплый", style:"нежный", season:"весна", colortype:"весна", textureHint:"Шёлк", makeupHint:"Румяна светлые", makeupSet:{ lips:"Персиковая", eyes:"Бежевые", blush:"Светлые", eyeliner:"Коричневая", style:"Нежный" }, hue: 30 },
  { id:"sp9", color:"#ffdab9", text:"Персиковый светлый", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Румяна персиковые", makeupSet:{ lips:"Персиковая", eyes:"Бежевые", blush:"Персиковые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 28 },
  { id:"sp7", color:"#ffe4b5", text:"Абрикосовый", tone:"тёплый", style:"романтический", season:"весна", colortype:"весна", textureHint:"Шёлк", makeupHint:"Румяна абрикосовые", makeupSet:{ lips:"Абрикосовая", eyes:"Бежевые", blush:"Абрикосовые", eyeliner:"Коричневая", style:"романтический" }, hue: 35 },

  // СЕКТОР 120-150°: ЖЕЛТЫЕ
  { id:"aub5", color:"#ffd700", text:"Ярко‑золотой", tone:"тёплый", style:"акцентный", season:"осень", colortype:"осень", textureHint:"Металлизированные ткани", makeupHint:"Хайлайтер золотой", makeupSet:{ lips:"Красная", eyes:"Золотые", blush:"Тёплые", eyeliner:"Коричневая", style:"Акцентный" }, hue: 51 },
  { id:"yellow_add1", color:"#ffdf00", text:"Солнечный жёлтый", tone:"тёплый", style:"яркий", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Золотистые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }, hue: 54 },
  { id:"bal8", color:"#ffeb3b", text:"Лимонно-жёлтый", tone:"тёплый", style:"яркий", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }, hue: 56 },
  { id:"aub3", color:"#ffef00", text:"Ярко‑жёлтый", tone:"тёплый", style:"энергичный", season:"осень", colortype:"осень", textureHint:"Хлопок", makeupHint:"Хайлайтер ярко‑жёлтый", makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Энергичный" }, hue: 56 },

  // СЕКТОР 150-180°: ЖЕЛТО-ЗЕЛЕНЫЕ
  { id:"sp4", color:"#ffff99", text:"Лимонный", tone:"тёплый", style:"яркий", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }, hue: 60 },
  { id:"yellow_gr_add1", color:"#eeff82", text:"Салатово-жёлтый", tone:"тёплый", style:"свежий", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени светлые", makeupSet:{ lips:"Нюдовая", eyes:"Салатовые", blush:"Светлые", eyeliner:"Коричневая", style:"Свежий" }, hue: 72 },
  { id:"bal1", color:"#adff2f", text:"Зеленовато-желтый", tone:"тёплый", style:"свежий", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени салатовые", makeupSet:{ lips:"Нюдовая", eyes:"Салатовые", blush:"Светлые", eyeliner:"Коричневая", style:"Свежий" }, hue: 84 },
  { id:"bal2", color:"#9acd32", text:"Желто-зеленый", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Тени желто-зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Жёлто-зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 80 },

  // СЕКТОР 180-210°: ЗЕЛЕНЫЕ
  { id:"bal9", color:"#7cfc00", text:"Зелёно-салатовый", tone:"тёплый", style:"свежий", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени салатовые", makeupSet:{ lips:"Нюдовая", eyes:"Салатовые", blush:"Светлые", eyeliner:"Коричневая", style:"Свежий" }, hue: 90 },
  { id:"green_add1", color:"#50ff50", text:"Ярко-салатовый", tone:"тёплый", style:"энергичный", season:"весна", colortype:"весна", textureHint:"Хлопок", makeupHint:"Тени яркие", makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Энергичный" }, hue: 120 },
  { id:"br5", color:"#00ff00", text:"Ярко‑зелёный", tone:"свежий", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 120 },
  { id:"spb4", color:"#32cd32", text:"Ярко‑зелёный", tone:"свежий", style:"креативный", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени ярко‑зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Ярко‑зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Креативный" }, hue: 120 },

  // СЕКТОР 210-240°: ЗЕЛЕНО-ГОЛУБЫЕ
  { id:"sp5", color:"#98fb98", text:"Светло‑зелёный", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна", textureHint:"Лён", makeupHint:"Тени зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Персиковые", eyeliner:"Коричневая", style:"Повседневный" }, hue: 120 },
  { id:"green_bl_add1", color:"#70e070", text:"Свежий зелёный", tone:"тёплый", style:"повседневный", season:"лето", colortype:"лето", textureHint:"Хлопок", makeupHint:"Тени зелёные", makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Светлые", eyeliner:"Серая", style:"Повседневный" }, hue: 120 },
  { id:"bal10", color:"#00fa9a", text:"Морская волна", tone:"холодный", style:"свежий", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени бирюзовые", makeupSet:{ lips:"Нюдовая", eyes:"Бирюзовые", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }, hue: 157 },
  { id:"sp3", color:"#40e0d0", text:"Бирюзовый", tone:"холодный", style:"креативный", season:"весна", colortype:"весна", textureHint:"Шёлк", makeupHint:"Тени бирюзовые", makeupSet:{ lips:"Нюдовая", eyes:"Бирюзовые", blush:"Светлые", eyeliner:"Чёрная", style:"Креативный" }, hue: 174 },

  // СЕКТОР 240-270°: ГОЛУБЫЕ
  { id:"wi4", color:"#00ced1", text:"Изумрудный", tone:"холодный", style:"деловой", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени изумрудные", makeupSet:{ lips:"Красная", eyes:"Изумрудные", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }, hue: 181 },
  { id:"blue_add1", color:"#20b2aa", text:"Светло-бирюзовый", tone:"холодный", style:"свежий", season:"лето", colortype:"лето", textureHint:"Хлопок", makeupHint:"Тени бирюзовые", makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }, hue: 177 },
  { id:"wid4", color:"#b0e0e6", text:"Тёмно‑ледяной", tone:"холодный", style:"свежий", season:"зима", colortype:"зима", textureHint:"Шёлк", makeupHint:"Тени тёмно‑ледяные", makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }, hue: 187 },
  { id:"bal11", color:"#87ceeb", text:"Небесно-голубой", tone:"холодный", style:"повседневный", season:"лето", colortype:"лето", textureHint:"Хлопок", makeupHint:"Тени голубые", makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Светлые", eyeliner:"Серая", style:"Повседневный" }, hue: 197 },

  // СЕКТОР 270-300°: СИНЕ-ГОЛУБЫЕ (продолжение)
  { id:"su5", color:"#87cefa", text:"Голубой яркий", tone:"холодный", style:"повседневный", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени голубые", makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Розовые", eyeliner:"Чёрная", style:"Повседневный" }, hue: 203 },
  { id:"sud2", color:"#4682b4", text:"Тёмно‑голубой", tone:"холодный", style:"деловой", season:"лето", colortype:"лето", textureHint:"Хлопок", makeupHint:"Тени тёмно‑голубые", makeupSet:{ lips:"Нюдовая", eyes:"Тёмно‑голубые", blush:"Светлые", eyeliner:"Чёрная", style:"Деловой" }, hue: 207 },
  { id:"wib4", color:"#0066ff", text:"Ярко‑синий", tone:"холодный", style:"свежий", season:"зима", colortype:"зима", textureHint:"Шёлк", makeupHint:"Тени ярко‑синие", makeupSet:{ lips:"Нюдовая", eyes:"Ярко‑синие", blush:"Светлые", eyeliner:"Чёрная", style:"Свежий" }, hue: 210 },

  // СЕКТОР 300-330°: СИНИЕ
  { id:"wib5", color:"#1e90ff", text:"Ярко‑голубой", tone:"холодный", style:"свежий", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени ярко‑голубые", makeupSet:{ lips:"Нюдовая", eyes:"Ярко‑голубые", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }, hue: 210 },
  { id:"blue_dark_add1", color:"#0080ff", text:"Насыщенный синий", tone:"холодный", style:"яркий", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени синие", makeupSet:{ lips:"Нюдовая", eyes:"Синие", blush:"Холодные", eyeliner:"Чёрная", style:"Яркий" }, hue: 210 },
  { id:"bal12", color:"#4169e1", text:"Королевский синий", tone:"холодный", style:"деловой", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени синие", makeupSet:{ lips:"Красная", eyes:"Синие", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }, hue: 225 },
  { id:"br4", color:"#0000ff", text:"Ярко‑синий", tone:"холодный", style:"свежий", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени синие", makeupSet:{ lips:"Нюдовая", eyes:"Синие", blush:"Светлые", eyeliner:"Чёрная", style:"Свежий" }, hue: 240 },

  // СЕКТОР 330-360°: СИНЕ-ФИОЛЕТОВЫЕ
  { id:"wi1", color:"#00008b", text:"Тёмно‑синий", tone:"холодный", style:"деловой", season:"зима", colortype:"зима", textureHint:"Атлас, шерсть", makeupHint:"Тени тёмно‑синие", makeupSet:{ lips:"Красная", eyes:"Тёмно‑синие", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }, hue: 240 },
  { id:"blue_vio_add1", color:"#0000cc", text:"Глубокий синий", tone:"холодный", style:"вечерний", season:"зима", colortype:"зима", textureHint:"Бархат", makeupHint:"Тени тёмные", makeupSet:{ lips:"Красная", eyes:"Синие", blush:"Холодные", eyeliner:"Чёрная", style:"Вечерний" }, hue: 240 },
  { id:"wi5", color:"#191970", text:"Сапфировый", tone:"холодный", style:"вечерний", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени сапфировые", makeupSet:{ lips:"Красная", eyes:"Сапфировые", blush:"Холодные", eyeliner:"Чёрная", style:"Вечерний" }, hue: 240 },
  { id:"bal13", color:"#191970", text:"Полуночный синий", tone:"холодный", style:"вечерний", season:"зима", colortype:"зима", textureHint:"Бархат", makeupHint:"Тени тёмно-синие", makeupSet:{ lips:"Красная", eyes:"Тёмно-синие", blush:"Холодные", eyeliner:"Чёрная", style:"Вечерний" }, hue: 240 },

  // СЕКТОР 0-30° (360-390°): ФИОЛЕТОВЫЕ
  { id:"su1", color:"#e6e6fa", text:"Лавандовый", tone:"холодный", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шифон", makeupHint:"Тени лавандовые", makeupSet:{ lips:"Розовая", eyes:"Лавандовые", blush:"Розовые", eyeliner:"Серая", style:"романтический" }, hue: 240 },
  { id:"violet_add1", color:"#d8bfd8", text:"Светло-сиреневый", tone:"холодный", style:"нежный", season:"лето", colortype:"лето", textureHint:"Шифон", makeupHint:"Тени сиреневые", makeupSet:{ lips:"Розовая", eyes:"Сиреневые", blush:"Светлые", eyeliner:"Серая", style:"Нежный" }, hue: 300 },
  { id:"bal4", color:"#9370db", text:"Средне-фиолетовый", tone:"холодный", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шёлк", makeupHint:"Тени фиолетовые", makeupSet:{ lips:"Розовая", eyes:"Фиолетовые", blush:"Холодные", eyeliner:"Серая", style:"романтический" }, hue: 260 },
  { id:"wib1", color:"#9b30ff", text:"Ярко‑фиолетовый", tone:"холодный", style:"креативный", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Тени ярко‑фиолетовые", makeupSet:{ lips:"Фуксия", eyes:"Ярко‑фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }, hue: 272 },

  // СЕКТОР 30-60°: ФИОЛЕТОВО-РОЗОВЫЕ
  { id:"wi2", color:"#ff00ff", text:"Фуксия", tone:"холодный", style:"креативный", season:"зима", colortype:"зима", textureHint:"Бархат, шёлк", makeupHint:"Помада фуксия", makeupSet:{ lips:"Фуксия", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Креативный" }, hue: 300 },
  { id:"pink_vio_add1", color:"#ff40ff", text:"Яркая фуксия", tone:"холодный", style:"яркий", season:"зима", colortype:"зима", textureHint:"Атлас", makeupHint:"Помада яркая", makeupSet:{ lips:"Фуксия", eyes:"Серебристые", blush:"Яркие", eyeliner:"Чёрная", style:"Яркий" }, hue: 300 },
  { id:"sp6", color:"#ff69b4", text:"Ярко‑розовый", tone:"тёплый", style:"креативный", season:"весна", colortype:"весна", textureHint:"Шифон", makeupHint:"Помада розовая", makeupSet:{ lips:"Ярко‑розовая", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Креативный" }, hue: 330 },
  { id:"br6", color:"#ff1493", text:"Ярко‑розовый", tone:"тёплый", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шифон", makeupHint:"Помада розовая", makeupSet:{ lips:"Ярко‑розовая", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"романтический" }, hue: 328 },

  // СЕКТОР 60-90°: РОЗОВЫЕ
  { id:"spb2", color:"#ff6b8b", text:"Ярко‑коралловый", tone:"тёплый", style:"контрастный", season:"весна", colortype:"весна", textureHint:"Шифон", makeupHint:"Помада ярко‑коралловая", makeupSet:{ lips:"Ярко‑коралловая", eyes:"Бежевые", blush:"Коралловые", eyeliner:"Чёрная", style:"Контрастный" }, hue: 348 },
  { id:"pink_add1", color:"#ff8090", text:"Нежно-розовый", tone:"тёплый", style:"романтический", season:"весна", colortype:"весна", textureHint:"Шифон", makeupHint:"Помада нежная", makeupSet:{ lips:"Розовая", eyes:"Бежевые", blush:"Светлые", eyeliner:"Коричневая", style:"Романтический" }, hue: 350 },
  { id:"su7", color:"#ffc0cb", text:"Розовый", tone:"тёплый", style:"романтический", season:"лето", colortype:"лето", textureHint:"Шифон", makeupHint:"Помада, румяна", makeupSet:{ lips:"Розовая", eyes:"Светло‑голубые", blush:"Розовые", eyeliner:"Тонкая чёрная", style:"романтический" }, hue: 350 },
  { id:"su8", color:"#ffe4e1", text:"Светло‑розовый", tone:"тёплый", style:"повседневный", season:"лето", colortype:"лето", textureHint:"Пастельные ткани", makeupHint:"Румяна, хайлайтер", makeupSet:{ lips:"Светло‑розовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Серая", style:"Повседневный" }, hue: 5 },

  // НЕЙТРАЛЬНЫЕ ЦВЕТА (добавляем в конец)
  { id:"dk1", color:"#000000", text:"Чёрный", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Классика, вечер", makeupHint:"Подводка чёрная", makeupSet:{ lips:"Красная", eyes:"Смоки айс", blush:"Нейтральные", eyeliner:"Чёрная", style:"Классический вечер" }, hue: 0 },
  { id:"neut1", color:"#2f2f2f", text:"Графитовый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Трикотаж", makeupHint:"Тени серые", makeupSet:{ lips:"Нюдовая", eyes:"Серые", blush:"Нейтральные", eyeliner:"Чёрная", style:"Базовый" }, hue: 0 },
  { id:"neut2", color:"#808080", text:"Серый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Трикотаж", makeupHint:"Тени серые", makeupSet:{ lips:"Нюдовая", eyes:"Серые", blush:"Нейтральные", eyeliner:"Чёрная", style:"Базовый" }, hue: 0 },
  { id:"neut3", color:"#dcdcdc", text:"Светло‑серый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Трикотаж", makeupHint:"Тени серые", makeupSet:{ lips:"Нюдовая", eyes:"Серые", blush:"Светлые", eyeliner:"Чёрная", style:"Универсальный" }, hue: 0 },
  { id:"wib3", color:"#ffffff", text:"Белый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный", textureHint:"Атлас", makeupHint:"Хайлайтер", makeupSet:{ lips:"Нюдовая", eyes:"Светлые", blush:"Светлые", eyeliner:"Чёрная", style:"Универсальный" }, hue: 0 }
];

// === АВТОМАТИЧЕСКИ ДОБАВЛЯЕМ HUE (ТОЛЬКО ЕСЛИ НЕ ЗАДАН) ===
colors = colors.map(color => ({
  ...color,
  hue: color.hue !== undefined ? color.hue : calculateHue(color.color)
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
    const baseColor = colors[i];
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Тетрадная гармония - 4 цвета с разницей в 90°
    const targetHues = [
      (baseHue + 90) % 360,
      (baseHue + 180) % 360, 
      (baseHue + 270) % 360
    ];
    
    const selectedColors = [];
    
    // Ищем ближайшие цвета к целевым оттенкам
    for (let targetHue of targetHues) {
      const closestColor = colors
        .filter(color => 
          color.id !== baseColor.id && 
          !selectedColors.includes(color)
        )
        .reduce((closest, current) => {
          if (!closest) return current;
          
          const currentHue = current.hue || calculateHue(current.color);
          const closestHue = closest.hue || calculateHue(closest.color);
          
          const currentDiff = Math.min(
            Math.abs(currentHue - targetHue),
            360 - Math.abs(currentHue - targetHue)
          );
          const closestDiff = Math.min(
            Math.abs(closestHue - targetHue),
            360 - Math.abs(closestHue - targetHue)
          );
          
          return currentDiff < closestDiff ? current : closest;
        }, null);
      
      if (closestColor) {
        selectedColors.push(closestColor);
      }
    }
    
    // Если не нашли достаточно цветов, добавляем случайные
    if (selectedColors.length < 3) {
      const additionalColors = colors
        .filter(color => 
          color.id !== baseColor.id && 
          !selectedColors.includes(color)
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - selectedColors.length);
      
      selectedColors.push(...additionalColors);
    }
    
    return [baseColor, ...selectedColors.slice(0, 3)];
  },

  // МОНОХРОМНАЯ СХЕМА - ПРЕМИУМ ВЕРСИЯ
monochrome: (i, colors = colors) => {
    const baseColor = colors[i]; // Основной цвет без изменений
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Стили монохромных палитр
    const monochromeStyles = [
        // 1. Градиентная элегантность
        {
            name: "градиентная_элегантность",
            variations: 5,
            range: "широкий",
            effects: ["градиентный", "плавный", "изысканный"],
            contrast: "мягкий"
        },
        // 2. Контрастная драма
        {
            name: "контрастная_драма", 
            variations: 3,
            range: "экстремальный",
            effects: ["драматичный", "контрастный", "выразительный"],
            contrast: "сильный"
        },
        // 3. Тональная сложность
        {
            name: "тональная_сложность",
            variations: 4,
            range: "умеренный",
            effects: ["сложный", "нюансный", "глубокий"],
            contrast: "средний"
        },
        // 4. Атмосферные оттенки
        {
            name: "атмосферные_оттенки",
            variations: 6,
            range: "узкий",
            effects: ["атмосферный", "воздушный", "прозрачный"],
            contrast: "минимальный"
        }
    ];
    
    // Выбираем случайный монохромный стиль
    const selectedStyle = monochromeStyles[Math.floor(Math.random() * monochromeStyles.length)];
    const randomEffect = selectedStyle.effects[Math.floor(Math.random() * selectedStyle.effects.length)];
    
    // Функция для создания сложного монохромного оттенка
    const createMonochromeVariation = (baseColor, variationIndex, totalVariations, style) => {
        const hex = baseColor.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        let newR = r, newG = g, newB = b;
        
        // Рассчитываем позицию в диапазоне на основе стиля
        let position;
        switch(style.range) {
            case "широкий":
                position = (variationIndex / (totalVariations - 1)) * 0.8 + 0.1; // 10%-90%
                break;
            case "экстремальный":
                position = variationIndex / (totalVariations - 1); // 0%-100%
                break;
            case "умеренный":
                position = (variationIndex / (totalVariations - 1)) * 0.6 + 0.2; // 20%-80%
                break;
            case "узкий":
                position = (variationIndex / (totalVariations - 1)) * 0.4 + 0.3; // 30%-70%
                break;
        }
        
        // Создаем вариацию на основе стиля
        switch(style.contrast) {
            case "мягкий":
                // Плавные тональные переходы
                const softFactor = position * 0.7;
                newR = Math.round(r * (1 - softFactor) + 255 * softFactor);
                newG = Math.round(g * (1 - softFactor) + 255 * softFactor);
                newB = Math.round(b * (1 - softFactor) + 255 * softFactor);
                break;
                
            case "сильный":
                // Резкие контрастные вариации
                if (position < 0.5) {
                    // Затемнение
                    const darkFactor = (0.5 - position) * 2;
                    newR = Math.round(r * (1 - darkFactor * 0.8));
                    newG = Math.round(g * (1 - darkFactor * 0.8));
                    newB = Math.round(b * (1 - darkFactor * 0.8));
                } else {
                    // Осветление
                    const lightFactor = (position - 0.5) * 2;
                    newR = Math.round(r + (255 - r) * lightFactor * 0.6);
                    newG = Math.round(g + (255 - g) * lightFactor * 0.6);
                    newB = Math.round(b + (255 - b) * lightFactor * 0.6);
                }
                break;
                
            case "средний":
                // Сбалансированные вариации
                const balancedFactor = position;
                newR = Math.round(r * (1 - balancedFactor * 0.5) + 255 * balancedFactor * 0.5);
                newG = Math.round(g * (1 - balancedFactor * 0.5) + 255 * balancedFactor * 0.5);
                newB = Math.round(b * (1 - balancedFactor * 0.5) + 255 * balancedFactor * 0.5);
                break;
                
            case "минимальный":
                // Тонкие нюансные вариации
                const nuanceFactor = position * 0.3;
                newR = Math.round(r * (1 - nuanceFactor) + 255 * nuanceFactor);
                newG = Math.round(g * (1 - nuanceFactor) + 255 * nuanceFactor);
                newB = Math.round(b * (1 - nuanceFactor) + 255 * nuanceFactor);
                break;
        }
        
        // Гарантируем границы
        newR = Math.max(0, Math.min(255, newR));
        newG = Math.max(0, Math.min(255, newG));
        newB = Math.max(0, Math.min(255, newB));
        
        const variationColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        // Определяем название оттенка на основе позиции
        let shadeName;
        if (position < 0.2) shadeName = "глубокий";
        else if (position < 0.4) shadeName = "насыщенный";
        else if (position < 0.6) shadeName = "основной";
        else if (position < 0.8) shadeName = "светлый";
        else shadeName = "пастельный";
        
        return {
            ...baseColor,
            color: variationColor,
            text: `${baseColor.text} (${shadeName} ${randomEffect})`,
            id: `${baseColor.id}_mono_${variationIndex}`,
            style: "монохромный",
            tone: shadeName
        };
    };
    
    // Функция для создания акцентного тона
    const createAccentTone = (baseColor, style) => {
        const hex = baseColor.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        let newR, newG, newB;
        
        // Создаем дополнительный акцентный тон
        switch(style.name) {
            case "градиентная_элегантность":
                // Теплый акцент
                newR = Math.min(255, r + 30);
                newG = Math.min(255, g + 15);
                newB = Math.max(0, b - 10);
                break;
            case "контрастная_драма":
                // Холодный акцент
                newR = Math.max(0, r - 15);
                newG = Math.min(255, g + 20);
                newB = Math.min(255, b + 30);
                break;
            case "тональная_сложность":
                // Нейтральный акцент
                const avg = Math.round((r + g + b) / 3);
                newR = Math.round(avg * 0.9);
                newG = Math.round(avg * 0.95);
                newB = Math.round(avg * 1.05);
                break;
            case "атмосферные_оттенки":
                // Прозрачный акцент
                newR = Math.round(r * 0.7 + 255 * 0.3);
                newG = Math.round(g * 0.7 + 255 * 0.3);
                newB = Math.round(b * 0.7 + 255 * 0.3);
                break;
        }
        
        const accentColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        return {
            ...baseColor,
            color: accentColor,
            text: `${baseColor.text} (акцентный ${randomEffect})`,
            id: `${baseColor.id}_accent`,
            style: "монохромный",
            tone: "акцентный"
        };
    };
    
    let selectedColors = [];
    
    // Создаем монохромные вариации
    const totalVariations = selectedStyle.variations;
    
    // Выбираем 2 лучшие вариации (исключая сам базовый цвет)
    for (let i = 1; i <= totalVariations; i++) {
        if (selectedColors.length >= 2) break;
        
        // Пропускаем среднюю вариацию (близкую к исходному цвету)
        if (i === Math.floor(totalVariations / 2)) continue;
        
        const variation = createMonochromeVariation(
            baseColor, 
            i, 
            totalVariations, 
            selectedStyle
        );
        selectedColors.push(variation);
    }
    
    // Если нужно больше вариаций, добавляем акцентный тон
    if (selectedColors.length < 2) {
        const accentTone = createAccentTone(baseColor, selectedStyle);
        selectedColors.push(accentTone);
    }
    
    console.log("ПРЕМИУМ МОНОХРОМНАЯ СХЕМА:");
    console.log("Стиль:", selectedStyle.name);
    console.log("Эффект:", randomEffect);
    console.log("Контраст:", selectedStyle.contrast);
    console.log("Диапазон:", selectedStyle.range);
    console.log("Вариации:", selectedStyle.variations);
    
    // ВОЗВРАЩАЕМ БАЗОВЫЙ ЦВЕТ БЕЗ ИЗМЕНЕНИЙ + 2 вариации
    return [baseColor, ...selectedColors.slice(0, 2)];
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

  // ДИАДНАЯ СХЕМА - 2 противоположных цвета с небольшим смещением
dyad: (i, colors = colors) => {
    const baseColor = colors[i];
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Противоположный цвет со смещением ±15°
    const offset = 15; // Смещение от чистой противоположности
    const targetHues = [
        (baseHue + 180 - offset + 360) % 360, // 165°
        (baseHue + 180 + offset) % 360         // 195°
    ];
    
    const selectedColors = [];
    
    // Ищем ближайшие цвета к целевым оттенкам со смещением
    for (let targetHue of targetHues) {
        const closestColor = colors
            .filter(color => 
                color.id !== baseColor.id && 
                !selectedColors.includes(color) &&
                color.style !== "нейтральный" // Исключаем нейтральные
            )
            .reduce((closest, current) => {
                if (!closest) return current;
                
                const currentHue = current.hue || calculateHue(current.color);
                const closestHue = closest.hue || calculateHue(closest.color);
                
                const currentDiff = Math.min(
                    Math.abs(currentHue - targetHue),
                    360 - Math.abs(currentHue - targetHue)
                );
                const closestDiff = Math.min(
                    Math.abs(closestHue - targetHue),
                    360 - Math.abs(closestHue - targetHue)
                );
                
                return currentDiff < closestDiff ? current : closest;
            }, null);
        
        if (closestColor) {
            selectedColors.push(closestColor);
        }
    }
    
    // Если нашли оба цвета - отлично, если только один - используем его
    if (selectedColors.length === 0) {
        // Резервный вариант - классическая противоположность
        const fallbackHue = (baseHue + 180) % 360;
        const fallbackColor = colors
            .filter(color => color.id !== baseColor.id)
            .reduce((closest, current) => {
                if (!closest) return current;
                const currentHue = current.hue || calculateHue(current.color);
                const closestHue = closest.hue || calculateHue(closest.color);
                const currentDiff = Math.min(Math.abs(currentHue - fallbackHue), 360 - Math.abs(currentHue - fallbackHue));
                const closestDiff = Math.min(Math.abs(closestHue - fallbackHue), 360 - Math.abs(closestHue - fallbackHue));
                return currentDiff < closestDiff ? current : closest;
            }, null);
        
        if (fallbackColor) {
            selectedColors.push(fallbackColor);
        }
    }
    
    console.log("Диадная схема - противоположные цвета со смещением:");
    console.log("Базовый цвет:", baseColor.text, "Hue:", baseHue);
    console.log("Найдены цвета:", selectedColors.map(c => `${c.text} (Hue: ${c.hue})`));
    
    return [baseColor, ...selectedColors.slice(0, 2)];
},

  // НЕЙТРАЛЬНАЯ СХЕМА - ПРЕМИУМ ВЕРСИЯ
neutral: (i, colors = colors) => {
    const baseColor = colors[i]; // Основной цвет без изменений
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Стили нейтральных палитр
    const neutralPalettes = [
        // 1. Классическая элегантность
        {
            name: "классическая_элегантность",
            hues: [
                baseHue,
                (baseHue + 30) % 360,
                (baseHue + 330) % 360
            ],
            tones: ["серый", "бежевый", "белый", "черный", "коричневый"],
            effects: ["элегантный", "утонченный", "аристократичный"],
            temperature: "нейтральный"
        },
        // 2. Современный минимализм
        {
            name: "современный_минимализм", 
            hues: [
                baseHue,
                (baseHue + 180) % 360
            ],
            tones: ["угольный", "цементный", "алебастровый", "графитовый"],
            effects: ["минималистичный", "лаконичный", "архитектурный"],
            temperature: "холодный"
        },
        // 3. Теплый сканди
        {
            name: "теплый_сканди",
            hues: [
                baseHue,
                (baseHue + 15) % 360,
                (baseHue + 345) % 360
            ],
            tones: ["песочный", "льняной", "дубовый", "глиняный"],
            effects: ["скандинавский", "уютный", "натуральный"],
            temperature: "теплый"
        },
        // 4. Урбан-люкс
        {
            name: "урбан_люкс",
            hues: [
                baseHue,
                (baseHue + 90) % 360,
                (baseHue + 270) % 360
            ],
            tones: ["тауп", "хаки", "пудровый", "мокко"],
            effects: ["урбанистический", "премиальный", "сложный"],
            temperature: "смешанный"
        }
    ];
    
    // Выбираем случайную нейтральную палитру
    const selectedPalette = neutralPalettes[Math.floor(Math.random() * neutralPalettes.length)];
    const randomEffect = selectedPalette.effects[Math.floor(Math.random() * selectedPalette.effects.length)];
    
    // Функция для создания совершенного нейтрального цвета
    const makePerfectNeutral = (color, effectName, palette) => {
        let neutralColor = color.color;
        
        // Нормализуем цвет к идеальному нейтралу
        const hex = neutralColor.replace('#', '');
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);
        
        // Приводим к нужной температуре
        switch(palette.temperature) {
            case "теплый":
                r = Math.min(255, r + 10);
                g = Math.min(255, g + 5);
                b = Math.max(0, b - 5);
                break;
            case "холодный":
                r = Math.max(0, r - 5);
                g = Math.min(255, g + 5);
                b = Math.min(255, b + 10);
                break;
            case "нейтральный":
                // Выравниваем каналы для идеального нейтрала
                const avg = Math.round((r + g + b) / 3);
                r = Math.round(r * 0.3 + avg * 0.7);
                g = Math.round(g * 0.3 + avg * 0.7);
                b = Math.round(b * 0.3 + avg * 0.7);
                break;
        }
        
        // Слегка приглушаем для большей sophistication
        const luminance = (r + g + b) / 3;
        const targetLuminance = 120; // Идеальная середина
        
        if (luminance > targetLuminance) {
            // Слегка затемняем слишком светлые цвета
            const factor = targetLuminance / luminance;
            r = Math.round(r * factor);
            g = Math.round(g * factor);
            b = Math.round(b * factor);
        }
        
        const perfectNeutral = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: perfectNeutral,
            text: `${color.text} (${effectName})`,
            id: color.id + `_neutral_${effectName}`,
            style: "нейтральный",
            tone: "нейтральный"
        };
    };
    
    // Функция для создания акцентного нейтрала
    const createAccentNeutral = (paletteName, baseHueValue) => {
        const accents = {
            "классическая_элегантность": { 
                color: "#2F4F4F", 
                text: "Темный графитовый" 
            },
            "современный_минимализм": { 
                color: "#36454F", 
                text: "Угольно-серый" 
            },
            "теплый_сканди": { 
                color: "#8B7355", 
                text: "Теплый коричневый" 
            },
            "урбан_люкс": { 
                color: "#483C32", 
                text: "Тауп" 
            }
        };
        
        const accent = accents[paletteName] || { color: "#808080", text: "Серый нейтральный" };
        
        return {
            color: accent.color,
            text: accent.text,
            tone: "нейтральный",
            style: "нейтральный",
            id: `accent_neutral_${paletteName}`
        };
    };
    
    let selectedColors = [];
    
    // 1. Сначала ищем идеальные нейтральные цвета
    const neutralStyleColors = colors.filter(color => 
        color.style === "нейтральный" && 
        color.id !== baseColor.id
    );
    
    // 2. Используем палитру для подбора гармоничных нейтралов
    if (neutralStyleColors.length > 0) {
        const perfectNeutrals = neutralStyleColors
            .filter(color => {
                // Проверяем соответствие тону палитры
                const colorText = color.text.toLowerCase();
                const matchesTone = selectedPalette.tones.some(tone => 
                    colorText.includes(tone)
                );
                
                if (!matchesTone) return false;
                
                // Проверяем гармонию по hue
                const colorHue = color.hue || calculateHue(color.color);
                return selectedPalette.hues.some(targetHue => {
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    return hueDiff <= 20;
                });
            })
            .slice(0, 2);
        
        for (let neutralColor of perfectNeutrals) {
            if (selectedColors.length >= 2) break;
            let perfectedColor = makePerfectNeutral(neutralColor, randomEffect, selectedPalette);
            selectedColors.push(perfectedColor);
        }
    }
    
    // 3. Если нейтральных цветов мало, ищем по тонам палитры
    if (selectedColors.length < 2) {
        const toneColors = colors.filter(color => {
            if (color.id === baseColor.id || selectedColors.includes(color)) return false;
            
            const colorText = color.text.toLowerCase();
            return selectedPalette.tones.some(tone => 
                colorText.includes(tone)
            );
        });
        
        if (toneColors.length > 0) {
            const bestToneColors = toneColors
                .sort((a, b) => {
                    const aHue = a.hue || calculateHue(a.color);
                    const bHue = b.hue || calculateHue(b.color);
                    const aDiff = Math.min(Math.abs(aHue - baseHue), 360 - Math.abs(aHue - baseHue));
                    const bDiff = Math.min(Math.abs(bHue - baseHue), 360 - Math.abs(bHue - baseHue));
                    return aDiff - bDiff;
                })
                .slice(0, 2 - selectedColors.length);
            
            for (let toneColor of bestToneColors) {
                let perfectedColor = makePerfectNeutral(toneColor, randomEffect, selectedPalette);
                selectedColors.push(perfectedColor);
            }
        }
    }
    
    // 4. Добавляем акцентный нейтрал если нужно
    if (selectedColors.length < 2) {
        const accentNeutral = createAccentNeutral(selectedPalette.name, baseHue);
        selectedColors.push(accentNeutral);
    }
    
    console.log("ПРЕМИУМ НЕЙТРАЛЬНАЯ СХЕМА:");
    console.log("Палитра:", selectedPalette.name);
    console.log("Эффект:", randomEffect);
    console.log("Температура:", selectedPalette.temperature);
    console.log("Тона:", selectedPalette.tones.join(", "));
    
    // ВОЗВРАЩАЕМ БАЗОВЫЙ ЦВЕТ БЕЗ ИЗМЕНЕНИЙ
    return [baseColor, ...selectedColors.slice(0, 2)];
},

  // Тональная схема
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

  
  // ПЕНТАДА - 5 гармоничных цветов
  pentadic:  (i, colorArray = colors) => {
    const baseColor = colorArray[i];
    const baseHue = baseColor.hue;
    
    // 5 цветов через равные промежутки 72°
    const targetHues = [
      (baseHue + 72) % 360,
      (baseHue + 144) % 360,
      (baseHue + 216) % 360,
      (baseHue + 288) % 360
    ];
    
    const selectedColors = [];

    // ЭФФЕКТНЫЕ ФИЛЬТРЫ В СТИЛЕ КОРЕЙСКИХ ДОРАМ
    const applyDramaEffect = (color, effectType) => {
      const hex = color.color.replace('#', '');
      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);
      
      switch(effectType) {
        case "moonlight_whisper":
          // Лунный шепот - холодное осветление с синевой
          r = Math.min(255, r * 0.9 + 40);
          g = Math.min(255, g * 0.9 + 40);
          b = Math.min(255, b * 1.1 + 20);
          break;
          
        case "sunset_drama":
          // Закатная драма - теплое затемнение с оранжевым
          r = Math.max(0, r * 0.85 + 15);
          g = Math.max(0, g * 0.75 - 5);
          b = Math.max(0, b * 0.65 - 10);
          break;
          
        case "velvet_mystery":
          // Бархатная тайна - глубокое насыщенное затемнение
          const avg = (r + g + b) / 3;
          r = Math.max(0, r * 0.7 + avg * 0.1);
          g = Math.max(0, g * 0.7 + avg * 0.1);
          b = Math.max(0, b * 0.7 + avg * 0.1);
          break;
          
        case "crystal_dream":
          // Кристальная мечта - пастельное осветление с холодным оттенком
          r = Math.min(255, (r + 255) / 2);
          g = Math.min(255, (g + 255) / 2);
          b = Math.min(255, (b + 255) / 2);
          // Добавляем холодный оттенок
          b = Math.min(255, b + 15);
          break;
          
        case "urban_noir":
          // Урбан нуар - приглушенный с серым подтоном
          const gray = (r + g + b) / 3 * 0.4;
          r = Math.round(r * 0.6 + gray);
          g = Math.round(g * 0.6 + gray);
          b = Math.round(b * 0.6 + gray);
          break;
      }
      
      const newColor = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
      
      return {
        ...color,
        color: newColor,
        text: `${color.text} • ${getEffectName(effectType)}`,
        id: `${color.id}_${effectType}`,
        style: "дорам-эффект",
        textureHint: getTextureForEffect(effectType),
        tone: getToneForEffect(effectType)
      };
    };

    const getEffectName = (effectType) => {
      const names = {
        "moonlight_whisper": "Лунный шёпот",
        "sunset_drama": "Закатная драма",
        "velvet_mystery": "Бархатная тайна",
        "crystal_dream": "Кристальная мечта",
        "urban_noir": "Урбан нуар"
      };
      return names[effectType];
    };

    const getTextureForEffect = (effectType) => {
      const textures = {
        "moonlight_whisper": "Шёлк, органза",
        "sunset_drama": "Бархат, шерсть", 
        "velvet_mystery": "Атлас, кожа",
        "crystal_dream": "Шифон, кристаллы",
        "urban_noir": "Хлопок, деним"
      };
      return textures[effectType];
    };

    const getToneForEffect = (effectType) => {
      const tones = {
        "moonlight_whisper": "холодный",
        "sunset_drama": "тёплый",
        "velvet_mystery": "глубокий",
        "crystal_dream": "пастельный", 
        "urban_noir": "нейтральный"
      };
      return tones[effectType];
    };

    // ФИЛЬТРЫ ДЛЯ ВЫБОРА ЛУЧШИХ ЦВЕТОВ ДЛЯ ЭФФЕКТОВ
    const dramaEffectFilter = (color, targetHueIndex) => {
      const effectProfiles = [
        {
          effect: "moonlight_whisper",
          preferredHues: [180, 200, 220, 240, 260], // Холодные тона
          mood: "романтический, мечтательный"
        },
        {
          effect: "sunset_drama", 
          preferredHues: [0, 20, 30, 40, 350], // Теплые тона
          mood: "драматичный, страстный"
        },
        {
          effect: "velvet_mystery",
          preferredHues: [270, 280, 290, 300, 320], // Пурпурные тона
          mood: "загадочный, роскошный"
        },
        {
          effect: "crystal_dream",
          preferredHues: [120, 140, 160, 180, 200], // Свежие тона
          mood: "нежный, воздушный"
        }
      ];
      
      const profile = effectProfiles[targetHueIndex];
      const hueDiff = Math.min(
        Math.abs(color.hue - profile.preferredHues[0]),
        360 - Math.abs(color.hue - profile.preferredHues[0])
      );
      
      return hueDiff <= 45; // Цвета в пределах 45° от предпочтительных
    };

    // Поиск и применение эффектов
    console.log("🎬 НАЛОЖЕНИЕ ДОРАМ-ЭФФЕКТОВ НА ПЕНТАДУ:");
    
    targetHues.forEach((targetHue, index) => {
      const effectTypes = ["moonlight_whisper", "sunset_drama", "velvet_mystery", "crystal_dream"];
      const selectedEffect = effectTypes[index];
      
      const closestColor = colorArray
        .filter(color => {
          if (color.id === baseColor.id) return false;
          if (selectedColors.some(selected => selected.id === color.id)) return false;
          return dramaEffectFilter(color, index);
        })
        .reduce((closest, current) => {
          if (!closest) return current;
          
          const currentDiff = Math.min(
            Math.abs(current.hue - targetHue),
            360 - Math.abs(current.hue - targetHue)
          );
          const closestDiff = Math.min(
            Math.abs(closest.hue - targetHue),
            360 - Math.abs(closest.hue - targetHue)
          );
          
          return currentDiff < closestDiff ? current : closest;
        }, null);
      
      if (closestColor) {
        const effectedColor = applyDramaEffect(closestColor, selectedEffect);
        selectedColors.push(effectedColor);
        
        const originalHex = closestColor.color;
        const effectedHex = effectedColor.color;
        const hueDiff = Math.min(
          Math.abs(closestColor.hue - targetHue),
          360 - Math.abs(closestColor.hue - targetHue)
        );
        
        console.log(`✨ ${getEffectName(selectedEffect)}: ${closestColor.text}`);
        console.log(`   ${originalHex} → ${effectedHex} │ ΔHue: ${hueDiff}°`);
      }
    });

    // Базовый цвет тоже получает эффект
    const baseEffect = "urban_noir";
    const effectedBaseColor = applyDramaEffect(baseColor, baseEffect);

    // ФИНАЛЬНАЯ ЭФФЕКТНАЯ ПЕНТАДА
    const dramaPentad = [effectedBaseColor, ...selectedColors.slice(0, 4)];
    
    console.log("\n🎭 ДОРАМ-ПЕНТАДА С ЭФФЕКТАМИ:");
    console.log("┌─────────────────────────────────────────────────┐");
    console.log("│              🎬 КИНЕМАТОГРАФИЧНАЯ ПАЛИТРА     │");
    console.log("├─────────────────────────────────────────────────┤");
    dramaPentad.forEach((color, index) => {
      const effects = ["Урбан нуар", "Лунный шёпот", "Закатная драма", "Бархатная тайна", "Кристальная мечта"];
      const emojis = ["🏙️", "🌙", "🌅", "🪞", "💎"];
      console.log(`│ ${emojis[index]} ${effects[index].padEnd(15)} │ ${color.text.padEnd(25)} │`);
    });
    console.log("├─────────────────────────────────────────────────┤");
    console.log("│ 🌟 Каждый цвет усилен кинематографичным эффектом │");
    console.log("└─────────────────────────────────────────────────┘");
    
    return dramaPentad;
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

  // ПОВСЕДНЕВНАЯ СХЕМА - ПРЕМИУМ ВЕРСИЯ
casual: (i, colors = colors) => {
    const baseColor = colors[i]; // Основной цвет без изменений
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Стили повседневной одежды
    const casualStyles = [
        // 1. Уютный кэжуал
        {
            name: "уютный_кэжуал",
            hues: [
                baseHue,
                (baseHue + 20) % 360,
                (baseHue + 340) % 360
            ],
            palette: ["бежевый", "коричневый", "кремовый", "терракотовый"],
            effects: ["уютный", "комфортный", "расслабленный"],
            lighten: 25
        },
        // 2. Городской минимализм
        {
            name: "городской_минимализм", 
            hues: [
                baseHue,
                (baseHue + 180) % 360
            ],
            palette: ["серый", "черный", "белый", "синий"],
            effects: ["минималистичный", "урбанистический", "лаконичный"],
            lighten: 15
        },
        // 3. Спортивный шик
        {
            name: "спортивный_шик",
            hues: [
                baseHue,
                (baseHue + 120) % 360,
                (baseHue + 240) % 360
            ],
            palette: ["хаки", "оливковый", "песочный", "графитовый"],
            effects: ["спортивный", "динамичный", "функциональный"],
            lighten: 20
        },
        // 4. Бохо-расслабленность
        {
            name: "бохо_расслабленность",
            hues: [
                baseHue,
                (baseHue + 60) % 360,
                (baseHue + 300) % 360
            ],
            palette: ["пыльный розовый", "приглушенный синий", "песочный", "зеленый"],
            effects: ["бохо", "расслабленный", "творческий"],
            lighten: 30
        }
    ];
    
    // Выбираем случайный повседневный стиль
    const selectedStyle = casualStyles[Math.floor(Math.random() * casualStyles.length)];
    const randomEffect = selectedStyle.effects[Math.floor(Math.random() * selectedStyle.effects.length)];
    
    // Функция для создания повседневного цвета
    const makeCasualColor = (color, effectName, style) => {
        let casualColor = color.color;
        
        // Осветляем для более мягкого вида
        casualColor = shadeColor(casualColor, style.lighten);
        
        // Слегка уменьшаем насыщенность для комфортности
        const hex = casualColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const avg = (r + g + b) / 3;
        const newR = Math.round(r * 0.8 + avg * 0.2);
        const newG = Math.round(g * 0.8 + avg * 0.2);
        const newB = Math.round(b * 0.8 + avg * 0.2);
        
        const comfortableColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: comfortableColor,
            text: `${color.text} (${effectName})`,
            id: color.id + `_casual_${effectName}`,
            style: "повседневный",
            tone: "мягкий"
        };
    };
    
    // Функция для создания нейтральной базы
    const createNeutralBase = (styleName) => {
        const neutrals = {
            "уютный_кэжуал": { 
                color: "#F5F5DC", 
                text: "Теплый бежевый" 
            },
            "городской_минимализм": { 
                color: "#F8F8FF", 
                text: "Чистый белый" 
            },
            "спортивный_шик": { 
                color: "#F0F0F0", 
                text: "Серо-белый" 
            },
            "бохо_расслабленность": { 
                color: "#FFF8DC", 
                text: "Кремовый" 
            }
        };
        
        const neutral = neutrals[styleName] || { color: "#FFFFFF", text: "Белый" };
        
        return {
            color: neutral.color,
            text: neutral.text,
            tone: "нейтральный",
            style: "повседневный",
            id: `neutral_${styleName}`
        };
    };
    
    let selectedColors = [];
    
    // 1. Сначала ищем повседневные цвета
    const casualStyleColors = colors.filter(color => 
        (color.style === "повседневный" || color.style === "универсальный") && 
        color.id !== baseColor.id
    );
    
    // 2. Используем стиль для подбора гармоничных повседневных цветов
    if (casualStyleColors.length > 0) {
        const harmoniousCasual = casualStyleColors
            .filter(color => {
                const colorHue = color.hue || calculateHue(color.color);
                return selectedStyle.hues.some(targetHue => {
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    return hueDiff <= 25;
                });
            })
            .slice(0, 2);
        
        for (let casualColor of harmoniousCasual) {
            if (selectedColors.length >= 2) break;
            let comfortableColor = makeCasualColor(casualColor, randomEffect, selectedStyle);
            selectedColors.push(comfortableColor);
        }
    }
    
    // 3. Если повседневных цветов мало, ищем по палитре стиля
    if (selectedColors.length < 2) {
        const paletteColors = colors.filter(color => {
            if (color.id === baseColor.id || selectedColors.includes(color)) return false;
            
            const colorText = color.text.toLowerCase();
            return selectedStyle.palette.some(paletteColor => 
                colorText.includes(paletteColor)
            );
        });
        
        if (paletteColors.length > 0) {
            const bestPaletteColors = paletteColors
                .sort((a, b) => {
                    const aHue = a.hue || calculateHue(a.color);
                    const bHue = b.hue || calculateHue(b.color);
                    const aDiff = Math.min(Math.abs(aHue - baseHue), 360 - Math.abs(aHue - baseHue));
                    const bDiff = Math.min(Math.abs(bHue - baseHue), 360 - Math.abs(bHue - baseHue));
                    return aDiff - bDiff;
                })
                .slice(0, 2 - selectedColors.length);
            
            for (let paletteColor of bestPaletteColors) {
                let comfortableColor = makeCasualColor(paletteColor, randomEffect, selectedStyle);
                selectedColors.push(comfortableColor);
            }
        }
    }
    
    // 4. Добавляем нейтральную базу если нужно
    if (selectedColors.length < 2) {
        const neutralBase = createNeutralBase(selectedStyle.name);
        selectedColors.push(neutralBase);
    }
    
    console.log("ПРЕМИУМ ПОВСЕДНЕВНАЯ СХЕМА:");
    console.log("Стиль:", selectedStyle.name);
    console.log("Эффект:", randomEffect);
    console.log("Осветление:", selectedStyle.lighten + "%");
    console.log("Палитра:", selectedStyle.palette.join(", "));
    
    // ВОЗВРАЩАЕМ БАЗОВЫЙ ЦВЕТ БЕЗ ИЗМЕНЕНИЙ
    return [baseColor, ...selectedColors.slice(0, 2)];
},

  // ДЕЛОВАЯ СХЕМА - ПРЕМИУМ ВЕРСИЯ
business: (i, colors = colors) => {
    const baseColor = colors[i]; // Основной цвет без изменений
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Деловые стили с разными характерами
    const businessStyles = [
        // 1. Классический офис
        {
            name: "классический_офис",
            hues: [
                baseHue,
                (baseHue + 30) % 360,
                (baseHue - 30 + 360) % 360
            ],
            palette: ["серый", "темно-синий", "бордовый", "бежевый"],
            effects: ["классический", "строгий", "элегантный"]
        },
        // 2. Современный бизнес
        {
            name: "современный_бизнес", 
            hues: [
                baseHue,
                (baseHue + 60) % 360,
                (baseHue + 300) % 360
            ],
            palette: ["угольный", "хаки", "петроль", "песочный"],
            effects: ["современный", "минималистичный", "урбанистический"]
        },
        // 3. Креативный профессионал
        {
            name: "креативный_профессионал",
            hues: [
                baseHue,
                (baseHue + 90) % 360,
                (baseHue + 270) % 360
            ],
            palette: ["графитовый", "терракотовый", "оливковый", "пшеничный"],
            effects: ["творческий", "выразительный", "индивидуальный"]
        },
        // 4. Люкс-элегантность
        {
            name: "люкс_элегантность",
            hues: [
                baseHue,
                (baseHue + 15) % 360,
                (baseHue + 345) % 360
            ],
            palette: ["черный", "шоколадный", "пудровый", "кремовый"],
            effects: ["роскошный", "утонченный", "премиальный"]
        }
    ];
    
    // Выбираем случайный деловой стиль
    const selectedStyle = businessStyles[Math.floor(Math.random() * businessStyles.length)];
    const randomEffect = selectedStyle.effects[Math.floor(Math.random() * selectedStyle.effects.length)];
    
    // Функция для создания делового цвета
    const makeBusinessColor = (color, effectName) => {
        // Слегка приглушаем цвет для делового стиля
        let businessColor = color.color;
        
        // Добавляем серый подтон для солидности
        const hex = businessColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Усредняем для более приглушенного вида
        const avg = (r + g + b) / 3;
        const newR = Math.round(r * 0.7 + avg * 0.3);
        const newG = Math.round(g * 0.7 + avg * 0.3);
        const newB = Math.round(b * 0.7 + avg * 0.3);
        
        const professionalColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: professionalColor,
            text: `${color.text} (${effectName})`,
            id: color.id + `_business_${effectName}`,
            style: "деловой",
            tone: "нейтральный"
        };
    };
    
    // Функция для создания нейтрального акцента
    const createNeutralAccent = (styleName) => {
        const neutrals = {
            "классический_офис": { color: "#2F4F4F", text: "Графитовый серый" },
            "современный_бизнес": { color: "#36454F", text: "Угольный" },
            "креативный_профессионал": { color: "#708090", text: "Сланцевый" },
            "люкс_элегантность": { color: "#483C32", text: "Тауп" }
        };
        
        const neutral = neutrals[styleName] || { color: "#808080", text: "Серый нейтральный" };
        
        return {
            color: neutral.color,
            text: neutral.text,
            tone: "нейтральный",
            style: "деловой",
            id: `neutral_${styleName}`
        };
    };
    
    let selectedColors = [];
    
    // 1. Сначала ищем деловые цвета
    const businessStyleColors = colors.filter(color => 
        color.style === "деловой" && 
        color.id !== baseColor.id
    );
    
    // 2. Используем стиль для подбора гармоничных деловых цветов
    if (businessStyleColors.length > 0) {
        const harmoniousBusiness = businessStyleColors
            .filter(color => {
                const colorHue = color.hue || calculateHue(color.color);
                return selectedStyle.hues.some(targetHue => {
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    return hueDiff <= 25;
                });
            })
            .slice(0, 2);
        
        for (let businessColor of harmoniousBusiness) {
            if (selectedColors.length >= 2) break;
            let professionalColor = makeBusinessColor(businessColor, randomEffect);
            selectedColors.push(professionalColor);
        }
    }
    
    // 3. Если деловых цветов мало, создаем из гармоничных нейтральных
    if (selectedColors.length < 2) {
        // Ищем цвета из палитры делового стиля
        const paletteColors = colors.filter(color => {
            if (color.id === baseColor.id || selectedColors.includes(color)) return false;
            
            const colorText = color.text.toLowerCase();
            return selectedStyle.palette.some(paletteColor => 
                colorText.includes(paletteColor)
            );
        });
        
        if (paletteColors.length > 0) {
            const bestPaletteColors = paletteColors
                .sort((a, b) => {
                    const aHue = a.hue || calculateHue(a.color);
                    const bHue = b.hue || calculateHue(b.color);
                    const aDiff = Math.min(Math.abs(aHue - baseHue), 360 - Math.abs(aHue - baseHue));
                    const bDiff = Math.min(Math.abs(bHue - baseHue), 360 - Math.abs(bHue - baseHue));
                    return aDiff - bDiff;
                })
                .slice(0, 2 - selectedColors.length);
            
            for (let paletteColor of bestPaletteColors) {
                let professionalColor = makeBusinessColor(paletteColor, randomEffect);
                selectedColors.push(professionalColor);
            }
        }
    }
    
    // 4. Добавляем нейтральный акцент если нужно
    if (selectedColors.length < 2) {
        const neutralAccent = createNeutralAccent(selectedStyle.name);
        selectedColors.push(neutralAccent);
    }
    
    console.log("ПРЕМИУМ ДЕЛОВАЯ СХЕМА:");
    console.log("Стиль:", selectedStyle.name);
    console.log("Эффект:", randomEffect);
    console.log("Палитра:", selectedStyle.palette.join(", "));
    
    // ВОЗВРАЩАЕМ БАЗОВЫЙ ЦВЕТ БЕЗ ИЗМЕНЕНИЙ
    return [baseColor, ...selectedColors.slice(0, 2)];
  },

  // Яркая схема с насыщенными и 
// ЯРКАЯ СХЕМА - ПРЕМИУМ ВЕРСИЯ
bright: (i, colors = colors) => {
    const baseColor = colors[i]; // Основной цвет без изменений
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Типы ярких гармоний
    const brightEnergies = [
        // 1. Электрическая триада
        {
            name: "электрическая_триада",
            hues: [
                baseHue,
                (baseHue + 120) % 360,
                (baseHue + 240) % 360
            ],
            effects: ["неоновый", "электрический", "кислотный"],
            saturation: 50,
            contrast: "максимальный"
        },
        // 2. Флуоресцентный дуэт
        {
            name: "флуоресцентный_дуэт", 
            hues: [
                baseHue,
                (baseHue + 180) % 360
            ],
            effects: ["флуоресцентный", "светящийся", "люминесцентный"],
            saturation: 45,
            contrast: "высокий"
        },
        // 3. Поп-арт палитра
        {
            name: "поп_арт_палитра",
            hues: [
                baseHue,
                (baseHue + 60) % 360,
                (baseHue + 300) % 360
            ],
            effects: ["поп-арт", "комиксный", "графический"],
            saturation: 55,
            contrast: "средний"
        },
        // 4. Радужный взрыв
        {
            name: "радужный_взрыв",
            hues: [
                baseHue,
                (baseHue + 90) % 360,
                (baseHue + 270) % 360
            ],
            effects: ["радужный", "карнавальный", "праздничный"],
            saturation: 60,
            contrast: "умеренный"
        }
    ];
    
    // Выбираем случайную яркую энергию
    const selectedEnergy = brightEnergies[Math.floor(Math.random() * brightEnergies.length)];
    const randomEffect = selectedEnergy.effects[Math.floor(Math.random() * selectedEnergy.effects.length)];
    
    // Функция для усиления яркости цвета
    const amplifyBrightness = (color, effectName, energy) => {
        let brightColor = color.color;
        
        // Усиливаем насыщенность
        const hex = brightColor.replace('#', '');
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);
        
        // Определяем доминирующий канал
        const maxChannel = Math.max(r, g, b);
        const isLight = maxChannel > 180;
        
        // Усиливаем в зависимости от эффекта
        if (effectName.includes("неоновый") || effectName.includes("электрический")) {
            // Неоновый эффект - усиливаем доминирующий канал
            if (maxChannel === r) {
                r = Math.min(255, r + energy.saturation);
                g = Math.max(0, g - 20);
                b = Math.max(0, b - 20);
            } else if (maxChannel === g) {
                r = Math.max(0, r - 20);
                g = Math.min(255, g + energy.saturation);
                b = Math.max(0, b - 20);
            } else {
                r = Math.max(0, r - 20);
                g = Math.max(0, g - 20);
                b = Math.min(255, b + energy.saturation);
            }
        } else if (effectName.includes("флуоресцентный")) {
            // Флуоресцентный эффект - равномерное усиление
            const boost = isLight ? energy.saturation : energy.saturation + 30;
            r = Math.min(255, r + boost * 0.8);
            g = Math.min(255, g + boost * 1.0);
            b = Math.min(255, b + boost * 0.9);
        } else {
            // Стандартное усиление яркости
            const boost = energy.saturation;
            r = Math.min(255, r + boost);
            g = Math.min(255, g + boost);
            b = Math.min(255, b + boost);
        }
        
        const amplifiedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: amplifiedColor,
            text: `${color.text} (${effectName})`,
            id: color.id + `_bright_${effectName}`,
            style: "яркий",
            tone: "яркий"
        };
    };
    
    // Функция для создания балансирующего цвета
    const createBalancer = (baseHueValue, energyType) => {
        const balancers = {
            "электрическая_триада": { 
                hue: (baseHueValue + 180) % 360,
                text: "Контрастный балансер"
            },
            "флуоресцентный_дуэт": { 
                hue: (baseHueValue + 90) % 360,
                text: "Гармоничный акцент"
            },
            "поп_арт_палитра": { 
                hue: (baseHueValue + 150) % 360,
                text: "Графический элемент"
            },
            "радужный_взрыв": { 
                hue: (baseHueValue + 30) % 360,
                text: "Переходный тон"
            }
        };
        
        const balancer = balancers[energyType] || { hue: (baseHueValue + 120) % 360, text: "Яркий акцент" };
        
        // Находим ближайший существующий цвет для балансера
        const closestBalancer = colors
            .filter(color => color.id !== baseColor.id)
            .reduce((closest, current) => {
                if (!closest) return current;
                
                const currentHue = current.hue || calculateHue(current.color);
                const closestHue = closest.hue || calculateHue(closest.color);
                
                const currentDiff = Math.min(
                    Math.abs(currentHue - balancer.hue),
                    360 - Math.abs(currentHue - balancer.hue)
                );
                const closestDiff = Math.min(
                    Math.abs(closestHue - balancer.hue),
                    360 - Math.abs(closestHue - balancer.hue)
                );
                
                return currentDiff < closestDiff ? current : closest;
            }, null);
        
        if (closestBalancer) {
            return amplifyBrightness(closestBalancer, "балансирующий", selectedEnergy);
        }
        
        return null;
    };
    
    let selectedColors = [];
    
    // 1. Сначала ищем яркие цвета
    const brightStyleColors = colors.filter(color => 
        (color.style === "яркий" || color.style === "контрастный") && 
        color.id !== baseColor.id
    );
    
    // 2. Используем энергию для подбора гармоничных ярких цветов
    if (brightStyleColors.length > 0) {
        const harmoniousBright = brightStyleColors
            .filter(color => {
                const colorHue = color.hue || calculateHue(color.color);
                return selectedEnergy.hues.some(targetHue => {
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    return hueDiff <= 30;
                });
            })
            .slice(0, 2);
        
        for (let brightColor of harmoniousBright) {
            if (selectedColors.length >= 2) break;
            let amplifiedColor = amplifyBrightness(brightColor, randomEffect, selectedEnergy);
            selectedColors.push(amplifiedColor);
        }
    }
    
    // 3. Если ярких цветов мало, создаем из гармоничных
    if (selectedColors.length < 2) {
        for (let targetHue of selectedEnergy.hues.slice(1)) {
            if (selectedColors.length >= 2) break;
            
            const closestColor = colors
                .filter(color => {
                    if (color.id === baseColor.id || selectedColors.includes(color)) return false;
                    if (color.style === "нейтральный" || color.style === "деловой") return false;
                    
                    const colorHue = color.hue || calculateHue(color.color);
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    
                    return hueDiff <= 25;
                })
                .reduce((closest, current) => {
                    if (!closest) return current;
                    
                    const currentHue = current.hue || calculateHue(current.color);
                    const closestHue = closest.hue || calculateHue(closest.color);
                    
                    const currentDiff = Math.min(
                        Math.abs(currentHue - targetHue),
                        360 - Math.abs(currentHue - targetHue)
                    );
                    const closestDiff = Math.min(
                        Math.abs(closestHue - targetHue),
                        360 - Math.abs(closestHue - targetHue)
                    );
                    
                    return currentDiff < closestDiff ? current : closest;
                }, null);
            
            if (closestColor) {
                let amplifiedColor = amplifyBrightness(closestColor, randomEffect, selectedEnergy);
                selectedColors.push(amplifiedColor);
            }
        }
    }
    
    // 4. Добавляем балансирующий цвет для гармонии
    if (selectedColors.length === 1) {
        const balancer = createBalancer(baseHue, selectedEnergy.name);
        if (balancer) {
            selectedColors.push(balancer);
        }
    }
    
    console.log("ПРЕМИУМ ЯРКАЯ СХЕМА:");
    console.log("Энергия:", selectedEnergy.name);
    console.log("Эффект:", randomEffect);
    console.log("Контраст:", selectedEnergy.contrast);
    console.log("Усиление насыщенности:", selectedEnergy.saturation + "%");
    
    // ВОЗВРАЩАЕМ БАЗОВЫЙ ЦВЕТ БЕЗ ИЗМЕНЕНИЙ
    return [baseColor, ...selectedColors.slice(0, 2)];
},

  // КРЕАТИВНАЯ СХЕМА - УЛУЧШЕННАЯ ВЕРСИЯ (ОСНОВНОЙ ЦВЕТ БЕЗ ИЗМЕНЕНИЙ)
creative: (i, colors = colors) => {
    const baseColor = colors[i]; // ОСНОВНОЙ ЦВЕТ БЕЗ ИЗМЕНЕНИЙ
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Креативные гармонии с разными подходами
    const creativeStrategies = [
        // 1. Неоновая триада
        {
            name: "неоновая_триада",
            hues: [
                baseHue,
                (baseHue + 120) % 360,
                (baseHue + 240) % 360
            ],
            effects: ["неоновый", "кислотный", "электрический"],
            saturationBoost: 40
        },
        // 2. Двойной контраст
        {
            name: "двойной_контраст", 
            hues: [
                baseHue,
                (baseHue + 90) % 360,
                (baseHue + 180) % 360
            ],
            effects: ["контрастный", "графичный", "поп-арт"],
            saturationBoost: 30
        },
        // 3. Расширенная аналогия
        {
            name: "расширенная_аналогия",
            hues: [
                baseHue,
                (baseHue + 60) % 360,
                (baseHue + 300) % 360
            ],
            effects: ["экспрессивный", "живописный", "акварельный"],
            saturationBoost: 25
        },
        // 4. Сплит-комплементарная
        {
            name: "сплит_комплементарная",
            hues: [
                baseHue,
                (baseHue + 150) % 360,
                (baseHue + 210) % 360
            ],
            effects: ["динамичный", "энергичный", "ритмичный"],
            saturationBoost: 35
        }
    ];
    
    // Выбираем случайную стратегию
    const selectedStrategy = creativeStrategies[Math.floor(Math.random() * creativeStrategies.length)];
    const randomEffect = selectedStrategy.effects[Math.floor(Math.random() * selectedStrategy.effects.length)];
    
    // Функция для усиления насыщенности
    const boostSaturation = (hexColor, boostPercent) => {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const max = Math.max(r, g, b);
        if (max === 0) return hexColor;
        
        const factor = (max + boostPercent) / max;
        const newR = Math.min(255, Math.round(r * factor));
        const newG = Math.min(255, Math.round(g * factor));
        const newB = Math.min(255, Math.round(b * factor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    };
    
    // Функция для создания креативного цвета (ТОЛЬКО ДЛЯ ДОПОЛНИТЕЛЬНЫХ ЦВЕТОВ)
    const makeCreativeColor = (color, effectName, strategy) => {
        let creativeColor = color.color;
        
        // Усиливаем насыщенность
        creativeColor = boostSaturation(creativeColor, strategy.saturationBoost);
        
        // Для неонового эффекта добавляем дополнительное усиление
        if (effectName.includes("неоновый") || effectName.includes("электрический")) {
            const hex = creativeColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            const maxChannel = Math.max(r, g, b);
            let newR = r, newG = g, newB = b;
            
            if (maxChannel === r) {
                newR = Math.min(255, r + 40);
                newG = Math.max(0, g - 10);
                newB = Math.max(0, b - 10);
            } else if (maxChannel === g) {
                newR = Math.max(0, r - 10);
                newG = Math.min(255, g + 40);
                newB = Math.max(0, b - 10);
            } else {
                newR = Math.max(0, r - 10);
                newG = Math.max(0, g - 10);
                newB = Math.min(255, b + 40);
            }
            
            creativeColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        }
        
        return {
            ...color,
            color: creativeColor,
            text: `${color.text} (${effectName})`,
            id: color.id + `_creative_${effectName}`,
            style: "креативный",
            tone: "яркий"
        };
    };
    
    let selectedColors = [];
    
    // Используем стратегию для подбора гармоничных ярких цветов
    for (let targetHue of selectedStrategy.hues.slice(1)) {
        if (selectedColors.length >= 2) break;
        
        const closestColor = colors
            .filter(color => {
                if (color.id === baseColor.id || selectedColors.includes(color)) return false;
                if (color.style === "нейтральный") return false;
                
                const colorHue = color.hue || calculateHue(color.color);
                const hueDiff = Math.min(
                    Math.abs(colorHue - targetHue),
                    360 - Math.abs(colorHue - targetHue)
                );
                
                return hueDiff <= 30;
            })
            .reduce((closest, current) => {
                if (!closest) return current;
                
                const currentHue = current.hue || calculateHue(current.color);
                const closestHue = closest.hue || calculateHue(closest.color);
                
                const currentDiff = Math.min(
                    Math.abs(currentHue - targetHue),
                    360 - Math.abs(currentHue - targetHue)
                );
                const closestDiff = Math.min(
                    Math.abs(closestHue - targetHue),
                    360 - Math.abs(closestHue - targetHue)
                );
                
                return currentDiff < closestDiff ? current : closest;
            }, null);
        
        if (closestColor) {
            let creativeColor = makeCreativeColor(closestColor, randomEffect, selectedStrategy);
            selectedColors.push(creativeColor);
        }
    }
    
    // ⚠️ ИСПРАВЛЕНИЕ: НЕ ИЗМЕНЯЕМ БАЗОВЫЙ ЦВЕТ!
    // Убираем эту строку:
    // let creativeBase = makeCreativeColor(baseColor, "базовый", selectedStrategy);
    
    console.log("УЛУЧШЕННАЯ КРЕАТИВНАЯ СХЕМА:");
    console.log("Стратегия:", selectedStrategy.name);
    console.log("Эффект:", randomEffect);
    console.log("✅ Основной цвет сохранен без изменений");
    
    // ВОЗВРАЩАЕМ БАЗОВЫЙ ЦВЕТ БЕЗ ИЗМЕНЕНИЙ + 2 креативных цвета
    return [baseColor, ...selectedColors.slice(0, 2)];
},
    
    

  // СВЕЖАЯ СХЕМА - УЛУЧШЕННАЯ ВЕРСИЯ
fresh: (i, colors = colors) => {
    const baseColor = colors[i];
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Холодные гармоничные оттенки для свежести
    const freshHarmonies = [
        // Бирюзовая гамма
        {
            hues: [170, 175, 180, 185, 190],
            name: "бирюзовая",
            effects: ["аква", "ледяной", "морской"]
        },
        // Ледяная синева
        {
            hues: [195, 200, 205, 210, 215],
            name: "ледяная", 
            effects: ["кристальный", "арктический", "серебристый"]
        },
        // Холодная сирень
        {
            hues: [265, 270, 275, 280, 285],
            name: "сиреневая",
            effects: ["лавандовый", "фиалковый", "орхидейный"]
        },
        // Мятная свежесть
        {
            hues: [150, 155, 160, 165, 170],
            name: "мятная",
            effects: ["мятный", "эвкалиптовый", "освежающий"]
        }
    ];
    
    // Выбираем случайную холодную гармонию
    const selectedHarmony = freshHarmonies[Math.floor(Math.random() * freshHarmonies.length)];
    const randomEffect = selectedHarmony.effects[Math.floor(Math.random() * selectedHarmony.effects.length)];
    
    // Функция для создания освежающего цвета
    const makeFreshColor = (color, effectName) => {
        let freshColor = color.color;
        
        // Осветляем холодные цвета
        freshColor = shadeColor(freshColor, 25 + Math.random() * 20);
        
        // Добавляем холодный подтон
        const hex = freshColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Усиливаем холодные каналы (синий, зеленый)
        const newR = Math.max(0, r - 10);
        const newG = Math.min(255, g + 15);
        const newB = Math.min(255, b + 20);
        
        const enhancedColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: enhancedColor,
            text: `${color.text} (${effectName})`,
            id: color.id + `_${effectName}`,
            tone: "холодный",
            style: "свежий"
        };
    };
    
    // Функция для создания аква-эффекта
    const addAquaEffect = (color) => {
        const hex = color.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Аква-эффект - усиливаем бирюзовые тона
        const newR = Math.max(0, r - 15);
        const newG = Math.min(255, g + 25);
        const newB = Math.min(255, b + 30);
        
        const aquaColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: aquaColor,
            text: color.text.replace(/\([^)]*\)/, '') + " (аква)",
            id: color.id + "_aqua"
        };
    };
    
    let selectedColors = [];
    
    // 1. Сначала ищем цвета стиля "свежий"
    const freshStyleColors = colors.filter(color => 
        color.style === "свежий" && 
        color.id !== baseColor.id
    );
    
    // 2. Если есть свежие цвета - используем их с гармонией
    if (freshStyleColors.length > 0) {
        const harmoniousFresh = freshStyleColors
            .filter(color => {
                const colorHue = color.hue || calculateHue(color.color);
                // Проверяем гармонию с выбранной гаммой
                return selectedHarmony.hues.some(targetHue => {
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    return hueDiff <= 20;
                });
            })
            .slice(0, 2);
        
        for (let freshColor of harmoniousFresh) {
            if (selectedColors.length >= 2) break;
            let enhancedColor = makeFreshColor(freshColor, randomEffect);
            
            // Для аква-гармонии добавляем дополнительный эффект
            if (selectedHarmony.name === "бирюзовая" && Math.random() > 0.5) {
                enhancedColor = addAquaEffect(enhancedColor);
            }
            
            selectedColors.push(enhancedColor);
        }
    }
    
    // 3. Если свежих цветов мало, создаем из гармоничных холодных
    if (selectedColors.length < 2) {
        for (let targetHue of selectedHarmony.hues) {
            if (selectedColors.length >= 2) break;
            
            const closestColor = colors
                .filter(color => {
                    if (color.id === baseColor.id || selectedColors.includes(color)) return false;
                    if (color.tone !== "холодный") return false;
                    
                    const colorHue = color.hue || calculateHue(color.color);
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    
                    return hueDiff <= 25;
                })
                .reduce((closest, current) => {
                    if (!closest) return current;
                    
                    const currentHue = current.hue || calculateHue(current.color);
                    const closestHue = closest.hue || calculateHue(closest.color);
                    
                    const currentDiff = Math.min(
                        Math.abs(currentHue - targetHue),
                        360 - Math.abs(currentHue - targetHue)
                    );
                    const closestDiff = Math.min(
                        Math.abs(closestHue - targetHue),
                        360 - Math.abs(closestHue - targetHue)
                    );
                    
                    return currentDiff < closestDiff ? current : closest;
                }, null);
            
            if (closestColor) {
                let freshColor = makeFreshColor(closestColor, randomEffect);
                selectedColors.push(freshColor);
            }
        }
    }
    
    // 4. Обрабатываем базовый цвет
    let freshBase = baseColor;
    if (baseColor.tone !== "холодный") {
        // Если базовый цвет не холодный, охлаждаем его
        freshBase = makeFreshColor(baseColor, "освеженный");
    }
    
    console.log("УЛУЧШЕННАЯ СВЕЖАЯ СХЕМА:");
    console.log("Гармония:", selectedHarmony.name);
    console.log("Эффект:", randomEffect);
    console.log("Базовый:", baseColor.text);
    console.log("Созданы:", selectedColors.map(c => c.text));
    
    return [freshBase, ...selectedColors.slice(0, 2)];
},

  // РОМАНТИЧЕСКАЯ СХЕМА - СТИЛЬ + ГАРМОНИЯ + ЭФФЕКТЫ
romantic: (i, colors = colors) => {
    const baseColor = colors[i];
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Узкая аналогичная гармония для максимальной нежности
    const romanticHues = [
        baseHue,                      // Базовый
        (baseHue + 8) % 360,         // Очень близкий аналогичный
        (baseHue - 8 + 360) % 360,   // Очень близкий аналогичный
        (baseHue + 12) % 360,        // Близкий аналогичный
        (baseHue - 12 + 360) % 360   // Близкий аналогичный
    ];
    
    // Функция для создания супер-нежного пастельного цвета
    const makeUltraSoft = (color, lightenPercent = 45, desaturatePercent = 25) => {
        // Сначала осветляем
        let softColor = shadeColor(color.color, lightenPercent);
        
        // Затем уменьшаем насыщенность для большей нежности
        const hex = softColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Усредняем цвет для уменьшения насыщенности
        const avg = (r + g + b) / 3;
        const newR = Math.round(r + (avg - r) * desaturatePercent / 100);
        const newG = Math.round(g + (avg - g) * desaturatePercent / 100);
        const newB = Math.round(b + (avg - b) * desaturatePercent / 100);
        
        const ultraSoftColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: ultraSoftColor,
            text: `${color.text} (нежнейший)`,
            id: color.id + "_ultra_soft",
            style: "романтический",
            tone: "нежный"
        };
    };
    
    // Функция для добавления перламутрового эффекта
    const addPearlEffect = (color) => {
        const hex = color.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Добавляем перламутровый оттенок (увеличиваем синий/розовый каналы)
        const newR = Math.min(255, r + 8);
        const newG = Math.min(255, g + 5);
        const newB = Math.min(255, b + 12);
        
        const pearlColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: pearlColor,
            text: `${color.text.replace(' (нежнейший)', '')} (перламутровый)`,
            id: color.id + "_pearl"
        };
    };
    
    // Функция для добавления пудрового эффекта
    const addPowderEffect = (color) => {
        const hex = color.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Создаем пудровый эффект - добавляем белизну
        const newR = Math.min(255, r + 20);
        const newG = Math.min(255, g + 18);
        const newB = Math.min(255, b + 22);
        
        const powderColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: powderColor,
            text: `${color.text.replace(' (нежнейший)', '')} (пудровый)`,
            id: color.id + "_powder"
        };
    };
    
    // 1. Сначала ищем цвета стиля "романтический"
    const romanticStyleColors = colors.filter(color => 
        color.style === "романтический" && 
        color.id !== baseColor.id
    );
    
    let selectedColors = [];
    
    // 2. Если есть романтические цвета в базе - используем их с эффектами
    if (romanticStyleColors.length > 0) {
        // Сортируем по гармонии с базовым цветом
        const harmoniousRomantic = romanticStyleColors
            .filter(color => {
                const colorHue = color.hue || calculateHue(color.color);
                const hueDiff = Math.min(
                    Math.abs(colorHue - baseHue),
                    360 - Math.abs(colorHue - baseHue)
                );
                return hueDiff <= 30; // Только гармоничные
            })
            .sort((a, b) => {
                const diffA = Math.min(Math.abs(a.hue - baseHue), 360 - Math.abs(a.hue - baseHue));
                const diffB = Math.min(Math.abs(b.hue - baseHue), 360 - Math.abs(b.hue - baseHue));
                return diffA - diffB;
            });
        
        // Применяем эффекты к найденным романтическим цветам
        for (let romanticColor of harmoniousRomantic) {
            if (selectedColors.length >= 2) break;
            
            let enhancedColor = makeUltraSoft(romanticColor, 40 + Math.random() * 10);
            
            // Добавляем случайный эффект для разнообразия
            const effectType = Math.random();
            if (effectType > 0.6) {
                enhancedColor = addPearlEffect(enhancedColor);
            } else if (effectType > 0.3) {
                enhancedColor = addPowderEffect(enhancedColor);
            }
            
            selectedColors.push(enhancedColor);
        }
    }
    
    // 3. Если романтических цветов недостаточно, дополняем гармоничными
    if (selectedColors.length < 2) {
        for (let targetHue of romanticHues.slice(1)) {
            if (selectedColors.length >= 2) break;
            
            const closestColor = colors
                .filter(color => {
                    if (color.id === baseColor.id || selectedColors.includes(color)) return false;
                    if (color.style === "яркий" || color.style === "контрастный") return false;
                    
                    const colorHue = color.hue || calculateHue(color.color);
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    
                    return hueDiff <= 15; // Только очень близкие
                })
                .reduce((closest, current) => {
                    if (!closest) return current;
                    
                    const currentHue = current.hue || calculateHue(current.color);
                    const closestHue = closest.hue || calculateHue(closest.color);
                    
                    const currentDiff = Math.min(
                        Math.abs(currentHue - targetHue),
                        360 - Math.abs(currentHue - targetHue)
                    );
                    const closestDiff = Math.min(
                        Math.abs(closestHue - targetHue),
                        360 - Math.abs(closestHue - targetHue)
                    );
                    
                    return currentDiff < closestDiff ? current : closest;
                }, null);
            
            if (closestColor) {
                let ultraSoftColor = makeUltraSoft(closestColor, 50);
                
                // Для созданных цветов чаще добавляем эффекты
                if (Math.random() > 0.4) {
                    ultraSoftColor = addPearlEffect(ultraSoftColor);
                } else if (Math.random() > 0.2) {
                    ultraSoftColor = addPowderEffect(ultraSoftColor);
                }
                
                selectedColors.push(ultraSoftColor);
            }
        }
    }
    
    // 4. Создаем ультра-нежную версию базового цвета
    const ultraSoftBase = makeUltraSoft(baseColor, 35);
    
    console.log("РОМАНТИЧЕСКАЯ СХЕМА ПРЕМИУМ:");
    console.log("Базовый:", baseColor.text);
    console.log("Найдено романтических цветов:", romanticStyleColors.length);
    console.log("Созданы:", selectedColors.map(c => c.text));
    
    return [ultraSoftBase, ...selectedColors.slice(0, 2)];
},

  // ВЕЧЕРНЯЯ СХЕМА - ПРЕМИУМ ВЕРСИЯ
evening: (i, colors = colors) => {
    const baseColor = colors[i];
    const baseHue = baseColor.hue || calculateHue(baseColor.color);
    
    // Вечерние гармонии с разным настроением
    const eveningDramas = [
        // 1. Бархатная драма
        {
            name: "бархатная_драма",
            hues: [
                baseHue,
                (baseHue + 30) % 360,
                (baseHue + 330) % 360
            ],
            effects: ["бархатный", "глубокий", "роскошный"],
            darken: 50,
            accent: "золотой"
        },
        // 2. Сапфировый вечер
        {
            name: "сапфировый_вечер",
            hues: [
                baseHue,
                (baseHue + 200) % 360,
                (baseHue + 280) % 360
            ],
            effects: ["сапфировый", "кристальный", "королевский"],
            darken: 45,
            accent: "серебряный"
        },
        // 3. Рубиновая ночь
        {
            name: "рубиновая_ночь",
            hues: [
                baseHue,
                (baseHue + 150) % 360,
                (baseHue + 210) % 360
            ],
            effects: ["рубиновый", "страстный", "загадочный"],
            darken: 55,
            accent: "бронзовый"
        },
        // 4. Аметистовые сумерки
        {
            name: "аметистовые_сумерки",
            hues: [
                baseHue,
                (baseHue + 270) % 360,
                (baseHue + 300) % 360
            ],
            effects: ["аметистовый", "мистический", "волшебный"],
            darken: 60,
            accent: "перламутровый"
        }
    ];
    
    // Выбираем случайную вечернюю драму
    const selectedDrama = eveningDramas[Math.floor(Math.random() * eveningDramas.length)];
    const randomEffect = selectedDrama.effects[Math.floor(Math.random() * selectedDrama.effects.length)];
    
    // Функция для создания вечернего цвета
    const makeEveningColor = (color, effectName, drama) => {
        let eveningColor = color.color;
        
        // Сильное затемнение
        eveningColor = shadeColor(eveningColor, -drama.darken);
        
        // Добавляем металлический оттенок
        const hex = eveningColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        let newR = r, newG = g, newB = b;
        
        // В зависимости от акцента добавляем металлический отлив
        switch(drama.accent) {
            case "золотой":
                newR = Math.min(255, r + 15);
                newG = Math.min(255, g + 10);
                break;
            case "серебряный":
                newR = Math.min(255, r + 8);
                newG = Math.min(255, g + 8);
                newB = Math.min(255, b + 12);
                break;
            case "бронзовый":
                newR = Math.min(255, r + 12);
                newG = Math.min(255, g + 8);
                newB = Math.max(0, b - 5);
                break;
            case "перламутровый":
                newR = Math.min(255, r + 10);
                newG = Math.min(255, g + 10);
                newB = Math.min(255, b + 15);
                break;
        }
        
        const dramaticColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: dramaticColor,
            text: `${color.text} (${effectName})`,
            id: color.id + `_evening_${effectName}`,
            style: "вечерний",
            tone: "глубокий"
        };
    };
    
    // Функция для создания акцентного черного
    const createAccentBlack = (accentType) => {
        let blackColor = "#000000";
        
        // Добавляем оттенок в черный в зависимости от акцента
        switch(accentType) {
            case "золотой":
                blackColor = "#1A1A00"; // Теплый черный
                break;
            case "серебряный":
                blackColor = "#1A1A1F"; // Холодный черный
                break;
            case "бронзовый":
                blackColor = "#1F1A00"; // Бронзовый черный
                break;
            case "перламутровый":
                blackColor = "#1A001F"; // Фиолетовый черный
                break;
        }
        
        return {
            color: blackColor,
            text: `Глубокий черный (${accentType} отлив)`,
            tone: "глубокий",
            style: "вечерний",
            id: `accent_black_${accentType}`
        };
    };
    
    let selectedColors = [];
    
    // 1. Сначала ищем вечерние цвета
    const eveningStyleColors = colors.filter(color => 
        color.style === "вечерний" && 
        color.id !== baseColor.id
    );
    
    // 2. Используем драму для подбора гармоничных вечерних цветов
    if (eveningStyleColors.length > 0) {
        const harmoniousEvening = eveningStyleColors
            .filter(color => {
                const colorHue = color.hue || calculateHue(color.color);
                return selectedDrama.hues.some(targetHue => {
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    return hueDiff <= 40;
                });
            })
            .slice(0, 2);
        
        for (let eveningColor of harmoniousEvening) {
            if (selectedColors.length >= 2) break;
            let dramaticColor = makeEveningColor(eveningColor, randomEffect, selectedDrama);
            selectedColors.push(dramaticColor);
        }
    }
    
    // 3. Если вечерних цветов мало, создаем из гармоничных
    if (selectedColors.length < 2) {
        for (let targetHue of selectedDrama.hues.slice(1)) {
            if (selectedColors.length >= 2) break;
            
            const closestColor = colors
                .filter(color => {
                    if (color.id === baseColor.id || selectedColors.includes(color)) return false;
                    if (color.style === "свежий" || color.style === "повседневный") return false;
                    
                    const colorHue = color.hue || calculateHue(color.color);
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    
                    return hueDiff <= 35;
                })
                .reduce((closest, current) => {
                    if (!closest) return current;
                    
                    const currentHue = current.hue || calculateHue(current.color);
                    const closestHue = closest.hue || calculateHue(closest.color);
                    
                    const currentDiff = Math.min(
                        Math.abs(currentHue - targetHue),
                        360 - Math.abs(currentHue - targetHue)
                    );
                    const closestDiff = Math.min(
                        Math.abs(closestHue - targetHue),
                        360 - Math.abs(closestHue - targetHue)
                    );
                    
                    return currentDiff < closestDiff ? current : closest;
                }, null);
            
            if (closestColor) {
                let dramaticColor = makeEveningColor(closestColor, randomEffect, selectedDrama);
                selectedColors.push(dramaticColor);
            }
        }
    }
    
    // 4. Добавляем акцентный черный для завершенности
    if (selectedColors.length < 2) {
        const accentBlack = createAccentBlack(selectedDrama.accent);
        selectedColors.push(accentBlack);
    }
    
    // 5. Обрабатываем базовый цвет
    let eveningBase = makeEveningColor(baseColor, "драматичный", selectedDrama);
    
    console.log("ПРЕМИУМ ВЕЧЕРНЯЯ СХЕМА:");
    console.log("Драма:", selectedDrama.name);
    console.log("Эффект:", randomEffect);
    console.log("Акцент:", selectedDrama.accent);
    console.log("Базовый:", baseColor.text);
    console.log("Созданы:", selectedColors.map(c => c.text));
    
    return [eveningBase, ...selectedColors.slice(0, 2)];
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
    makeup: "Сверхглубокий смоки-айс с неоновыми всполохами, угольные стрелки.Матовые помады глубоких винных оттенков с неоновым свечением. Скульптурирующие контуры, минимальные румяна.Графичные насыщенные брови",
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


// ПОЛНАЯ ИСПРАВЛЕННАЯ ФУНКЦИЯ АККОРДЕОНА
// Простая функция аккордеона
function toggleAccordion(sectionId) {
    const content = document.getElementById(sectionId);
    const header = content.previousElementSibling;
    
    // Просто переключаем видимость
    if (content.style.display === 'none') {
        content.style.display = 'block';
        header.classList.add('active');
    } else {
        content.style.display = 'none';
        header.classList.remove('active');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Закрываем расширенные схемы по умолчанию
    const advancedSection = document.getElementById('advancedSchemes');
    const utilitySection = document.getElementById('utilitySchemes');
    
    if (advancedSection) {
        advancedSection.style.display = 'none';
        advancedSection.previousElementSibling.classList.remove('active');
    }
    
    if (utilitySection) {
        utilitySection.style.display = 'none';
        utilitySection.previousElementSibling.classList.remove('active');
    }
});


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
        width = 120, 
        height = 100, 
        showText = true, 
        showDetails = true,
        interactive = true,
        isMainColor = false
    } = options;
    
    // Основной контейнер для карточки и текста
    const cardContainer = document.createElement("div");
    cardContainer.style.display = 'flex';
    cardContainer.style.flexDirection = 'column';
    cardContainer.style.alignItems = 'center';
    cardContainer.style.margin = '5px'; // Уменьшили отступ
    cardContainer.style.width = width + 'px';
    cardContainer.style.flexShrink = '0'; // Чтобы не сжимались
    
    // Сама цветовая карточка
    const card = document.createElement("div");
    card.style.width = '100%';
    card.style.height = height + 'px';
    card.style.background = colorData.color;
    card.style.borderRadius = '8px';
    card.style.border = isMainColor ? '3px solid #fff' : '2px solid #fff';
    card.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)';
    card.style.cursor = interactive ? 'pointer' : 'default';
    card.style.transition = 'all 0.3s ease';
    card.style.flexShrink = '0';

    // Контейнер для текста ПОД карточкой
    const textContainer = document.createElement('div');
    textContainer.style.marginTop = '8px';
    textContainer.style.textAlign = 'center';
    textContainer.style.width = '100%';
    textContainer.style.padding = '0 2px';

    if (showText) {
        const textElement = document.createElement('div');
        textElement.style.color = '#2d3748';
        textElement.style.fontWeight = 'bold';
        textElement.style.fontSize = '12px';
        textElement.style.textAlign = 'center';
        textElement.style.lineHeight = '1.2';
        textElement.style.marginBottom = '3px';
        textElement.textContent = colorData.text;
        
        textContainer.appendChild(textElement);
        
        if (showDetails) {
            const detailsElement = document.createElement('div');
            detailsElement.style.color = '#718096';
            detailsElement.style.fontSize = '10px';
            detailsElement.style.opacity = '0.9';
            detailsElement.style.textAlign = 'center';
            detailsElement.style.fontWeight = '600';
            detailsElement.style.lineHeight = '1.1';
            detailsElement.textContent = `${colorData.season} • ${colorData.tone}`;
            textContainer.appendChild(detailsElement);
        }
    }
    
    // Собираем все вместе
    cardContainer.appendChild(card);
    cardContainer.appendChild(textContainer);
    
    return cardContainer;
}

// === ОТОБРАЖЕНИЕ СХЕМ С ГОРИЗОНТАЛЬНЫМ РАСПОЛОЖЕНИЕМ ===
function showScheme(type) {
    const result = document.getElementById("schemeGuide");
    if (!result || lastChosenIndex === null || colors.length === 0) {
        result.innerHTML = "<div style='color:#666; text-align:center; padding:20px; background:#f8f9fa; border-radius:8px;'>🎨 Выберите цвет на круге для просмотра схем</div>";
        return;
    }

    const generator = schemeGenerators[type];
    const scheme = schemeInfo[type];

    if (!generator || !scheme) {
        result.innerHTML = "<div style='color:red; padding:15px; text-align:center; background:#ffe6e6; border-radius:8px;'>❌ Схема не найдена</div>";
        return;
    }

    const schemeColors = generator(lastChosenIndex, colors);

    // Контейнер для карточек - ГОРИЗОНТАЛЬНОЕ РАСПОЛОЖЕНИЕ
    const cardsContainer = document.createElement("div");
    cardsContainer.style.display = 'flex';
    cardsContainer.style.flexWrap = 'nowrap'; // Не переносить на новую строку
    cardsContainer.style.gap = '8px'; // Минимальные отступы
    cardsContainer.style.justifyContent = 'flex-start'; // Выравнивание по левому краю
    cardsContainer.style.alignItems = 'flex-start';
    cardsContainer.style.marginBottom = '20px';
    cardsContainer.style.padding = '15px';
    cardsContainer.style.background = '#f8f9fa';
    cardsContainer.style.borderRadius = '8px';
    cardsContainer.style.border = '1px solid #e2e8f0';
    cardsContainer.style.overflowX = 'auto'; // Горизонтальная прокрутка если не помещаются
    cardsContainer.style.overflowY = 'hidden';

    // Создаем карточки для каждого цвета схемы
schemeColors.forEach((colorData, index) => {
    const isMainColor = index === 0;
    const card = createColorCard(colorData, { 
        width: isMainColor ? 110 : 100, // Уменьшили ширину
        height: isMainColor ? 90 : 80,   // Уменьшили высоту
        showText: true,
        showDetails: true,
        interactive: false,
        isMainColor: isMainColor
    });
    
    cardsContainer.appendChild(card);
});

// Собираем HTML схемы с БЕЛЫМ ТЕКСТОМ
result.innerHTML = `
    <div class="scheme-card" style="color: white !important;">
        <div class="scheme-header">
            <h3 class="scheme-title" style="color: white !important;">${scheme.name}</h3>
            <div class="scheme-description" style="color: white !important;">${scheme.description}</div>
        </div>
        
        <div class="scheme-content">
            <div class="palette-section">
                <h4 class="section-title" style="color: white !important;">🎨 Цветовая палитра схемы</h4>
            </div>
        </div>
    </div>
`;
    result.appendChild(cardsContainer);
// Добавляем детали схемы
const detailsHTML = `
    <div class="scheme-grid">
        <div class="detail-card makeup">
            <div class="detail-title">💄 МАКИЯЖ</div>
            <div class="detail-content">${scheme.makeup}</div>
        </div>
        
        <div class="detail-card clothing">
            <div class="detail-title">👗 СТИЛЬ ОДЕЖДЫ</div>
            <div class="detail-content">${scheme.clothingStyle}</div>
        </div>
        
        <div class="detail-card accessories">
            <div class="detail-title">🎀 АКСЕССУАРЫ</div>
            <div class="detail-content">${scheme.tips?.accessories || "Классические аксессуары"}</div>
        </div>
        
        <div class="detail-card hair">
            <div class="detail-title">💇 ВОЛОСЫ</div>
            <div class="detail-content">${scheme.hairTips || "Универсальные рекомендации по окрашиванию"}</div>
        </div>
    </div>
    
    <div class="scheme-meta">
        <div class="meta-item">
            <div class="meta-label">🌸 СЕЗОН</div>
            <div class="meta-value">${scheme.season}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">🧠 ПСИХОЛОГИЯ</div>
            <div class="meta-value">${scheme.psychology}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">🎉 СЛУЧАЙ</div>
            <div class="meta-value">${scheme.occasion}</div>
        </div>
    </div>
    
    ${scheme.paletteRule ? `
        <div class="palette-rule">
            <div class="rule-label">🎨 ПРАВИЛО ПАЛИТРЫ</div>
            <div class="rule-content">${scheme.paletteRule}</div>
        </div>
    ` : ''}
`;

    result.insertAdjacentHTML('beforeend', detailsHTML);
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
