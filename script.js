const danChips = document.getElementById("danChips");
const answersEl = document.getElementById("answers");
const questionEl = document.getElementById("question");
const feedbackEl = document.getElementById("feedback");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const starsEl = document.getElementById("stars");
const heartsEl = document.getElementById("hearts");
const nextBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("skipBtn");
const countRange = document.getElementById("countRange");
const countValue = document.getElementById("countValue");
const toggleBtns = document.querySelectorAll(".toggle-btn");
const sessionBtns = document.querySelectorAll("[data-session]");
const challengeControl = document.getElementById("challengeControl");
const timeLimitRange = document.getElementById("timeLimitRange");
const timeLimitValue = document.getElementById("timeLimitValue");
const card = document.getElementById("card");
const result = document.getElementById("result");
const resultStars = document.getElementById("resultStars");
const resultRate = document.getElementById("resultRate");
const resultTime = document.getElementById("resultTime");
const restartBtn = document.getElementById("restartBtn");
const reviewBtn = document.getElementById("reviewBtn");
const reviewList = document.getElementById("reviewList");
const historyList = document.getElementById("historyList");
const wrongList = document.getElementById("wrongList");
const challengeWrongList = document.getElementById("challengeWrongList");
const challengeSummary = document.getElementById("challengeSummary");
const historyChart = document.getElementById("historyChart");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const exportHistoryBtn = document.getElementById("exportHistoryBtn");
const languageSelect = document.getElementById("languageSelect");
const extendToggle = document.getElementById("extendToggle");
const ttsToggle = document.getElementById("ttsToggle");
const ttsButton = document.getElementById("ttsButton");
const questionTts = document.getElementById("questionTts");
const ttsVoiceSelect = document.getElementById("ttsVoiceSelect");

const state = {
  mode: "mixed",
  session: "normal",
  total: 10,
  current: 0,
  correct: 0,
  stars: 0,
  hearts: 3,
  questions: [],
  answers: [],
  timer: null,
  countdownTimer: null,
  questionStartedAt: null,
  questionTimes: [],
  startedAt: null,
  selectedDans: new Set([2, 3, 4]),
  timeLimit: 3,
  lang: "ko",
  maxDan: 9,
  maxTimes: 9,
  ttsEnabled: false,
  speechReady: false,
  voices: [],
};

const HISTORY_KEY = "gugudan-history-v1";
const HISTORY_LIMIT = 30;
const WRONG_POOL_MIN = 10;
const CHALLENGE_WRONG_RATIO = 0.3;
const NORMAL_WRONG_RATIO = 0.5;
const LANG_KEY = "gugudan-language";
const VOICE_KEY_PREFIX = "gugudan-voice-";

