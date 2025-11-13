document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");

    // скрываем все страницы
    document.querySelectorAll(".tab-page").forEach(page => {
      page.style.display = "none";
    });

    // показываем выбранную
    const activePage = document.getElementById(tabId);
    if (activePage) activePage.style.display = "block";

    // отрисовка для нужных вкладок
    if (tabId === "colorwheel") {
      drawHairColorWheel();
    }
    if (tabId === "stylistWheel") {
      drawStylistColorWheel();
    }
  });
});
