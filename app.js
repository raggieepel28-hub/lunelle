const $ = (id) => document.getElementById(id);

const monthEl = $("month");
const daysEl = $("days");
const prevBtn = $("prev");
const nextBtn = $("next");

const planEl = $("plan");
const todoEl = $("todos");
const memoEl = $("memo");

const planForm = $("planForm");
const todoForm = $("todoForm");

const scheduleEl = $("schedule");
const scheduleForm = $("scheduleForm");

const diaryEl = $("diary");
const selectedMoodEl = $("selectedMood");

const moodChoices =
  document.querySelectorAll("#moodChoices button");

const tabs =
  document.querySelectorAll(".tab");

const pages =
  document.querySelectorAll(".page");


let currentDate = new Date();
let selectedDate = new Date();


/* =========================
   Data
========================= */

function dateKey(date) {

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

}


function getData(key) {

  try {

    return JSON.parse(
      localStorage.getItem(key) || "[]"
    );

  } catch {

    return [];

  }

}


function saveData(key, data) {

  localStorage.setItem(
    key,
    JSON.stringify(data)
  );

}


/* =========================
   Page
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


$("goCalendar")?.addEventListener(
  "click",
  () => showPage("calendarPage")
);


/* =========================
   Calendar
========================= */

function renderCalendar() {

  if (!daysEl) return;

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  monthEl.textContent =
    `${year}年 ${month + 1}月`;

  daysEl.innerHTML = "";


  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  const lastDate =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    const empty =
      document.createElement("div");

    daysEl.appendChild(empty);

  }


  for (
    let day = 1;
    day <= lastDate;
    day++
  ) {

    const date =
      new Date(
        year,
        month,
        day
      );

    const key =
      dateKey(date);


    const cell =
      document.createElement("div");

    cell.className =
      "calendar-day";


    const number =
      document.createElement("div");

    number.textContent =
      day;

    cell.appendChild(number);


    /* Today */

    if (
      key === dateKey(new Date())
    ) {

      cell.classList.add(
        "today"
      );

    }


    /* Selected */

    if (
      key === dateKey(selectedDate)
    ) {

      cell.classList.add(
        "selected"
      );

    }


    /* Plan emoji */

    const plans =
      getData(
        `plans-${key}`
      );

    if (plans.length) {

      const emoji =
        document.createElement(
          "div"
        );

      emoji.className =
        "calendar-emoji";

      emoji.textContent =
        plans[0].emoji || "♡";

      cell.appendChild(emoji);

    }


    /* Mood */

    const mood =
      localStorage.getItem(
        `mood-${key}`
      );


    if (mood) {

      const moodEl =
        document.createElement(
          "div"
        );

      moodEl.className =
        "calendar-mood";

      moodEl.textContent =
        mood;

      cell.appendChild(
        moodEl
      );

    }


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


    daysEl.appendChild(
      cell
    );

  }

}


/* Month */

prevBtn?.addEventListener(
  "click",
  () => {

    currentDate.setMonth(
      currentDate.getMonth() - 1
    );

    renderCalendar();

  }
);


nextBtn?.addEventListener(
  "click",
  () => {

    currentDate.setMonth(
      currentDate.getMonth() + 1
    );

    renderCalendar();

  }
);


/* =========================
   Plans
========================= */

function renderData() {

  const key =
    dateKey(selectedDate);


  /* Plans */

  const plans =
    getData(`plans-${key}`);

  planEl.innerHTML = "";


  plans.forEach(
    (plan, index) => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "item";


      item.innerHTML = `
        <span>${plan.emoji || "♡"}</span>
        <span>${plan.time}</span>
        <span>${escapeHTML(plan.text)}</span>
        <button onclick="deletePlan(${index})">
          ×
        </button>
      `;


      planEl.appendChild(
        item
      );

    }
  );


  /* Todo */

  const todos =
    getData(`todos-${key}`);

  todoEl.innerHTML = "";


  todos.forEach(
    (todo, index) => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "item";


      item.innerHTML = `
        <input
          type="checkbox"
          ${todo.done ? "checked" : ""}
          onchange="toggleTodo(${index})"
        >

        <span>
          ${escapeHTML(todo.text)}
        </span>

        <button onclick="deleteTodo(${index})">
          ×
        </button>
      `;


      todoEl.appendChild(
        item
      );

    }
  );


  /* Memo */

  memoEl.value =
    localStorage.getItem(
      `memo-${key}`
    ) || "";

}


/* Add Plan */

planForm?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const key =
      dateKey(selectedDate);


    const plans =
      getData(
        `plans-${key}`
      );


    plans.push({

      time:
        $("planTime").value,

      text:
        $("planText").value,

      emoji:
        $("planEmoji").value || "♡"

    });


    saveData(
      `plans-${key}`,
      plans
    );


    planForm.reset();


    renderCalendar();
    renderData();
    renderHome();

  }
);


function deletePlan(index) {

  const key =
    dateKey(selectedDate);

  const plans =
    getData(`plans-${key}`);


  plans.splice(
    index,
    1
  );


  saveData(
    `plans-${key}`,
    plans
  );


  renderCalendar();
  renderData();
  renderHome();

}


/* =========================
   Todo
========================= */

