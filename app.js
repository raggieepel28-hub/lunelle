const monthEl = document.getElementById("month");
const daysEl = document.getElementById("days");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const planEl = document.getElementById("plan");
const todoEl = document.getElementById("todos");
const memoEl = document.getElementById("memo");

const planForm = document.getElementById("planForm");
const todoForm = document.getElementById("todoForm");
const planEmoji = document.getElementById("planEmoji");

let currentDate = new Date();
let selectedDate = new Date();

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


/* =========================
   カレンダー
========================= */

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

    const date = new Date(year, month, day);

    const cell = document.createElement("div");

    cell.className = "calendar-day";


    /* 日付 */

    const number = document.createElement("div");

    number.textContent = day;

    cell.appendChild(number);


    /* 今日 */

    if (dateKey(date) === dateKey(new Date())) {

      cell.classList.add("today");

    }


    /* 選択中 */

    if (dateKey(date) === dateKey(selectedDate)) {

      cell.classList.add("selected");

    }


    /* 予定の絵文字 */

    const plans = getData(`plans-${dateKey(date)}`);

if (plans.length > 0) {
  const emojiBox = document.createElement("div");

  emojiBox.className = "calendar-emoji";
  emojiBox.textContent = plans[0].emoji || "♡";

  cell.appendChild(emojiBox);
}

    /* 日付クリック */

    cell.addEventListener("click", () => {

      selectedDate = date;
/* =========================
   Daily Schedule
========================= */

const scheduleEl = document.getElementById("schedule");
const scheduleForm = document.getElementById("scheduleForm");

function renderSchedule() {

  if (!scheduleEl) return;

  const key = dateKey(selectedDate);

  const schedules = getData(`schedules-${key}`)
    .sort((a, b) => a.time.localeCompare(b.time));

  scheduleEl.innerHTML = "";

  schedules.forEach((schedule, index) => {

    const item = document.createElement("div");

    item.className = "schedule-item";

    item.innerHTML = `
      <span class="schedule-time">${schedule.time}</span>

      <span class="schedule-emoji">${schedule.emoji || "♡"}</span>

      <span class="schedule-text">${schedule.text}</span>

      <button
        class="schedule-delete"
        onclick="deleteSchedule(${index})"
      >×</button>
    `;

    scheduleEl.appendChild(item);

  });
}


scheduleForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const key = dateKey(selectedDate);

  const schedules = getData(`schedules-${key}`);

  schedules.push({

    time: document.getElementById("scheduleTime").value,

    text: document.getElementById("scheduleText").value,

    emoji: document.getElementById("scheduleEmoji").value

  });

  saveData(`schedules-${key}`, schedules);

  scheduleForm.reset();

  renderSchedule();

});


function deleteSchedule(index) {

  const key = dateKey(selectedDate);

  const schedules = getData(`schedules-${key}`);

  schedules.splice(index, 1);

  saveData(`schedules-${key}`, schedules);

  renderSchedule();

}
      renderCalendar();

      renderData();

    });


    daysEl.appendChild(cell);

  }

}


/* =========================
   月移動
========================= */

prevBtn.addEventListener("click", () => {

  currentDate.setMonth(currentDate.getMonth() - 1);

  renderCalendar();

});


nextBtn.addEventListener("click", () => {

  currentDate.setMonth(currentDate.getMonth() + 1);

  renderCalendar();

});


/* =========================
   予定表示
========================= */

function renderData() {

  const key = dateKey(selectedDate);


  /* Plans */

  const plans = getData(`plans-${key}`);

  planEl.innerHTML = "";


  plans.forEach((plan, index) => {

    const item = document.createElement("div");

    item.className = "item";


    item.innerHTML = `
      <span>${plan.emoji || "♡"}</span>
      <span>${plan.time}</span>
      <span>${plan.text}</span>
      <button onclick="deletePlan(${index})">×</button>
    `;


    planEl.appendChild(item);

  });


  /* Todo */

  const todos = getData(`todos-${key}`);

  todoEl.innerHTML = "";


  todos.forEach((todo, index) => {

    const item = document.createElement("div");

    item.className = "item";


    item.innerHTML = `
      <input
        type="checkbox"
        ${todo.done ? "checked" : ""}
        onchange="toggleTodo(${index})"
      >

      <span>${todo.text}</span>

      <button onclick="deleteTodo(${index})">×</button>
    `;


    todoEl.appendChild(item);

  });


  /* Memo */

  memoEl.value =
    localStorage.getItem(`memo-${key}`) || "";

}


/* =========================
   予定追加
========================= */

planForm.addEventListener("submit", (e) => {

  e.preventDefault();


  const key = dateKey(selectedDate);

  const plans = getData(`plans-${key}`);


  plans.push({

    time: document.getElementById("planTime").value,

    text: document.getElementById("planText").value,

    emoji: planEmoji.value

  });


  saveData(`plans-${key}`, plans);


  planForm.reset();

  planEmoji.value = "♡";


  renderCalendar();

  renderData();

});


/* =========================
   Todo追加
========================= */

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


/* =========================
   Plan削除
========================= */

function deletePlan(index) {

  const key = dateKey(selectedDate);

  const plans = getData(`plans-${key}`);


  plans.splice(index, 1);


  saveData(`plans-${key}`, plans);


  renderCalendar();

  renderData();

}


/* =========================
   Todoチェック
========================= */

function toggleTodo(index) {

  const key = dateKey(selectedDate);

  const todos = getData(`todos-${key}`);


  todos[index].done = !todos[index].done;


  saveData(`todos-${key}`, todos);


  renderData();

}


/* =========================
   Todo削除
========================= */

function deleteTodo(index) {

  const key = dateKey(selectedDate);

  const todos = getData(`todos-${key}`);


  todos.splice(index, 1);


  saveData(`todos-${key}`, todos);


  renderData();

}


/* =========================
   Memo
========================= */

memoEl.addEventListener("input", () => {

  const key = dateKey(selectedDate);

  localStorage.setItem(
    `memo-${key}`,
    memoEl.value
  );

});


/* =========================
   初期表示
========================= */

renderCalendar();
renderData();
renderSchedule();
/* =========================
   Mood & Diary
========================= */

const moodChoices = document.querySelectorAll("#moodChoices button");
const selectedMoodEl = document.getElementById("selectedMood");
const diaryEl = document.getElementById("diary");


function renderMoodDiary() {

  const key = dateKey(selectedDate);

  const savedMood =
    localStorage.getItem(`mood-${key}`) || "";

  const savedDiary =
    localStorage.getItem(`diary-${key}`) || "";


  /* Mood */

  moodChoices.forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.mood === savedMood
    );

  });


  selectedMoodEl.textContent =
    savedMood
      ? `今日の気分 ${savedMood}`
      : "今日の気分を選んでね ♡";


  /* Diary */

  diaryEl.value = savedDiary;

}


/* Moodを選択 */

moodChoices.forEach(button => {

  button.addEventListener("click", () => {

    const key = dateKey(selectedDate);

    const mood = button.dataset.mood;

    localStorage.setItem(
      `mood-${key}`,
      mood
    );

    renderMoodDiary();

  });

});


/* Diaryを保存 */

diaryEl.addEventListener("input", () => {

  const key = dateKey(selectedDate);

  localStorage.setItem(
    `diary-${key}`,
    diaryEl.value
  );

});


/* 初期表示 */

renderMoodDiary();
