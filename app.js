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

const scheduleEl = document.getElementById("schedule");
const scheduleForm = document.getElementById("scheduleForm");

const moodChoices = document.querySelectorAll("#moodChoices button");
const selectedMoodEl = document.getElementById("selectedMood");
const diaryEl = document.getElementById("diary");

const homeDate = document.getElementById("homeDate");
const homeWeek = document.getElementById("homeWeek");
const homeGreeting = document.getElementById("homeGreeting");
const homeMood = document.getElementById("homeMood");
const homeNextSchedule = document.getElementById("homeNextSchedule");
const homeTodoCount = document.getElementById("homeTodoCount");
const homeProgress = document.getElementById("homeProgress");
const homeDiary = document.getElementById("homeDiary");

const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".page");
const goCalendar = document.getElementById("goCalendar");


let currentDate = new Date();
let selectedDate = new Date();


/* =========================
   基本機能
========================= */

function dateKey(date) {

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

}


function getData(key) {

  return JSON.parse(
    localStorage.getItem(key) || "[]"
  );

}


function saveData(key, data) {

  localStorage.setItem(
    key,
    JSON.stringify(data)
  );

}


/* =========================
   ページ切り替え
========================= */

function showPage(pageId) {

  pages.forEach(page => {

    page.style.display =
      page.id === pageId
        ? "block"
        : "none";

  });


  tabs.forEach(tab => {

    tab.classList.toggle(
      "active",
      tab.dataset.page === pageId
    );

  });


  if (pageId === "homePage") {

    renderHome();

  }


  if (pageId === "diaryPage") {

    renderDiaryArchive();

  }

}


tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    showPage(tab.dataset.page);

  });

});


if (goCalendar) {

  goCalendar.addEventListener("click", () => {

    showPage("calendarPage");

  });

}


/* =========================
   カレンダー
========================= */

function renderCalendar() {

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthEl.textContent =
    `${year}年 ${month + 1}月`;

  daysEl.innerHTML = "";

  const firstDay =
    new Date(year, month, 1).getDay();

  const lastDate =
    new Date(year, month + 1, 0).getDate();


  /* 月初の空白 */

  for (let i = 0; i < firstDay; i++) {

    const empty =
      document.createElement("div");

    empty.style.background =
      "transparent";

    daysEl.appendChild(empty);

  }


  /* 日付 */

  for (
    let day = 1;
    day <= lastDate;
    day++
  ) {

    const date =
      new Date(year, month, day);

    const key =
      dateKey(date);

    const cell =
      document.createElement("div");

    cell.className =
      "calendar-day";


    /* 日付 */

    const number =
      document.createElement("div");

    number.textContent =
      day;

    cell.appendChild(number);


    /* 今日 */

    if (
      key === dateKey(new Date())
    ) {

      cell.classList.add("today");

    }


    /* 選択中 */

    if (
      key === dateKey(selectedDate)
    ) {

      cell.classList.add("selected");

    }


    /* 予定マーク */

    const plans =
      getData(`plans-${key}`);

    if (plans.length > 0) {

      const emojiBox =
        document.createElement("div");

      emojiBox.className =
        "calendar-emoji";

      emojiBox.textContent =
        plans[0].emoji || "♡";

      cell.appendChild(emojiBox);

    }


    /* Mood */

    const savedMood =
      localStorage.getItem(
        `mood-${key}`
      ) || "";

    if (savedMood) {

      const moodBox =
        document.createElement("div");

      moodBox.className =
        "calendar-mood";

      moodBox.textContent =
        savedMood;

      cell.appendChild(moodBox);

    }


    /* クリック */

    cell.addEventListener(
      "click",
      () => {

        selectedDate = date;

        renderCalendar();
        renderData();
        renderSchedule();
        renderMoodDiary();
        renderHome();

      }
    );


    daysEl.appendChild(cell);

  }

}


/* =========================
   月移動
========================= */

prevBtn.addEventListener(
  "click",
  () => {

    currentDate.setMonth(
      currentDate.getMonth() - 1
    );

    renderCalendar();

  }
);


nextBtn.addEventListener(
  "click",
  () => {

    currentDate.setMonth(
      currentDate.getMonth() + 1
    );

    renderCalendar();

  }
);


/* =========================
   Plan / Todo / Memo
========================= */