const I18N = {
  ko: {
    badge: "오늘의 구구단",
    title: "구구단 퀴즈 놀이터",
    subtitle: "짧고 재미있는 문제로 2~9단을 자연스럽게 익혀요. 맞히면 별이 쌓여요!",
    languageLabel: "언어",
    danLabel: "연습할 단",
    extendLabel: "20단까지 확장",
    ttsLabel: "문제 읽어주기",
    ttsAuto: "자동 읽기",
    ttsPlay: "지금 읽기",
    ttsHelp: "현재 언어로 문제를 읽어줘요.",
    styleLabel: "문제 스타일",
    modeMixed: "섞어서",
    modeSequence: "순서대로",
    sessionLabel: "학습 모드",
    sessionNormal: "기본",
    sessionChallenge: "도전",
    timeLimitLabel: "도전 시간 제한",
    timeLimitHelp: "도전 모드에서는 문제당 제한 시간 안에 답해야 해요.",
    countLabel: "문제 수",
    starsLabel: "별",
    starsSuffix: "개",
    skipBtn: "모르면 넘어가기",
    nextBtn: "다음 문제",
    resultTitle: "오늘의 결과",
    resultStarsSuffix: "개의 별을 모았어요!",
    resultRateLabel: "정답률",
    resultTimeLabel: "걸린 시간",
    restartBtn: "다시 도전",
    reviewBtn: "틀린 문제 보기",
    historyTitle: "학습 이력",
    exportBtn: "JSON 저장",
    clearBtn: "기록 삭제",
    historyHelp: "최근 30회 기록을 저장하고, 성장 그래프를 보여줘요.",
    recentTitle: "최근 기록",
    wrongTitle: "자주 틀리는 문제",
    challengeReportTitle: "챌린지 모드 리포트",
    challengeEmpty: "도전 모드 기록이 아직 없어요.",
    noHistory: "아직 기록이 없어요. 퀴즈를 풀어보세요!",
    noWrong: "아직 자주 틀리는 문제가 없어요.",
    noWrongChallenge: "도전 모드에서 틀린 문제가 아직 없어요.",
    perfect: "틀린 문제가 없어요! 완벽해요 ✨",
    skipped: "넘김",
    myAnswer: "내 답",
    correctRateMeta: "정답률",
    normalMeta: "기본",
    challengeMeta: "도전",
    average: "평균",
    limit: "제한",
    seconds: "초",
    remainingTime: "남은 시간 {value}초",
    timeout: "시간 초과! 다음 문제로 넘어갈게요.",
    skipFeedback: "넘겼어요! 다음 문제로 갈게요.",
    resultsBtn: "결과 보기",
    bestRecord: "최고 기록: 평균 {value}초 · 제한 {limit}초 · {date}",
    wrongCount: "{count}번",
    wrongCountFull: "{count}번 틀림",
    danSuffix: "단",
    applause: ["멋져요!", "천재네!", "완벽해요!", "짱이에요!", "정답! 잘했어요!"],
    gentle: ["괜찮아요, 다시!", "조금만 더!", "다음엔 맞힐 수 있어요!"],
  },
  en: {
    badge: "Today's Times Tables",
    title: "Times Table Quiz Playground",
    subtitle: "Quick, fun questions to master 2–9 times tables. Earn stars when you’re right!",
    languageLabel: "Language",
    danLabel: "Tables to Practice",
    extendLabel: "Extend to 20",
    ttsLabel: "Read Aloud",
    ttsAuto: "Auto Read",
    ttsPlay: "Read Now",
    ttsHelp: "Reads the question in the selected language.",
    styleLabel: "Question Style",
    modeMixed: "Mixed",
    modeSequence: "In Order",
    sessionLabel: "Learning Mode",
    sessionNormal: "Normal",
    sessionChallenge: "Challenge",
    timeLimitLabel: "Challenge Time Limit",
    timeLimitHelp: "Answer each question within the time limit in Challenge mode.",
    countLabel: "Number of Questions",
    starsLabel: "Stars",
    starsSuffix: "",
    skipBtn: "Skip",
    nextBtn: "Next",
    resultTitle: "Today's Result",
    resultStarsSuffix: " stars collected!",
    resultRateLabel: "Accuracy",
    resultTimeLabel: "Time",
    restartBtn: "Retry",
    reviewBtn: "Review Mistakes",
    historyTitle: "Learning History",
    exportBtn: "Save JSON",
    clearBtn: "Clear History",
    historyHelp: "Saves up to 30 sessions and shows your growth graph.",
    recentTitle: "Recent Records",
    wrongTitle: "Frequently Missed",
    challengeReportTitle: "Challenge Report",
    challengeEmpty: "No challenge records yet.",
    noHistory: "No history yet. Try a quiz!",
    noWrong: "No frequently missed questions yet.",
    noWrongChallenge: "No wrong answers in Challenge mode yet.",
    perfect: "No wrong answers! Perfect ✨",
    skipped: "Skipped",
    myAnswer: "My answer",
    correctRateMeta: "Accuracy",
    normalMeta: "Normal",
    challengeMeta: "Challenge",
    average: "Avg",
    limit: "Limit",
    seconds: "sec",
    remainingTime: "Time left {value}s",
    timeout: "Time's up! Moving to the next question.",
    skipFeedback: "Skipped! Moving on.",
    resultsBtn: "Show Results",
    bestRecord: "Best: Avg {value}s · Limit {limit}s · {date}",
    wrongCount: "{count}x",
    wrongCountFull: "{count} wrong",
    danSuffix: "x",
    applause: ["Great!", "Genius!", "Perfect!", "Awesome!", "Correct!"],
    gentle: ["It's okay, try again!", "Almost there!", "You'll get it next time!"],
  },
  zh: {
    badge: "今日九九表",
    title: "九九乘法测验乐园",
    subtitle: "用有趣的小题轻松掌握 2–9 乘法。答对就得星星！",
    languageLabel: "语言",
    danLabel: "练习乘法",
    extendLabel: "扩展到20",
    ttsLabel: "朗读题目",
    ttsAuto: "自动朗读",
    ttsPlay: "立即朗读",
    ttsHelp: "用当前语言朗读题目。",
    styleLabel: "题目方式",
    modeMixed: "随机",
    modeSequence: "顺序",
    sessionLabel: "学习模式",
    sessionNormal: "普通",
    sessionChallenge: "挑战",
    timeLimitLabel: "挑战时间限制",
    timeLimitHelp: "挑战模式下每题需要在限定时间内作答。",
    countLabel: "题目数量",
    starsLabel: "星星",
    starsSuffix: "个",
    skipBtn: "跳过",
    nextBtn: "下一题",
    resultTitle: "今日结果",
    resultStarsSuffix: "颗星星!",
    resultRateLabel: "正确率",
    resultTimeLabel: "用时",
    restartBtn: "再挑战",
    reviewBtn: "查看错题",
    historyTitle: "学习记录",
    exportBtn: "导出 JSON",
    clearBtn: "清除记录",
    historyHelp: "保存最近 30 次记录，并显示成长曲线。",
    recentTitle: "最近记录",
    wrongTitle: "常错题",
    challengeReportTitle: "挑战报告",
    challengeEmpty: "暂无挑战记录。",
    noHistory: "还没有记录，先做一次测验吧！",
    noWrong: "目前没有常错题。",
    noWrongChallenge: "挑战模式暂无错题。",
    perfect: "没有错题！太棒了 ✨",
    skipped: "跳过",
    myAnswer: "我的答案",
    correctRateMeta: "正确率",
    normalMeta: "普通",
    challengeMeta: "挑战",
    average: "平均",
    limit: "限制",
    seconds: "秒",
    remainingTime: "剩余时间 {value}秒",
    timeout: "时间到！进入下一题。",
    skipFeedback: "已跳过！进入下一题。",
    resultsBtn: "查看结果",
    bestRecord: "最佳：平均 {value}秒 · 限制 {limit}秒 · {date}",
    wrongCount: "{count}次",
    wrongCountFull: "错 {count}次",
    danSuffix: "乘",
    applause: ["太棒了！", "天才！", "完美！", "厉害！", "答对了！"],
    gentle: ["没关系，再试试！", "差一点！", "下次一定行！"],
  },
  ja: {
    badge: "今日の九九",
    title: "九九クイズ広場",
    subtitle: "楽しい問題で2〜9の九九を身につけよう。正解で星がたまる！",
    languageLabel: "言語",
    danLabel: "練習する段",
    extendLabel: "20まで拡張",
    ttsLabel: "読み上げ",
    ttsAuto: "自動読み上げ",
    ttsPlay: "今すぐ読む",
    ttsHelp: "現在の言語で読み上げます。",
    styleLabel: "出題スタイル",
    modeMixed: "ミックス",
    modeSequence: "順番",
    sessionLabel: "学習モード",
    sessionNormal: "通常",
    sessionChallenge: "チャレンジ",
    timeLimitLabel: "チャレンジ制限時間",
    timeLimitHelp: "チャレンジモードでは時間内に答えてね。",
    countLabel: "問題数",
    starsLabel: "スター",
    starsSuffix: "個",
    skipBtn: "スキップ",
    nextBtn: "次へ",
    resultTitle: "今日の結果",
    resultStarsSuffix: "個のスター！",
    resultRateLabel: "正答率",
    resultTimeLabel: "時間",
    restartBtn: "もう一回",
    reviewBtn: "まちがいを見る",
    historyTitle: "学習履歴",
    exportBtn: "JSON保存",
    clearBtn: "履歴削除",
    historyHelp: "直近30回を保存し、成長グラフを表示します。",
    recentTitle: "最近の記録",
    wrongTitle: "よく間違える問題",
    challengeReportTitle: "チャレンジレポート",
    challengeEmpty: "チャレンジの記録がありません。",
    noHistory: "まだ記録がありません。クイズに挑戦してね！",
    noWrong: "よく間違える問題はまだありません。",
    noWrongChallenge: "チャレンジで間違いがまだありません。",
    perfect: "間違いなし！すごい ✨",
    skipped: "スキップ",
    myAnswer: "自分の答え",
    correctRateMeta: "正答率",
    normalMeta: "通常",
    challengeMeta: "チャレンジ",
    average: "平均",
    limit: "制限",
    seconds: "秒",
    remainingTime: "残り {value}秒",
    timeout: "時間切れ！次の問題へ。",
    skipFeedback: "スキップしました！次へ。",
    resultsBtn: "結果を見る",
    bestRecord: "ベスト：平均 {value}秒 · 制限 {limit}秒 · {date}",
    wrongCount: "{count}回",
    wrongCountFull: "{count}回まちがい",
    danSuffix: "の段",
    applause: ["すごい！", "天才！", "完璧！", "いいね！", "正解！"],
    gentle: ["大丈夫、もう一回！", "あと少し！", "次はできるよ！"],
  },
  es: {
    badge: "Tablas del día",
    title: "Parque de Quiz de Tablas",
    subtitle: "Aprende las tablas del 2 al 9 con preguntas divertidas. ¡Gana estrellas!",
    languageLabel: "Idioma",
    danLabel: "Tablas a practicar",
    extendLabel: "Ampliar a 20",
    ttsLabel: "Leer en voz alta",
    ttsAuto: "Lectura automática",
    ttsPlay: "Leer ahora",
    ttsHelp: "Lee la pregunta en el idioma actual.",
    styleLabel: "Estilo de preguntas",
    modeMixed: "Mezclado",
    modeSequence: "En orden",
    sessionLabel: "Modo de aprendizaje",
    sessionNormal: "Normal",
    sessionChallenge: "Desafío",
    timeLimitLabel: "Límite de tiempo",
    timeLimitHelp: "En el modo desafío, responde en el tiempo indicado.",
    countLabel: "Número de preguntas",
    starsLabel: "Estrellas",
    starsSuffix: "",
    skipBtn: "Saltar",
    nextBtn: "Siguiente",
    resultTitle: "Resultado de hoy",
    resultStarsSuffix: " estrellas conseguidas!",
    resultRateLabel: "Precisión",
    resultTimeLabel: "Tiempo",
    restartBtn: "Reintentar",
    reviewBtn: "Ver errores",
    historyTitle: "Historial",
    exportBtn: "Guardar JSON",
    clearBtn: "Borrar historial",
    historyHelp: "Guarda hasta 30 sesiones y muestra tu progreso.",
    recentTitle: "Registros recientes",
    wrongTitle: "Errores frecuentes",
    challengeReportTitle: "Informe de desafío",
    challengeEmpty: "Aún no hay registros de desafío.",
    noHistory: "No hay historial todavía. ¡Haz un quiz!",
    noWrong: "No hay errores frecuentes aún.",
    noWrongChallenge: "No hay errores en modo desafío.",
    perfect: "¡Sin errores! Perfecto ✨",
    skipped: "Saltado",
    myAnswer: "Mi respuesta",
    correctRateMeta: "Precisión",
    normalMeta: "Normal",
    challengeMeta: "Desafío",
    average: "Prom",
    limit: "Límite",
    seconds: "s",
    remainingTime: "Tiempo restante {value}s",
    timeout: "¡Tiempo agotado! Pasando a la siguiente.",
    skipFeedback: "Saltado. Vamos a la siguiente.",
    resultsBtn: "Ver resultados",
    bestRecord: "Mejor: Prom {value}s · Límite {limit}s · {date}",
    wrongCount: "{count}x",
    wrongCountFull: "{count} errores",
    danSuffix: "x",
    applause: ["¡Genial!", "¡Eres un genio!", "¡Perfecto!", "¡Muy bien!", "¡Correcto!"],
    gentle: ["No pasa nada, intenta otra vez.", "¡Casi!", "¡La próxima lo logras!"],
  },
  fr: {
    badge: "Tables du jour",
    title: "Terrain de Quiz des Tables",
    subtitle: "Apprends les tables de 2 à 9 avec des questions fun. Gagne des étoiles !",
    languageLabel: "Langue",
    danLabel: "Tables à pratiquer",
    extendLabel: "Étendre jusqu'à 20",
    ttsLabel: "Lecture à voix haute",
    ttsAuto: "Lecture automatique",
    ttsPlay: "Lire maintenant",
    ttsHelp: "Lit la question dans la langue sélectionnée.",
    styleLabel: "Style des questions",
    modeMixed: "Mélangé",
    modeSequence: "Dans l'ordre",
    sessionLabel: "Mode d'apprentissage",
    sessionNormal: "Normal",
    sessionChallenge: "Défi",
    timeLimitLabel: "Limite de temps",
    timeLimitHelp: "En mode défi, réponds dans le temps imparti.",
    countLabel: "Nombre de questions",
    starsLabel: "Étoiles",
    starsSuffix: "",
    skipBtn: "Passer",
    nextBtn: "Suivant",
    resultTitle: "Résultat du jour",
    resultStarsSuffix: " étoiles collectées !",
    resultRateLabel: "Précision",
    resultTimeLabel: "Temps",
    restartBtn: "Recommencer",
    reviewBtn: "Voir les erreurs",
    historyTitle: "Historique",
    exportBtn: "Enregistrer JSON",
    clearBtn: "Effacer",
    historyHelp: "Enregistre jusqu'à 30 sessions et affiche ta progression.",
    recentTitle: "Historique récent",
    wrongTitle: "Erreurs fréquentes",
    challengeReportTitle: "Rapport défi",
    challengeEmpty: "Aucun enregistrement de défi.",
    noHistory: "Aucun historique pour l'instant.",
    noWrong: "Aucune erreur fréquente pour l'instant.",
    noWrongChallenge: "Aucune erreur en mode défi.",
    perfect: "Aucune erreur ! Parfait ✨",
    skipped: "Passé",
    myAnswer: "Ma réponse",
    correctRateMeta: "Précision",
    normalMeta: "Normal",
    challengeMeta: "Défi",
    average: "Moy",
    limit: "Limite",
    seconds: "s",
    remainingTime: "Temps restant {value}s",
    timeout: "Temps écoulé ! Question suivante.",
    skipFeedback: "Passé. Question suivante.",
    resultsBtn: "Voir les résultats",
    bestRecord: "Meilleur : Moy {value}s · Limite {limit}s · {date}",
    wrongCount: "{count}x",
    wrongCountFull: "{count} erreurs",
    danSuffix: "x",
    applause: ["Super !", "Génial !", "Parfait !", "Bravo !", "Correct !"],
    gentle: ["Ce n'est pas grave, réessaie.", "Presque !", "Tu y arriveras !"],
  },
  de: {
    badge: "Heutige Einmaleins",
    title: "Einmaleins-Quiz Spielplatz",
    subtitle: "Lerne die 2–9er Reihen mit Spaß. Sammle Sterne!",
    languageLabel: "Sprache",
    danLabel: "Tabellen üben",
    extendLabel: "Bis 20 erweitern",
    ttsLabel: "Vorlesen",
    ttsAuto: "Automatisch vorlesen",
    ttsPlay: "Jetzt lesen",
    ttsHelp: "Liest die Frage in der gewählten Sprache vor.",
    styleLabel: "Fragenstil",
    modeMixed: "Gemischt",
    modeSequence: "Der Reihe nach",
    sessionLabel: "Lernmodus",
    sessionNormal: "Normal",
    sessionChallenge: "Challenge",
    timeLimitLabel: "Zeitlimit",
    timeLimitHelp: "Im Challenge-Modus musst du rechtzeitig antworten.",
    countLabel: "Anzahl der Fragen",
    starsLabel: "Sterne",
    starsSuffix: "",
    skipBtn: "Überspringen",
    nextBtn: "Weiter",
    resultTitle: "Ergebnis heute",
    resultStarsSuffix: " Sterne gesammelt!",
    resultRateLabel: "Genauigkeit",
    resultTimeLabel: "Zeit",
    restartBtn: "Nochmal",
    reviewBtn: "Fehler ansehen",
    historyTitle: "Verlauf",
    exportBtn: "JSON speichern",
    clearBtn: "Verlauf löschen",
    historyHelp: "Speichert bis zu 30 Sessions und zeigt deinen Fortschritt.",
    recentTitle: "Letzte Einträge",
    wrongTitle: "Häufig falsch",
    challengeReportTitle: "Challenge-Bericht",
    challengeEmpty: "Noch keine Challenge-Daten.",
    noHistory: "Noch kein Verlauf vorhanden.",
    noWrong: "Noch keine häufigen Fehler.",
    noWrongChallenge: "Keine Fehler im Challenge-Modus.",
    perfect: "Keine Fehler! Super ✨",
    skipped: "Übersprungen",
    myAnswer: "Meine Antwort",
    correctRateMeta: "Genauigkeit",
    normalMeta: "Normal",
    challengeMeta: "Challenge",
    average: "Ø",
    limit: "Limit",
    seconds: "s",
    remainingTime: "Verbleibend {value}s",
    timeout: "Zeit abgelaufen! Nächste Frage.",
    skipFeedback: "Übersprungen. Weiter geht's.",
    resultsBtn: "Ergebnis anzeigen",
    bestRecord: "Best: Ø {value}s · Limit {limit}s · {date}",
    wrongCount: "{count}x",
    wrongCountFull: "{count} Fehler",
    danSuffix: "x",
    applause: ["Super!", "Genial!", "Perfekt!", "Toll!", "Richtig!"],
    gentle: ["Nicht schlimm, nochmal.", "Fast!", "Beim nächsten Mal klappt's!"],
  },
  pt: {
    badge: "Tabuadas do dia",
    title: "Parque de Quiz da Tabuada",
    subtitle: "Aprenda a tabuada do 2 ao 9 com diversão. Ganhe estrelas!",
    languageLabel: "Idioma",
    danLabel: "Tabuadas",
    extendLabel: "Expandir até 20",
    ttsLabel: "Ler em voz alta",
    ttsAuto: "Leitura automática",
    ttsPlay: "Ler agora",
    ttsHelp: "Lê a pergunta no idioma atual.",
    styleLabel: "Estilo",
    modeMixed: "Misturado",
    modeSequence: "Em ordem",
    sessionLabel: "Modo",
    sessionNormal: "Normal",
    sessionChallenge: "Desafio",
    timeLimitLabel: "Limite de tempo",
    timeLimitHelp: "No modo desafio, responda dentro do tempo.",
    countLabel: "Número de questões",
    starsLabel: "Estrelas",
    starsSuffix: "",
    skipBtn: "Pular",
    nextBtn: "Próxima",
    resultTitle: "Resultado de hoje",
    resultStarsSuffix: " estrelas!",
    resultRateLabel: "Precisão",
    resultTimeLabel: "Tempo",
    restartBtn: "Tentar novamente",
    reviewBtn: "Ver erros",
    historyTitle: "Histórico",
    exportBtn: "Salvar JSON",
    clearBtn: "Limpar histórico",
    historyHelp: "Salva até 30 sessões e mostra seu progresso.",
    recentTitle: "Registros recentes",
    wrongTitle: "Erros frequentes",
    challengeReportTitle: "Relatório desafio",
    challengeEmpty: "Sem registros de desafio.",
    noHistory: "Sem histórico ainda.",
    noWrong: "Sem erros frequentes.",
    noWrongChallenge: "Sem erros no modo desafio.",
    perfect: "Sem erros! Perfeito ✨",
    skipped: "Pulado",
    myAnswer: "Minha resposta",
    correctRateMeta: "Precisão",
    normalMeta: "Normal",
    challengeMeta: "Desafio",
    average: "Média",
    limit: "Limite",
    seconds: "s",
    remainingTime: "Tempo restante {value}s",
    timeout: "Tempo acabou! Próxima questão.",
    skipFeedback: "Pulado. Próxima.",
    resultsBtn: "Ver resultados",
    bestRecord: "Melhor: Média {value}s · Limite {limit}s · {date}",
    wrongCount: "{count}x",
    wrongCountFull: "{count} erros",
    danSuffix: "x",
    applause: ["Ótimo!", "Gênio!", "Perfeito!", "Muito bem!", "Correto!"],
    gentle: ["Tudo bem, tente de novo.", "Quase!", "Você consegue!"],
  },
  vi: {
    badge: "Bảng cửu chương hôm nay",
    title: "Sân chơi Quiz Cửu Chương",
    subtitle: "Học bảng 2–9 qua câu hỏi vui. Trả lời đúng để nhận sao!",
    languageLabel: "Ngôn ngữ",
    danLabel: "Bảng cần luyện",
    extendLabel: "Mở rộng đến 20",
    ttsLabel: "Đọc to",
    ttsAuto: "Tự động đọc",
    ttsPlay: "Đọc ngay",
    ttsHelp: "Đọc câu hỏi theo ngôn ngữ hiện tại.",
    styleLabel: "Kiểu câu hỏi",
    modeMixed: "Trộn",
    modeSequence: "Theo thứ tự",
    sessionLabel: "Chế độ",
    sessionNormal: "Bình thường",
    sessionChallenge: "Thử thách",
    timeLimitLabel: "Giới hạn thời gian",
    timeLimitHelp: "Ở chế độ thử thách, trả lời trong thời gian cho phép.",
    countLabel: "Số câu hỏi",
    starsLabel: "Sao",
    starsSuffix: "",
    skipBtn: "Bỏ qua",
    nextBtn: "Tiếp theo",
    resultTitle: "Kết quả hôm nay",
    resultStarsSuffix: " sao đã thu thập!",
    resultRateLabel: "Tỉ lệ đúng",
    resultTimeLabel: "Thời gian",
    restartBtn: "Làm lại",
    reviewBtn: "Xem câu sai",
    historyTitle: "Lịch sử học",
    exportBtn: "Lưu JSON",
    clearBtn: "Xóa lịch sử",
    historyHelp: "Lưu tối đa 30 lần và hiển thị đồ thị tiến bộ.",
    recentTitle: "Gần đây",
    wrongTitle: "Hay sai",
    challengeReportTitle: "Báo cáo thử thách",
    challengeEmpty: "Chưa có bản ghi thử thách.",
    noHistory: "Chưa có lịch sử.",
    noWrong: "Chưa có câu hay sai.",
    noWrongChallenge: "Chưa có lỗi ở chế độ thử thách.",
    perfect: "Không có lỗi! Tuyệt vời ✨",
    skipped: "Bỏ qua",
    myAnswer: "Đáp án của tôi",
    correctRateMeta: "Tỉ lệ đúng",
    normalMeta: "Bình thường",
    challengeMeta: "Thử thách",
    average: "TB",
    limit: "Giới hạn",
    seconds: "giây",
    remainingTime: "Còn {value}s",
    timeout: "Hết giờ! Sang câu tiếp.",
    skipFeedback: "Đã bỏ qua. Sang câu tiếp.",
    resultsBtn: "Xem kết quả",
    bestRecord: "Tốt nhất: TB {value}s · Giới hạn {limit}s · {date}",
    wrongCount: "{count} lần",
    wrongCountFull: "Sai {count} lần",
    danSuffix: "x",
    applause: ["Tuyệt!", "Thiên tài!", "Hoàn hảo!", "Rất tốt!", "Đúng rồi!"],
    gentle: ["Không sao, thử lại nhé!", "Gần đúng rồi!", "Lần sau sẽ đúng!"],
  },
  th: {
    badge: "ตารางคูณวันนี้",
    title: "สนามเด็กเล่นควิซตารางคูณ",
    subtitle: "ฝึกตารางคูณ 2–9 แบบสนุก ๆ ตอบถูกได้ดาว!",
    languageLabel: "ภาษา",
    danLabel: "ตารางที่ฝึก",
    extendLabel: "ขยายถึง 20",
    ttsLabel: "อ่านออกเสียง",
    ttsAuto: "อ่านอัตโนมัติ",
    ttsPlay: "อ่านตอนนี้",
    ttsHelp: "อ่านโจทย์ด้วยภาษาปัจจุบัน",
    styleLabel: "รูปแบบคำถาม",
    modeMixed: "สุ่ม",
    modeSequence: "เรียงลำดับ",
    sessionLabel: "โหมดการเรียน",
    sessionNormal: "ปกติ",
    sessionChallenge: "ท้าทาย",
    timeLimitLabel: "จำกัดเวลา",
    timeLimitHelp: "โหมดท้าทายต้องตอบภายในเวลาที่กำหนด",
    countLabel: "จำนวนข้อ",
    starsLabel: "ดาว",
    starsSuffix: "",
    skipBtn: "ข้าม",
    nextBtn: "ข้อต่อไป",
    resultTitle: "ผลลัพธ์วันนี้",
    resultStarsSuffix: " ดาวที่ได้!",
    resultRateLabel: "ความถูกต้อง",
    resultTimeLabel: "เวลา",
    restartBtn: "เล่นอีกครั้ง",
    reviewBtn: "ดูข้อผิดพลาด",
    historyTitle: "ประวัติการเรียน",
    exportBtn: "บันทึก JSON",
    clearBtn: "ล้างประวัติ",
    historyHelp: "บันทึกได้ 30 ครั้งและแสดงกราฟพัฒนา",
    recentTitle: "บันทึกล่าสุด",
    wrongTitle: "ข้อที่ผิดบ่อย",
    challengeReportTitle: "รายงานโหมดท้าทาย",
    challengeEmpty: "ยังไม่มีบันทึกโหมดท้าทาย",
    noHistory: "ยังไม่มีประวัติ",
    noWrong: "ยังไม่มีข้อผิดบ่อย",
    noWrongChallenge: "ยังไม่มีข้อผิดในโหมดท้าทาย",
    perfect: "ไม่มีข้อผิด! เยี่ยม ✨",
    skipped: "ข้าม",
    myAnswer: "คำตอบของฉัน",
    correctRateMeta: "ความถูกต้อง",
    normalMeta: "ปกติ",
    challengeMeta: "ท้าทาย",
    average: "เฉลี่ย",
    limit: "จำกัด",
    seconds: "วินาที",
    remainingTime: "เหลือเวลา {value}วิ",
    timeout: "หมดเวลา! ไปข้อถัดไป",
    skipFeedback: "ข้ามแล้ว ไปข้อถัดไป",
    resultsBtn: "ดูผลลัพธ์",
    bestRecord: "ดีที่สุด: เฉลี่ย {value}วิ · จำกัด {limit}วิ · {date}",
    wrongCount: "{count}ครั้ง",
    wrongCountFull: "ผิด {count} ครั้ง",
    danSuffix: "x",
    applause: ["เยี่ยม!", "สุดยอด!", "สมบูรณ์แบบ!", "ดีมาก!", "ถูกต้อง!"],
    gentle: ["ไม่เป็นไร ลองใหม่!", "เกือบแล้ว!", "ครั้งหน้าจะได้!"],
  },
  id: {
    badge: "Tabel hari ini",
    title: "Taman Kuis Perkalian",
    subtitle: "Belajar tabel 2–9 dengan soal seru. Dapatkan bintang saat benar!",
    languageLabel: "Bahasa",
    danLabel: "Tabel latihan",
    extendLabel: "Perluas hingga 20",
    ttsLabel: "Bacakan",
    ttsAuto: "Baca otomatis",
    ttsPlay: "Baca sekarang",
    ttsHelp: "Membacakan soal dalam bahasa yang dipilih.",
    styleLabel: "Gaya soal",
    modeMixed: "Acak",
    modeSequence: "Berurutan",
    sessionLabel: "Mode belajar",
    sessionNormal: "Normal",
    sessionChallenge: "Tantangan",
    timeLimitLabel: "Batas waktu",
    timeLimitHelp: "Pada mode tantangan, jawab dalam waktu yang ditentukan.",
    countLabel: "Jumlah soal",
    starsLabel: "Bintang",
    starsSuffix: "",
    skipBtn: "Lewati",
    nextBtn: "Berikutnya",
    resultTitle: "Hasil hari ini",
    resultStarsSuffix: " bintang terkumpul!",
    resultRateLabel: "Akurasi",
    resultTimeLabel: "Waktu",
    restartBtn: "Coba lagi",
    reviewBtn: "Lihat salah",
    historyTitle: "Riwayat belajar",
    exportBtn: "Simpan JSON",
    clearBtn: "Hapus riwayat",
    historyHelp: "Menyimpan hingga 30 sesi dan menampilkan grafik perkembangan.",
    recentTitle: "Riwayat terbaru",
    wrongTitle: "Sering salah",
    challengeReportTitle: "Laporan tantangan",
    challengeEmpty: "Belum ada riwayat tantangan.",
    noHistory: "Belum ada riwayat.",
    noWrong: "Belum ada soal sering salah.",
    noWrongChallenge: "Belum ada salah di mode tantangan.",
    perfect: "Tidak ada yang salah! Sempurna ✨",
    skipped: "Lewati",
    myAnswer: "Jawabanku",
    correctRateMeta: "Akurasi",
    normalMeta: "Normal",
    challengeMeta: "Tantangan",
    average: "Rata2",
    limit: "Batas",
    seconds: "detik",
    remainingTime: "Sisa waktu {value}detik",
    timeout: "Waktu habis! Lanjut soal berikutnya.",
    skipFeedback: "Dilewati. Lanjut soal berikutnya.",
    resultsBtn: "Lihat hasil",
    bestRecord: "Terbaik: Rata2 {value}detik · Batas {limit}detik · {date}",
    wrongCount: "{count}x",
    wrongCountFull: "{count} salah",
    danSuffix: "x",
    applause: ["Bagus!", "Hebat!", "Sempurna!", "Keren!", "Benar!"],
    gentle: ["Tidak apa-apa, coba lagi!", "Hampir!", "Kamu pasti bisa!"],
  },
};

