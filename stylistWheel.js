
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

// === ПОЛНЫЙ ПЕРЕРАБОТАННЫЙ МАССИВ С ПРАВИЛЬНЫМ РАСПРЕДЕЛЕНИЕМ ===

let colors = [];

// === 0°-29°  КРАСНЫЙ  ===
colors.push(
  {id:'rT', color:'#ffb3b3', text:'Светло-красный',     tone:'тёплый', style:'нежный',     season:'весна', colortype:'весна', textureHint:'Шифон',      makeupHint:'Румяна розовые',      makeupSet:{lips:'Розовая', eyes:'Серые', blush:'Розовые', eyeliner:'Серая', style:'Нежный'}, hue:2},
  {id:'rP', color:'#ff6666', text:'Кораллово-красный',  tone:'тёплый', style:'романтичный',season:'весна', colortype:'весна', textureHint:'Шёлк',       makeupHint:'Румяна коралловые',   makeupSet:{lips:'Коралловая', eyes:'Золотистые', blush:'Коралловые', eyeliner:'Коричневая', style:'Романтичный'}, hue:5},
  {id:'rC', color:'#ff0000', text:'Красный чистый',     tone:'тёплый', style:'контрастный',season:'зима',  colortype:'зима',  textureHint:'Атлас',      makeupHint:'Помада красная',      makeupSet:{lips:'Красная', eyes:'Чёрные', blush:'Охра', eyeliner:'Чёрная', style:'Контрастный'}, hue:0},
  {id:'rB', color:'#cc3333', text:'Красный кирпичный',  tone:'тёплый', style:'осенний',    season:'осень', colortype:'осень', textureHint:'Замша',      makeupHint:'Помада терракотовая',makeupSet:{lips:'Терракотовая', eyes:'Коричневые', blush:'Тёплые', eyeliner:'Коричневая', style:'Осенний'}, hue:8},
  {id:'rS', color:'#8b0000', text:'Тёмно-красный',      tone:'тёплый', style:'вечерний',   season:'зима',  colortype:'зима',  textureHint:'Бархат',     makeupHint:'Помада бордовая',     makeupSet:{lips:'Бордовая', eyes:'Тёмно-серые', blush:'Охра', eyeliner:'Чёрная', style:'Вечерний'}, hue:12}
);

// === 30°-59°  ОРАНЖЕВЫЙ  ===
colors.push(
  {id:'oT', color:'#ffd1b3', text:'Светло-оранжевый',   tone:'тёплый', style:'мягкий',     season:'весна', colortype:'весна', textureHint:'Лён',        makeupHint:'Румяна персиковые',   makeupSet:{lips:'Персиковая', eyes:'Золотистые', blush:'Персиковые', eyeliner:'Коричневая', style:'Мягкий'}, hue:32},
  {id:'oP', color:'#ffb366', text:'Персиковый',         tone:'тёплый', style:'нежный',     season:'весна', colortype:'весна', textureHint:'Хлопок',     makeupHint:'Тени персиковые',     makeupSet:{lips:'Нюдовая', eyes:'Бежевые', blush:'Персиковые', eyeliner:'Коричневая', style:'Нежный'}, hue:35},
  {id:'oC', color:'#ff7700', text:'Оранжевый чистый',   tone:'тёплый', style:'энергичный', season:'осень', colortype:'осень', textureHint:'Хлопок',     makeupHint:'Румяна оранжевые',    makeupSet:{lips:'Оранжевая', eyes:'Коричневые', blush:'Оранжевые', eyeliner:'Коричневая', style:'Энергичный'}, hue:30},
  {id:'oR', color:'#e65c00', text:'Рыжий',              tone:'тёплый', style:'осенний',    season:'осень', colortype:'осень', textureHint:'Твид',       makeupHint:'Тени медные',         makeupSet:{lips:'Коралловая', eyes:'Зелёные', blush:'Тёплые', eyeliner:'Коричневая', style:'Осенний'}, hue:38},
  {id:'oS', color:'#cc5500', text:'Тёмно-оранжевый',    tone:'тёплый', style:'осенний',    season:'осень', colortype:'осень', textureHint:'Замша',      makeupHint:'Тени тёплые',         makeupSet:{lips:'Терракотовая', eyes:'Коричневые', blush:'Тёплые', eyeliner:'Коричневая', style:'Осенний'}, hue:42}
);

// === 60°-89°  ЖЁЛТЫЙ  ===
colors.push(
  {id:'yT', color:'#fff2b3', text:'Светло-жёлтый',      tone:'тёплый', style:'солнечный',  season:'весна', colortype:'весна', textureHint:'Хлопок',     makeupHint:'Хайлайтер',           makeupSet:{lips:'Нюдовая', eyes:'Золотистые', blush:'Светлые', eyeliner:'Коричневая', style:'Солнечный'}, hue:62},
  {id:'yP', color:'#ffe066', text:'Лимонно-кремовый',   tone:'тёплый', style:'свежий',     season:'весна', colortype:'весна', textureHint:'Шёлк',       makeupHint:'Хайлайтер жёлтый',    makeupSet:{lips:'Нюдовая', eyes:'Салатовые', blush:'Светлые', eyeliner:'Коричневая', style:'Свежий'}, hue:65},
  {id:'yC', color:'#ffdf00', text:'Жёлтый чистый',      tone:'тёплый', style:'яркий',      season:'весна', colortype:'весна', textureHint:'Лён',        makeupHint:'Хайлайтер',           makeupSet:{lips:'Нюдовая', eyes:'Жёлтые', blush:'Светлые', eyeliner:'Коричневая', style:'Яркий'}, hue:60},
  {id:'yG', color:'#e6c200', text:'Золотистый',         tone:'тёплый', style:'благородный',season:'осень', colortype:'осень', textureHint:'Парча',      makeupHint:'Хайлайтер золотой',   makeupSet:{lips:'Коралловая', eyes:'Золотистые', blush:'Тёплые', eyeliner:'Коричневая', style:'Благородный'}, hue:68},
  {id:'yS', color:'#ccaa00', text:'Горчичный',          tone:'тёплый', style:'осенний',    season:'осень', colortype:'осень', textureHint:'Шерсть',     makeupHint:'Тени горчичные',      makeupSet:{lips:'Терракотовая', eyes:'Коричневые', blush:'Тёплые', eyeliner:'Коричневая', style:'Осенний'}, hue:72}
);

// === 90°-119°  ЖЕЛТО-ЗЕЛЁНЫЙ  ===
colors.push(
  {id:'ygT', color:'#f5ffb3', text:'Светло-лимонный',    tone:'тёплый', style:'свежий',     season:'весна', colortype:'весна', textureHint:'Лён',        makeupHint:'Тени светлые',        makeupSet:{lips:'Нюдовая', eyes:'Салатовые', blush:'Светлые', eyeliner:'Коричневая', style:'Свежий'}, hue:92},
  {id:'ygP', color:'#e6ff66', text:'Лаймовый',           tone:'тёплый', style:'энергичный', season:'весна', colortype:'весна', textureHint:'Хлопок',     makeupHint:'Тени лаймовые',       makeupSet:{lips:'Нюдовая', eyes:'Золотистые', blush:'Светлые', eyeliner:'Коричневая', style:'Энергичный'}, hue:95},
  {id:'ygC', color:'#adff2f', text:'Желто-зелёный',      tone:'тёплый', style:'весенний',   season:'весна', colortype:'весна', textureHint:'Хлопок',     makeupHint:'Тени салатовые',      makeupSet:{lips:'Нюдовая', eyes:'Жёлто-зелёные', blush:'Светлые', eyeliner:'Коричневая', style:'Весенний'}, hue:90},
  {id:'ygA', color:'#9acd32', text:'Зелёное яблоко',     tone:'тёплый', style:'молодёжный', season:'весна', colortype:'весна', textureHint:'Джинса',     makeupHint:'Тени ярко-зелёные',   makeupSet:{lips:'Нюдовая', eyes:'Зелёные', blush:'Светлые', eyeliner:'Коричневая', style:'Молодёжный'}, hue:98},
  {id:'ygS', color:'#7ba428', text:'Тёмно-оливковый',    tone:'тёплый', style:'натуральный',season:'осень', colortype:'осень', textureHint:'Замша',      makeupHint:'Тени оливковые',      makeupSet:{lips:'Нюдовая', eyes:'Оливковые', blush:'Тёплые', eyeliner:'Коричневая', style:'Натуральный'}, hue:102}
);

