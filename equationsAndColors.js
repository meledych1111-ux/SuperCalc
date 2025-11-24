// Функция для определения контрастного цвета текста
function getContrastColor(hexcolor) {
    return '#000000'; // Всегда черный текст
}

// Таблица нейтрализации для парикмахеров
const neutralizationTable = {
    'Красный': { neutralizer: '#00FF00', name: 'Зеленый', advice: 'Нейтрализует красные оттенки, убирает рыжину' },
    'Красно-оранжевый': { neutralizer: '#00FFFF', name: 'Сине-зеленый', advice: 'Нейтрализует медно-рыжие тона' },
    'Оранжевый': { neutralizer: '#0000FF', name: 'Синий', advice: 'Убирает оранжевые пигменты, охлаждает тон' },
    'Желтый': { neutralizer: '#800080', name: 'Фиолетовый', advice: 'Нейтрализует желтизну, убирает бронзовость' },
    'Желто-зеленый': { neutralizer: '#FF00FF', name: 'Пурпурный', advice: 'Убирает салатовые оттенки' },
    'Зеленый': { neutralizer: '#FF0000', name: 'Красный', advice: 'Нейтрализует зеленые тона после хлора' },
    'Сине-зеленый': { neutralizer: '#FF5500', name: 'Красно-оранжевый', advice: 'Убирает изумрудные оттенки' },
    'Голубой': { neutralizer: '#FFAA00', name: 'Оранжевый', advice: 'Нейтрализует голубые пигменты' },
    'Синий': { neutralizer: '#FFFF00', name: 'Желтый', advice: 'Убирает синие тона, осветляет' },
    'Сине-фиолетовый': { neutralizer: '#AAFF00', name: 'Желто-зеленый', advice: 'Нейтрализует фиолетово-синие оттенки' },
    'Фиолетовый': { neutralizer: '#55FF00', name: 'Зеленый', advice: 'Убирает фиолетовые пигменты' },
    'Красно-фиолетовый': { neutralizer: '#00FF80', name: 'Весенне-зеленый', advice: 'Нейтрализует пурпурные тона' }
};