function t(key, vars = {}) {
  const pack = I18N[state.lang] || I18N.ko;
  const template = pack[key] ?? I18N.ko[key] ?? key;
  if (Array.isArray(template)) return template;
  return String(template).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  buildChips();
  updateModeButtons();
  if (state.session === "challenge") {
    timerEl.textContent = t("remainingTime", { value: state.timeLimit.toFixed(1) });
  }
  timeLimitValue.textContent = `${state.timeLimit}${t("seconds")}`;
}

function getLangCode() {
  const map = {
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
  return map[state.lang] || "en-US";
}

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  state.voices = window.speechSynthesis.getVoices();
  state.speechReady = state.voices.length > 0;
  renderVoiceSelect();
}

function pickVoice(langCode) {
  if (!state.voices.length) return null;
  const savedUri = localStorage.getItem(`${VOICE_KEY_PREFIX}${state.lang}`);
  if (savedUri) {
    const saved = state.voices.find((v) => v.voiceURI === savedUri);
    if (saved) return saved;
  }
  const exact = state.voices.find((v) => v.lang === langCode);
  if (exact) return exact;
  const prefix = langCode.split("-")[0];
  return state.voices.find((v) => v.lang.startsWith(prefix)) || null;
}

function renderVoiceSelect() {
  if (!ttsVoiceSelect) return;
  ttsVoiceSelect.innerHTML = "";
  if (!state.voices.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "TTS 음성이 없습니다";
    ttsVoiceSelect.appendChild(opt);
    ttsVoiceSelect.disabled = true;
    return;
  }

  const langCode = getLangCode();
  const prefix = langCode.split("-")[0];
  const filtered = state.voices.filter((v) => v.lang.startsWith(prefix));
  const voices = filtered.length ? filtered : state.voices;
  const savedUri = localStorage.getItem(`${VOICE_KEY_PREFIX}${state.lang}`);
  const preferredNames = {
    en: ["Google US English", "Google UK English Female", "Google UK English Male", "Google English"],
    ko: ["Google 한국의", "Google Korean"],
    ja: ["Google 日本語"],
    zh: ["Google 普通话", "Google Mandarin", "Google Cantonese"],
    es: ["Google español", "Google español de Estados Unidos"],
    fr: ["Google français", "Google Canada French"],
    de: ["Google Deutsch"],
    pt: ["Google português", "Google português do Brasil"],
    vi: ["Google Tiếng Việt"],
    th: ["Google ภาษาไทย"],
    id: ["Google Bahasa Indonesia"],
  };
  const nameList = preferredNames[state.lang] || [];
  const preferred =
    nameList
      .map((name) => voices.find((v) => v.name === name))
      .find(Boolean) ||
    nameList
      .map((name) => voices.find((v) => v.name.includes(name)))
      .find(Boolean) ||
    null;

  voices.forEach((voice) => {
    const opt = document.createElement("option");
    opt.value = voice.voiceURI;
    opt.textContent = `${voice.name} (${voice.lang})`;
    if (voice.voiceURI === savedUri) opt.selected = true;
    ttsVoiceSelect.appendChild(opt);
  });

  if (!savedUri && voices.length) {
    ttsVoiceSelect.value = preferred ? preferred.voiceURI : voices[0].voiceURI;
    localStorage.setItem(`${VOICE_KEY_PREFIX}${state.lang}`, ttsVoiceSelect.value);
  }
  ttsVoiceSelect.disabled = false;
}