// === 120°-149°  ЗЕЛЁНЫЙ  ===
colors.push(
  {id:'gT', color:'#ccffcc', text:'Мятно-зелёный',      tone:'свежий', style:'свежий',     season:'весна', colortype:'весна', textureHint:'Хлопок',     makeupHint:'Тени мятные',         makeupSet:{lips:'Нюдовая', eyes:'Голубые', blush:'Светлые', eyeliner:'Серая', style:'Свежий'}, hue:122},
  {id:'gP', color:'#66ff66', text:'Светло-зелёный',     tone:'свежий', style:'весенний',   season:'весна', colortype:'весна', textureHint:'Лён',        makeupHint:'Тени салатовые',      makeupSet:{lips:'Нюдовая', eyes:'Серые', blush:'Светлые', eyeliner:'Серая', style:'Весенний'}, hue:125},
  {id:'gC', color:'#00ff00', text:'Зелёный чистый',     tone:'свежий', style:'креативный', season:'весна', colortype:'весна', textureHint:'Хлопок',     makeupHint:'Тени ярко-зелёные',   makeupSet:{lips:'Нюдовая', eyes:'Ярко-зелёные', blush:'Светлые', eyeliner:'Серая', style:'Креативный'}, hue:120},
  {id:'gF', color:'#32cd32', text:'Зелёный лайм',       tone:'свежий', style:'яркий',      season:'весна', colortype:'весна', textureHint:'Джинса',     makeupHint:'Тени зелёные',        makeupSet:{lips:'Нюдовая', eyes:'Коричневые', blush:'Светлые', eyeliner:'Серая', style:'Яркий'}, hue:128},
  {id:'gS', color:'#008000', text:'Тёмно-зелёный',      tone:'свежий', style:'деловой',    season:'лето',  colortype:'летo',  textureHint:'Шерсть',     makeupHint:'Тени зелёные',        makeupSet:{lips:'Нюдовая', eyes:'Зелёные', blush:'Светлые', eyeliner:'Серая', style:'Деловой'}, hue:132},
  {id:'gF2',color:'#2e8b57', text:'Зелёный лесной',     tone:'свежий', style:'натуральный',season:'осень', colortype:'осень', textureHint:'Твид',       makeupHint:'Тени хаки',           makeupSet:{lips:'Нюдовая', eyes:'Карие', blush:'Тёплые', eyeliner:'Коричневая', style:'Натуральный'}, hue:138}
);

// === 150°-179°  ЗЕЛЕНО-ГОЛУБОЙ / БИРЮЗА ===
colors.push(
  {id:'tgT', color:'#b3fff5', text:'Светло-бирюзовый',   tone:'холодный', style:'свежий',     season:'лето', colortype:'лето', textureHint:'Шёлк',       makeupHint:'Тени светло-бирюзовые',makeupSet:{lips:'Нюдовая', eyes:'Бирюзовые', blush:'Светлые', eyeliner:'Серая', style:'Свежий'}, hue:152},
  {id:'tgP', color:'#66ffe6', text:'Аквамариновый',      tone:'холодный', style:'нежный',     season:'лето', colortype:'лето', textureHint:'Шёлк',       makeupHint:'Тени аквамариновые',  makeupSet:{lips:'Нюдовая', eyes:'Голубые', blush:'Светлые', eyeliner:'Серая', style:'Нежный'}, hue:155},
  {id:'tgC', color:'#40e0d0', text:'Бирюзовый чистый',   tone:'холодный', style:'креативный', season:'весна',colortype:'весна',textureHint:'Шёлк',       makeupHint:'Тени бирюзовые',      makeupSet:{lips:'Нюдовая', eyes:'Бирюзовые', blush:'Светлые', eyeliner:'Серая', style:'Креативный'}, hue:150},
  {id:'tgA', color:'#00ced1', text:'Бирюзово-синий',     tone:'холодный', style:'яркий',      season:'лето', colortype:'лето', textureHint:'Атлас',      makeupHint:'Тени тёмно-бирюзовые',makeupSet:{lips:'Светло-розовая', eyes:'Синие', blush:'Холодные', eyeliner:'Серая', style:'Яркий'}, hue:158},
  {id:'tgS', color:'#008b8b', text:'Тёмно-бирюзовый',    tone:'холодный', style:'вечерний',   season:'лето', colortype:'лето', textureHint:'Атлас',      makeupHint:'Тени изумрудные',     makeupSet:{lips:'Красная', eyes:'Изумрудные', blush:'Холодные', eyeliner:'Чёрная', style:'Вечерний'}, hue:162}
);

// === 180°-209°  СИНЕ-ЗЕЛЁНЫЙ / МОРСКАЯ ВОЛНА ===
colors.push(
  {id:'cgT', color:'#b3ffed', text:'Светло-морской',     tone:'холодный', style:'свежий',     season:'лето', colortype:'лето', textureHint:'Шёлк',       makeupHint:'Хайлайтер светло-голубой',makeupSet:{lips:'Нюдовая', eyes:'Голубые', blush:'Светлые', eyeliner:'Серая', style:'Свежий'}, hue:182},
  {id:'cgP', color:'#66ffd9', text:'Морская пена',       tone:'холодный', style:'нежный',     season:'лето', colortype:'лето', textureHint:'Шифон',      makeupHint:'Тени голубовато-зелёные',makeupSet:{lips:'Нюдовая', eyes:'Серо-голубые', blush:'Светлые', eyeliner:'Серая', style:'Нежный'}, hue:185},
  {id:'cgC', color:'#00fa9a', text:'Морская волна',      tone:'холодный', style:'креативный', season:'лето', colortype:'лето', textureHint:'Шёлк',       makeupHint:'Тени бирюзовые',      makeupSet:{lips:'Нюдовая', eyes:'Бирюзовые', blush:'Светлые', eyeliner:'Серая', style:'Креативный'}, hue:180},
  {id:'cgA', color:'#00c897', text:'Изумрудно-зелёный',  tone:'холодный', style:'драматичный',season:'зима', colortype:'зима', textureHint:'Атлас',      makeupHint:'Тени изумрудные',     makeupSet:{lips:'Фуксия', eyes:'Изумрудные', blush:'Холодные', eyeliner:'Чёрная', style:'Драматичный'}, hue:188},
  {id:'cgS', color:'#008c7f', text:'Тёмно-морской',      tone:'холодный', style:'деловой',    season:'лето', colortype:'лето', textureHint:'Атлас',      makeupHint:'Тени тёмно-бирюзовые',makeupSet:{lips:'Красная', eyes:'Тёмно-бирюзовые', blush:'Холодные', eyeliner:'Чёрная', style:'Деловой'}, hue:192}
);

// === 210°-239°  СИНИЙ  ===
colors.push(
  {id:'bT', color:'#b3d9ff', text:'Светло-голубой',     tone:'холодный', style:'нежный',     season:'лето', colortype:'лето', textureHint:'Хлопок',     makeupHint:'Тени голубые',        makeupSet:{lips:'Нюдовая', eyes:'Голубые', blush:'Светлые', eyeliner:'Серая', style:'Нежный'}, hue:212},
  {id:'bP', color:'#99ccff', text:'Голубой небесный',   tone:'холодный', style:'романтичный',season:'лето', colortype:'лето', textureHint:'Шифон',      makeupHint:'Тени нежно-голубые',  makeupSet:{lips:'Розовая', eyes:'Голубые', blush:'Светлые', eyeliner:'Серая', style:'Романтичный'}, hue:215},
  {id:'bC', color:'#1e90ff', text:'Синий чистый',       tone:'холодный', style:'свежий',     season:'зима', colortype:'зима', textureHint:'Атлас',      makeupHint:'Тени ярко-синие',     makeupSet:{lips:'Нюдовая', eyes:'Ярко-синие', blush:'Светлые', eyeliner:'Серая', style:'Свежий'}, hue:210},
  {id:'bA', color:'#0066cc', text:'Кобальтовый',        tone:'холодный', style:'яркий',      season:'зима', colortype:'зима', textureHint:'Джинса',     makeupHint:'Тени кобальтовые',    makeupSet:{lips:'Красная', eyes:'Синие', blush:'Холодные', eyeliner:'Чёрная', style:'Яркий'}, hue:218},
  {id:'bS', color:'#003d7a', text:'Тёмно-синий',        tone:'холодный', style:'деловой',    season:'зима', colortype:'зима', textureHint:'Шерсть',     makeupHint:'Тени тёмно-синие',    makeupSet:{lips:'Красная', eyes:'Тёмно-синие', blush:'Холодные', eyeliner:'Чёрная', style:'Деловой'}, hue:222}
);

// === 240°-269°  ФИОЛЕТОВО-СИНИЙ  ===
colors.push(
  {id:'pvT', color:'#d1b3ff', text:'Светло-фиолетовый',  tone:'холодный', style:'романтический',season:'лето',colortype:'лето',textureHint:'Шифон',    makeupHint:'Тени светло-фиолетовые',makeupSet:{lips:'Розовая', eyes:'Сиреневые', blush:'Светлые', eyeliner:'Серая', style:'Романтический'}, hue:242},
  {id:'pvP', color:'#b399ff', text:'Сиреневый пастельный',tone:'холодный', style:'нежный',     season:'летo',colortype:'лето',textureHint:'Шёлк',      makeupHint:'Тени сиреневые',      makeupSet:{lips:'Светло-розовая', eyes:'Серо-сиреневые', blush:'Светлые', eyeliner:'Серая', style:'Нежный'}, hue:245},
  {id:'pvC', color:'#8a2be2', text:'Фиолетовый чистый',  tone:'холодный', style:'креативный', season:'зима',colortype:'зима',textureHint:'Атлас',      makeupHint:'Тени фиолетовые',     makeupSet:{lips:'Фуксия', eyes:'Фиолетовые', blush:'Холодные', eyeliner:'Чёрная', style:'Креативный'}, hue:240},
  {id:'pvA', color:'#6a0dad', text:'Фиолетовый насыщенный',tone:'холодный',style:'драматичный',season:'зима',colortype:'зима',textureHint:'Бархат',    makeupHint:'Тени тёмно-фиолетовые',makeupSet:{lips:'Пурпурная', eyes:'Фиолетовые', blush:'Холодные', eyeliner:'Чёрная', style:'Драматичный'}, hue:248},
  {id:'pvS', color:'#4b0082', text:'Тёмно-фиолетовый',   tone:'холодный', style:'вечерний',   season:'зима',colortype:'зима',textureHint:'Бархат',     makeupHint:'Тени тёмно-фиолетовые',makeupSet:{lips:'Пурпурная', eyes:'Тёмно-фиолетовые', blush:'Холодные', eyeliner:'Чёрная', style:'Вечерний'}, hue:252}
);