function renderData() {

  const key =
    dateKey(selectedDate);


  /* Plan */

  const plans =
    getData(`plans-${key}`);

  planEl.innerHTML = "";

  plans.forEach(
    (plan, index) => {

      const item =
        document.createElement("div");

      item.className =
        "item";

      item.innerHTML = `
        <span>${plan.emoji || "♡"}</span>
        <span>${plan.time}</span>
        <span>${plan.text}</span>
        <button onclick="deletePlan(${index})">×</button>
      `;

      planEl.appendChild(item);

    }
  );


  /* Todo */

  const todos =
    getData(`todos-${key}`);

  todoEl.innerHTML = "";

  todos.forEach(
    (todo, index) => {

      const item =
        document.createElement("div");

      item.className =
        "item";

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

    }
  );


  /* Memo */

  memoEl.value =
    localStorage.getItem(
      `memo-${key}`
    ) || "";

}


/* =========================
   Daily Schedule
========================= */

function renderSchedule() {

  if (!scheduleEl) return;

  const key =
    dateKey(selectedDate);

  const schedules =
    getData(`schedules-${key}`)
      .sort(
        (a, b) =>
          a.time.localeCompare(b.time)
      );

  scheduleEl.innerHTML = "";

  schedules.forEach(
    (schedule, index) => {

      const item =
        document.createElement("div");

      item.className =
        "schedule-item";

      item.innerHTML = `
        <span class="schedule-time">
          ${schedule.time}
        </span>

        <span class="schedule-emoji">
          ${schedule.emoji || "♡"}
        </span>

        <span class="schedule-text">
          ${schedule.text}
        </span>

        <button
          class="schedule-delete"
          onclick="deleteSchedule(${index})"
        >
          ×
        </button>
      `;

      scheduleEl.appendChild(item);

    }
  );

}


if (scheduleForm) {

  scheduleForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const key =
        dateKey(selectedDate);

      const schedules =
        getData(`schedules-${key}`);

      schedules.push({

        time:
          document.getElementById(
            "scheduleTime"
          ).value,

        text:
          document.getElementById(
            "scheduleText"
          ).value,

        emoji:
          document.getElementById(
            "scheduleEmoji"
          ).value || "♡"

      });

      saveData(
        `schedules-${key}`,
        schedules
      );

      scheduleForm.reset();

      renderSchedule();
      renderHome();

    }
  );

}


function deleteSchedule(index) {

  const key =
    dateKey(selectedDate);

  const schedules =
    getData(`schedules-${key}`);

  schedules.splice(index, 1);

  saveData(
    `schedules-${key}`,
    schedules
  );

  renderSchedule();
  renderHome();

}


/* =========================
   Plan追加
========================= */

planForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const key =
      dateKey(selectedDate);

    const plans =
      getData(`plans-${key}`);

    plans.push({

      time:
        document.getElementById(
          "planTime"
        ).value,

      text:
        document.getElementById(
          "planText"
        ).value,

      emoji:
        planEmoji
          ? planEmoji.value || "♡"
          : "♡"

    });

    saveData(
      `plans-${key}`,
      plans
    );

    planForm.reset();

    if (planEmoji) {

      planEmoji.value = "♡";

    }

    renderCalendar();
    renderData();
    renderHome();

  }
);


/* =========================
   Todo追加
========================= */

todoForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const key =
      dateKey(selectedDate);

    const todos =
      getData(`todos-${key}`);

    todos.push({

      text:
        document.getElementById(
          "todoText"
        ).value,

      done: false

    });

    saveData(
      `todos-${key}`,
      todos
    );

    todoForm.reset();

    renderData();
    renderHome();

  }
);


/* =========================
   Plan削除
========================= */

function deletePlan(index) {

  const key =
    dateKey(selectedDate);

  const plans =
    getData(`plans-${key}`);

  plans.splice(index, 1);

  saveData(
    `plans-${key}`,
    plans
  );

  renderCalendar();
  renderData();
  renderHome();

}


/* =========================
   Todoチェック
========================= */

function toggleTodo(index) {

  const key =
    dateKey(selectedDate);

  const todos =
    getData(`todos-${key}`);

  todos[index].done =
    !todos[index].done;

  saveData(
    `todos-${key}`,
    todos
  );

  renderData();
  renderHome();

}


/* =========================
   Todo削除
========================= */

function deleteTodo(index) {

  const key =
    dateKey(selectedDate);

  const todos =
    getData(`todos-${key}`);

  todos.splice(index, 1);

  saveData(
    `todos-${key}`,
    todos
  );

  renderData();
  renderHome();

}


/* =========================
   Memo
========================= */

memoEl.addEventListener(
  "input",
  () => {

    const key =
      dateKey(selectedDate);

    localStorage.setItem(
      `memo-${key}`,
      memoEl.value
    );

  }
);


/* =========================
   Mood
========================= */