// Обновленная таблица с советами по осветлению
const hairTonesTable = {
    'Сине-фиолетовый': { 
        level: 1, 
        description: 'Черный',
        natural: 'Черный',
        pigments: 'Синий + красный (макс)',
        lightening: 'Очень сложное осветление',
        coloring: 'Требует декапирования',
        lighteningTips: '❌ Крайне сложно осветлить до блонда. Требуется несколько сеансов с перерывами. Риск сильного повреждения.'
    },
    'Фиолетовый': { 
        level: 2, 
        description: 'Темно-коричневый',
        natural: 'Темно-коричневый',
        pigments: 'Синий + красный',
        lightening: 'Сложное осветление',
        coloring: 'Нужны сильные окислители',
        lighteningTips: '⚠️ Сложное осветление. Используйте 9% окислитель в несколько этапов. Высокий риск желтизны.'
    },
    'Синий': { 
        level: 3, 
        description: 'Коричневый',
        natural: 'Коричневый',
        pigments: 'Синий + красный',
        lightening: 'Осветляется до 5-6 уровня',
        coloring: 'Хорошо принимает темные оттенки',
        lighteningTips: '⚠️ Осветление до светлого блонда проблематично. Максимум - средний блонд.'
    },
    'Голубой': { 
        level: 4, 
        description: 'Светло-коричневый',
        natural: 'Светло-коричневый',
        pigments: 'Синий',
        lightening: 'Осветляется до 7 уровня',
        coloring: 'Идеален для карамельных тонов',
        lighteningTips: '✅ Хорошо осветляется до русского/светло-русого. Для блонда - 2 этапа осветления.'
    },
    'Сине-зеленый': { 
        level: 5, 
        description: 'Темно-русый',
        natural: 'Темно-русый',
        pigments: 'Синий + красный',
        lightening: 'До 8-9 уровня',
        coloring: 'Хорош для холодных оттенков',
        lighteningTips: '✅💡 ИДЕАЛЬНЫЙ КАНДИДАТ ДЛЯ ОСВЕТЛЕНИЯ! Используйте 6-9% окислитель. После осветления - фиолетовый тонировщик.'
    },
    'Зеленый': { 
        level: 6, 
        description: 'Русый',
        natural: 'Русый',
        pigments: 'Красный + синий',
        lightening: 'Осветляется до 9 уровня',
        coloring: 'Универсальный для большинства цветов',
        lighteningTips: '✅💡 ЛУЧШИЙ УРОВЕНЬ ДЛЯ БЛОНДА! Один этап с 6% окислителем. Минимальный риск желтизны.'
    },
    'Красно-фиолетовый': { 
        level: 6, 
        description: 'Русый с красным',
        natural: 'Русый с теплым подтоном',
        pigments: 'Красный + синий',
        lightening: 'Осветляется до 9 уровня',
        coloring: 'Идеален для медных оттенков',
        lighteningTips: '✅ Хорошо осветляется, но может дать оранжевый подтон. Используйте синий корректор перед осветлением.'
    },
    'Красный': { 
        level: 7, 
        description: 'Светло-русый',
        natural: 'Светло-русый',
        pigments: 'Красный + оранжевый',
        lightening: 'Легко осветляется до 9-10 уровня',
        coloring: 'Хорошо принимает теплые оттенки',
        lighteningTips: '✅ Легко осветляется до блонда. Может потребоваться нейтрализация оранжевого подтона.'
    },
    'Красно-оранжевый': { 
        level: 7, 
        description: 'Светло-русый золотистый',
        natural: 'Светло-русый с золотистым подтоном',
        pigments: 'Оранжевый + красный',
        lightening: 'Осветляется до 10 уровня',
        coloring: 'Идеален для золотистых тонов',
        lighteningTips: '✅ Идеален для золотистого блонда. Для холодного блонда - фиолетовый тонировщик.'
    },
    'Оранжевый': { 
        level: 8, 
        description: 'Светлый блондин',
        natural: 'Светлый блондин',
        pigments: 'Оранжевый + желтый',
        lightening: 'До 10 уровня с тонированием',
        coloring: 'Требует нейтрализации желтизны',
        lighteningTips: '✅ Уже блонд! Для платины - одно осветление с 6% окислителем + тонирование.'
    },
    'Желтый': { 
        level: 9, 
        description: 'Очень светлый блондин',
        natural: 'Очень светлый блондин',
        pigments: 'Желтый',
        lightening: 'Максимальный уровень осветления',
        coloring: 'Нужны фиолетовые тонировщики',
        lighteningTips: '✅ Почти идеальный блонд. Легкое тонирование для нейтрализации желтизны.'
    },
    'Желто-зеленый': { 
        level: 10, 
        description: 'Светлейший блондин',
        natural: 'Платиновый блондин',
        pigments: 'Минимальный желтый',
        lightening: 'Предел осветления',
        coloring: 'Идеален для холодных оттенков',
        lighteningTips: '✅ Идеальный платиновый блонд. Только поддерживающее тонирование.'
    }
};

// Общая памятка по осветлению русых в блондинок
const lighteningGuide = {
    '5-6 уровень': '💡 ИДЕАЛЬНЫЕ КАНДИДАТЫ: Легко осветляются до блонда за 1-2 этапа. Минимальный риск повреждения.',
    '7 уровень': '✅ ОТЛИЧНЫЕ КАНДИДАТЫ: Почти готовый блонд. Легкое осветление + тонирование.',
    '4 уровень': '⚠️ СРЕДНЯЯ СЛОЖНОСТЬ: Требует 2-3 этапов осветления. Высокий риск желтизны.',
    '1-3 уровень': '❌ СЛОЖНОЕ ОСВЕТЛЕНИЕ: Многократные процедуры, высокий риск повреждения. Рекомендуются темные оттенки.'
};
// Описание уровней тонов волос
const hairLevelsDescription = {
    1: "Черный - самый темный натуральный тон",
    2: "Темно-коричневый - очень темный коричневый",
    3: "Темный шатен - средне-темный коричневый", 
    4: "Шатен - средний коричневый",
    5: "Темный шатен - светло-коричневый",
    6: "Темно-рыжий - каштановый с рыжим",
    7: "Рыжий - яркий рыжий/медный",
    8: "Светло-рыжий - золотистый блондин",
    9: "Очень светлый блондин - пшеничный",
    10: "Светлейший блондин - платиновый/пепельный"
};

