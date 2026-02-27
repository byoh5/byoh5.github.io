const SETTINGS_KEY = "gugudan_v2_settings";
const SESSIONS_KEY = "gugudan_sessions";
const LANG_KEY = "gugudan-language";
const SESSION_LIMIT = 30;
const I18N = window.APP_V2_I18N || { ko: {} };

const LOCALE_MAP = {
  ko: "ko-KR",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-PT",
  vi: "vi-VN",
  th: "th-TH",
  id: "id-ID",
};

const DEFAULT_SETTINGS = {
  tableMin: 2,
  tableMax: 9,
  extendTo20: false,
  mode: "practice", // practice | challenge | mistake
  order: "shuffle", // shuffle | inOrder
  totalQuestions: 10,
  answerUI: "keypad", // keypad | choices
  ttsEnabled: true,
  autoSpeak: true,
  hearts: 3,
  timeLimitSec: 6,
};

const state = {
  phase: "start", // start | playing | paused | result
  tab: "learn", // learn | history
  lang: "ko",
  settings: { ...DEFAULT_SETTINGS },
  sessions: [],
  session: null,
  lastFeedback: "",
  ticker: null,
  notice: "",
};

const el = {
  workspace: document.getElementById("workspace"),
  topBar: document.getElementById("topBar"),
  tabs: Array.from(document.querySelectorAll(".v2-tab")),
  mainLanguageSelect: document.getElementById("mainLanguageSelect"),

  startScreen: document.getElementById("startScreen"),
  playScreen: document.getElementById("playScreen"),
  resultScreen: document.getElementById("resultScreen"),
  historyScreen: document.getElementById("historyScreen"),
  pauseOverlay: document.getElementById("pauseOverlay"),

  missionSummary: document.getElementById("missionSummary"),
  missionMeta: document.getElementById("missionMeta"),
  quickStartBtn: document.getElementById("quickStartBtn"),
  startCustomBtn: document.getElementById("startCustomBtn"),

  modeCards: Array.from(document.querySelectorAll(".v2-mode-card")),
  tableMinRange: document.getElementById("tableMinRange"),
  tableMaxRange: document.getElementById("tableMaxRange"),
  tableRangeLabel: document.getElementById("tableRangeLabel"),
  countButtons: Array.from(document.querySelectorAll("#countButtons .v2-chip")),
  orderButtons: Array.from(document.querySelectorAll("#orderButtons .v2-chip")),
  autoSpeakToggle: document.getElementById("autoSpeakToggle"),

  advancedToggle: document.getElementById("advancedToggle"),
  advancedSettings: document.getElementById("advancedSettings"),
  extendToggle: document.getElementById("extendToggle"),
  answerUISelect: document.getElementById("answerUISelect"),
  heartsRange: document.getElementById("heartsRange"),
  heartsValue: document.getElementById("heartsValue"),
  timeLimitRange: document.getElementById("timeLimitRange"),
  timeLimitValue: document.getElementById("timeLimitValue"),

  hudHearts: document.getElementById("hudHearts"),
  hudProgress: document.getElementById("hudProgress"),
  hudStars: document.getElementById("hudStars"),
  hudProgressBar: document.getElementById("hudProgressBar"),
  hudCombo: document.getElementById("hudCombo"),
  hudTimer: document.getElementById("hudTimer"),
  hudCountdown: document.getElementById("hudCountdown"),

  questionCard: document.getElementById("questionCard"),
  questionText: document.getElementById("questionText"),
  feedbackText: document.getElementById("feedbackText"),
  speakBtn: document.getElementById("speakBtn"),

  keypadWrap: document.getElementById("keypadWrap"),
  answerDisplay: document.getElementById("answerDisplay"),
  keypadGrid: document.getElementById("keypadGrid"),
  choicesWrap: document.getElementById("choicesWrap"),
  choicesGrid: document.getElementById("choicesGrid"),

  pauseBtn: document.getElementById("pauseBtn"),
  hintBtn: document.getElementById("hintBtn"),
  skipBtn: document.getElementById("skipBtn"),
  resumeBtn: document.getElementById("resumeBtn"),

  resultHeadline: document.getElementById("resultHeadline"),
  resultAccuracy: document.getElementById("resultAccuracy"),
  resultStars: document.getElementById("resultStars"),
  resultBestCombo: document.getElementById("resultBestCombo"),
  resultDuration: document.getElementById("resultDuration"),
  retryBtn: document.getElementById("retryBtn"),
  retryMistakeBtn: document.getElementById("retryMistakeBtn"),
  showHistoryBtn: document.getElementById("showHistoryBtn"),

  historyList: document.getElementById("historyList"),
  mistakeTopList: document.getElementById("mistakeTopList"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function pad2(v) {
  return String(v).padStart(2, "0");
}

function formatDuration(totalSec) {
  const sec = Math.max(0, Math.floor(totalSec));
  const min = Math.floor(sec / 60);
  const rest = sec % 60;
  return `${pad2(min)}:${pad2(rest)}`;
}

function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function t(key, vars = {}) {
  const pack = I18N[state.lang] || I18N.ko || {};
  const template = pack[key] ?? I18N.en?.[key] ?? I18N.ko?.[key] ?? key;
  return String(template).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-meta]").forEach((node) => {
    const key = node.dataset.i18nMeta;
    node.setAttribute("content", t(key));
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    node.setAttribute("placeholder", t(key));
  });

  document.title = t("pageTitle");
  document.documentElement.lang = state.lang;
}