todoForm?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const key =
      dateKey(selectedDate);


    const todos =
      getData(
        `todos-${key}`
      );


    todos.push({

      text:
        $("todoText").value,

      done:
        false

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


function deleteTodo(index) {

  const key =
    dateKey(selectedDate);

  const todos =
    getData(`todos-${key}`);


  todos.splice(
    index,
    1
  );


  saveData(
    `todos-${key}`,
    todos
  );


  renderData();
  renderHome();

}


/* =========================
   Schedule
========================= */

function renderSchedule() {

  if (!scheduleEl) return;


  const key =
    dateKey(selectedDate);


  const schedules =
    getData(
      `schedules-${key}`
    );


  schedules.sort(
    (a, b) =>
      a.time.localeCompare(
        b.time
      )
  );


  scheduleEl.innerHTML = "";


  schedules.forEach(
    (schedule, index) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "schedule-item";


      item.innerHTML = `
        <span>
          ${schedule.time}
        </span>

        <span>
          ${schedule.emoji || "♡"}
        </span>

        <span>
          ${escapeHTML(schedule.text)}
        </span>

        <button
          onclick="deleteSchedule(${index})"
        >
          ×
        </button>
      `;


      scheduleEl.appendChild(
        item
      );

    }
  );

}


scheduleForm?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const key =
      dateKey(selectedDate);


    const schedules =
      getData(
        `schedules-${key}`
      );


    schedules.push({

      time:
        $("scheduleTime").value,

      text:
        $("scheduleText").value,

      emoji:
        $("scheduleEmoji").value || "♡"

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


function deleteSchedule(index) {

  const key =
    dateKey(selectedDate);


  const schedules =
    getData(
      `schedules-${key}`
    );


  schedules.splice(
    index,
    1
  );


  saveData(
    `schedules-${key}`,
    schedules
  );


  renderSchedule();
  renderHome();

}


/* =========================
   Memo
========================= */

memoEl?.addEventListener(
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

  const key =
    dateKey(selectedDate);


  const mood =
    localStorage.getItem(
      `mood-${key}`
    ) || "";


  moodChoices.forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.mood === mood
      );

    }
  );


  if (selectedMoodEl) {

    selectedMoodEl.textContent =
      mood
        ? `今日の気分 ${mood}`
        : "今日の気分を選んでね ♡";

  }


  if (diaryEl) {

    diaryEl.value =
      localStorage.getItem(
        `diary-${key}`
      ) || "";

  }

}


moodChoices.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const key =
          dateKey(selectedDate);


        localStorage.setItem(
          `mood-${key}`,
          button.dataset.mood
        );


        renderMoodDiary();
        renderCalendar();
        renderHome();

      }
    );

  }
);


diaryEl?.addEventListener(
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


/* =========================
   Home
========================= */

function renderHome() {

  const key =
    dateKey(selectedDate);


  const date =
    selectedDate;


  /* Date */

  const homeDate =
    $("homeDate");

  const homeWeek =
    $("homeWeek");


  if (homeDate) {

    homeDate.textContent =
      `${date.getMonth() + 1} / ${date.getDate()}`;

  }


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


  /* Greeting */

  const greeting =
    $("homeGreeting");


  if (greeting) {

    const hour =
      new Date().getHours();


    greeting.textContent =
      hour < 11
        ? "Good morning ♡"
        : hour < 18
          ? "Good afternoon ♡"
          : "Good evening ♡";

  }


  /* Mood */

  const homeMood =
    $("homeMood");


  const mood =
    localStorage.getItem(
      `mood-${key}`
    ) || "";


  if (homeMood) {

    homeMood.textContent =
      mood ||
      "今日の気分を選んでね ♡";

  }


  /* Schedule */

  const next =
    $("homeNextSchedule");


  if (next) {

    const schedules =
      getData(
        `schedules-${key}`
      );


    schedules.sort(
      (a, b) =>
        a.time.localeCompare(
          b.time
        )
    );


    if (!schedules.length) {

      next.textContent =
        "今日の予定はまだないよ ♡";

    } else {

      const item =
        schedules[0];


      next.textContent =
        `${item.time}  ${item.emoji || "♡"}  ${item.text}`;

    }

  }


  /* Todo */

  const todos =
    getData(
      `todos-${key}`
    );


  const completed =
    todos.filter(
      todo => todo.done
    ).length;


  const count =
    $("homeTodoCount");


  if (count) {

    count.textContent =
      `${completed} / ${todos.length}`;

  }


  const progress =
    $("homeProgress");


  if (progress) {

    const percent =
      todos.length
        ? completed /
          todos.length *
          100
        : 0;


    progress.style.width =
      `${percent}%`;

  }


  /* Diary */

  const homeDiary =
    $("homeDiary");


  if (homeDiary) {

    const diary =
      localStorage.getItem(
        `diary-${key}`
      ) || "";


    homeDiary.textContent =
      diary ||
      "今日のことを書いてみよう ♡";

  }

}


/* =========================
   Diary Archive
========================= */

function renderDiaryArchive() {

  const archive =
    $("diaryArchive");


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
      key.startsWith(
        "diary-"
      )
    ) {

      const text =
        localStorage.getItem(
          key
        );


      if (text) {

        entries.push({

          date:
            key.replace(
              "diary-",
              ""
            ),

          text

        });

      }

    }

  }


  entries.sort(
    (a, b) =>
      b.date.localeCompare(
        a.date
      )
  );


  if (!entries.length) {

    archive.innerHTML =
      "<p>まだDiaryがないよ ♡</p>";

    return;

  }


  entries.forEach(
    entry => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "diary-entry";


      item.innerHTML = `
        <strong>
          ${entry.date}
        </strong>

        <p>
          ${escapeHTML(entry.text)}
        </p>
      `;


      archive.appendChild(
        item
      );

    }
  );

}


/* =========================
   HTML安全処理
========================= */

function escapeHTML(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================
   Start
========================= */

renderCalendar();

renderData();

renderSchedule();

renderMoodDiary();

renderHome();

showPage("homePage");
