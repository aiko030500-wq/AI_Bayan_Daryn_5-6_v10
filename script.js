function show(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goBack() {
  history.back();
}
function goForward() {
  history.forward();
}

/* ======== AI Bayan Trainer ======== */
function trainerAdd(text, from = "ai", save = true) {
  const log = document.getElementById("trainerLog");
  const d = document.createElement("div");
  d.className = "trainer-msg " + (from === "user" ? "trainer-user" : "trainer-ai");
  d.textContent = text;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  if (save) {
    const data = JSON.parse(localStorage.getItem("trainer_history") || "[]");
    data.push({ text, from });
    localStorage.setItem("trainer_history", JSON.stringify(data));
  }
}

function trainerLangDetect(text) {
  return /[а-яё]/i.test(text) ? "ru" : "en";
}

function trainerTip(lang) {
  const tips_en = [
    "💡 Tip: Read short English texts every day.",
    "💡 Tip: Learn 5 new words daily.",
    "💡 Tip: Speak aloud to practice pronunciation.",
    "💡 Tip: Review your mistakes — they are your best teacher.",
    "💡 Tip: Watch cartoons in English with subtitles."
  ];
  const tips_ru = [
    "💡 Совет дня: Читай короткие тексты на английском каждый день.",
    "💡 Совет дня: Учись по 5 новых слов ежедневно.",
    "💡 Совет дня: Повторяй ошибки — они лучший учитель.",
    "💡 Совет дня: Смотри мультфильмы на английском с субтитрами."
  ];
  return (lang === "ru" ? tips_ru : tips_en)[Math.floor(Math.random() * 5)];
}

function trainerSend() {
  const input = document.getElementById("trainerInput");
  const text = input.value.trim();
  if (!text) return;
  trainerAdd(text, "user");
  input.value = "";

  const lang = trainerLangDetect(text);
  let reply = "";

  if (lang === "ru") {
    if (/привет|здрав/i.test(text))
      reply = "Привет! Я Байан, твой помощник. Задавай вопросы о грамматике, чтении или письме 💫";
    else if (/граммат/i.test(text))
      reply = "Грамматика — это основа языка. Например: ‘I am learning English now’.";
    else if (/слово|перевод/i.test(text))
      reply = "Чтобы перевести слово, просто напиши его — я помогу!";
    else if (/эссе|письмо/i.test(text))
      reply = "Структура эссе: вступление, основная часть, заключение. Используй firstly, however, finally.";
    else
      reply = "Я понимаю тебя 😊 Попробуй спросить о грамматике, словах или эссе!";
  } else {
    if (/hello|hi/i.test(text))
      reply = "Hello! I’m AI Bayan, your English Olympiad trainer 🌟";
    else if (/grammar/i.test(text))
      reply = "Grammar is the base of the language. Example: 'She studies English every day.'";
    else if (/essay|write/i.test(text))
      reply = "Start with an introduction, then main body, then conclusion.";
    else
      reply = "I understand! Try asking about grammar or writing tips 💡";
  }

  setTimeout(() => {
    trainerAdd(reply, "ai");
    trainerAdd(trainerTip(lang), "ai");
  }, 500);
}

function trainerClear() {
  if (!confirm("Очистить историю чата тренера?")) return;
  localStorage.removeItem("trainer_history");
  document.getElementById("trainerLog").innerHTML = "";
}

function loadQuiz(path) {
  fetch(path)
    .then(r => r.text())
    .then(t => {
      document.getElementById("quizContainer5").innerHTML = t;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("trainer_history") || "[]");
  data.forEach(msg => trainerAdd(msg.text, msg.from, false));
});