function getLocale() {
  return LOCALE_MAP[state.lang] || "en-US";
}

function getSpeakText(question) {
  const phraseMap = {
    ko: `${question.a} 곱하기 ${question.b}`,
    en: `${question.a} times ${question.b}`,
    zh: `${question.a} 乘以 ${question.b}`,
    ja: `${question.a} かける ${question.b}`,
    es: `${question.a} por ${question.b}`,
    fr: `${question.a} fois ${question.b}`,
    de: `${question.a} mal ${question.b}`,
    pt: `${question.a} vezes ${question.b}`,
    vi: `${question.a} nhân ${question.b}`,
    th: `${question.a} คูณ ${question.b}`,
    id: `${question.a} kali ${question.b}`,
  };
  return phraseMap[state.lang] || `${question.a} x ${question.b}`;
}

function syncAdvancedToggleLabel() {
  const expanded = el.advancedToggle.getAttribute("aria-expanded") === "true";
  el.advancedToggle.textContent = expanded ? t("advancedClose") : t("advancedOpen");
}

function normalizeSettings(next) {
  const merged = { ...DEFAULT_SETTINGS, ...next };
  merged.extendTo20 = Boolean(merged.extendTo20);
  const maxDan = merged.extendTo20 ? 20 : 9;
  merged.tableMin = clamp(Number(merged.tableMin) || 2, 2, maxDan);
  merged.tableMax = clamp(Number(merged.tableMax) || 9, merged.tableMin, maxDan);
  merged.totalQuestions = [10, 20, 30].includes(Number(merged.totalQuestions)) ? Number(merged.totalQuestions) : 10;
  merged.mode = ["practice", "challenge", "mistake"].includes(merged.mode) ? merged.mode : "practice";
  merged.order = ["shuffle", "inOrder"].includes(merged.order) ? merged.order : "shuffle";
  merged.answerUI = ["keypad", "choices"].includes(merged.answerUI) ? merged.answerUI : "keypad";
  merged.hearts = clamp(Number(merged.hearts) || 3, 1, 5);
  merged.timeLimitSec = clamp(Number(merged.timeLimitSec) || 6, 3, 20);
  merged.ttsEnabled = Boolean(merged.ttsEnabled);
  merged.autoSpeak = Boolean(merged.autoSpeak);
  return merged;
}

function modeLabel(mode) {
  const map = {
    practice: t("modePracticeTitle"),
    challenge: t("modeChallengeTitle"),
    mistake: t("modeMistakeTitle"),
  };
  return map[mode] || t("modePracticeTitle");
}

function orderLabel(order) {
  return order === "inOrder" ? t("orderInOrder") : t("orderShuffle");
}