// === 270°-299°  ПУРПУРНЫЙ / МАГЕНТА ===
colors.push(
  {id:'pT', color:'#ffb3ff', text:'Светло-пурпурный',   tone:'холодный', style:'романтичный',season:'лето', colortype:'лето', textureHint:'Шифон',      makeupHint:'Тени светло-фиолетовые',makeupSet:{lips:'Светло-розовая', eyes:'Сиреневые', blush:'Розовые', eyeliner:'Серая', style:'Романтичный'}, hue:272},
  {id:'pP', color:'#ff66ff', text:'Пурпурный пастельный',tone:'холодный', style:'нежный',     season:'лето', colortype:'лето', textureHint:'Шёлк',       makeupHint:'Тени пурпурные',      makeupSet:{lips:'Розовая', eyes:'Серые', blush:'Розовые', eyeliner:'Серая', style:'Нежный'}, hue:275},
  {id:'pC', color:'#ff00ff', text:'Пурпурный чистый',   tone:'холодный', style:'яркий',      season:'зима', colortype:'зима', textureHint:'Атлас',      makeupHint:'Помада фуксия',       makeupSet:{lips:'Фуксия', eyes:'Серебристые', blush:'Яркие', eyeliner:'Чёрная', style:'Яркий'}, hue:270},
  {id:'pA', color:'#cc00cc', text:'Пурпурный насыщенный',tone:'холодный', style:'драматичный',season:'зима', colortype:'зима', textureHint:'Атлас',      makeupHint:'Помада яркая',       makeupSet:{lips:'Ярко-фуксия', eyes:'Дымчатые', blush:'Холодные', eyeliner:'Чёрная', style:'Драматичный'}, hue:278},
  {id:'pS', color:'#990099', text:'Тёмно-пурпурный',    tone:'холодный', style:'драматичный',season:'зима', colortype:'зима', textureHint:'Бархат',     makeupHint:'Помада тёмно-розовая',makeupSet:{lips:'Тёмно-фуксия', eyes:'Дымчатые', blush:'Холодные', eyeliner:'Чёрная', style:'Драматичный'}, hue:282}
);

// === 300°-329°  РОЗОВО-ФИОЛЕТОВЫЙ  ===
colors.push(
  {id:'rpT', color:'#ffb3f5', text:'Светло-розовый фиолет',tone:'холодный', style:'романтический',season:'лето',colortype:'лето',textureHint:'Шифон',  makeupHint:'Помада светло-розовая',makeupSet:{lips:'Светло-розовая', eyes:'Сиреневые', blush:'Розовые', eyeliner:'Серая', style:'Романтический'}, hue:302},
  {id:'rpP', color:'#ff99e6', text:'Розово-сиреневый',   tone:'холодный', style:'нежный',     season:'лето', colortype:'лето', textureHint:'Шёлк',       makeupHint:'Тени розово-сиреневые',makeupSet:{lips:'Розовая', eyes:'Серо-сиреневые', blush:'Светлые', eyeliner:'Серая', style:'Нежный'}, hue:305},
  {id:'rpC', color:'#d8bfd8', text:'Сиреневый чистый',   tone:'холодный', style:'нежный',     season:'лето', colortype:'лето', textureHint:'Шёлк',       makeupHint:'Тени сиреневые',      makeupSet:{lips:'Розовая', eyes:'Сиреневые', blush:'Светлые', eyeliner:'Серая', style:'Нежный'}, hue:300},
  {id:'rpA', color:'#c8a2c8', text:'Сиреневый насыщенный',tone:'холодный', style:'романтичный',season:'зима',colortype:'зима',textureHint:'Атлас',      makeupHint:'Тени сиреневые',      makeupSet:{lips:'Фуксия', eyes:'Фиолетовые', blush:'Холодные', eyeliner:'Чёрная', style:'Романтичный'}, hue:308},
  {id:'rpS', color:'#8b008b', text:'Тёмно-сиреневый',    tone:'холодный', style:'вечерний',   season:'зима', colortype:'зима', textureHint:'Бархат',     makeupHint:'Тени тёмно-сиреневые',makeupSet:{lips:'Пурпурная', eyes:'Тёмно-сиреневые', blush:'Холодные', eyeliner:'Чёрная', style:'Вечерний'}, hue:312}
);

// === 330°-359°  РОЗОВЫЙ / ФУКСИЯ  ===
colors.push(
  {id:'pkT', color:'#ffb3d9', text:'Светло-розовый',     tone:'тёплый', style:'нежный',     season:'весна',colortype:'весна',textureHint:'Шифон',      makeupHint:'Помада светло-розовая',makeupSet:{lips:'Светло-розовая', eyes:'Бежевые', blush:'Розовые', eyeliner:'Коричневая', style:'Нежный'}, hue:332},
  {id:'pkP', color:'#ff99cc', text:'Розовый пастельный', tone:'тёплый', style:'романтичный',season:'весна',colortype:'весна',textureHint:'Шёлк',       makeupHint:'Румяна розовые',      makeupSet:{lips:'Розовая', eyes:'Золотистые', blush:'Розовые', eyeliner:'Коричневая', style:'Романтичный'}, hue:335},
  {id:'pkC', color:'#ff1493', text:'Розовый чистый',     tone:'тёплый', style:'яркий',      season:'лето', colortype:'лето', textureHint:'Шёлк',       makeupHint:'Помада ярко-розовая', makeupSet:{lips:'Ярко-розовая', eyes:'Серебристые', blush:'Розовые', eyeliner:'Чёрная', style:'Яркий'}, hue:330},
  {id:'pkA', color:'#e60073', text:'Фуксия',             tone:'тёплый', style:'драматичный',season:'зима', colortype:'зима', textureHint:'Атлас',      makeupHint:'Помада фуксия',       makeupSet:{lips:'Фуксия', eyes:'Дымчатые', blush:'Яркие', eyeliner:'Чёрная', style:'Драматичный'}, hue:338},
  {id:'pkS', color:'#b20077', text:'Тёмно-розовый',      tone:'тёплый', style:'драматичный',season:'зима', colortype:'зима', textureHint:'Бархат',     makeupHint:'Помада тёмно-розовая',makeupSet:{lips:'Тёмно-розовая', eyes:'Дымчатые', blush:'Тёплые', eyeliner:'Чёрная', style:'Драматичный'}, hue:342}
);

function findColorsInRange(targetHue, tolerance) {
    return colors.filter(color => {
        const hue = color.virtualHue !== undefined ? color.virtualHue : color.hue;
        const diff = Math.abs(hue - targetHue);
        return diff <= tolerance || Math.abs(diff - 360) <= tolerance;
    });
}

function findComplementaryColors(baseColor) {
    let baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue;
    let complementaryHue = (baseHue + 180) % 360;
    return findColorsInRange(complementaryHue, 15);
}

function findAnalogousColors(baseColor, range = 30) {
    let baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue;
    return [
        ...findColorsInRange((baseHue - range + 360) % 360, 10),
        ...findColorsInRange((baseHue + range) % 360, 10)
    ];
}

function findTriadicColors(baseColor) {
    let baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue;
    return [
        ...findColorsInRange((baseHue + 120) % 360, 15),
        ...findColorsInRange((baseHue + 240) % 360, 15)
    ];
}

function findMonochromaticColors(baseColor, range = 20) {
    let baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue;
    return findColorsInRange(baseHue, range).filter(color => color.id !== baseColor.id);
}

function findColorsBySeason(season) {
    return colors.filter(color => color.season === season || color.season === 'все');
}

function findColorsByTone(tone) {
    return colors.filter(color => color.tone === tone);
}

// === НЕЙТРАЛЬНЫЕ С ВИРТУАЛЬНЫМ HUE ДЛЯ КОМПЛИМЕНТАРНЫХ СХЕМ ===

