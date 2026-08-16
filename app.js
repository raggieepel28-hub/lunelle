const monthEl = document.getElementById("month");
const daysEl = document.getElementById("days");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const planEl = document.getElementById("plan");
const todoEl = document.getElementById("todos");
const memoEl = document.getElementById("memo");

const planForm = document.getElementById("planForm");
const todoForm = document.getElementById("todoForm");

let currentDate = new Date();
let selectedDate = new Date();

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthEl.textContent = `${year}年 ${month + 1}月`;
  daysEl.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.style.background = "transparent";
    daysEl.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement("div");
    const date = new Date(year, month, day);

    cell.textContent = day;

    if (dateKey(date) === dateKey(new Date())) {
      cell.classList.add("today");
    }

    if (dateKey(date) === dateKey(selectedDate)) {
      cell.classList.add("selected");
    }

    cell.addEventListener("click", () => {
      selectedDate = date;
      renderCalendar();
      renderData();
    });

    daysEl.appendChild(cell);
  }
}

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

function getData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function renderData() {
  const key = dateKey(selectedDate);

  const plans = getData(`plans-${key}`);
  planEl.innerHTML = "";

  plans.forEach((plan, index) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <span>♡ ${plan.time}</span>
      <span>${plan.text}</span>
      <button onclick="deletePlan(${index})">×</button>
    `;
    planEl.appendChild(item);
  });

  const todos = getData(`todos-${key}`);
  todoEl.innerHTML = "";

  todos.forEach((todo, index) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <input type="checkbox" ${todo.done ? "checked" : ""} onchange="toggleTodo(${index})">
      <span>${todo.text}</span>
      <button onclick="deleteTodo(${index})">×</button>
    `;
    todoEl.appendChild(item);
  });

  memoEl.value = localStorage.getItem(`memo-${key}`) || "";
}

planForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const key = dateKey(selectedDate);
  const plans = getData(`plans-${key}`);

  plans.push({
    time: document.getElementById("planTime").value,
    text: document.getElementById("planText").value
  });

  saveData(`plans-${key}`, plans);

  planForm.reset();
  renderData();
});

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const key = dateKey(selectedDate);
  const todos = getData(`todos-${key}`);

  todos.push({
    text: document.getElementById("todoText").value,
    done: false
  });

  saveData(`todos-${key}`, todos);

  todoForm.reset();
  renderData();
});

function deletePlan(index) {
  const key = dateKey(selectedDate);
  const plans = getData(`plans-${key}`);

  plans.splice(index, 1);
  saveData(`plans-${key}`, plans);
  renderData();
}

function toggleTodo(index) {
  const key = dateKey(selectedDate);
  const todos = getData(`todos-${key}`);

  todos[index].done = !todos[index].done;

  saveData(`todos-${key}`, todos);
  renderData();
}

function deleteTodo(index) {
  const key = dateKey(selectedDate);
  const todos = getData(`todos-${key}`);

  todos.splice(index, 1);
  saveData(`todos-${key}`, todos);
  renderData();
}

memoEl.addEventListener("input", () => {
  const key = dateKey(selectedDate);
  localStorage.setItem(`memo-${key}`, memoEl.value);
});

renderCalendar();
renderData();