function saveSettings() {
  writeJSON(SETTINGS_KEY, state.settings);
}

function getAllSessions() {
  const saved = readJSON(SESSIONS_KEY, []);
  return Array.isArray(saved) ? saved : [];
}

function saveSessions() {
  const sliced = state.sessions.slice(-SESSION_LIMIT);
  state.sessions = sliced;
  writeJSON(SESSIONS_KEY, sliced);
}

function initLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  state.lang = I18N[saved] ? saved : "ko";
  if (!el.mainLanguageSelect) return;

  el.mainLanguageSelect.value = state.lang;
  el.mainLanguageSelect.addEventListener("change", () => {
    const next = el.mainLanguageSelect.value;
    state.lang = I18N[next] ? next : "ko";
    localStorage.setItem(LANG_KEY, state.lang);
    applyTranslations();
    syncAdvancedToggleLabel();
    syncSettingUI();
    buildKeypad();
    renderTabs();
    renderHud();
    renderQuestion();
    renderResult();
    renderHistory();
    renderVisibility();
  });
}

function collectMistakePool() {
  const pool = [];
  state.sessions.forEach((session) => {
    const mistakes = Array.isArray(session.mistakes) ? session.mistakes : [];
    mistakes.forEach((item) => {
      if (item && Number.isFinite(item.a) && Number.isFinite(item.b)) {
        pool.push({ a: item.a, b: item.b, answer: item.a * item.b });
      } else if (typeof item === "string") {
        const match = item.match(/(\d+)\D+(\d+)/);
        if (match) {
          const a = Number(match[1]);
          const b = Number(match[2]);
          if (Number.isFinite(a) && Number.isFinite(b)) {
            pool.push({ a, b, answer: a * b });
          }
        }
      }
    });
  });
  return pool;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const next = arr.slice();
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildSequentialQuestions(total, minDan, maxDan) {
  const all = [];
  for (let a = minDan; a <= maxDan; a += 1) {
    for (let b = 1; b <= 9; b += 1) {
      all.push({ a, b, answer: a * b });
    }
  }

  const questions = [];
  while (questions.length < total) {
    const left = total - questions.length;
    questions.push(...all.slice(0, left));
  }
  return questions;
}

function buildShuffledQuestions(total, minDan, maxDan) {
  const all = [];
  for (let a = minDan; a <= maxDan; a += 1) {
    for (let b = 1; b <= 9; b += 1) {
      all.push({ a, b, answer: a * b });
    }
  }

  const questions = [];
  while (questions.length < total) {
    const block = shuffle(all);
    const left = total - questions.length;
    questions.push(...block.slice(0, left));
  }
  return questions;
}

function buildRandomQuestions(total, minDan, maxDan) {
  const questions = [];
  for (let i = 0; i < total; i += 1) {
    const a = randomInt(minDan, maxDan);
    const b = randomInt(1, 9);
    questions.push({ a, b, answer: a * b });
  }
  return questions;
}

function buildQuestions() {
  const { totalQuestions, tableMin, tableMax, order, mode } = state.settings;
  state.notice = "";

  if (mode === "mistake") {
    const pool = collectMistakePool();
    if (pool.length) {
      const randomPool = shuffle(pool);
      const questions = [];
      for (let i = 0; i < totalQuestions; i += 1) {
        questions.push(randomPool[i % randomPool.length]);
      }
      return questions;
    }

    state.notice = t("noticeNoMistake");
    return order === "inOrder"
      ? buildSequentialQuestions(totalQuestions, tableMin, tableMax)
      : buildShuffledQuestions(totalQuestions, tableMin, tableMax);
  }

  if (order === "inOrder") {
    return buildSequentialQuestions(totalQuestions, tableMin, tableMax);
  }

  return buildRandomQuestions(totalQuestions, tableMin, tableMax);
}

function buildChoiceSet(answer, minDan, maxDan) {
  const choices = new Set([answer]);
  while (choices.size < 4) {
    const candidate = randomInt(minDan, maxDan) * randomInt(1, 9);
    if (candidate > 0) choices.add(candidate);
  }
  return shuffle(Array.from(choices));
}

function getCurrentQuestion() {
  if (!state.session) return null;
  return state.session.questions[state.session.currentQuestionIndex] || null;
}

function updateMissionCard() {
  const { tableMin, tableMax, totalQuestions, order, mode } = state.settings;
  const bonus = totalQuestions + (mode === "challenge" ? 5 : mode === "mistake" ? 3 : 0);
  el.missionSummary.textContent = `${tableMin}~${tableMax}${t("unitDan")} · ${totalQuestions}${t("unitQuestion")} · ${orderLabel(order)}`;
  el.missionMeta.textContent = `${modeLabel(mode)} · ${t("goalStars")} +${bonus}`;
}

function syncSettingUI() {
  const s = state.settings;
  const maxDan = s.extendTo20 ? 20 : 9;

  el.tableMinRange.max = String(maxDan);
  el.tableMaxRange.max = String(maxDan);
  el.tableMinRange.value = String(s.tableMin);
  el.tableMaxRange.value = String(s.tableMax);
  el.tableRangeLabel.textContent = `${s.tableMin} ~ ${s.tableMax}${t("unitDan")}`;

  el.countButtons.forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.count) === s.totalQuestions);
  });

  el.orderButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.order === s.order);
  });

  el.modeCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.mode === s.mode);
  });

  el.autoSpeakToggle.checked = s.autoSpeak;
  el.extendToggle.checked = s.extendTo20;
  el.answerUISelect.value = s.answerUI;
  el.heartsRange.value = String(s.hearts);
  el.heartsValue.textContent = `${s.hearts}${t("unitCount")}`;
  el.timeLimitRange.value = String(s.timeLimitSec);
  el.timeLimitValue.textContent = `${s.timeLimitSec}${t("unitSecond")}`;

  updateMissionCard();
}