function renderMoodDiary() {

  if (!selectedMoodEl || !diaryEl) {
    return;
  }

  const key =
    dateKey(selectedDate);

  const savedMood =
    localStorage.getItem(
      `mood-${key}`
    ) || "";

  const savedDiary =
    localStorage.getItem(
      `diary-${key}`
    ) || "";


  moodChoices.forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.mood ===
        savedMood
      );

    }
  );


  selectedMoodEl.textContent =
    savedMood
      ? `今日の気分 ${savedMood}`
      : "今日の気分を選んでね ♡";


  diaryEl.value =
    savedDiary;

}


moodChoices.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const key =
          dateKey(selectedDate);

        const mood =
          button.dataset.mood;

        localStorage.setItem(
          `mood-${key}`,
          mood
        );

        renderMoodDiary();
        renderCalendar();
        renderHome();

      }
    );

  }
);


if (diaryEl) {

  diaryEl.addEventListener(
    "input",
    () => {

      const key =
        dateKey(selectedDate);

      localStorage.setItem(
        `diary-${key}`,
        diaryEl.value
      );

      renderHome();

    }
  );

}


/* =========================
   Home
========================= */

function renderHome() {

  const key =
    dateKey(selectedDate);

  const date =
    selectedDate;


  /* 日付 */

  if (homeDate) {

    homeDate.textContent =
      `${date.getMonth() + 1} / ${date.getDate()}`;

  }


  /* 曜日 */

  if (homeWeek) {

    const weeks = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    homeWeek.textContent =
      weeks[date.getDay()];

  }


  /* 挨拶 */

  if (homeGreeting) {

    const hour =
      new Date().getHours();

    if (hour < 11) {

      homeGreeting.textContent =
        "Good morning ♡";

    } else if (hour < 18) {

      homeGreeting.textContent =
        "Good afternoon ♡";

    } else {

      homeGreeting.textContent =
        "Good evening ♡";

    }

  }


  /* Mood */

  const mood =
    localStorage.getItem(
      `mood-${key}`
    ) || "";

  if (homeMood) {

    homeMood.textContent =
      mood
        ? mood
        : "今日の気分を選んでね ♡";

  }


  /* Schedule */

  if (homeNextSchedule) {

    const schedules =
      getData(`schedules-${key}`)
        .sort(
          (a, b) =>
            a.time.localeCompare(b.time)
        );

    if (schedules.length === 0) {

      homeNextSchedule.textContent =
        "今日の予定はまだないよ ♡";

    } else {

      const next =
        schedules[0];

      homeNextSchedule.textContent =
        `${next.time}  ${next.emoji || "♡"}  ${next.text}`;

    }

  }


  /* Todo */

  const todos =
    getData(`todos-${key}`);

  const total =
    todos.length;

  const completed =
    todos.filter(
      todo => todo.done
    ).length;


  if (homeTodoCount) {

    homeTodoCount.textContent =
      `${completed} / ${total}`;

  }


  if (homeProgress) {

    const percentage =
      total === 0
        ? 0
        : (completed / total) * 100;

    homeProgress.style.width =
      `${percentage}%`;

  }


  /* Diary */

  const diary =
    localStorage.getItem(
      `diary-${key}`
    ) || "";

  if (homeDiary) {

    homeDiary.textContent =
      diary
        ? diary
        : "今日のことを書いてみよう ♡";

  }

}


/* =========================
   Diary Archive
========================= */

function renderDiaryArchive() {

  const archive =
    document.getElementById(
      "diaryArchive"
    );

  if (!archive) return;

  archive.innerHTML = "";

  const entries = [];

  for (
    let i = 0;
    i < localStorage.length;
    i++
  ) {

    const key =
      localStorage.key(i);

    if (
      key &&
      key.startsWith("diary-")
    ) {

      const diary =
        localStorage.getItem(key);

      if (diary) {

        entries.push({
          date:
            key.replace(
              "diary-",
              ""
            ),

          text:
            diary
        });

      }

    }

  }


  entries.sort(
    (a, b) =>
      b.date.localeCompare(a.date)
  );


  if (entries.length === 0) {

    archive.innerHTML = `
      <p>
        まだDiaryがないよ ♡
      </p>
    `;

    return;

  }


  entries.forEach(
    entry => {

      const item =
        document.createElement("div");

      item.className =
        "diary-entry";

      item.innerHTML = `
        <div class="diary-entry-date">
          ${entry.date}
        </div>

        <div class="diary-entry-text">
          ${entry.text}
        </div>
      `;

      archive.appendChild(item);

    }
  );

}


/* =========================
   初期表示
========================= */

renderCalendar();

renderData();

renderSchedule();

renderMoodDiary();

renderHome();

showPage("homePage");
