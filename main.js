// Переключение вкладок
const tabBtns = document.querySelectorAll(".tab-btn");
const pages = document.querySelectorAll(".tab-page");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // снимаем активность со всех
    tabBtns.forEach(b => b.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));

    // активируем выбранную
    btn.classList.add("active");
    const targetPage = document.getElementById(btn.dataset.tab);
    if (targetPage) targetPage.classList.add("active");

    // плавная анимация появления
    targetPage.style.opacity = 0;
    setTimeout(() => targetPage.style.opacity = 1, 50);
  });
});