function renderTabs() {
  el.tabs.forEach((btn) => {
    const selected = btn.dataset.tab === state.tab;
    btn.classList.toggle("active", selected);
    btn.setAttribute("aria-selected", selected ? "true" : "false");
  });
}

function renderVisibility() {
  const isPlaying = state.phase === "playing" || state.phase === "paused";

  el.topBar.classList.toggle("v2-hidden", state.phase !== "start");
  el.startScreen.classList.toggle("v2-hidden", !(state.phase === "start" && state.tab === "learn"));
  el.historyScreen.classList.toggle("v2-hidden", !(state.phase === "start" && state.tab === "history"));
  el.playScreen.classList.toggle("v2-hidden", !isPlaying);
  el.resultScreen.classList.toggle("v2-hidden", state.phase !== "result");
  el.pauseOverlay.classList.toggle("v2-hidden", state.phase !== "paused");
}

function renderHud() {
  if (!state.session) return;

  const { currentQuestionIndex, questions, stars, combo } = state.session;
  const total = questions.length;
  const idx = currentQuestionIndex + 1;
  const ratio = total ? (idx / total) * 100 : 0;

  if (state.settings.mode === "challenge") {
    const totalHearts = state.settings.hearts;
    const text = Array.from({ length: totalHearts }, (_, i) => (i < state.session.heartsLeft ? "❤" : "♡")).join("");
    el.hudHearts.textContent = text;
  } else {
    el.hudHearts.textContent = `❤ ${t("hudPractice")}`;
  }

  el.hudProgress.textContent = `${idx} / ${total}`;
  el.hudStars.textContent = `⭐ ${stars}`;
  el.hudProgressBar.style.width = `${ratio.toFixed(2)}%`;
  el.hudCombo.textContent = `${t("hudCombo")} x${combo}`;

  const elapsed = getElapsedSec();
  el.hudTimer.textContent = formatDuration(elapsed);

  if (state.settings.mode === "challenge") {
    const remain = getQuestionRemainSec();
    el.hudCountdown.textContent = `${t("hudLimit")} ${remain.toFixed(1)}${t("unitSecond")}`;
  } else {
    el.hudCountdown.textContent = t("hudNoLimit");
  }
}