function speakQuestion(force = false) {
  if (!("speechSynthesis" in window)) return;
  if (!force && !state.ttsEnabled) return;
  const current = state.questions[state.current];
  if (!current) return;
  const langCode = getLangCode();
  const text = `${current.dan} ${current.times}`;
  const phraseMap = {
    ko: `${current.dan} 곱하기 ${current.times}`,
    en: `${current.dan} times ${current.times}`,
    zh: `${current.dan} 乘以 ${current.times}`,
    ja: `${current.dan} かける ${current.times}`,
    es: `${current.dan} por ${current.times}`,
    fr: `${current.dan} fois ${current.times}`,
    de: `${current.dan} mal ${current.times}`,
    pt: `${current.dan} vezes ${current.times}`,
    vi: `${current.dan} nhân ${current.times}`,
    th: `${current.dan} คูณ ${current.times}`,
    id: `${current.dan} kali ${current.times}`,
  };
  const phrase = phraseMap[state.lang] || text;
  questionTts.textContent = phrase;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = langCode;
  const voice = pickVoice(langCode);
  if (voice) utterance.voice = voice;
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function buildChips() {
  danChips.innerHTML = "";
  for (let dan = 2; dan <= state.maxDan; dan += 1) {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = `${dan}${t("danSuffix")}`;
    chip.dataset.dan = dan;
    if (state.selectedDans.has(dan)) chip.classList.add("active");
    chip.addEventListener("click", () => toggleDan(dan, chip));
    danChips.appendChild(chip);
  }
}

function toggleDan(dan, chip) {
  if (state.selectedDans.has(dan)) {
    if (state.selectedDans.size === 1) return;
    state.selectedDans.delete(dan);
    chip.classList.remove("active");
  } else {
    state.selectedDans.add(dan);
    chip.classList.add("active");
  }
  startQuiz();
}

function updateModeButtons() {
  toggleBtns.forEach((btn) => {
    if (btn.dataset.mode) {
      btn.classList.toggle("active", btn.dataset.mode === state.mode);
    }
    if (btn.dataset.session) {
      btn.classList.toggle("active", btn.dataset.session === state.session);
    }
  });
}

function buildQuestions() {
  const dans = Array.from(state.selectedDans);
  const total = state.total;
  const questions = [];
  const wrongPool = getWrongPool();
  const ratio = state.session === "challenge" ? CHALLENGE_WRONG_RATIO : NORMAL_WRONG_RATIO;
  const wrongTarget = Math.floor(total * ratio);
  const wrongCount =
    wrongPool.length >= WRONG_POOL_MIN
      ? Math.min(wrongTarget, wrongPool.length)
      : 0;
  const used = new Set();

  for (let i = 0; i < wrongCount; i += 1) {
    const item = wrongPool[i % wrongPool.length];
    const key = `${item.dan}x${item.times}`;
    if (used.has(key)) continue;
    used.add(key);
    questions.push({ dan: item.dan, times: item.times, answer: item.dan * item.times });
  }

  if (state.mode === "sequence") {
    let i = 0;
    while (questions.length < total) {
      const dan = dans[i % dans.length];
      const times = (Math.floor(i / dans.length) % state.maxTimes) + 1;
      const key = `${dan}x${times}`;
      if (!used.has(key)) {
        used.add(key);
        questions.push({ dan, times, answer: dan * times });
      }
      i += 1;
    }
  } else {
    while (questions.length < total) {
      const dan = dans[Math.floor(Math.random() * dans.length)];
      const times = Math.floor(Math.random() * state.maxTimes) + 1;
      const key = `${dan}x${times}`;
      if (!used.has(key)) {
        used.add(key);
        questions.push({ dan, times, answer: dan * times });
      }
    }
  }

  state.questions = questions;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function buildAnswers(current) {
  const answers = new Set([current.answer]);
  while (answers.size < 4) {
    const rand = (Math.floor(Math.random() * state.maxTimes) + 1) * (Math.floor(Math.random() * (state.maxDan - 1)) + 2);
    answers.add(rand);
  }
  return shuffle(Array.from(answers));
}

function renderHearts() {
  heartsEl.textContent = "❤️".repeat(state.hearts) + "🧡".repeat(3 - state.hearts);
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function formatSeconds(ms) {
  return (ms / 1000).toFixed(2);
}

function startTimer() {
  if (state.timer) clearInterval(state.timer);
  state.startedAt = Date.now();
  state.timer = setInterval(() => {
    timerEl.textContent = formatTime(Date.now() - state.startedAt);
  }, 500);
}

function stopTimer() {
  if (state.timer) clearInterval(state.timer);
  state.timer = null;
}

function startCountdown() {
  if (state.countdownTimer) clearInterval(state.countdownTimer);
  state.questionStartedAt = Date.now();
  const limitMs = state.timeLimit * 1000;
  const update = () => {
    const elapsed = Date.now() - state.questionStartedAt;
    const remaining = Math.max(0, limitMs - elapsed);
    const value = (Math.ceil(remaining / 100) / 10).toFixed(1);
    timerEl.textContent = t("remainingTime", { value });
    if (remaining <= 0) {
      handleTimeout();
    }
  };
  update();
  state.countdownTimer = setInterval(update, 100);
}

function stopCountdown() {
  if (state.countdownTimer) clearInterval(state.countdownTimer);
  state.countdownTimer = null;
}

function renderQuestion() {
  const current = state.questions[state.current];
  if (!current) return;
  progressEl.textContent = `${state.current + 1} / ${state.total}`;
  questionEl.textContent = `${current.dan} × ${current.times} = ?`;
  feedbackEl.textContent = "";
  nextBtn.disabled = true;
  questionTts.textContent = "";

  answersEl.innerHTML = "";
  const options = buildAnswers(current);
  options.forEach((value) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = value;
    btn.dataset.index = answersEl.children.length + 1;
    btn.addEventListener("click", () => handleAnswer(btn, value));
    answersEl.appendChild(btn);
  });

  card.classList.remove("pop");
  void card.offsetWidth;
  card.classList.add("pop");

  if (state.session === "challenge") {
    startCountdown();
  }
  speakQuestion();
}

function handleAnswer(button, value) {
  const current = state.questions[state.current];
  if (!current) return;

  if (state.session === "challenge") {
    stopCountdown();
    const elapsed = Date.now() - state.questionStartedAt;
    state.questionTimes.push(elapsed);
  }

  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => (btn.disabled = true));

  if (value === current.answer) {
    state.correct += 1;
    state.stars += 1;
    const applause = t("applause");
    feedbackEl.textContent = applause[Math.floor(Math.random() * applause.length)];
    button.classList.add("correct");
  } else {
    state.hearts = Math.max(0, state.hearts - 1);
    const gentle = t("gentle");
    feedbackEl.textContent = gentle[Math.floor(Math.random() * gentle.length)];
    button.classList.add("wrong");
    buttons.forEach((btn) => {
      if (Number(btn.textContent) === current.answer) btn.classList.add("correct");
    });
  }

  state.answers.push({
    ...current,
    chosen: value,
    correct: value === current.answer,
  });

  starsEl.textContent = state.stars;
  renderHearts();
  nextBtn.disabled = false;
  if (state.hearts === 0) {
    nextBtn.textContent = t("resultsBtn");
  }

  setTimeout(() => {
    nextQuestion();
  }, 600);
}

function handleSkip() {
  const current = state.questions[state.current];
  if (!current) return;
  if (state.session === "challenge") return;
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => (btn.disabled = true));
  state.answers.push({
    ...current,
    chosen: null,
    correct: false,
  });
  feedbackEl.textContent = t("skipFeedback");
  nextBtn.disabled = false;
  setTimeout(() => {
    nextQuestion();
  }, 600);
}