// Тёплые нейтральные (ассоциируются с оранжево-коричневой гаммой 20°-60°)
colors.push(
  {id:'nCream', color:'#fffdd0', text:'Кремовый', tone:'тёплый', style:'нежный', season:'весна', colortype:'весна', textureHint:'Шёлк', makeupHint:'Хайлайтер кремовый', makeupSet:{lips:'Нюдовая', eyes:'Золотистые', blush:'Персиковые', eyeliner:'Коричневая', style:'Нежный'}, hue:55, virtualHue:55, baseTone:'warm'},
  {id:'nIvory', color:'#fffff0', text:'Слоновая кость', tone:'тёплый', style:'элегантный', season:'весна', colortype:'весна', textureHint:'Шёлк', makeupHint:'Тональная основа', makeupSet:{lips:'Нюдовая', eyes:'Бежевые', blush:'Светлые', eyeliner:'Коричневая', style:'Элегантный'}, hue:52, virtualHue:52, baseTone:'warm'},
  {id:'nBeige', color:'#f5f5dc', text:'Бежевый', tone:'тёплый', style:'повседневный', season:'весна', colortype:'весна', textureHint:'Хлопок', makeupHint:'Пудра бежевая', makeupSet:{lips:'Нюдовая', eyes:'Бежевые', blush:'Персиковые', eyeliner:'Коричневая', style:'Повседневный'}, hue:50, virtualHue:50, baseTone:'warm'},
  {id:'nLatte', color:'#c5a582', text:'Латте', tone:'тёплый', style:'ежедневный', season:'все', colortype:'универсальный', textureHint:'Кашемир', makeupHint:'Хайлайтер золотой', makeupSet:{lips:'Нюдовая', eyes:'Золотистые', blush:'Тёплые', eyeliner:'Коричневая', style:'Ежедневный'}, hue:45, virtualHue:45, baseTone:'warm'},
  {id:'nClay', color:'#9f8170', text:'Глина', tone:'тёплый', style:'мягкий', season:'весна', colortype:'универсальный', textureHint:'Лён', makeupHint:'Румяна персиковые', makeupSet:{lips:'Персиковая', eyes:'Золотистые', blush:'Персиковые', eyeliner:'Коричневая', style:'Мягкий'}, hue:40, virtualHue:40, baseTone:'warm'},
  {id:'nTan', color:'#d2b48c', text:'Загорелый', tone:'тёплый', style:'естественный', season:'осень', colortype:'осень', textureHint:'Лён', makeupHint:'Бронзер', makeupSet:{lips:'Коралловая', eyes:'Карие', blush:'Тёплые', eyeliner:'Коричневая', style:'Естественный'}, hue:38, virtualHue:38, baseTone:'warm'},
  {id:'nCamel', color:'#c19a6b', text:'Верблюжий', tone:'тёплый', style:'элегантный', season:'осень', colortype:'осень', textureHint:'Кашемир', makeupHint:'Тени песочные', makeupSet:{lips:'Терракотовая', eyes:'Золотистые', blush:'Тёплые', eyeliner:'Коричневая', style:'Элегантный'}, hue:35, virtualHue:35, baseTone:'warm'},
  {id:'nHazel', color:'#b56545', text:'Ореховый', tone:'тёплый', style:'мягкий', season:'осень', colortype:'осень', textureHint:'Замша', makeupHint:'Помада ореховая', makeupSet:{lips:'Ореховая', eyes:'Золотистые', blush:'Тёплые', eyeliner:'Коричневая', style:'Мягкий'}, hue:32, virtualHue:32, baseTone:'warm'},
  {id:'nBrandy', color:'#864d2e', text:'Бренди', tone:'тёплый', style:'осенний', season:'осень', colortype:'осень', textureHint:'Кожа', makeupHint:'Тени бренди', makeupSet:{lips:'Коралловая', eyes:'Карие', blush:'Тёплые', eyeliner:'Коричневая', style:'Осенний'}, hue:28, virtualHue:28, baseTone:'warm'},
  {id:'nCocoa', color:'#7b3f00', text:'Какао', tone:'тёплый', style:'уютный', season:'осень', colortype:'осень', textureHint:'Вельвет', makeupHint:'Тени шоколадные', makeupSet:{lips:'Терракотовая', eyes:'Коричневые', blush:'Тёплые', eyeliner:'Коричневая', style:'Уютный'}, hue:25, virtualHue:25, baseTone:'warm'}
);

// Холодные нейтральные (ассоциируются с сине-серой гаммой 200°-240°)
colors.push(
  {id:'nWhite', color:'#ffffff', text:'Белый чистый', tone:'нейтральный', style:'универсальный', season:'все', colortype:'универсальный', textureHint:'Атлас', makeupHint:'Хайлайтер', makeupSet:{lips:'Нюдовая', eyes:'Светлые', blush:'Светлые', eyeliner:'Серая', style:'Универсальный'}, hue:0, virtualHue:220, baseTone:'cool'},
  {id:'nLiteG', color:'#dcdcdc', text:'Светло-серый', tone:'нейтральный', style:'универсальный', season:'все', colortype:'универсальный', textureHint:'Трикотаж', makeupHint:'Тени светло-серые', makeupSet:{lips:'Нюдовая', eyes:'Серые', blush:'Светлые', eyeliner:'Серая', style:'Универсальный'}, hue:0, virtualHue:225, baseTone:'cool'},
  {id:'nMidG', color:'#808080', text:'Серый', tone:'нейтральный', style:'универсальный', season:'все', colortype:'универсальный', textureHint:'Трикотаж', makeupHint:'Тени серые', makeupSet:{lips:'Нюдовая', eyes:'Серые', blush:'Нейтральные', eyeliner:'Серая', style:'Базовый'}, hue:0, virtualHue:230, baseTone:'cool'},
  {id:'nCoolTaupe', color:'#7b7370', text:'Холодный тауп', tone:'холодный', style:'деловой', season:'все', colortype:'универсальный', textureHint:'Фланель', makeupHint:'Тени холодные', makeupSet:{lips:'Нюдовая', eyes:'Серые', blush:'Холодные', eyeliner:'Серая', style:'Деловой'}, hue:0, virtualHue:235, baseTone:'cool'},
  {id:'nDarkG', color:'#2f2f2f', text:'Тёмно-серый', tone:'нейтральный', style:'универсальный', season:'все', colortype:'универсальный', textureHint:'Трикотаж', makeupHint:'Тени тёмно-серые', makeupSet:{lips:'Нюдовая', eyes:'Серые', blush:'Нейтральные', eyeliner:'Чёрная', style:'Базовый'}, hue:0, virtualHue:240, baseTone:'cool'},
  {id:'nAshB', color:'#7a6a65', text:'Пепельно-коричневый', tone:'холодный', style:'строгий', season:'зима', colortype:'зима', textureHint:'Твид', makeupHint:'Пудра холодная', makeupSet:{lips:'Нюдовая', eyes:'Холодные', blush:'Холодные', eyeliner:'Серая', style:'Строгий'}, hue:0, virtualHue:238, baseTone:'cool'},
  {id:'nCharBrown', color:'#5e4f4a', text:'Угольно-коричневый', tone:'холодный', style:'драматичный', season:'зима', colortype:'зима', textureHint:'Кожа', makeupHint:'Смоки айс', makeupSet:{lips:'Яркая', eyes:'Смоки', blush:'Минимальные', eyeliner:'Чёрная', style:'Драматичный'}, hue:0, virtualHue:242, baseTone:'cool'},
  {id:'nMocha', color:'#4d3d30', text:'Мокко', tone:'холодный', style:'вечерний', season:'зима', colortype:'зима', textureHint:'Бархат', makeupHint:'Тени тёмно-коричневые', makeupSet:{lips:'Бордовая', eyes:'Смоки', blush:'Минимальные', eyeliner:'Чёрная', style:'Вечерний'}, hue:0, virtualHue:245, baseTone:'cool'},
  {id:'nBlack', color:'#000000', text:'Чёрный', tone:'нейтральный', style:'универсальный', season:'все', colortype:'универсальный', textureHint:'Классика', makeupHint:'Подводка чёрная', makeupSet:{lips:'Красная', eyes:'Смоки айс', blush:'Нейтральные', eyeliner:'Чёрная', style:'Классический вечер'}, hue:0, virtualHue:250, baseTone:'cool'}
);

// Смешанные нейтральные (имеют характеристики обоих подтонов)
colors.push(
  {id:'nGreige', color:'#b5a895', text:'Грейж', tone:'нейтральный', style:'универсальный', season:'все', colortype:'универсальный', textureHint:'Фланель', makeupHint:'Пудра грейж', makeupSet:{lips:'Нюдовая', eyes:'Серые', blush:'Нейтральные', eyeliner:'Серая', style:'Универсальный'}, hue:0, virtualHue:30, baseTone:'neutral'},
  {id:'nTaupe', color:'#8b8589', text:'Тёплый тауп', tone:'нейтральный', style:'деловой', season:'все', colortype:'универсальный', textureHint:'Твид', makeupHint:'Тени тауп', makeupSet:{lips:'Нюдовая', eyes:'Серые', blush:'Тауп', eyeliner:'Серая', style:'Деловой'}, hue:0, virtualHue:35, baseTone:'neutral'},
  {id:'nStone', color:'#928d88', text:'Камень', tone:'нейтральный', style:'повседневный', season:'все', colortype:'универсальный', textureHint:'Хлопок', makeupHint:'Пудра матовая', makeupSet:{lips:'Нюдовая', eyes:'Серые', blush:'Нейтральные', eyeliner:'Серая', style:'Повседневный'}, hue:0, virtualHue:40, baseTone:'neutral'},
  {id:'nMushroom', color:'#7d746d', text:'Грибной', tone:'нейтральный', style:'осенний', season:'осень', colortype:'универсальный', textureHint:'Кашемир', makeupHint:'Пудра холодная', makeupSet:{lips:'Нюдовая', eyes:'Холодные', blush:'Холодные', eyeliner:'Серая', style:'Осенний'}, hue:0, virtualHue:220, baseTone:'neutral'},
  {id:'nSlateB', color:'#6a5a55', text:'Сланцевый', tone:'нейтральный', style:'строгий', season:'зима', colortype:'универсальный', textureHint:'Твид', makeupHint:'Тени сланцевые', makeupSet:{lips:'Нюдовая', eyes:'Серые', blush:'Нейтральные', eyeliner:'Серая', style:'Строгий'}, hue:0, virtualHue:235, baseTone:'neutral'}
);



colors.sort((a, b) => {
    const hueA = a.virtualHue !== undefined ? a.virtualHue : a.hue;
    const hueB = b.virtualHue !== undefined ? b.virtualHue : b.hue;
    return hueA - hueB;
});

