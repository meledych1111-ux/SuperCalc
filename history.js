let history = [];

function addToHistory(expr, result) {
  history.unshift({ expr, result });
  if (history.length > 10) history.pop();
  renderHistory();
}

function clearHistory() {
  history = [];
  renderHistory();
}

document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.expr} = ${item.result}`;
    li.classList.add("history-item");
    li.addEventListener("click", () => {
      // возвращаем весь пример в дисплей
      document.getElementById("display").textContent = `${item.expr} = ${item.result}`;
      currentInput = item.result.toString();
    });
    list.appendChild(li);
  });
}
