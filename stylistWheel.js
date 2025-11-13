// Глобальное состояние выбора и фильтров
let lastChosenIndex = null;
let currentFilters = { style: "", season: "" };

const colors = [
  // 🌸 Весна (9)
  { color:"#ffb07c", text:"Персиковый", tone:"тёплый", style:"романтический", season:"весна", colortype:"весна",
    textureHint:"Шифон, лёгкий хлопок", makeupHint:"Румяна персиковые",
    makeupSet:{ lips:"Персиковая", eyes:"Золотистые", blush:"Персиковые", eyeliner:"Коричневая", style:"Романтический" }},
  { color:"#ffa07a", text:"Коралловый", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна",
    textureHint:"Хлопок, лен", makeupHint:"Помада коралловая",
    makeupSet:{ lips:"Коралловая", eyes:"Бежевые", blush:"Абрикосовые", eyeliner:"Коричневая", style:"Повседневный" }},
  { color:"#40e0d0", text:"Бирюзовый", tone:"холодный", style:"креативный", season:"весна", colortype:"весна",
    textureHint:"Шёлк", makeupHint:"Тени бирюзовые",
    makeupSet:{ lips:"Нюдовая", eyes:"Бирюзовые", blush:"Светлые", eyeliner:"Чёрная", style:"Креативный" }},
  { color:"#ffff99", text:"Лимонный", tone:"тёплый", style:"яркий", season:"весна", colortype:"весна",
    textureHint:"Хлопок", makeupHint:"Хайлайтер",
    makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }},
  { color:"#98fb98", text:"Светло‑зелёный", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна",
    textureHint:"Лён", makeupHint:"Тени зелёные",
    makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Персиковые", eyeliner:"Коричневая", style:"Повседневный" }},
  { color:"#ff69b4", text:"Ярко‑розовый", tone:"тёплый", style:"креативный", season:"весна", colortype:"весна",
    textureHint:"Шифон", makeupHint:"Помада розовая",
    makeupSet:{ lips:"Ярко‑розовая", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Креативный" }},
  { color:"#ffe4b5", text:"Абрикосовый", tone:"тёплый", style:"романтический", season:"весна", colortype:"весна",
    textureHint:"Шёлк", makeupHint:"Румяна абрикосовые",
    makeupSet:{ lips:"Абрикосовая", eyes:"Бежевые", blush:"Абрикосовые", eyeliner:"Коричневая", style:"Романтический" }},
  { color:"#f0e68c", text:"Хаки светлый", tone:"тёплый", style:"универсальный", season:"весна", colortype:"весна",
    textureHint:"Хлопок", makeupHint:"Тени хаки",
    makeupSet:{ lips:"Нюдовая", eyes:"Хаки", blush:"Персиковые", eyeliner:"Коричневая", style:"Универсальный" }},
  { color:"#ffdab9", text:"Персиковый светлый", tone:"тёплый", style:"повседневный", season:"весна", colortype:"весна",
    textureHint:"Лён", makeupHint:"Румяна персиковые",
    makeupSet:{ lips:"Персиковая", eyes:"Бежевые", blush:"Персиковые", eyeliner:"Коричневая", style:"Повседневный" }},

  // ☀️ Лето (9)
  { color:"#e6e6fa", text:"Лавандовый", tone:"холодный", style:"романтический", season:"лето", colortype:"лето",
    textureHint:"Шифон", makeupHint:"Тени лавандовые",
    makeupSet:{ lips:"Розовая", eyes:"Лавандовые", blush:"Розовые", eyeliner:"Серая", style:"Романтический" }},
  { color:"#add8e6", text:"Небесно‑голубой", tone:"холодный", style:"повседневный", season:"лето", colortype:"лето",
    textureHint:"Хлопок", makeupHint:"Тени голубые",
    makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Светлые", eyeliner:"Чёрная", style:"Повседневный" }},
  { color:"#dda0dd", text:"Сиреневый", tone:"холодный", style:"креативный", season:"лето", colortype:"лето",
    textureHint:"Шёлк", makeupHint:"Тени сиреневые",
    makeupSet:{ lips:"Фуксия", eyes:"Сиреневые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }},
  { color:"#98ff98", text:"Мятный", tone:"холодный", style:"свежий", season:"лето", colortype:"лето",
    textureHint:"Хлопок", makeupHint:"Тени мятные",
    makeupSet:{ lips:"Нюдовая", eyes:"Мятные", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }},
  { color:"#87cefa", text:"Голубой яркий", tone:"холодный", style:"повседневный", season:"лето", colortype:"лето",
    textureHint:"Шёлк", makeupHint:"Тени голубые",
    makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Розовые", eyeliner:"Чёрная", style:"Повседневный" }},
  { color:"#c0c0c0", text:"Серебристый", tone:"холодный", style:"вечерний", season:"лето", colortype:"лето",
    textureHint:"Атлас", makeupHint:"Хайлайтер",
    makeupSet:{ lips:"Нюдовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Чёрная", style:"Вечерний" }},
  { color:"#ffc0cb", text:"Розовый", tone:"тёплый", style:"романтический", season:"лето", colortype:"лето",
    textureHint:"Шифон", makeupHint:"Помада, румяна",
    makeupSet:{ lips:"Розовая", eyes:"Светло‑голубые", blush:"Розовые", eyeliner:"Тонкая чёрная", style:"Романтический" }},
  { color:"#ffe4e1", text:"Светло‑розовый", tone:"тёплый", style:"повседневный", season:"лето", colortype:"лето",
    textureHint:"Пастельные ткани", makeupHint:"Румяна, хайлайтер",
    makeupSet:{ lips:"Светло‑розовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Серая", style:"Повседневный" }},
  { color:"#f5f5dc", text:"Бежевый", tone:"нейтральный", style:"универсальный", season:"лето", colortype:"лето",
    textureHint:"Хлопок", makeupHint:"Тени бежевые",
    makeupSet:{ lips:"Нюдовая", eyes:"Бежевые", blush:"Светлые", eyeliner:"Коричневая", style:"Универсальный" }},

  // 🍂 Осень (9)
  { color:"#cd5c5c", text:"Терракотовый", tone:"тёплый", style:"повседневный", season:"осень", colortype:"осень",
    textureHint:"Шерсть", makeupHint:"Помада терракотовая",
    makeupSet:{ lips:"Терракотовая", eyes:"Коричневые", blush:"Бронзовые", eyeliner:"Коричневая", style:"Повседневный" }},
  { color:"#800000", text:"Бордовый", tone:"тёплый", style:"деловой", season:"осень", colortype:"осень",
    textureHint:"Твид", makeupHint:"Помада бордовая",
    makeupSet:{ lips:"Бордовая", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Чёрная", style:"Деловой" }},
  { color:"#808000", text:"Оливковый", tone:"тёплый", style:"универсальный", season:"осень", colortype:"осень",
    textureHint:"Лён", makeupHint:"Тени оливковые",
    makeupSet:{ lips:"Нюдовая", eyes:"Оливковые", blush:"Персиковые", eyeliner:"Коричневая", style:"Универсальный" }},
  { color:"#a0522d", text:"Шоколадный", tone:"тёплый", style:"вечерний", season:"осень", colortype:"осень",
    textureHint:"Бархат", makeupHint:"Помада шоколадная",
    makeupSet:{ lips:"Шоколадная", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Чёрная", style:"Вечерний" }},
  { color:"#b8860b", text:"Золотисто‑коричневый", tone:"тёплый", style:"деловой", season:"осень", colortype:"осень",
    textureHint:"Шерсть", makeupHint:"Тени золотистые",
    makeupSet:{ lips:"Бордовая", eyes:"Золотистые", blush:"Бронзовые", eyeliner:"Чёрная", style:"Деловой" }},
  { color:"#d2691e", text:"Медный", tone:"тёплый", style:"креативный", season:"осень", colortype:"осень",
    textureHint:"Твид", makeupHint:"Тени медные",
    makeupSet:{ lips:"Нюдовая", eyes:"Медные", blush:"Тёплые", eyeliner:"Коричневая", style:"Креативный" }},
  { color:"#cc7722", text:"Охра", tone:"тёплый", style:"повседневный", season:"осень", colortype:"осень",
    textureHint:"Шерсть", makeupHint:"Румяна охра",
    makeupSet:{ lips:"Нюдовая", eyes:"Коричневые", blush:"Охра", eyeliner:"Коричневая", style:"Повседневный" }},
  { color:"#8b4513", text:"Каштановый", tone:"тёплый", style:"универсальный", season:"осень", colortype:"осень",
    textureHint:"Кожа", makeupHint:"Помада каштановая",
    makeupSet:{ lips:"Каштановая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Чёрная", style:"Универсальный" }},

  // ❄️ Зима (9)
  { color:"#00008b", text:"Тёмно‑синий", tone:"холодный", style:"деловой", season:"зима", colortype:"зима",
    textureHint:"Атлас, шерсть", makeupHint:"Тени тёмно‑синие",
    makeupSet:{ lips:"Красная", eyes:"Тёмно‑синие", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }},
  { color:"#ff00ff", text:"Фуксия", tone:"холодный", style:"креативный", season:"зима", colortype:"зима",
    textureHint:"Бархат, шёлк", makeupHint:"Помада фуксия",
    makeupSet:{ lips:"Фуксия", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Креативный" }},
  { color:"#4b0082", text:"Фиолетовый", tone:"холодный", style:"романтический", season:"зима", colortype:"зима",
    textureHint:"Шёлк", makeupHint:"Тени фиолетовые",
    makeupSet:{ lips:"Нюдовая", eyes:"Фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"Романтический" }},
  { color:"#00ced1", text:"Изумрудный", tone:"холодный", style:"деловой", season:"зима", colortype:"зима",
    textureHint:"Атлас", makeupHint:"Тени изумрудные",
    makeupSet:{ lips:"Красная", eyes:"Изумрудные", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }},
  { color:"#191970", text:"Сапфировый", tone:"холодный", style:"вечерний", season:"зима", colortype:"зима",
    textureHint:"Атлас", makeupHint:"Тени сапфировые",
    makeupSet:{ lips:"Красная", eyes:"Сапфировые", blush:"Холодные", eyeliner:"Чёрная", style:"Вечерний" }},
  { color:"#e0ffff", text:"Ледяной голубой", tone:"холодный", style:"свежий", season:"зима", colortype:"зима",
    textureHint:"Атлас", makeupHint:"Тени голубые",
    makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }},
  { color:"#c0c0c0", text:"Серебристый", tone:"холодный", style:"вечерний", season:"зима", colortype:"зима",
    textureHint:"Металлизированные ткани", makeupHint:"Хайлайтер",
    makeupSet:{ lips:"Нюдовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Чёрная", style:"Вечерний" }},
  { color:"#8b0000", text:"Красный бархат", tone:"тёплый", style:"деловой", season:"зима", colortype:"зима",
    textureHint:"Бархат", makeupHint:"Помада красная",
    makeupSet:{ lips:"Красная бархатная", eyes:"Тёмно‑синие", blush:"Охра", eyeliner:"Чёрная", style:"Деловой вечер" }},
  { color:"#2f4f4f", text:"Тёмно‑серый", tone:"нейтральный", style:"универсальный", season:"зима", colortype:"зима",
    textureHint:"Шерсть", makeupHint:"Тени серые",
    makeupSet:{ lips:"Нюдовая", eyes:"Серые", blush:"Нейтральные", eyeliner:"Чёрная", style:"Универсальный" }},

    // ⚪ Универсальные (продолжение)
  { color:"#faf0e6", text:"Льняной", tone:"нейтральный", style:"повседневный", season:"все", colortype:"универсальный",
    textureHint:"Лён", makeupHint:"Тени светлые",
    makeupSet:{ lips:"Нюдовая", eyes:"Светлые", blush:"Светлые", eyeliner:"Коричневая", style:"Повседневный" }},
  { color:"#dcdcdc", text:"Светло‑серый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Трикотаж", makeupHint:"Тени серые",
    makeupSet:{ lips:"Нюдовая", eyes:"Серые", blush:"Светлые", eyeliner:"Чёрная", style:"Универсальный" }},
  { color:"#ffe4c4", text:"Бисквитный", tone:"тёплый", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Хлопок", makeupHint:"Румяна бежевые",
    makeupSet:{ lips:"Нюдовая", eyes:"Бежевые", blush:"Светлые", eyeliner:"Коричневая", style:"Универсальный" }},
  { color:"#f0f8ff", text:"Алиссиновый белый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Шифон", makeupHint:"Хайлайтер",
    makeupSet:{ lips:"Нюдовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Серая", style:"Базовый" }},
  { color:"#fafafa", text:"Молочный", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Трикотаж", makeupHint:"Тени светлые",
    makeupSet:{ lips:"Нюдовая", eyes:"Светлые", blush:"Светлые", eyeliner:"Коричневая", style:"Универсальный" }},
  { color:"#fdf5e6", text:"Слоновая кость", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Атлас", makeupHint:"Хайлайтер",
    makeupSet:{ lips:"Нюдовая", eyes:"Светлые", blush:"Светлые", eyeliner:"Коричневая", style:"Классический" }},
  { color:"#fff5ee", text:"Сливочный", tone:"тёплый", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Хлопок", makeupHint:"Румяна светлые",
    makeupSet:{ lips:"Нюдовая", eyes:"Бежевые", blush:"Светлые", eyeliner:"Коричневая", style:"Универсальный" }},
  { color:"#f8f8ff", text:"Призрачный белый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Шифон", makeupHint:"Хайлайтер",
    makeupSet:{ lips:"Нюдовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Серая", style:"Базовый" }},
  { color:"#fffafa", text:"Снежный", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Атлас", makeupHint:"Хайлайтер",
    makeupSet:{ lips:"Нюдовая", eyes:"Серебристые", blush:"Светлые", eyeliner:"Чёрная", style:"Классический" }},
  { color:"#f0fff0", text:"Мятный белый", tone:"холодный", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Хлопок", makeupHint:"Тени мятные",
    makeupSet:{ lips:"Нюдовая", eyes:"Мятные", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }},
  { color:"#fffacd", text:"Лимонный крем", tone:"тёплый", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Хлопок", makeupHint:"Румяна лимонные",
    makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }},

  // 🌑 Тёмные оттенки
  { color:"#000000", text:"Чёрный", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Классика, вечер", makeupHint:"Подводка чёрная",
    makeupSet:{ lips:"Красная", eyes:"Смоки айс", blush:"Нейтральные", eyeliner:"Чёрная", style:"Классический вечер" }},
  { color:"#5c0a0a", text:"Тёмно‑бордовый", tone:"тёплый", style:"вечерний", season:"осень", colortype:"осень",
    textureHint:"Бархат", makeupHint:"Помада бордовая",
    makeupSet:{ lips:"Бордовая", eyes:"Золотистые", blush:"Тёплые", eyeliner:"Чёрная", style:"Вечерний" }},
  { color:"#2e0854", text:"Тёмно‑фиолетовый", tone:"холодный", style:"креативный", season:"зима", colortype:"зима",
    textureHint:"Шёлк", makeupHint:"Тени фиолетовые",
    makeupSet:{ lips:"Фуксия", eyes:"Фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }},
  { color:"#000033", text:"Тёмно‑синий", tone:"холодный", style:"деловой", season:"зима", colortype:"зима",
    textureHint:"Атлас", makeupHint:"Тени синие",
    makeupSet:{ lips:"Красная", eyes:"Синие", blush:"Холодные", eyeliner:"Чёрная", style:"Деловой" }},
  { color:"#013220", text:"Тёмно‑зелёный", tone:"холодный", style:"универсальный", season:"осень", colortype:"осень",
    textureHint:"Шерсть", makeupHint:"Тени зелёные",
    makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Тёплые", eyeliner:"Коричневая", style:"Универсальный" }},
  { color:"#2f2f2f", text:"Графитовый", tone:"нейтральный", style:"универсальный", season:"все", colortype:"универсальный",
    textureHint:"Трикотаж", makeupHint:"Тени серые",
    makeupSet:{ lips:"Нюдовая", eyes:"Серые", blush:"Нейтральные", eyeliner:"Чёрная", style:"Базовый" }},

  // 🌈 Яркие оттенки
  { color:"#ff0000", text:"Ярко‑красный", tone:"тёплый", style:"контрастный", season:"зима", colortype:"зима",
    textureHint:"Атлас", makeupHint:"Помада красная",
    makeupSet:{ lips:"Красная", eyes:"Тёмные", blush:"Охра", eyeliner:"Чёрная", style:"Контрастный" }},
  { color:"#ff6600", text:"Ярко‑оранжевый", tone:"тёплый", style:"креативный", season:"осень", colortype:"осень",
    textureHint:"Хлопок", makeupHint:"Румяна тёплые",
    makeupSet:{ lips:"Оранжевая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Коричневая", style:"Креативный" }},
  { color:"#ffff00", text:"Ярко‑жёлтый", tone:"тёплый", style:"яркий", season:"весна", colortype:"весна",
    textureHint:"Хлопок", makeupHint:"Хайлайтер",
    makeupSet:{ lips:"Нюдовая", eyes:"Жёлтые", blush:"Светлые", eyeliner:"Коричневая", style:"Яркий" }},
  { color:"#0066ff", text:"Ярко‑синий", tone:"холодный", style:"свежий", season:"лето", colortype:"лето",
    textureHint:"Шёлк", makeupHint:"Тени синие",
    makeupSet:{ lips:"Нюдовая", eyes:"Синие", blush:"Светлые", eyeliner:"Чёрная", style:"Свежий" }},
  { color:"#00ff00", text:"Ярко‑зелёный", tone:"свежий", style:"повседневный", season:"весна", colortype:"весна",
    textureHint:"Лён", makeupHint:"Тени зелёные",
    makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Повседневный" }},
  { color:"#ff1493", text:"Ярко‑розовый", tone:"тёплый", style:"романтический", season:"лето", colortype:"лето",
    textureHint:"Шифон", makeupHint:"Помада розовая",
    makeupSet:{ lips:"Ярко‑розовая", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Романтический" }},
// 🌑 Дополнительные тёмные
{ color:"#3b2f2f", text:"Тёмно‑коричневый", tone:"тёплый", style:"деловой", season:"осень", colortype:"осень",
  textureHint:"Шерсть", makeupHint:"Помада коричневая",
  makeupSet:{ lips:"Коричневая", eyes:"Коричневые", blush:"Тёплые", eyeliner:"Чёрная", style:"Деловой" }},
{ color:"#1c1c1c", text:"Угольный", tone:"нейтральный", style:"вечерний", season:"все", colortype:"универсальный",
  textureHint:"Кожа", makeupHint:"Подводка чёрная",
  makeupSet:{ lips:"Красная", eyes:"Смоки айс", blush:"Нейтральные", eyeliner:"Чёрная", style:"Вечерний" }},
{ color:"#045f5f", text:"Тёмно‑бирюзовый", tone:"холодный", style:"креативный", season:"зима", colortype:"зима",
  textureHint:"Атлас", makeupHint:"Тени бирюзовые",
  makeupSet:{ lips:"Нюдовая", eyes:"Бирюзовые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }},
{ color:"#2b3d2f", text:"Тёмно‑хаки", tone:"тёплый", style:"универсальный", season:"осень", colortype:"осень",
  textureHint:"Лён", makeupHint:"Тени хаки",
  makeupSet:{ lips:"Нюдовая", eyes:"Хаки", blush:"Тёплые", eyeliner:"Коричневая", style:"Универсальный" }},
{ color:"#4b1c3f", text:"Тёмно‑бордо‑фиолетовый", tone:"холодный", style:"романтический", season:"зима", colortype:"зима",
  textureHint:"Бархат", makeupHint:"Помада бордовая",
  makeupSet:{ lips:"Бордовая", eyes:"Фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"Романтический" }},
{ color:"#4a3c1a", text:"Тёмно‑золотистый", tone:"тёплый", style:"акцентный", season:"осень", colortype:"осень",
  textureHint:"Металлизированные ткани", makeupHint:"Тени золотые",
  makeupSet:{ lips:"Красная", eyes:"Золотые", blush:"Тёплые", eyeliner:"Коричневая", style:"Акцентный" }},

// 🌈 Дополнительные яркие
{ color:"#00f5ff", text:"Ярко‑бирюзовый", tone:"холодный", style:"свежий", season:"лето", colortype:"лето",
  textureHint:"Шифон", makeupHint:"Тени бирюзовые",
  makeupSet:{ lips:"Нюдовая", eyes:"Бирюзовые", blush:"Светлые", eyeliner:"Серая", style:"Свежий" }},
{ color:"#9b30ff", text:"Ярко‑фиолетовый", tone:"холодный", style:"креативный", season:"зима", colortype:"зима",
  textureHint:"Атлас", makeupHint:"Тени фиолетовые",
  makeupSet:{ lips:"Фуксия", eyes:"Фиолетовые", blush:"Холодные", eyeliner:"Чёрная", style:"Креативный" }},
{ color:"#32cd32", text:"Ярко‑лаймовый", tone:"свежий", style:"энергичный", season:"весна", colortype:"весна",
  textureHint:"Хлопок", makeupHint:"Тени лаймовые",
  makeupSet:{ lips:"Нюдовая", eyes:"Зелёные", blush:"Светлые", eyeliner:"Коричневая", style:"Энергичный" }},
{ color:"#dc143c", text:"Ярко‑малиновый", tone:"тёплый", style:"контрастный", season:"лето", colortype:"лето",
  textureHint:"Шифон", makeupHint:"Помада малиновая",
  makeupSet:{ lips:"Малиновая", eyes:"Серебристые", blush:"Розовые", eyeliner:"Чёрная", style:"Контрастный" }},
{ color:"#1e90ff", text:"Ярко‑голубой", tone:"холодный", style:"свежий", season:"лето", colortype:"лето",
  textureHint:"Шёлк", makeupHint:"Тени голубые",
  makeupSet:{ lips:"Нюдовая", eyes:"Голубые", blush:"Светлые", eyeliner:"Чёрная", style:"Свежий" }},
{ color:"#ffd700", text:"Ярко‑золотой", tone:"тёплый", style:"праздничный", season:"осень", colortype:"осень",
  textureHint:"Металлизированные ткани", makeupHint:"Хайлайтер золотой",
  makeupSet:{ lips:"Красная", eyes:"Золотые", blush:"Тёплые", eyeliner:"Чёрная", style:"Праздничный" }}
];


// Рендер круга с возможностью подсветки выбранного сегмента
function renderWheel(ctx, cx, cy, radius, step, highlightIndex = null) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();

  colors.forEach((seg, i) => {
    const start = i * step;
    const end = (i + 1) * step;

    const styleOk = !currentFilters.style || seg.style === currentFilters.style;
    const seasonOk = !currentFilters.season || seg.season === currentFilters.season;
    const typeOk = !currentFilters.colortype || seg.colortype === currentFilters.colortype;
    const visible = styleOk && seasonOk && typeOk;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.globalAlpha = visible ? 1 : 0.25;
    ctx.shadowBlur = 0;
    ctx.fill();

    const angle = (i + 0.5) * step;
    ctx.fillStyle = "#000";
    ctx.globalAlpha = visible ? 1 : 0.4;
    ctx.font = "9px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(seg.text, cx + Math.cos(angle) * 110, cy + Math.sin(angle) * 110);
  });

  // 🔥 рисуем выбранный сегмент поверх с glow
  if (highlightIndex !== null) {
    const seg = colors[highlightIndex];
    const start = highlightIndex * step;
    const end = (highlightIndex + 1) * step;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.globalAlpha = 1;
    ctx.shadowColor = "white";
    ctx.shadowBlur = 25;
    ctx.fill();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawStylistColorWheel() {
  const canvas = document.getElementById("stylistColorWheel");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  const cssW = 450, cssH = 450
;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cx = cssW / 2;
  const cy = cssH / 2;
  const radius = Math.min(cx, cy);
  const step = (2 * Math.PI) / colors.length;

  renderWheel(ctx, cx, cy, radius, step);

  // Клик по кругу
  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - cx;
    const dy = y - cy;
    const angle = (Math.atan2(dy, dx) + 2 * Math.PI) % (2 * Math.PI);
    const index = Math.floor(angle / step);
    lastChosenIndex = index;

    const chosen = colors[index];
    const opposite = colors[(index + Math.floor(colors.length / 2)) % colors.length];
    const left = colors[(index - 1 + colors.length) % colors.length];
    const right = colors[(index + 1) % colors.length];

    const card = document.getElementById("stylistColorResult");
    if (!card) return;

    // Перерисовываем круг с подсветкой выбранного сегмента
    renderWheel(ctx, cx, cy, radius, step, index);

    // Основная информация
    card.innerHTML = `
      <div style="display:flex;gap:8px;margin-bottom:6px;">
        <div style="width:30px;height:30px;background:${chosen.color};border:1px solid #000;"></div>
        <div style="width:30px;height:30px;background:${opposite.color};border:1px solid #000;"></div>
      </div>
      <strong>Выбранный:</strong> ${chosen.text} (${chosen.tone}, ${chosen.style}, ${chosen.season}, ${chosen.colortype})<br>
      <em>${chosen.textureHint}</em><br>
      <strong>Соседние:</strong> ${left.text}, ${right.text}<br>
      <strong>Комплементарный:</strong> ${opposite.text} (${opposite.tone}, ${opposite.style}, ${opposite.season}, ${opposite.colortype})<br>
      <em>${opposite.textureHint}</em>
    `;

    // Макияж
    const set = chosen.makeupSet || {};
    card.innerHTML += `
      <div style="margin-top:8px;">
        <strong>Макияж сет:</strong><br>
        💋 Губы: ${set.lips || "—"}<br>
        👁 Тени: ${set.eyes || "—"}<br>
        😊 Румяна: ${set.blush || "—"}<br>
        ✒ Подводка: ${set.eyeliner || "—"}<br>
        🎨 Стиль: ${set.style || "—"}
      </div>
    `;
  });

  canvas._renderParams = { ctx, cx, cy, radius, step };
}

// Фильтры
function highlightByStyle(style) {
  currentFilters.style = style || "";
  const canvas = document.getElementById("stylistColorWheel");
  if (!canvas || !canvas._renderParams) return;
  const { ctx, cx, cy, radius, step } = canvas._renderParams;
  renderWheel(ctx, cx, cy, radius, step, lastChosenIndex);
}

function highlightBySeason(season) {
  currentFilters.season = season || "";
  const canvas = document.getElementById("stylistColorWheel");
  if (!canvas || !canvas._renderParams) return;
  const { ctx, cx, cy, radius, step } = canvas._renderParams;
  renderWheel(ctx, cx, cy, radius, step, lastChosenIndex);
}

// 🔥 новый фильтр по цветотипу
function highlightByColortype(type) {
  currentFilters.colortype = type || "";
  const canvas = document.getElementById("stylistColorWheel");
  if (!canvas || !canvas._renderParams) return;
  const { ctx, cx, cy, radius, step } = canvas._renderParams;
  renderWheel(ctx, cx, cy, radius, step, lastChosenIndex);
}
// 🔥 вспомогательная функция

function shadeColor(color, percent) {
  let f = parseInt(color.slice(1),16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent*-1 : percent,
      R = f>>16,
      G = f>>8&0x00FF,
      B = f&0x0000FF;
  return "#" + (0x1000000 + 
    (Math.round((t-R)*p/100)+R)*0x10000 + 
    (Math.round((t-G)*p/100)+G)*0x100 + 
    (Math.round((t-B)*p/100)+B)).toString(16).slice(1);
}

// Схемы
function showScheme(type) {
  const result = document.getElementById("stylistColorResult");
  if (!result || lastChosenIndex === null) return;

  let schemeColors = [];

  if (type === "analog") {
    schemeColors = [
      colors[(lastChosenIndex - 1 + colors.length) % colors.length],
      colors[lastChosenIndex],
      colors[(lastChosenIndex + 1) % colors.length]
    ];
  } else if (type === "complement") {
    schemeColors = [
      colors[lastChosenIndex],
      colors[(lastChosenIndex + Math.floor(colors.length / 2)) % colors.length]
    ];
} else if (type === "accentComplement") {
  schemeColors = [
    colors[lastChosenIndex],
    colors[(lastChosenIndex - 1 + colors.length) % colors.length],
    colors[(lastChosenIndex + 1) % colors.length],
    colors[(lastChosenIndex + Math.floor(colors.length / 2)) % colors.length]
  ];
  } else if (type === "triad") {
    schemeColors = [
      colors[lastChosenIndex],
      colors[(lastChosenIndex + Math.floor(colors.length / 3)) % colors.length],
      colors[(lastChosenIndex + 2 * Math.floor(colors.length / 3)) % colors.length]
    ];
  } else if (type === "splitComplement") {
    schemeColors = [
      colors[lastChosenIndex],
      colors[(lastChosenIndex + Math.floor(colors.length / 2) - 1 + colors.length) % colors.length],
      colors[(lastChosenIndex + Math.floor(colors.length / 2) + 1) % colors.length]
    ];
  } else if (type === "tetradic") {
    schemeColors = [
      colors[lastChosenIndex],
      colors[(lastChosenIndex + Math.floor(colors.length / 2)) % colors.length],
      colors[(lastChosenIndex + Math.floor(colors.length / 4)) % colors.length],
      colors[(lastChosenIndex + Math.floor(3 * colors.length / 4)) % colors.length]
    ];
} else if (type === "dyad") {
  // Диада: два цвета через 180° ±30°
  schemeColors = [
    colors[lastChosenIndex],
    colors[(lastChosenIndex + Math.floor(colors.length / 2) - Math.floor(colors.length / 12) + colors.length) % colors.length],
    colors[(lastChosenIndex + Math.floor(colors.length / 2) + Math.floor(colors.length / 12)) % colors.length]
  ];
} else if (type === "neutral") {
  // Нейтральная: выбранный цвет + серые/бежевые тона
  const base = colors[lastChosenIndex];
  schemeColors = [
    base,
    { ...base, color: "#808080", text: "Нейтральный серый" },
    { ...base, color: "#c0c0c0", text: "Светло‑серый" },
    { ...base, color: "#d2b48c", text: "Бежевый" }
  ];
    } else if (type === "monochrome") {
    const base = colors[lastChosenIndex];
    schemeColors = [
      base,
      { ...base, color: shadeColor(base.color, -30), text: base.text + " (тёмный оттенок)" },
      { ...base, color: shadeColor(base.color, 30), text: base.text + " (светлый оттенок)" }
    ];
  } else if (type === "alsoGood") {
    // Автоматически выбираем соседние сегменты ±2
    schemeColors = [
      colors[lastChosenIndex],
      colors[(lastChosenIndex + 2) % colors.length],
      colors[(lastChosenIndex - 2 + colors.length) % colors.length]
    ];
  } else if (type === "notGood") {
    // Автоматически выбираем конфликтные сегменты (±90°)
    schemeColors = [
      colors[lastChosenIndex],
      colors[(lastChosenIndex + Math.floor(colors.length / 4)) % colors.length],
      colors[(lastChosenIndex - Math.floor(colors.length / 4) + colors.length) % colors.length]
    ];
  } else {
    return;
  }

  // ✅ единый вывод результата
  result.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:6px;">
      ${schemeColors.map(c => `<div style="width:30px;height:30px;background:${c.color};border:1px solid #000;"></div>`).join("")}
    </div>
    <strong>Схема (${type}):</strong> 
    ${schemeColors.map(c => c.text + " (" + c.tone + ", " + c.style + ", " + c.season + ", " + c.colortype + ")").join(", ")}<br>
    <em>Подсказки:</em> ${schemeColors.map(c => c.textureHint).join(" | ")}
  `;
}

// Инициализация после загрузки
window.addEventListener("load", drawStylistColorWheel);