let currentSelectedSector = null;

// Основная функция отрисовки парикмахерского круга
function drawHairColorWheel() {
    console.log('🎨 Рисуем парикмахерский круг...');
    
    const canvas = document.getElementById('hairColorWheel');
    if (!canvas) {
        console.error('❌ Canvas не найден!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Цвета круга
    const hairColors = [
        '#FF0000', '#FF5500', '#FFAA00', '#FFFF00', 
        '#AAFF00', '#55FF00', '#00FF55', '#00FFAA', 
        '#00AAFF', '#0055FF', '#5500FF', '#AA00FF'
    ];

    const colorNames = [
        'Красный', 'Красно-оранжевый', 'Оранжевый', 'Желтый',
        'Желто-зеленый', 'Зеленый', 'Сине-зеленый', 'Голубой',
        'Синий', 'Сине-фиолетовый', 'Фиолетовый', 'Красно-фиолетовый'
    ];

    const sectors = hairColors.length;
    const angleStep = (2 * Math.PI) / sectors;

    // Рисуем сегменты
    for (let i = 0; i < sectors; i++) {
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;
        
        // Рисуем сегмент
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        // Заливка
        ctx.fillStyle = hairColors[i];
        ctx.fill();
        
        // Граница
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Цифры уровней - с обводкой для читаемости
        const middleAngle = startAngle + angleStep / 2;
        const textRadius = radius * 0.7;
        const textX = centerX + Math.cos(middleAngle) * textRadius;
        const textY = centerY + Math.sin(middleAngle) * textRadius;
        const level = hairTonesTable[colorNames[i]].level;
        
        // Белая обводка
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(level, textX, textY);
        
        // Черный текст
        ctx.fillStyle = '#000000';
        ctx.fillText(level, textX, textY);
    }

    // Подсветка выбранного сегмента
    if (currentSelectedSector !== null) {
        const i = currentSelectedSector;
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;
        
        // Свечение
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 8, startAngle, endAngle);
        ctx.strokeStyle = hairColors[i];
        ctx.lineWidth = 12;
        ctx.shadowColor = hairColors[i];
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Белая обводка
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    // Центральный круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Текст в центре
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Уровни тонов', centerX, centerY);
}

// Обработчик клика по кругу
function initHairWheelClick() {
    const canvas = document.getElementById('hairColorWheel');
    if (!canvas) return;
    
    const hairColors = ['#FF0000', '#FF5500', '#FFAA00', '#FFFF00', '#AAFF00', '#55FF00', '#00FF55', '#00FFAA', '#00AAFF', '#0055FF', '#5500FF', '#AA00FF'];
    const colorNames = ['Красный', 'Красно-оранжевый', 'Оранжевый', 'Желтый', 'Желто-зеленый', 'Зеленый', 'Сине-зеленый', 'Голубой', 'Синий', 'Сине-фиолетовый', 'Фиолетовый', 'Красно-фиолетовый'];
    const sectors = hairColors.length;
    const angleStep = (2 * Math.PI) / sectors;
    
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        const x = event.clientX - rect.left - centerX;
        const y = event.clientY - rect.top - centerY;
        
        const distance = Math.sqrt(x * x + y * y);
        if (distance <= radius && distance >= radius * 0.3) {
            const angle = Math.atan2(y, x);
            const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
            const sector = Math.floor(normalizedAngle / angleStep);
            
            currentSelectedSector = sector;
            showColorInfo(sector);
            drawHairColorWheel();
        }
    });
}