function renderQuestion() {
  const q = getCurrentQuestion();
  if (!q) return;

  el.questionText.textContent = `${q.a} × ${q.b} = ?`;
  el.feedbackText.textContent = state.lastFeedback || state.notice;
  el.answerDisplay.value = state.session.currentInput || "";

  const useChoices = state.settings.answerUI === "choices";
  el.keypadWrap.classList.toggle("v2-hidden", useChoices);
  el.choicesWrap.classList.toggle("v2-hidden", !useChoices);

  if (useChoices) {
    const choices = buildChoiceSet(q.answer, state.settings.tableMin, state.settings.tableMax);
    state.session.currentChoices = choices;
    el.choicesGrid.innerHTML = "";
    choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "v2-choice-btn";
      btn.textContent = String(choice);
      btn.addEventListener("click", () => {
        evaluateAnswer(choice, { skipped: false, timeout: false });
      });
      el.choicesGrid.appendChild(btn);
    });
  }
}

function pulseCard(correct) {
  const klass = correct ? "v2-pulse-correct" : "v2-pulse-wrong";
  el.questionCard.classList.remove("v2-pulse-correct", "v2-pulse-wrong");
  el.questionCard.classList.add(klass);
  window.setTimeout(() => {
    el.questionCard.classList.remove(klass);
  }, 320);
}

function getElapsedSec() {
  if (!state.session) return 0;
  const now = Date.now();
  const pausedNow = state.phase === "paused" ? now - state.session.pausedAt : 0;
  const elapsedMs = now - state.session.startedAt - state.session.pausedMs - pausedNow;
  return Math.max(0, Math.floor(elapsedMs / 1000));
}

function getQuestionRemainSec() {
  if (!state.session) return state.settings.timeLimitSec;
  const elapsed = (Date.now() - state.session.questionStartedAt) / 1000;
  return Math.max(0, state.settings.timeLimitSec - elapsed);
}