// === ВСЕ ЦВЕТОВЫЕ СХЕМЫ ===
const schemeGenerators = {
  // Аналоговая - соседние цвета в круге
  analog: (i, colorsArr = colors) => {
        const mainColor = colorsArr[i];
        const mainHue = mainColor.virtualHue !== undefined ? mainColor.virtualHue : mainColor.hue; // ← ИСПРАВЛЕНО
        
        const analogousColors = colorsArr
            .map((color, index) => { 
                const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ВЫНЕСЕНО В ПЕРЕМЕННУЮ
                return {
                    color, 
                    index, 
                    diff: Math.min(
                        Math.abs(colorHue - mainHue), // ← ИСПРАВЛЕНО
                        360 - Math.abs(colorHue - mainHue) // ← ИСПРАВЛЕНО
                    )
                };
            })
            .filter(item => item.index !== i && item.diff <= 30)
            .sort((a, b) => a.diff - b.diff)
            .slice(0, 2)
            .map(item => item.color);
        
        return [mainColor, ...analogousColors];
    },

  // Комплементарная - противоположный цвет
  complement: (i, colorsArr = colors) => {
        const mainColor = colorsArr[i];
        const mainHue = mainColor.virtualHue !== undefined ? mainColor.virtualHue : mainColor.hue; // ← ИСПРАВЛЕНО
        const targetHue = (mainHue + 180) % 360; // ← ИСПРАВЛЕНО
        
        let closestColor = null;
        let minDiff = 360;
        
        colorsArr.forEach((color, index) => {
            if (index === i) return;
            
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
            let hueDiff = Math.abs(colorHue - targetHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            if (hueDiff < minDiff) {
                minDiff = hueDiff;
                closestColor = color;
            }
        });
        
        return [mainColor, closestColor];
    },

  // Триада - три равноудаленных цвета
triad: (i, colorsArr = colors) => {
    const mainColor = colorsArr[i];
    const mainHue = mainColor.virtualHue !== undefined ? mainColor.virtualHue : mainColor.hue; // ← ИСПРАВЛЕНО
    
    const triadHues = [
        (mainHue + 120) % 360,
        (mainHue + 240) % 360
    ];
    
    const triadColors = triadHues.map(targetHue => {
        let closestColor = null;
        let minDiff = 360;
        
        colorsArr.forEach((color, index) => {
            if (index === i) return;
            
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
            let hueDiff = Math.abs(colorHue - targetHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            if (hueDiff < minDiff) {
                minDiff = hueDiff;
                closestColor = color;
            }
        });
        
        return closestColor;
    }).filter(Boolean);
    
    return [mainColor, ...triadColors];
},

// Раздельно-комплементарная - основной + два соседних к комплементарному
splitComplement: (i, colorsArr = colors) => {
    const mainColor = colorsArr[i];
    const mainHue = mainColor.virtualHue !== undefined ? mainColor.virtualHue : mainColor.hue; // ← ИСПРАВЛЕНО
    const compHue = (mainHue + 180) % 360;
    
    const splitHues = [
        (compHue - 30 + 360) % 360,
        (compHue + 30) % 360
    ];
    
    const splitColors = splitHues.map(targetHue => {
        let closestColor = null;
        let minDiff = 360;
        
        colorsArr.forEach((color, index) => {
            if (index === i) return;
            
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
            let hueDiff = Math.abs(colorHue - targetHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            if (hueDiff < minDiff) {
                minDiff = hueDiff;
                closestColor = color;
            }
        });
        
        return closestColor;
    }).filter(Boolean);
    
    return [mainColor, ...splitColors];
},

// Монохроматическая - оттенки одного hue (±10°)
  monochrome: (i, colorsArr = colors) => {
    const mainColor = colorsArr[i];
    const mainHue = mainColor.hue;
    
    const monoColors = colorsArr
      .filter((color, index) => {
        if (index === i) return false;
        const hueDiff = Math.min(
          Math.abs(color.hue - mainHue),
          360 - Math.abs(color.hue - mainHue)
        );
        return hueDiff <= 10;
      })
      .slice(0, 2);
    
    return [mainColor, ...monoColors];
  },

  // Тетрадическая - 4 цвета через 90°
  tetradic: (i, colorsArr = colors) => {
        const mainColor = colorsArr[i];
        const mainHue = mainColor.hue;
        
        const tetradHues = [
            (mainHue + 90) % 360,
            (mainHue + 180) % 360,
            (mainHue + 270) % 360
        ];
        
        const tetradColors = tetradHues.map(targetHue => {
            let closestColor = null;
            let minDiff = 360;
            
            colorsArr.forEach((color, index) => {
                if (index === i) return;
                
                let hueDiff = Math.abs(color.hue - targetHue);
                hueDiff = Math.min(hueDiff, 360 - hueDiff);
                
                if (hueDiff < minDiff) {
                    minDiff = hueDiff;
                    closestColor = color;
                }
            });
            
            return closestColor;
        }).filter(Boolean);
        
        return [mainColor, ...tetradColors];
    },


  // Акцентная комплементарная
accentComplement: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.hue;
    
    // Комплементарный цвет
    const targetHue = (baseHue + 180) % 360;
    let complementaryColor = null;
    let minCompDiff = 360;
    
    colorsArr.forEach((color, index) => {
        if (index === i) return;
        
        let hueDiff = Math.abs(color.hue - targetHue);
        hueDiff = Math.min(hueDiff, 360 - hueDiff);
        
        if (hueDiff < minCompDiff) {
            minCompDiff = hueDiff;
            complementaryColor = color;
        }
    });
    
    // Аналогичные цвета (соседи основного)
    const analogousColors = [];
    colorsArr.forEach((color, index) => {
        if (index === i || (complementaryColor && color.id === complementaryColor.id)) return;
        
        let hueDiff = Math.abs(color.hue - baseHue);
        hueDiff = Math.min(hueDiff, 360 - hueDiff);
        
        if (hueDiff <= 30) {
            analogousColors.push({ color, diff: hueDiff });
        }
    });
    
    // Сортируем по близости и берем 2 ближайших
    analogousColors.sort((a, b) => a.diff - b.diff);
    const selectedAnalogs = analogousColors.slice(0, 2).map(item => item.color);
    
    return complementaryColor ? [baseColor, complementaryColor, ...selectedAnalogs] : [baseColor, ...selectedAnalogs];
},

// DYAD - два противоположных цвета с эффектами
dyad: (i, colorsArr = colors) => {
    const mainColor = colorsArr[i];
    const mainHue = mainColor.virtualHue !== undefined ? mainColor.virtualHue : mainColor.hue; // ← ИСПРАВЛЕНО
    
    // Противоположный цвет (180°) с небольшим смещением ±10°
    const oppositeHue = (mainHue + 170) % 360; // -10° от противоположного
    
    let oppositeColor = null;
    let minDiff = 360;
    
    colorsArr.forEach((color, index) => {
        if (index === i) return;
        
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        let diff = Math.abs(colorHue - oppositeHue);
        diff = Math.min(diff, 360 - diff);
        
        if (diff < minDiff) {
            minDiff = diff;
            oppositeColor = color;
        }
    });

    // ЭФФЕКТЫ СООТВЕТСТВУЮЩИЕ ЦВЕТУ (по цветовому кругу)
    const getColorEffects = (color) => {
        const hue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        
        // КРАСНЫЙ сектор (330-30°)
        if ((hue >= 330 && hue <= 360) || (hue >= 0 && hue <= 30)) {
            return [
                { ...color, color: "#8B0000", text: "Бордовый акцент", id: color.id + '_effect1' },
                { ...color, color: "#FF6B6B", text: "Яркий красный", id: color.id + '_effect2' }
            ];
        }
        // ОРАНЖЕВЫЙ сектор (30-60°)
        else if (hue > 30 && hue <= 60) {
            return [
                { ...color, color: "#D2691E", text: "Терракотовый", id: color.id + '_effect1' },
                { ...color, color: "#FFA500", text: "Насыщенный оранж", id: color.id + '_effect2' }
            ];
        }
        // ЖЕЛТЫЙ сектор (60-90°)
        else if (hue > 60 && hue <= 90) {
            return [
                { ...color, color: "#B8860B", text: "Тёмное золото", id: color.id + '_effect1' },
                { ...color, color: "#FFD700", text: "Яркое золото", id: color.id + '_effect2' }
            ];
        }
        // ЗЕЛЕНЫЙ сектор (90-150°)
        else if (hue > 90 && hue <= 150) {
            return [
                { ...color, color: "#006400", text: "Глубокий зелёный", id: color.id + '_effect1' },
                { ...color, color: "#32CD32", text: "Сочный зелёный", id: color.id + '_effect2' }
            ];
        }
        // СИНИЙ сектор (150-210°)
        else if (hue > 150 && hue <= 210) {
            return [
                { ...color, color: "#00695C", text: "Изумрудный", id: color.id + '_effect1' },
                { ...color, color: "#00CED1", text: "Бирюзовый", id: color.id + '_effect2' }
            ];
        }
        // СИНИЙ-ФИОЛЕТОВЫЙ сектор (210-270°)
        else if (hue > 210 && hue <= 270) {
            return [
                { ...color, color: "#191970", text: "Сапфировый", id: color.id + '_effect1' },
                { ...color, color: "#4169E1", text: "Королевский синий", id: color.id + '_effect2' }
            ];
        }
        // ФИОЛЕТОВЫЙ сектор (270-330°)
        else {
            return [
                { ...color, color: "#4A235A", text: "Королевский фиолет", id: color.id + '_effect1' },
                { ...color, color: "#9370DB", text: "Нежный фиолет", id: color.id + '_effect2' }
            ];
        }
    };

    // Получаем эффекты для каждого цвета
    const mainEffects = getColorEffects(mainColor);
    const oppositeEffects = oppositeColor ? getColorEffects(oppositeColor) : [];

    // Возвращаем только 2 основных цвета + по 1 эффекту для каждого
    return [
        // Основные цвета
        mainColor,
        oppositeColor,
        
        // По одному эффекту для каждого цвета
        ...(mainEffects.slice(0, 1)),
        ...(oppositeEffects.slice(0, 1))
        
    ].filter(Boolean);
},

// НЕЙТРАЛЬНАЯ СХЕМА - ИСПРАВЛЕННАЯ ВЕРСИЯ
neutral: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue;
    
    // Все нейтральные цвета из массива
    const allNeutralColors = colorsArr.filter(color => {
        if (color.id === baseColor.id) return false;
        
        return (
            // Черный, белый, серые
            color.id === 'nBlack' || 
            color.id === 'nWhite' || 
            color.id.startsWith('nLiteG') ||
            color.id.startsWith('nMidG') ||
            color.id.startsWith('nDarkG') ||
            // Коричневые и бежевые оттенки
            color.id.startsWith('nCream') ||
            color.id.startsWith('nBeige') ||
            color.id.startsWith('nLatte') ||
            color.id.startsWith('nTan') ||
            color.id.startsWith('nCamel') ||
            color.id.startsWith('nHazel') ||
            color.id.startsWith('nBrandy') ||
            color.id.startsWith('nCocoa') ||
            // Смешанные нейтральные
            color.id.startsWith('nGreige') ||
            color.id.startsWith('nTaupe') ||
            color.id.startsWith('nStone') ||
            color.id.startsWith('nMushroom') ||
            color.id.startsWith('nSlateB') ||
            // Холодные нейтральные
            color.id.startsWith('nAshB') ||
            color.id.startsWith('nCoolTaupe') ||
            color.id.startsWith('nCharBrown') ||
            color.id.startsWith('nMocha') ||
            // Универсальные цвета
            color.colortype === 'универсальный'
        );
    });

    console.log(`🔍 Доступные нейтральные цвета: ${allNeutralColors.length}`);
    allNeutralColors.forEach(color => {
        console.log(`   - ${color.text} (${color.id})`);
    });

    // Сортируем по разнообразию тонов и близости к базовому hue
    const sortedNeutrals = allNeutralColors
        .map(color => {
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue;
            let hueDiff = Math.abs(colorHue - baseHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            // Приоритет по типу цвета
            let priority = 1;
            if (color.id.startsWith('nBeige') || color.id.startsWith('nCream')) priority = 2;
            if (color.colortype === 'универсальный') priority = 3;
            if (color.id === 'nBlack' || color.id === 'nWhite') priority = 4;
            
            return { 
                color, 
                diff: hueDiff,
                priority: priority
            };
        })
        .sort((a, b) => {
            if (a.priority !== b.priority) return b.priority - a.priority;
            return a.diff - b.diff;
        })
        .slice(0, 4);

    const selectedNeutrals = sortedNeutrals.map(item => item.color);

    console.log(`🎨 ВЫБРАНЫ для ${baseColor.text}:`);
    selectedNeutrals.forEach(color => {
        console.log(`   ✅ ${color.text} (${color.id})`);
    });

    return [baseColor, ...selectedNeutrals];
},
  
// ПЕНТАДА - 5 гармоничных цветов с дорам-эффектами (ИСПРАВЛЕННАЯ ВЕРСИЯ)
pentadic: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue;
    
    // 5 цветов через равные промежутки 72°
    const targetHues = [
        (baseHue + 72) % 360,
        (baseHue + 144) % 360,
        (baseHue + 216) % 360,
        (baseHue + 288) % 360
    ];
    
    // ДОРАМ-ЭФФЕКТЫ
    const applyDramaEffect = (color, effectType) => {
        const hex = color.color.replace('#', '');
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);
        
        switch(effectType) {
            case "moonlight_whisper":
                r = Math.min(255, r * 0.9 + 40);
                g = Math.min(255, g * 0.9 + 40);
                b = Math.min(255, b * 1.1 + 20);
                break;
            case "sunset_drama":
                r = Math.max(0, r * 0.85 + 15);
                g = Math.max(0, g * 0.75 - 5);
                b = Math.max(0, b * 0.65 - 10);
                break;
            case "forest_whisper":
                g = Math.min(255, g * 1.2 + 20);
                r = Math.max(0, r * 0.9);
                b = Math.max(0, b * 0.9);
                break;
            case "purple_mist":
                r = Math.min(255, r * 1.1 + 10);
                b = Math.min(255, b * 1.2 + 15);
                g = Math.max(0, g * 0.8);
                break;
            case "vintage_gold":
                r = Math.max(0, r * 0.8 + 20);
                g = Math.max(0, g * 0.8 + 15);
                b = Math.max(0, b * 0.7);
                break;
        }
        
        const newColor = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
        
        return {
            ...color,
            color: newColor,
            text: `${color.text} • ${getEffectName(effectType)}`,
            id: `${color.id}_${effectType}`,
            style: "дорам-эффект"
        };
    };

    const getEffectName = (effectType) => {
        const names = {
            "moonlight_whisper": "Лунный шёпот",
            "sunset_drama": "Закатная драма",
            "forest_whisper": "Лесной шёпот",
            "purple_mist": "Фиолетовая дымка",
            "vintage_gold": "Винтажное золото"
        };
        return names[effectType];
    };

    // Поиск цветов и применение эффектов
    const selectedColors = [];

    targetHues.forEach((targetHue, index) => {
        const effectTypes = [
            "forest_whisper",
            "sunset_drama", 
            "purple_mist",
            "vintage_gold"
        ];
        const selectedEffect = effectTypes[index];
        
        let closestColor = null;
        let minDiff = 360;
        
        colorsArr.forEach((color, colorIndex) => {
            if (colorIndex === i) return;
            if (selectedColors.some(selected => selected.id === color.id)) return;
            
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue;
            let hueDiff = Math.abs(colorHue - targetHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            if (hueDiff < minDiff) {
                minDiff = hueDiff;
                closestColor = color;
            }
        });
        
        if (closestColor) {
            const effectedColor = applyDramaEffect(closestColor, selectedEffect);
            selectedColors.push(effectedColor);
        }
    });

    // Базовый цвет получает эффект "Лунный шепот"
    const effectedBaseColor = applyDramaEffect(baseColor, "moonlight_whisper");

    console.log("🎬 ДОРАМ-ЭФФЕКТЫ ПЕНТАДЫ:");
    console.log("┌─────────────────────────────────────────────────┐");
    console.log("│              КИНЕМАТОГРАФИЧНЫЕ ЭФФЕКТЫ        │");
    console.log("├─────────────────────────────────────────────────┤");
    
    [effectedBaseColor, ...selectedColors].forEach((color, index) => {
        const effects = ["Лунный шёпот", "Лесной шёпот", "Закатная драма", "Фиолетовая дымка", "Винтажное золото"];
        const emojis = ["🌙", "🌲", "🌅", "💜", "🟫"];
        console.log(`│ ${emojis[index]} ${effects[index].padEnd(18)} │ ${color.text.padEnd(25)} │`);
    });
    console.log("└─────────────────────────────────────────────────┘");

    return [effectedBaseColor, ...selectedColors.slice(0, 4)];
},

// Акцентная триада (ИСПРАВЛЕННАЯ)
accentTriad: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue; // ← ИСПРАВЛЕНО
    
    // Триадные цвета (120° и 240°)
    const triadHues = [
        (baseHue + 120) % 360, 
        (baseHue + 240) % 360
    ];
    
    const triadColors = triadHues.map(targetHue => {
        let closestColor = null;
        let minDiff = 360;
        
        colorsArr.forEach((color, index) => {
            if (index === i) return;
            
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
            let hueDiff = Math.abs(colorHue - targetHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            if (hueDiff < minDiff) {
                minDiff = hueDiff;
                closestColor = color;
            }
        });
        
        return closestColor;
    }).filter(Boolean);
    
    // Акцентный цвет (аналогичный основному)
    let accentColor = null;
    let minAccentDiff = 360;
    
    colorsArr.forEach((color, index) => {
        if (index === i || triadColors.includes(color)) return;
        
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        let hueDiff = Math.abs(colorHue - baseHue);
        hueDiff = Math.min(hueDiff, 360 - hueDiff);
        
        if (hueDiff < minAccentDiff && hueDiff <= 30) {
            minAccentDiff = hueDiff;
            accentColor = color;
        }
    });
    
    const result = [baseColor, ...triadColors];
    if (accentColor) result.push(accentColor);
    
    console.log(`🎯 АКЦЕНТНАЯ ТРИАДА для ${baseColor.text}:`);
    console.log(`   🎨 Основной: ${baseColor.text} (${baseHue}°)`);
    triadColors.forEach((color, index) => {
        console.log(`   ${index === 0 ? '①' : '②'} Триадный: ${color.text} (${color.hue}°)`);
    });
    if (accentColor) {
        console.log(`   💥 Акцент: ${accentColor.text} (${accentColor.hue}°)`);
    }
    
    return result;
},

  

// Контрастная аналоговая
contrastAnalogous: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue; // ← ИСПРАВЛЕНО
    
    // Аналогичные цвета (соседи ±30°)
    const analogousColors = [];
    colorsArr.forEach((color, index) => {
        if (index === i) return;
        
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        let hueDiff = Math.abs(colorHue - baseHue);
        hueDiff = Math.min(hueDiff, 360 - hueDiff);
        
        if (hueDiff <= 30) {
            analogousColors.push({ color, diff: hueDiff });
        }
    });
    
    // Сортируем по близости и берем 2 ближайших
    analogousColors.sort((a, b) => a.diff - b.diff);
    const selectedAnalogs = analogousColors.slice(0, 2).map(item => item.color);
    
    // Контрастный акцент (противоположный цвет 180°)
    const targetHue = (baseHue + 180) % 360;
    let contrastColor = null;
    let minContrastDiff = 360;
    
    colorsArr.forEach((color, index) => {
        if (index === i || selectedAnalogs.includes(color)) return;
        
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        let hueDiff = Math.abs(colorHue - targetHue);
        hueDiff = Math.min(hueDiff, 360 - hueDiff);
        
        if (hueDiff < minContrastDiff) {
            minContrastDiff = hueDiff;
            contrastColor = color;
        }
    });
    
    const result = [baseColor, ...selectedAnalogs];
    if (contrastColor) result.push(contrastColor);
    
    console.log(`🎨 КОНТРАСТНАЯ АНАЛОГОВАЯ для ${baseColor.text}:`);
    console.log(`   🎯 Основной: ${baseColor.text} (${baseHue}°)`);
    selectedAnalogs.forEach((color, index) => {
        console.log(`   ${index === 0 ? '①' : '②'} Аналоговый: ${color.text} (${color.hue}°)`);
    });
    if (contrastColor) {
        console.log(`   ⚡ Контрастный: ${contrastColor.text} (${contrastColor.hue}°)`);
    }
    
    return result;
},



// Оттеночная комплементарная
tintedComplement: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue; // ← ИСПРАВЛЕНО
    const targetHue = (baseHue + 180) % 360;
    
    // Основной комплементарный цвет
    let complementaryColor = null;
    let minDiff = 360;
    
    colorsArr.forEach((color, index) => {
        if (index === i) return;
        
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        let hueDiff = Math.abs(colorHue - targetHue);
        hueDiff = Math.min(hueDiff, 360 - hueDiff);
        
        if (hueDiff < minDiff) {
            minDiff = hueDiff;
            complementaryColor = color;
        }
    });
    
    // Соседи комплементарного цвета (±30°)
    const neighborColors = [];
    if (complementaryColor) {
        const compHue = complementaryColor.virtualHue !== undefined ? complementaryColor.virtualHue : complementaryColor.hue; // ← ИСПРАВЛЕНО
        
        colorsArr.forEach((color, index) => {
            if (index === i || color.id === complementaryColor.id) return;
            
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
            let hueDiff = Math.abs(colorHue - compHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            if (hueDiff <= 30) {
                neighborColors.push({ color, diff: hueDiff });
            }
        });
        
        // Сортируем по близости и берем 2 ближайших
        neighborColors.sort((a, b) => a.diff - b.diff);
    }
    
    const selectedNeighbors = neighborColors.slice(0, 2).map(item => item.color);
    
    console.log(`🎨 ОТТЕНОЧНАЯ КОМПЛЕМЕНТАРНАЯ для ${baseColor.text}:`);
    console.log(`   🎯 Основной: ${baseColor.text} (${baseHue}°)`);
    if (complementaryColor) {
        console.log(`   ⚡ Комплементарный: ${complementaryColor.text} (${complementaryColor.hue}°)`);
        selectedNeighbors.forEach((color, index) => {
            console.log(`   ${index === 0 ? '①' : '②'} Оттенок: ${color.text} (${color.hue}°)`);
        });
    }
    
    return complementaryColor ? [baseColor, complementaryColor, ...selectedNeighbors] : [baseColor, ...selectedNeighbors];
},

// ТАКЖЕ ХОРОШИЕ СОЧЕТАНИЯ - расширенная аналогичная
alsoGood: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue; // ← ИСПРАВЛЕНО
    
    // Ищем цвета с разницей hue 30-90° (хорошие сочетания)
    const goodColors = [];
    colorsArr.forEach((color, index) => {
        if (index === i) return;
        
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        let hueDiff = Math.abs(colorHue - baseHue);
        hueDiff = Math.min(hueDiff, 360 - hueDiff);
        
        // Хорошие сочетания: не слишком близко и не слишком далеко
        if (hueDiff >= 30 && hueDiff <= 90) {
            goodColors.push({ color, diff: hueDiff });
        }
    });
    
    // Сортируем по близости и берем 4 лучших
    goodColors.sort((a, b) => a.diff - b.diff);
    const selectedGoodColors = goodColors.slice(0, 4).map(item => item.color);
    
    console.log(`👍 ТАКЖЕ ХОРОШИЕ для ${baseColor.text}:`);
    console.log(`   🎯 Основной: ${baseColor.text} (${baseHue}°)`);
    selectedGoodColors.forEach((color, index) => {
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        const hueDiff = Math.min(
            Math.abs(colorHue - baseHue),
            360 - Math.abs(colorHue - baseHue)
        );
        console.log(`   ${index + 1}️⃣ Хороший: ${color.text} (${colorHue}°, Δ${hueDiff}°)`);
    });
    
    return [baseColor, ...selectedGoodColors];
},

