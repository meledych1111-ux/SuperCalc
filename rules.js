const extraRules = [
  // Алгебра
  "<strong>Формулы сокращённого умножения:</strong> (a+b)²=a²+2ab+b²; (a−b)²=a²−2ab+b²; (a+b)(a−b)=a²−b²",
  "<strong>Линейное уравнение:</strong> ax+b=0 → x=−b/a",
  "<strong>Квадратное уравнение:</strong> ax²+bx+c=0, D=b²−4ac",
  "<strong>Кубическое уравнение:</strong> ax³+bx²+cx+d=0, решение по формулам Кардано",
  "<strong>Система 2×2:</strong> Δ=a₁b₂−a₂b₁, решение по формулам Крамера",

  // Прогрессии
  "<strong>Арифметическая прогрессия:</strong> aₙ=a₁+(n−1)d; Sₙ=(a₁+aₙ)·n/2",
  "<strong>Геометрическая прогрессия:</strong> aₙ=a₁·qⁿ⁻¹; Sₙ=a₁·(qⁿ−1)/(q−1)",

  // Степени и корни
  "<strong>Степени:</strong> a⁰=1; aᵐ·aⁿ=aᵐ⁺ⁿ; (aᵐ)ⁿ=aᵐⁿ",
  "<strong>Корни:</strong> √a²=|a|; √(ab)=√a·√b",

  // Геометрия
  "<strong>Площадь прямоугольника:</strong> S=a·b",
  "<strong>Площадь треугольника:</strong> S=½·a·h",
  "<strong>Площадь круга:</strong> S=πr²",
  "<strong>Длина окружности:</strong> C=2πr",
  "<strong>Объём куба:</strong> V=a³",
  "<strong>Объём шара:</strong> V=4/3·πr³",
  "<strong>Теорема Пифагора:</strong> a²+b²=c²",
  "<strong>Формула Герона:</strong> S=√(p(p−a)(p−b)(p−c)), p=(a+b+c)/2",
  "<strong>Площадь треугольника через синус:</strong> S=½ab·sinγ",
  "<strong>Объём пирамиды:</strong> V=⅓·Sосн·h",
  "<strong>Объём цилиндра:</strong> V=πr²h",
  "<strong>Объём конуса:</strong> V=⅓·πr²h",

  // Тригонометрия
  "<strong>Основное тождество:</strong> sin²x+cos²x=1",
  "<strong>Формулы:</strong> tanx=sinx/cosx; cotx=cosx/sinx",
  "<strong>Двойной угол:</strong> sin(2x)=2sinx·cosx; cos(2x)=cos²x−sin²x",
  "<strong>Сумма и разность:</strong> sin(α±β)=sinαcosβ±cosαsinβ; cos(α±β)=cosαcosβ∓sinαsinβ",
  "<strong>Формулы приведения:</strong> sin(π−x)=sinx; cos(π−x)=−cosx",

  // Логарифмы
  "<strong>Логарифмы:</strong> logₐ1=0; logₐa=1",
  "<strong>Свойства:</strong> logₐ(bc)=logₐb+logₐc; logₐ(b/c)=logₐb−logₐc; logₐ(bⁿ)=n·logₐb",

  // Производные
  "<strong>Степенная функция:</strong> (xⁿ)'=n·xⁿ⁻¹",
  "<strong>Тригонометрия:</strong> (sinx)'=cosx; (cosx)'=−sinx",
  "<strong>Показательная:</strong> (e^x)'=e^x; (a^x)'=a^x·ln a",
  "<strong>Логарифмическая:</strong> (lnx)'=1/x",
  "<strong>Правила:</strong> (f+g)'=f'+g'; (f·g)'=f'g+fg'; (f/g)'=(f'g−fg')/g²",

  // Интегралы
  "<strong>Степенная функция:</strong> ∫xⁿ dx=xⁿ⁺¹/(n+1)+C",
  "<strong>Основные:</strong> ∫1/x dx=ln|x|+C; ∫e^x dx=e^x+C",
  "<strong>Тригонометрия:</strong> ∫sinx dx=−cosx+C; ∫cosx dx=sinx+C",

  // Комбинаторика и вероятность
  "<strong>Факториал:</strong> n!=1·2·3·...·n",
  "<strong>Размещения:</strong> Aₙᵏ=n!/(n−k)!",
  "<strong>Сочетания:</strong> Cₙᵏ=n!/(k!(n−k)!)",
  "<strong>Бином Ньютона:</strong> (a+b)ⁿ=Σ Cₙᵏ·aⁿ⁻ᵏ·bᵏ",
  "<strong>Вероятность:</strong> P(A)=m/n"
];

document.getElementById("showMoreRules").addEventListener("click", () => {
  const rulesContent = document.getElementById("rulesContent");
  extraRules.forEach(rule => {
    const li = document.createElement("li");
    li.innerHTML = rule;
    rulesContent.querySelector("ul").appendChild(li);
  });
  document.getElementById("showMoreRules").disabled = true;
});
document.getElementById("searchRuleBtn").addEventListener("click", () => {
  const query = document.getElementById("searchRuleInput").value.toLowerCase();
  const rulesList = document.querySelectorAll("#rulesContent ul li");

  rulesList.forEach(li => {
    if (li.textContent.toLowerCase().includes(query)) {
      li.style.backgroundColor = "yellow"; // подсветка найденного
    } else {
      li.style.backgroundColor = "";
    }
  });
});