function speakCurrentQuestion() {
  if (!state.settings.ttsEnabled || !("speechSynthesis" in window)) return;
  const q = getCurrentQuestion();
  if (!q) return;

  const utter = new SpeechSynthesisUtterance(getSpeakText(q));
  utter.lang = getLocale();
  utter.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function applyHint() {
  const q = getCurrentQuestion();
  if (!q || !state.session || state.session.locked) return;
  const tens = Math.floor(q.answer / 10);
  if (tens > 0) {
    state.lastFeedback = t("hintRange", { low: `${tens}0`, high: `${tens + 1}0` });
  } else {
    state.lastFeedback = t("hintSingleDigit");
  }
  renderQuestion();
}

function evaluateAnswer(answer, { skipped = false, timeout = false } = {}) {
  if (!state.session || state.phase !== "playing" || state.session.locked) return;

  const q = getCurrentQuestion();
  if (!q) return;

  state.session.locked = true;
  const numericAnswer = Number(answer);
  const isCorrect = !skipped && !timeout && Number.isFinite(numericAnswer) && numericAnswer === q.answer;
  const elapsedMs = Date.now() - state.session.questionStartedAt;

  if (isCorrect) {
    state.session.correct += 1;
    state.session.stars += 1;
    state.session.combo += 1;
    state.session.bestCombo = Math.max(state.session.bestCombo, state.session.combo);
    state.lastFeedback = t("feedbackCorrect");
  } else {
    state.session.combo = 0;
    if (state.settings.mode === "challenge") {
      state.session.heartsLeft = Math.max(0, state.session.heartsLeft - 1);
    }

    if (timeout) {
      state.lastFeedback = t("feedbackTimeout");
    } else if (skipped) {
      state.lastFeedback = t("feedbackSkipped");
    } else {
      state.lastFeedback = t("feedbackWrong", { answer: q.answer });
    }

    state.session.mistakes.push({
      a: q.a,
      b: q.b,
      answer: q.answer,
      userAnswer: Number.isFinite(numericAnswer) ? numericAnswer : null,
    });
  }

  state.session.answers.push({
    a: q.a,
    b: q.b,
    answer: q.answer,
    userAnswer: Number.isFinite(numericAnswer) ? numericAnswer : null,
    isCorrect,
    skipped,
    timeout,
    ms: elapsedMs,
  });

  pulseCard(isCorrect);
  renderHud();
  renderQuestion();

  if (state.settings.mode === "challenge" && state.session.heartsLeft <= 0) {
    window.setTimeout(() => {
      finishSession();
    }, 450);
    return;
  }

  window.setTimeout(() => {
    if (!state.session) return;

    const isLast = state.session.currentQuestionIndex >= state.session.questions.length - 1;
    if (isLast) {
      finishSession();
      return;
    }

    state.session.currentQuestionIndex += 1;
    state.session.currentInput = "";
    state.session.locked = false;
    state.session.questionStartedAt = Date.now();
    state.lastFeedback = "";
    renderHud();
    renderQuestion();

    if (state.settings.autoSpeak) {
      speakCurrentQuestion();
    }
  }, 480);
}

function submitCurrentAnswer() {
  if (!state.session || state.phase !== "playing" || state.settings.answerUI !== "keypad") return;
  if (!state.session.currentInput) return;
  const value = Number(state.session.currentInput);
  evaluateAnswer(value, { skipped: false, timeout: false });
}

function keyInput(value) {
  if (!state.session || state.phase !== "playing" || state.settings.answerUI !== "keypad") return;
  if (state.session.locked) return;

  if (value === "delete") {
    state.session.currentInput = state.session.currentInput.slice(0, -1);
  } else if (value === "submit") {
    submitCurrentAnswer();
    return;
  } else {
    if (state.session.currentInput.length >= 3) return;
    state.session.currentInput += String(value);
  }
  el.answerDisplay.value = state.session.currentInput;
}

function buildKeypad() {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "delete", "0", "submit"];
  el.keypadGrid.innerHTML = "";

  keys.forEach((key) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "v2-key";

    if (key === "delete") {
      btn.textContent = "⌫";
      btn.classList.add("action");
    } else if (key === "submit") {
      btn.textContent = t("keySubmit");
      btn.classList.add("action");
    } else {
      btn.textContent = key;
    }

    btn.addEventListener("click", () => keyInput(key));
    el.keypadGrid.appendChild(btn);
  });
}

function startTicker() {
  stopTicker();
  state.ticker = window.setInterval(() => {
    if (!state.session || state.phase !== "playing") return;

    if (state.settings.mode === "challenge" && !state.session.locked) {
      const remain = getQuestionRemainSec();
      if (remain <= 0) {
        evaluateAnswer(null, { skipped: false, timeout: true });
        return;
      }
    }

    renderHud();
  }, 120);
}

function stopTicker() {
  if (state.ticker) {
    window.clearInterval(state.ticker);
    state.ticker = null;
  }
}

function createSession() {
  const questions = buildQuestions();
  const hearts = state.settings.mode === "challenge" ? state.settings.hearts : state.settings.hearts;

  state.session = {
    phase: "playing",
    currentQuestionIndex: 0,
    heartsLeft: hearts,
    stars: 0,
    combo: 0,
    bestCombo: 0,
    correct: 0,
    questions,
    answers: [],
    mistakes: [],
    currentInput: "",
    currentChoices: [],
    lock: false,
    locked: false,
    startedAt: Date.now(),
    pausedMs: 0,
    pausedAt: 0,
    questionStartedAt: Date.now(),
  };
}

function startGame() {
  createSession();
  state.phase = "playing";
  state.tab = "learn";
  state.lastFeedback = state.notice;

  renderVisibility();
  renderTabs();
  renderHud();
  renderQuestion();
  startTicker();

  if (state.settings.autoSpeak) {
    speakCurrentQuestion();
  }
}

function pauseGame() {
  if (!state.session || state.phase !== "playing") return;
  state.phase = "paused";
  state.session.pausedAt = Date.now();
  stopTicker();
  renderVisibility();
}

function resumeGame() {
  if (!state.session || state.phase !== "paused") return;
  state.session.pausedMs += Date.now() - state.session.pausedAt;
  state.session.pausedAt = 0;
  state.phase = "playing";
  renderVisibility();
  startTicker();
}