// НЕУДАЧНЫЕ СОЧЕТАНИЯ - реальные цветовые конфликты
notGood: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue;
    
    const conflictingColors = [];

    // 1. КОНФЛИКТ ПО ТЕМПЕРАТУРЕ
    if (baseColor.tone === 'тёплый') {
        // Тёплому НЕ подходят холодные пастели
        const badForWarm = colorsArr.find(color => 
            color.id !== baseColor.id &&
            color.tone === 'холодный' && 
            color.style.includes('нежный')
        );
        if (badForWarm) conflictingColors.push(badForWarm);
    }
    
    if (baseColor.tone === 'холодный') {
        // Холодному НЕ подходят тёплые яркие
        const badForCool = colorsArr.find(color => 
            color.id !== baseColor.id &&
            color.tone === 'тёплый' && 
            color.style.includes('яркий')
        );
        if (badForCool) conflictingColors.push(badForCool);
    }

    // 2. КОНФЛИКТ СЕЗОНОВ
    const seasonConflicts = {
        'весна': ['зима'],
        'лето': ['осень'], 
        'осень': ['лето'],
        'зима': ['весна']
    };
    
    if (seasonConflicts[baseColor.season]) {
        const badSeason = colorsArr.find(color => 
            color.id !== baseColor.id &&
            seasonConflicts[baseColor.season].includes(color.season)
        );
        if (badSeason && !conflictingColors.includes(badSeason)) {
            conflictingColors.push(badSeason);
        }
    }

    // 3. КОНФЛИКТ НАСЫЩЕННОСТИ
    if (baseColor.style.includes('нежный')) {
        // Пастельным не подходят яркие кислотные
        const tooBright = colorsArr.find(color => 
            color.id !== baseColor.id &&
            color.style.includes('яркий') &&
            Math.abs((color.virtualHue || color.hue) - baseHue) > 120
        );
        if (tooBright && !conflictingColors.includes(tooBright)) {
            conflictingColors.push(tooBright);
        }
    }

    // 4. КОНКРЕТНЫЕ ПЛОХИЕ ПАРЫ
    const colorFamilyConflicts = {
        'r': ['yg', 'g'], // красный + желто-зеленый, зеленый
        'o': ['tg', 'b'], // оранжевый + бирюза, синий  
        'y': ['rp', 'pv'], // желтый + розово-фиолетовый, фиолетовый
        'g': ['r', 'pk'], // зеленый + красный, розовый
        'b': ['r', 'o'], // синий + красный, оранжевый
        'pv': ['y', 'g'] // фиолетовый + желтый, зеленый
    };

    const baseFamily = baseColor.id.charAt(0);
    if (colorFamilyConflicts[baseFamily]) {
        const badFamilyColor = colorsArr.find(color => 
            color.id !== baseColor.id &&
            colorFamilyConflicts[baseFamily].some(family => color.id.startsWith(family))
        );
        if (badFamilyColor && !conflictingColors.includes(badFamilyColor)) {
            conflictingColors.push(badFamilyColor);
        }
    }

    // 5. ЕСЛИ МАЛО КОНФЛИКТОВ - ДОБАВЛЯЕМ СЛУЧАЙНЫЕ НЕПОДХОДЯЩИЕ
    if (conflictingColors.length < 2) {
        const randomBad = colorsArr.find(color => 
            color.id !== baseColor.id &&
            !conflictingColors.includes(color) &&
            Math.abs((color.virtualHue || color.hue) - baseHue) > 150 &&
            color.tone !== baseColor.tone
        );
        if (randomBad) conflictingColors.push(randomBad);
    }

    console.log(`👎 НЕУДАЧНЫЕ для ${baseColor.text}:`);
    console.log(`   🎯 Основной: ${baseColor.text} (${baseColor.tone}, ${baseColor.season})`);
    conflictingColors.forEach((color, index) => {
        const conflictReason = getConflictReason(baseColor, color);
        console.log(`   ${index + 1}️⃣ Конфликт: ${color.text} - ${conflictReason}`);
    });
    
    return [baseColor, ...conflictingColors.slice(0, 3)];
},

