// physics.js — поиск по формулам физики
document.getElementById("searchPhysicsBtn").addEventListener("click", () => {
  const query = document.getElementById("searchPhysicsInput").value.toLowerCase();
  const items = document.querySelectorAll("#physicsContent li");
  items.forEach(item => {
    if (item.textContent.toLowerCase().includes(query)) {
      item.style.background = "linear-gradient(135deg, var(--accent2), var(--accent3))";
      item.style.color = "#000";
    } else {
      item.style.background = "";
      item.style.color = "";
    }
  });
});