function handleTimeout() {
  if (state.session !== "challenge") return;
  stopCountdown();
  const current = state.questions[state.current];
  if (!current) return;
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => (btn.disabled = true));

  state.questionTimes.push(state.timeLimit * 1000);
  state.hearts = Math.max(0, state.hearts - 1);
  feedbackEl.textContent = t("timeout");
  buttons.forEach((btn) => {
    if (Number(btn.textContent) === current.answer) btn.classList.add("correct");
  });

  state.answers.push({
    ...current,
    chosen: null,
    correct: false,
  });

  starsEl.textContent = state.stars;
  renderHearts();
  nextBtn.disabled = false;
  nextBtn.textContent = state.hearts === 0 ? t("resultsBtn") : t("nextBtn");
  setTimeout(() => {
    nextQuestion();
  }, 500);
}

function nextQuestion() {
  if (state.hearts === 0 || state.current === state.total - 1) {
    finishQuiz();
    return;
  }
  state.current += 1;
  renderQuestion();
}

function finishQuiz() {
  stopTimer();
  stopCountdown();
  card.style.display = "none";
  result.style.display = "block";

  resultStars.textContent = state.stars;
  const rate = Math.round((state.correct / state.total) * 100);
  resultRate.textContent = rate;
  resultTime.textContent =
    state.session === "challenge"
      ? `${t("average")} ${formatSeconds(getAverageTime())}${t("seconds")}`
      : timerEl.textContent;

  const wrong = state.answers.filter((item) => !item.correct);
  reviewList.innerHTML = "";
  wrong.forEach((item) => {
    const div = document.createElement("div");
    div.className = "review-item";
    const chosen = item.chosen === null ? t("skipped") : item.chosen;
    div.textContent = `${item.dan} × ${item.times} = ${item.answer} (${t("myAnswer")}: ${chosen})`;
    reviewList.appendChild(div);
  });

  if (wrong.length === 0) {
    reviewList.innerHTML = `<p>${t("perfect")}</p>`;
  }

  saveHistory({
    date: new Date().toISOString(),
    rate,
    total: state.total,
    correct: state.correct,
    time: state.session === "challenge" ? null : timerEl.textContent,
    avgTimeMs: state.session === "challenge" ? Math.round(getAverageTime()) : null,
    timeLimit: state.session === "challenge" ? state.timeLimit : null,
    wrong,
    selected: Array.from(state.selectedDans),
    mode: state.mode,
    session: state.session,
  });

  renderHistory();
}