// МЯГКАЯ ГАРМОНИЯ - аналоги + нейтральный
soft: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue; // ← ИСПРАВЛЕНО
    
    // Аналогичные цвета (соседи ±30°)
    const analogousColors = [];
    colorsArr.forEach((color, index) => {
        if (index === i) return;
        
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        let hueDiff = Math.abs(colorHue - baseHue);
        hueDiff = Math.min(hueDiff, 360 - hueDiff);
        
        if (hueDiff <= 30) {
            analogousColors.push({ color, diff: hueDiff });
        }
    });
    
    // Сортируем по близости и берем 2 ближайших
    analogousColors.sort((a, b) => a.diff - b.diff);
    const selectedAnalogs = analogousColors.slice(0, 2).map(item => item.color);
    
    // Нейтральный цвет (серый, бежевый, коричневый) - ОБНОВЛЕННЫЕ ID
    let neutralColor = null;
    let minNeutralDiff = 360;
    
    colorsArr.forEach((color, index) => {
        if (index === i || selectedAnalogs.includes(color)) return;
        
        // Ищем нейтральные цвета по ОБНОВЛЕННЫМ ID
        const isNeutral = 
            color.id.startsWith('n') || // Все нейтральные начинаются с n
            color.colortype === 'универсальный';
        
        if (isNeutral) {
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
            let hueDiff = Math.abs(colorHue - baseHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            if (hueDiff < minNeutralDiff) {
                minNeutralDiff = hueDiff;
                neutralColor = color;
            }
        }
    });
    
    const result = [baseColor, ...selectedAnalogs];
    if (neutralColor) result.push(neutralColor);
    
    console.log(`💫 МЯГКАЯ ГАРМОНИЯ для ${baseColor.text}:`);
    console.log(`   🎯 Основной: ${baseColor.text} (${baseHue}°)`);
    selectedAnalogs.forEach((color, index) => {
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        console.log(`   ${index === 0 ? '①' : '②'} Аналоговый: ${color.text} (${colorHue}°)`);
    });
    if (neutralColor) {
        const neutralHue = neutralColor.virtualHue !== undefined ? neutralColor.virtualHue : neutralColor.hue; // ← ИСПРАВЛЕНО
        console.log(`   ⚪ Нейтральный: ${neutralColor.text} (${neutralHue}°)`);
    }
    
    return result;
}, 