// Функция показа информации о цвете
function showColorInfo(sector) {
    const hairColors = ['#FF0000', '#FF5500', '#FFAA00', '#FFFF00', '#AAFF00', '#55FF00', '#00FF55', '#00FFAA', '#00AAFF', '#0055FF', '#5500FF', '#AA00FF'];
    const colorNames = ['Красный', 'Красно-оранжевый', 'Оранжевый', 'Желтый', 'Желто-зеленый', 'Зеленый', 'Сине-зеленый', 'Голубой', 'Синий', 'Сине-фиолетовый', 'Фиолетовый', 'Красно-фиолетовый'];
    
    const resultElement = document.getElementById('hairColorResult');
    const colorName = colorNames[sector];
    const neutralization = neutralizationTable[colorName];
    const hairTone = hairTonesTable[colorName];
    const levelDescription = hairLevelsDescription[hairTone.level];
    
    let resultHTML = `
        <div style="margin-bottom: 20px; font-size: 16px; color: #000000;">
            <strong>🎯 Выбран цвет:</strong> ${colorName}
        </div>
        
        <div style="background: ${hairColors[sector]}; color: #000000; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center; font-weight: bold; font-size: 16px; border: 2px solid #333;">
            🎨 Основной цвет
        </div>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 5px solid #2196f3; color: #000000;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #000000;">💇 Уровень тона: ${hairTone.level}/10</div>
            <div style="margin-bottom: 5px; color: #000000;"><strong>Описание:</strong> ${hairTone.description}</div>
            <div style="margin-bottom: 5px; color: #000000;"><strong>Натуральный:</strong> ${hairTone.natural}</div>
            <div style="margin-bottom: 5px; color: #000000;"><strong>Пигменты:</strong> ${hairTone.pigments}</div>
            <div style="margin-bottom: 5px; color: #000000;"><strong>Осветление:</strong> ${hairTone.lightening}</div>
            <div style="margin-bottom: 5px; color: #000000;"><strong>Окрашивание:</strong> ${hairTone.coloring}</div>
            <div style="font-style: italic; color: #000000; margin-top: 8px;">${levelDescription}</div>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 5px solid #ffc107; color: #000000;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #000000;">💡 Осветление в блонд</div>
            <div style="color: #000000;">${hairTone.lighteningTips}</div>
        </div> 
        `;
    
    
    resultElement.innerHTML = resultHTML;
    resultElement.style.padding = '20px';
    resultElement.style.borderRadius = '10px';
    resultElement.style.background = '#fff';
    resultElement.style.border = '2px solid #e9ecef';
    resultElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
}

// Функция сброса выбора
function resetHairColorSelection() {
    currentSelectedSector = null;
    const resultElement = document.getElementById('hairColorResult');
    resultElement.innerHTML = '<div style="text-align: center; color: #666; padding: 30px; font-size: 16px;">—</div>';
    resultElement.style.background = 'transparent';
    resultElement.style.border = 'none';
    resultElement.style.boxShadow = 'none';
    drawHairColorWheel();
}

// Функция показа таблицы уровней
function showHairLevelsTable() {
    const resultElement = document.getElementById('hairColorResult');
    let tableHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <h3 style="margin-top: 0; color: #333; text-align: center;">📊 Таблица уровней тонов волос</h3>
    `;
    
    for (let level = 1; level <= 10; level++) {
        const description = hairLevelsDescription[level];
        tableHTML += `
            <div style="background: white; padding: 12px 15px; margin: 8px 0; border-radius: 6px; border-left: 4px solid #667eea; font-size: 14px; color: #000000;">
                <strong style="color: #000000;">Уровень ${level}:</strong> ${description}
            </div>
        `;
    }
    
    tableHTML += `</div>`;
    resultElement.innerHTML = tableHTML;
    resultElement.style.padding = '20px';
    resultElement.style.background = '#fff';
    resultElement.style.border = '2px solid #e9ecef';
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация парикмахерского круга...');
    drawHairColorWheel();
    initHairWheelClick();
});

// Глобальные функции
window.drawHairColorWheel = drawHairColorWheel;
window.resetHairColorSelection = resetHairColorSelection;
window.showHairLevelsTable = showHairLevelsTable;

console.log('✅ Парикмахерский круг загружен!');