function startQuiz() {
  state.total = Number(countRange.value);
  state.timeLimit = Number(timeLimitRange.value);
  state.maxDan = extendToggle.checked ? 20 : 9;
  state.maxTimes = extendToggle.checked ? 20 : 9;
  for (let dan = state.maxDan + 1; dan <= 20; dan += 1) {
    state.selectedDans.delete(dan);
  }
  buildChips();
  state.current = 0;
  state.correct = 0;
  state.stars = 0;
  state.hearts = 3;
  state.questions = [];
  state.answers = [];
  state.questionTimes = [];
  timerEl.textContent = "00:00";
  starsEl.textContent = "0";
  renderHearts();
  nextBtn.textContent = t("nextBtn");

  buildQuestions();
  renderQuestion();

  card.style.display = "block";
  result.style.display = "none";
  reviewList.innerHTML = "";
  if (state.session === "normal") {
    startTimer();
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  const trimmed = history.slice(0, HISTORY_LIMIT);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

function formatDate(iso) {
  const date = new Date(iso);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}

function renderHistory() {
  const history = loadHistory();
  renderHistoryList(history);
  renderWrongList(history);
  renderChallengeReport(history);
  renderChart(history);
}

function getWrongPool() {
  const history = loadHistory();
  const pool = [];
  history.forEach((entry) => {
    (entry.wrong || []).forEach((item) => {
      if (state.selectedDans.has(item.dan)) {
        pool.push({ dan: item.dan, times: item.times });
      }
    });
  });
  return pool;
}

function renderHistoryList(history) {
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = `<p>${t("noHistory")}</p>`;
    return;
  }
  history.slice(0, 8).forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    const meta =
      item.session === "challenge"
        ? `${t("challengeMeta")} · ${t("average")} ${formatSeconds(item.avgTimeMs)}${t("seconds")} · ${t("limit")} ${item.timeLimit}${t("seconds")}`
        : `${t("normalMeta")} · ${item.time}`;
    div.innerHTML = `<strong>${item.rate}%</strong> <span>${formatDate(item.date)} · ${item.correct}/${item.total} · ${meta}</span>`;
    historyList.appendChild(div);
  });
}