// РАЗДЕЛЕННАЯ ТРИАДА - триада со смещением
splitTriad: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue; // ← ИСПРАВЛЕНО
    
    // Триада со смещением ±15° от классических 120° и 240°
    const triadHues = [
        (baseHue + 120 - 15) % 360,  // 105°
        (baseHue + 240 + 15) % 360   // 255°
    ];
    
    const triadColors = triadHues.map(targetHue => {
        let closestColor = null;
        let minDiff = 360;
        
        colorsArr.forEach((color, index) => {
            if (index === i) return;
            
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
            let hueDiff = Math.abs(colorHue - targetHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            if (hueDiff < minDiff) {
                minDiff = hueDiff;
                closestColor = color;
            }
        });
        
        return closestColor;
    }).filter(Boolean);
    
    console.log(`🎨 РАЗДЕЛЕННАЯ ТРИАДА для ${baseColor.text}:`);
    console.log(`   🎯 Основной: ${baseColor.text} (${baseHue}°)`);
    triadColors.forEach((color, index) => {
        const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
        const targetPos = triadHues[index];
        const actualDiff = Math.min(
            Math.abs(colorHue - targetPos),
            360 - Math.abs(colorHue - targetPos)
        );
        console.log(`   ${index === 0 ? '①' : '②'} Смещенный: ${color.text} (${colorHue}°, цель ${targetPos}°, Δ${actualDiff}°)`);
    });
    
    return [baseColor, ...triadColors.slice(0, 2)];
}, // ← НЕ ЗАБУДЬТЕ ЗАПЯТУЮ ЕСЛИ ЭТО НЕ ПОСЛЕДНЯЯ СХЕМА

// TONAL СХЕМА - цвета одного тона с разной насыщенностью и яркостью
tonal: (i, colorsArr = colors) => {
    const baseColor = colorsArr[i];
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue; // ← ИСПРАВЛЕНО
    
    // Ищем цвета с таким же hue (±15°) но разной насыщенностью/яркостью
    const tonalColors = colorsArr
        .map((color, index) => {
            if (index === i) return null;
            
            const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
            let hueDiff = Math.abs(colorHue - baseHue);
            hueDiff = Math.min(hueDiff, 360 - hueDiff);
            
            if (hueDiff <= 15) {
                // Вычисляем насыщенность и яркость для сортировки
                const hex = color.color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16) / 255;
                const g = parseInt(hex.substr(2, 2), 16) / 255;
                const b = parseInt(hex.substr(4, 2), 16) / 255;
                
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const lightness = (max + min) / 2;
                const saturation = max === 0 ? 0 : (max - min) / (1 - Math.abs(2 * lightness - 1));
                
                return { 
                    color, 
                    hueDiff,
                    saturation: saturation,
                    lightness: lightness
                };
            }
            return null;
        })
        .filter(Boolean)
        .sort((a, b) => {
            // Сначала по насыщенности (от самой насыщенной к наименее)
            if (Math.abs(a.saturation - b.saturation) > 0.1) {
                return b.saturation - a.saturation;
            }
            // Затем по яркости (от светлого к темному)
            return a.lightness - b.lightness;
        })
        .slice(0, 4) // Берем 4 лучших тональных цвета
        .map(item => item.color);
    
    console.log(`🎨 TONAL СХЕМА для ${baseColor.text}:`);
    console.log(`   🎯 Основной: ${baseColor.text} (${baseHue}°)`);
    
    tonalColors.forEach((color, index) => {
        const hex = color.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = Math.round((r + g + b) / 3);
        
        const tones = ["Насыщенный", "Яркий", "Средний", "Светлый", "Пастельный"];
        console.log(`   ${index + 1}️⃣ ${tones[index] || 'Тональный'}: ${color.text} (яркость: ${brightness})`);
    });
    
    return [baseColor, ...tonalColors];
}, // ← НЕ ЗАБУДЬТЕ ЗАПЯТУЮ ЕСЛИ ЭТО НЕ ПОСЛЕДНЯЯ СХЕМА

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

  // ЯРКАЯ СХЕМА - ПРЕМИУМ ВЕРСИЯ
bright: (i, colorsArr = colors) => { // ← ИСПРАВЛЕНО: colors → colorsArr
    const baseColor = colorsArr[i]; // Основной цвет без изменений
    const baseHue = baseColor.virtualHue !== undefined ? baseColor.virtualHue : baseColor.hue; // ← ИСПРАВЛЕНО
    
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
        const closestBalancer = colorsArr // ← ИСПРАВЛЕНО: colors → colorsArr
            .filter(color => color.id !== baseColor.id)
            .reduce((closest, current) => {
                if (!closest) return current;
                
                const currentHue = current.virtualHue !== undefined ? current.virtualHue : current.hue; // ← ИСПРАВЛЕНО
                const closestHue = closest.virtualHue !== undefined ? closest.virtualHue : closest.hue; // ← ИСПРАВЛЕНО
                
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
    const brightStyleColors = colorsArr.filter(color => // ← ИСПРАВЛЕНО: colors → colorsArr
        (color.style === "яркий" || color.style === "контрастный") && 
        color.id !== baseColor.id
    );
    
    // 2. Используем энергию для подбора гармоничных ярких цветов
    if (brightStyleColors.length > 0) {
        const harmoniousBright = brightStyleColors
            .filter(color => {
                const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
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
            
            const closestColor = colorsArr // ← ИСПРАВЛЕНО: colors → colorsArr
                .filter(color => {
                    if (color.id === baseColor.id || selectedColors.includes(color)) return false;
                    if (color.style === "нейтральный" || color.style === "деловой") return false;
                    
                    const colorHue = color.virtualHue !== undefined ? color.virtualHue : color.hue; // ← ИСПРАВЛЕНО
                    const hueDiff = Math.min(
                        Math.abs(colorHue - targetHue),
                        360 - Math.abs(colorHue - targetHue)
                    );
                    
                    return hueDiff <= 25;
                })
                .reduce((closest, current) => {
                    if (!closest) return current;
                    
                    const currentHue = current.virtualHue !== undefined ? current.virtualHue : current.hue; // ← ИСПРАВЛЕНО
                    const closestHue = closest.virtualHue !== undefined ? closest.virtualHue : closest.hue; // ← ИСПРАВЛЕНО
                    
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
}, // ← НЕ ЗАБУДЬТЕ ЗАПЯТУЮ ЕСЛИ ЭТО НЕ ПОСЛЕДНЯЯ СХЕМА


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

// Функция для определения причины конфликта
function getConflictReason(color1, color2) {
    if (color1.tone !== color2.tone) {
        return `Конфликт температур: ${color1.tone} + ${color2.tone}`;
    }
    if (color1.season !== color2.season && !['все', 'универсальный'].includes(color2.season)) {
        return `Конфликт сезонов: ${color1.season} + ${color2.season}`;
    }
    if ((color1.style.includes('нежный') && color2.style.includes('яркий')) ||
        (color1.style.includes('яркий') && color2.style.includes('нежный'))) {
        return 'Конфликт насыщенности';
    }
    
    const colorFamilies = {
        'r': 'красный', 'o': 'оранжевый', 'y': 'жёлтый', 
        'g': 'зелёный', 'b': 'синий', 'pv': 'фиолетовый'
    };
    const family1 = colorFamilies[color1.id.charAt(0)];
    const family2 = colorFamilies[color2.id.charAt(0)];
    
    return `Конфликт цветов: ${family1} + ${family2}`;
}


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