function finalizeRecord() {
  if (!state.session) return null;

  const total = state.session.questions.length;
  const correct = state.session.correct;
  const durationSec = getElapsedSec();

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    mode: state.settings.mode,
    total,
    correct,
    stars: state.session.stars,
    bestCombo: state.session.bestCombo,
    durationSec,
    mistakes: state.session.mistakes,
  };
}

function finishSession() {
  if (!state.session) return;

  stopTicker();
  const record = finalizeRecord();
  if (record) {
    state.sessions.push(record);
    saveSessions();
    state.lastResult = record;
  }

  state.phase = "result";
  state.tab = "learn";
  renderResult();
  renderHistory();
  renderVisibility();
  renderTabs();
}

function renderResult() {
  const r = state.lastResult;
  if (!r) return;

  const accuracy = r.total ? Math.round((r.correct / r.total) * 100) : 0;
  if (accuracy >= 90) {
    el.resultHeadline.textContent = t("resultHeadlineGreat");
  } else if (accuracy >= 70) {
    el.resultHeadline.textContent = t("resultHeadlineGood");
  } else {
    el.resultHeadline.textContent = t("resultHeadlineTry");
  }

  el.resultAccuracy.textContent = `${accuracy}%`;
  el.resultStars.textContent = `⭐ ${r.stars}`;
  el.resultBestCombo.textContent = `x${r.bestCombo}`;
  el.resultDuration.textContent = formatDuration(r.durationSec);
}