function renderWrongList(history) {
  wrongList.innerHTML = "";
  const counter = {};
  history.forEach((entry) => {
    (entry.wrong || []).forEach((item) => {
      const key = `${item.dan}x${item.times}`;
      counter[key] = (counter[key] || 0) + 1;
    });
  });

  const sorted = Object.entries(counter)
    .map(([key, count]) => {
      const [dan, times] = key.split("x");
      return { dan: Number(dan), times: Number(times), count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (sorted.length === 0) {
    wrongList.innerHTML = `<p>${t("noWrong")}</p>`;
    return;
  }

  sorted.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `<strong>${item.dan} × ${item.times}</strong> <span>${t("wrongCountFull", { count: item.count })}</span>`;
    wrongList.appendChild(div);
  });
}

function renderChart(history) {
  if (!historyChart) return;
  const ctx = historyChart.getContext("2d");
  const width = historyChart.width;
  const height = historyChart.height;
  ctx.clearRect(0, 0, width, height);

  const padding = 36;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const data = history.slice(0, 12).reverse();

  ctx.fillStyle = "#fff7ef";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255, 122, 0, 0.2)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding + (plotHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  if (data.length === 0) {
    ctx.fillStyle = "#d65f00";
    ctx.font = "18px 'Baloo 2'";
    ctx.textAlign = "center";
    ctx.fillText(t("noHistory"), width / 2, height / 2);
    return;
  }

  const step = plotWidth / Math.max(1, data.length - 1);
  ctx.strokeStyle = "#ff7a00";
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((item, index) => {
    const x = padding + step * index;
    const y = padding + plotHeight * (1 - item.rate / 100);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  data.forEach((item, index) => {
    const x = padding + step * index;
    const y = padding + plotHeight * (1 - item.rate / 100);
    ctx.fillStyle = "#2bc7a8";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1d1c1a";
    ctx.font = "14px 'Baloo 2'";
    ctx.textAlign = "center";
    ctx.fillText(`${item.rate}%`, x, y - 12);
  });
}

function renderChallengeReport(history) {
  const challengeHistory = history.filter((item) => item.session === "challenge");
  if (challengeHistory.length === 0) {
    challengeSummary.textContent = t("challengeEmpty");
    challengeWrongList.innerHTML = `<p>${t("noWrongChallenge")}</p>`;
    return;
  }

  const best = challengeHistory.reduce((acc, cur) => {
    if (!cur.avgTimeMs) return acc;
    if (!acc || cur.avgTimeMs < acc.avgTimeMs) return cur;
    return acc;
  }, null);

  if (best) {
    challengeSummary.textContent = t("bestRecord", {
      value: formatSeconds(best.avgTimeMs),
      limit: best.timeLimit,
      date: formatDate(best.date),
    });
  }

  const counter = {};
  challengeHistory.forEach((entry) => {
    (entry.wrong || []).forEach((item) => {
      const key = `${item.dan}x${item.times}`;
      counter[key] = (counter[key] || 0) + 1;
    });
  });

  const sorted = Object.entries(counter)
    .map(([key, count]) => {
      const [dan, times] = key.split("x");
      return { dan: Number(dan), times: Number(times), count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  challengeWrongList.innerHTML = "";
  if (sorted.length === 0) {
    challengeWrongList.innerHTML = `<p>${t("noWrongChallenge")}</p>`;
    return;
  }

  sorted.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `<strong>${item.dan} × ${item.times}</strong> <span>${t("wrongCount", { count: item.count })}</span>`;
    challengeWrongList.appendChild(div);
  });
}

function getAverageTime() {
  if (state.questionTimes.length === 0) return 0;
  const sum = state.questionTimes.reduce((acc, cur) => acc + cur, 0);
  return sum / state.questionTimes.length;
}

countRange.addEventListener("input", () => {
  countValue.textContent = countRange.value;
});

countRange.addEventListener("change", startQuiz);

timeLimitRange.addEventListener("input", () => {
  timeLimitValue.textContent = `${timeLimitRange.value}${t("seconds")}`;
});

timeLimitRange.addEventListener("change", () => {
  state.timeLimit = Number(timeLimitRange.value);
  if (state.session === "challenge") startQuiz();
});

extendToggle.addEventListener("change", () => {
  startQuiz();
});

skipBtn.addEventListener("click", () => {
  handleSkip();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
});

restartBtn.addEventListener("click", startQuiz);

reviewBtn.addEventListener("click", () => {
  reviewList.scrollIntoView({ behavior: "smooth" });
});

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

exportHistoryBtn.addEventListener("click", () => {
  const history = loadHistory();
  const payload = {
    exportedAt: new Date().toISOString(),
    count: history.length,
    items: history,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gugudan-history.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

toggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.mode) {
      state.mode = btn.dataset.mode;
    }
    if (btn.dataset.session) {
      state.session = btn.dataset.session;
      challengeControl.classList.toggle("hidden", state.session !== "challenge");
      skipBtn.classList.toggle("hidden", state.session === "challenge");
    }
    updateModeButtons();
    startQuiz();
  });
});

languageSelect.addEventListener("change", () => {
  state.lang = languageSelect.value;
  localStorage.setItem(LANG_KEY, state.lang);
  applyTranslations();
  renderHistory();
  renderVoiceSelect();
  speakQuestion(true);
});

buildChips();
updateModeButtons();
countValue.textContent = countRange.value;
state.lang = localStorage.getItem(LANG_KEY) || "ko";
languageSelect.value = state.lang;
timeLimitValue.textContent = `${timeLimitRange.value}${t("seconds")}`;
challengeControl.classList.add("hidden");
startQuiz();
renderHistory();
applyTranslations();
loadVoices();
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

ttsToggle.addEventListener("change", () => {
  state.ttsEnabled = ttsToggle.checked;
  if (state.ttsEnabled) speakQuestion(true);
});

ttsButton.addEventListener("click", () => {
  speakQuestion(true);
});

ttsVoiceSelect.addEventListener("change", () => {
  const value = ttsVoiceSelect.value;
  if (value) {
    localStorage.setItem(`${VOICE_KEY_PREFIX}${state.lang}`, value);
  }
  speakQuestion(true);
});

document.addEventListener("keydown", (event) => {
  if (result.style.display === "block") return;
  const key = event.key;
  if (!["1", "2", "3", "4"].includes(key)) return;
  const buttons = document.querySelectorAll(".answer-btn");
  const index = Number(key) - 1;
  const target = buttons[index];
  if (target && !target.disabled) {
    target.click();
  }
});