function renderHistory() {
  const sessions = state.sessions.slice().reverse();
  el.historyList.innerHTML = "";
  el.mistakeTopList.innerHTML = "";

  if (!sessions.length) {
    el.historyList.innerHTML = `<div class="v2-empty">${t("historyEmpty")}</div>`;
    el.mistakeTopList.innerHTML = `<div class="v2-empty">${t("mistakeTopEmpty")}</div>`;
    return;
  }

  sessions.forEach((session) => {
    const item = document.createElement("div");
    item.className = "v2-history-item";

    const date = new Date(session.date);
    const total = Number(session.total) || 0;
    const correct = Number(session.correct) || 0;
    const stars = Number(session.stars) || 0;
    const bestCombo = Number(session.bestCombo) || 0;
    const acc = total ? Math.round((correct / total) * 100) : 0;

    item.innerHTML = `
      <div>
        <strong>${modeLabel(session.mode)}</strong>
        <small>${date.toLocaleDateString(getLocale())} · ${t("metricAccuracy")} ${acc}% · ${correct}/${total} · ${t("metricBestCombo")} x${bestCombo}</small>
      </div>
      <strong>⭐ ${stars}</strong>
    `;
    el.historyList.appendChild(item);
  });

  const counts = new Map();
  sessions.forEach((session) => {
    (session.mistakes || []).forEach((m) => {
      if (!Number.isFinite(m.a) || !Number.isFinite(m.b)) return;
      const key = `${m.a}×${m.b}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });

  const top = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (!top.length) {
    el.mistakeTopList.innerHTML = `<div class="v2-empty">${t("mistakeTopPerfect")}</div>`;
    return;
  }

  top.forEach(([key, count]) => {
    const item = document.createElement("div");
    item.className = "v2-history-item";
    item.innerHTML = `<div><strong>${key}</strong><small>${t("mistakeCountLabel")}</small></div><strong>${count}${t("countTimes")}</strong>`;
    el.mistakeTopList.appendChild(item);
  });
}

function setTab(nextTab) {
  if (state.phase !== "start") return;
  state.tab = nextTab;
  renderTabs();
  renderVisibility();
  if (state.tab === "history") {
    renderHistory();
  }
}

function updateSetting(patch) {
  state.settings = normalizeSettings({ ...state.settings, ...patch });
  saveSettings();
  syncSettingUI();
}

function bindEvents() {
  el.tabs.forEach((btn) => {
    btn.addEventListener("click", () => setTab(btn.dataset.tab));
  });

  el.modeCards.forEach((card) => {
    card.addEventListener("click", () => {
      updateSetting({ mode: card.dataset.mode });
    });
  });

  el.tableMinRange.addEventListener("input", () => {
    let min = Number(el.tableMinRange.value);
    let max = Number(el.tableMaxRange.value);
    if (min > max) max = min;
    updateSetting({ tableMin: min, tableMax: max });
  });

  el.tableMaxRange.addEventListener("input", () => {
    let min = Number(el.tableMinRange.value);
    let max = Number(el.tableMaxRange.value);
    if (max < min) min = max;
    updateSetting({ tableMin: min, tableMax: max });
  });

  el.countButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      updateSetting({ totalQuestions: Number(btn.dataset.count) });
    });
  });

  el.orderButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      updateSetting({ order: btn.dataset.order });
    });
  });

  el.autoSpeakToggle.addEventListener("change", () => {
    updateSetting({ autoSpeak: el.autoSpeakToggle.checked });
  });

  el.extendToggle.addEventListener("change", () => {
    const extend = el.extendToggle.checked;
    const next = { extendTo20: extend };
    if (!extend && state.settings.tableMax > 9) {
      next.tableMax = 9;
      next.tableMin = Math.min(state.settings.tableMin, 9);
    }
    updateSetting(next);
  });

  el.answerUISelect.addEventListener("change", () => {
    updateSetting({ answerUI: el.answerUISelect.value });
  });

  el.heartsRange.addEventListener("input", () => {
    updateSetting({ hearts: Number(el.heartsRange.value) });
  });

  el.timeLimitRange.addEventListener("input", () => {
    updateSetting({ timeLimitSec: Number(el.timeLimitRange.value) });
  });

  el.advancedToggle.addEventListener("click", () => {
    const expanded = el.advancedToggle.getAttribute("aria-expanded") === "true";
    el.advancedToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
    el.advancedSettings.classList.toggle("v2-hidden", expanded);
    syncAdvancedToggleLabel();
  });

  el.quickStartBtn.addEventListener("click", startGame);
  el.startCustomBtn.addEventListener("click", startGame);

  el.pauseBtn.addEventListener("click", pauseGame);
  el.resumeBtn.addEventListener("click", resumeGame);
  el.skipBtn.addEventListener("click", () => evaluateAnswer(null, { skipped: true, timeout: false }));
  el.hintBtn.addEventListener("click", applyHint);
  el.speakBtn.addEventListener("click", speakCurrentQuestion);

  el.retryBtn.addEventListener("click", () => {
    state.phase = "start";
    startGame();
  });

  el.retryMistakeBtn.addEventListener("click", () => {
    updateSetting({ mode: "mistake" });
    state.phase = "start";
    startGame();
  });

  el.showHistoryBtn.addEventListener("click", () => {
    state.phase = "start";
    state.tab = "history";
    renderTabs();
    renderHistory();
    renderVisibility();
  });

  el.clearHistoryBtn.addEventListener("click", () => {
    const confirmed = window.confirm(t("confirmClear"));
    if (!confirmed) return;
    state.sessions = [];
    saveSessions();
    renderHistory();
  });

  window.addEventListener("keydown", (event) => {
    if (!state.session || state.phase !== "playing" || state.settings.answerUI !== "keypad") return;
    if (event.key >= "0" && event.key <= "9") {
      keyInput(event.key);
    } else if (event.key === "Backspace") {
      keyInput("delete");
    } else if (event.key === "Enter") {
      keyInput("submit");
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.phase === "playing") {
      pauseGame();
    }
  });
}

function init() {
  state.settings = normalizeSettings(readJSON(SETTINGS_KEY, DEFAULT_SETTINGS));
  state.sessions = getAllSessions();
  initLanguage();
  applyTranslations();

  buildKeypad();
  bindEvents();
  syncSettingUI();
  syncAdvancedToggleLabel();
  if (el.mainLanguageSelect) {
    el.mainLanguageSelect.value = state.lang;
  }
  renderTabs();
  renderHistory();
  renderVisibility();
}

init();
