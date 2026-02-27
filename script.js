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
const pauseBtn = document.getElementById("pauseBtn");
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
const languageSelect = document.getElementById("languageSelect");
const extendToggle = document.getElementById("extendToggle");
const ttsToggle = document.getElementById("ttsToggle");
const ttsButton = document.getElementById("ttsButton");
const questionTts = document.getElementById("questionTts");
const ttsVoiceSelect = document.getElementById("ttsVoiceSelect");
const startBtn = document.getElementById("startBtn");

const state = {
  mode: "mixed",
  session: "normal",
  total: 20,
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
  hasStarted: false,
  isPaused: false,
  elapsedMs: 0,
  countdownRemainingMs: null,
  autoNextTimer: null,
  pendingAutoNext: false,
  pauseSnapshot: null,
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
    siteBrand: "구구단 퀴즈 놀이터",
    title: "구구단 퀴즈 놀이터",
    subtitle: "새로운 시대의 구구단 학습법, 게임처럼 몰입하고 기록으로 성장해요!",
    heroStory: "우리 아이의 구구단 공부를 위해 아빠가 AI로 직접 만들었어요.\n전 세계 모든 아이들이 구구단을 쉽게 외울 수 있도록요.",
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
    sessionWrong: "오답 집중",
    timeLimitLabel: "도전 시간 제한",
    timeLimitHelp: "도전 모드에서는 문제당 제한 시간 안에 답해야 해요.",
    countLabel: "문제 수",
    starsLabel: "별",
    starsSuffix: "개",
    startBtn: "학습 시작",
    startBtnRestart: "학습 다시 시작",
    startHelp: "설정을 고른 뒤 위의 학습 시작 버튼을 눌러 주세요.",
    wrongPracticeHelp: "기록된 오답으로 집중 학습을 할 수 있어요. 학습 시작 버튼을 눌러 주세요.",
    wrongPracticeEmpty: "기록된 오답이 없어요. 기본 모드로 먼저 학습해 주세요.",
    pauseBtn: "잠시 멈춤",
    resumeBtn: "이어서 학습",
    paused: "일시정지됨. 이어서 학습 버튼을 눌러 계속하세요.",
    ttsNoVoice: "TTS 음성이 없습니다",
    skipBtn: "모르면 넘어가기",
    nextBtn: "다음 문제",
    resultTitle: "오늘의 결과",
    resultStarsSuffix: "개의 별을 모았어요!",
    resultRateLabel: "정답률",
    resultTimeLabel: "걸린 시간",
    restartBtn: "다시 도전",
    reviewBtn: "틀린 문제 보기",
    historyTitle: "학습 이력",
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
    wrongMeta: "오답 집중",
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
    navGuide: "학습 가이드",
    navTerms: "이용약관",
    footerAbout: "사이트 소개",
    footerPrivacy: "개인정보처리방침",
    footerContact: "문의하기",
    homeQualityTitle: "구구단 퀴즈 놀이터가 학습에 도움이 되는 이유",
    homeQualityP1:
      "이 서비스는 단순히 문제를 무작위로 보여주는 퀴즈가 아니라, 오답 복습, 답변 속도 확인, 학습 이력 시각화를 함께 제공하도록 설계했습니다.",
    homeQualityP2:
      "학습 과정에서는 아는 것과 빠르게 맞히는 것의 차이가 크기 때문에, 기본 모드와 챌린지 모드를 분리해 정확도와 속도를 따로 훈련할 수 있게 했습니다.",
    homeTipsTitle: "부모와 교사를 위한 권장 사용법",
    homeTips1: "하루 10~15분씩 짧게, 주 5회 이상 반복하는 방식을 권장합니다.",
    homeTips2: "정답률 90% 이상이 3회 이상 유지되면 다음 단으로 확장하세요.",
    homeTips3: "오답 집중 모드는 취약한 문제를 빠르게 보완하는 데 가장 효과적입니다.",
    homeTips4: "학습 시간은 길게 끌지 말고, 성취감이 남을 때 종료하는 편이 지속성에 유리합니다.",
    homeTipsLinkPrefix: "더 자세한 운영 팁은",
    homeTipsLinkSuffix: "에서 확인할 수 있습니다.",
    homePolicyTitle: "광고 및 정책 안내",
    homePolicyP1Prefix: "본 사이트는 무료 운영을 위해 Google AdSense를 사용할 수 있으며, 광고·개인정보 처리 기준은",
    homePolicyP1Middle: "과",
    homePolicyP1Suffix: "에서 투명하게 공개합니다.",
    homePolicyP2Prefix: "사이트 운영자 정보와 문의 채널은",
    homePolicyP2Middle: "와",
    homePolicyP2Suffix: "페이지에서 확인할 수 있습니다.",
    chartAria: "정답률 그래프",
    applause: ["멋져요!", "천재네!", "완벽해요!", "짱이에요!", "정답! 잘했어요!"],
    gentle: ["괜찮아요, 다시!", "조금만 더!", "다음엔 맞힐 수 있어요!"],
  },
  en: {
    badge: "Today's Times Tables",
    siteBrand: "Times Table Quiz Playground",
    title: "Times Table Quiz Playground",
    subtitle: "A new-era way to master times tables: game-like focus powered by progress data.",
    heroStory: "Made directly with AI by a dad to help his own child study times tables, so kids everywhere can learn them with ease.",
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
    sessionWrong: "Mistake Focus",
    timeLimitLabel: "Challenge Time Limit",
    timeLimitHelp: "Answer each question within the time limit in Challenge mode.",
    countLabel: "Number of Questions",
    starsLabel: "Stars",
    starsSuffix: "",
    startBtn: "Start Learning",
    startBtnRestart: "Restart Learning",
    startHelp: "Choose settings, then click Start Learning.",
    wrongPracticeHelp: "Practice only with frequently missed questions from your history. Click Start Learning.",
    wrongPracticeEmpty: "No missed-question history yet. Complete a Normal session first.",
    pauseBtn: "Pause",
    resumeBtn: "Resume",
    paused: "Paused. Click resume to continue.",
    ttsNoVoice: "No TTS voice available",
    skipBtn: "Skip",
    nextBtn: "Next",
    resultTitle: "Today's Result",
    resultStarsSuffix: " stars collected!",
    resultRateLabel: "Accuracy",
    resultTimeLabel: "Time",
    restartBtn: "Retry",
    reviewBtn: "Review Mistakes",
    historyTitle: "Learning History",
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
    wrongMeta: "Mistake Focus",
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
    navGuide: "Learning Guide",
    navTerms: "Terms",
    footerAbout: "About",
    footerPrivacy: "Privacy Policy",
    footerContact: "Contact",
    homeQualityTitle: "Why This Quiz Helps Learning",
    homeQualityP1:
      "This service is not just a random quiz generator. It is designed to combine mistake review, response-speed tracking, and learning-history visualization.",
    homeQualityP2:
      "In practice, knowing an answer and answering quickly are different skills. That is why Normal mode and Challenge mode are separated for focused training.",
    homeTipsTitle: "Recommended Use for Parents and Teachers",
    homeTips1: "Keep sessions short (10-15 minutes), but repeat at least 5 times a week.",
    homeTips2: "If accuracy stays above 90% for three sessions, move to the next table range.",
    homeTips3: "Mistake Focus mode is the most effective way to fix weak questions quickly.",
    homeTips4: "Do not force long sessions. Ending while motivation is high improves consistency.",
    homeTipsLinkPrefix: "You can find more operation tips in the",
    homeTipsLinkSuffix: "page.",
    homePolicyTitle: "Ads and Policy Notice",
    homePolicyP1Prefix:
      "This site may use Google AdSense to stay free, and ad/privacy handling rules are transparently documented in the",
    homePolicyP1Middle: "and",
    homePolicyP1Suffix: "pages.",
    homePolicyP2Prefix: "Operator information and contact channels are available on the",
    homePolicyP2Middle: "and",
    homePolicyP2Suffix: "pages.",
    chartAria: "Accuracy chart",
    applause: ["Great!", "Genius!", "Perfect!", "Awesome!", "Correct!"],
    gentle: ["It's okay, try again!", "Almost there!", "You'll get it next time!"],
  },
  zh: {
    badge: "今日九九表",
    siteBrand: "九九乘法测验乐园",
    title: "九九乘法测验乐园",
    subtitle: "面向新时代的九九学习法：像游戏一样投入，用学习记录持续进步。",
    heroStory: "这是爸爸为了自己孩子学习九九乘法，用AI亲自制作的，希望全世界的孩子都能轻松掌握。",
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
    sessionWrong: "错题练习",
    timeLimitLabel: "挑战时间限制",
    timeLimitHelp: "挑战模式下每题需要在限定时间内作答。",
    countLabel: "题目数量",
    starsLabel: "星星",
    starsSuffix: "个",
    startBtn: "开始学习",
    startBtnRestart: "重新开始学习",
    startHelp: "先选择设置，再点击开始学习。",
    wrongPracticeHelp: "可以基于历史错题进行集中练习，点击开始学习。",
    wrongPracticeEmpty: "还没有错题记录。请先完成一次普通模式学习。",
    pauseBtn: "暂停",
    resumeBtn: "继续学习",
    paused: "已暂停。点击继续学习以继续。",
    ttsNoVoice: "没有可用的TTS语音",
    skipBtn: "跳过",
    nextBtn: "下一题",
    resultTitle: "今日结果",
    resultStarsSuffix: "颗星星!",
    resultRateLabel: "正确率",
    resultTimeLabel: "用时",
    restartBtn: "再挑战",
    reviewBtn: "查看错题",
    historyTitle: "学习记录",
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
    wrongMeta: "错题练习",
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
    navGuide: "学习指南",
    navTerms: "使用条款",
    footerAbout: "网站介绍",
    footerPrivacy: "隐私政策",
    footerContact: "联系我们",
    homeQualityTitle: "为什么这个测验有助于学习",
    homeQualityP1:
      "这不仅是随机出题的测验，还结合了错题复习、答题速度追踪和学习记录可视化。",
    homeQualityP2:
      "在练习中，“会做”和“答得快”是不同能力，所以将普通模式与挑战模式分开，分别训练准确率和速度。",
    homeTipsTitle: "给家长和老师的使用建议",
    homeTips1: "建议每天短时练习10-15分钟，每周至少5次。",
    homeTips2: "当正确率连续3次保持在90%以上时，可扩展到下一段乘法。",
    homeTips3: "错题练习模式最适合快速补强薄弱题。",
    homeTips4: "不要拉长学习时间，在仍有成就感时结束更利于持续。",
    homeTipsLinkPrefix: "更多运营建议可在",
    homeTipsLinkSuffix: "页面查看。",
    homePolicyTitle: "广告与政策说明",
    homePolicyP1Prefix:
      "本站为免费运营，可能使用 Google AdSense，广告与隐私处理标准已在",
    homePolicyP1Middle: "和",
    homePolicyP1Suffix: "页面公开说明。",
    homePolicyP2Prefix: "站点运营者信息与联系方式可在",
    homePolicyP2Middle: "与",
    homePolicyP2Suffix: "页面查看。",
    chartAria: "正确率图表",
    applause: ["太棒了！", "天才！", "完美！", "厉害！", "答对了！"],
    gentle: ["没关系，再试试！", "差一点！", "下次一定行！"],
  },
  ja: {
    badge: "今日の九九",
    siteBrand: "九九クイズ広場",
    title: "九九クイズ広場",
    subtitle: "新しい時代の九九学習法。ゲーム感覚で集中し、記録で成長できます。",
    heroStory: "わが子の九九学習のために、父親がAIで直接作りました。世界中の子どもが九九をやさしく覚えられるように。",
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
    sessionWrong: "ミス集中",
    timeLimitLabel: "チャレンジ制限時間",
    timeLimitHelp: "チャレンジモードでは時間内に答えてね。",
    countLabel: "問題数",
    starsLabel: "スター",
    starsSuffix: "個",
    startBtn: "学習開始",
    startBtnRestart: "学習を最初から",
    startHelp: "設定を選んでから学習開始を押してください。",
    wrongPracticeHelp: "履歴の間違い問題だけを集中練習できます。学習開始を押してください。",
    wrongPracticeEmpty: "まだ間違い履歴がありません。先に通常モードで学習してください。",
    pauseBtn: "一時停止",
    resumeBtn: "学習を再開",
    paused: "一時停止中です。学習を再開を押してください。",
    ttsNoVoice: "利用可能なTTS音声がありません",
    skipBtn: "スキップ",
    nextBtn: "次へ",
    resultTitle: "今日の結果",
    resultStarsSuffix: "個のスター！",
    resultRateLabel: "正答率",
    resultTimeLabel: "時間",
    restartBtn: "もう一回",
    reviewBtn: "まちがいを見る",
    historyTitle: "学習履歴",
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
    wrongMeta: "ミス集中",
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
    navGuide: "学習ガイド",
    navTerms: "利用規約",
    footerAbout: "サイト紹介",
    footerPrivacy: "プライバシーポリシー",
    footerContact: "お問い合わせ",
    homeQualityTitle: "このクイズが学習に役立つ理由",
    homeQualityP1:
      "このサービスはランダム出題だけでなく、間違い復習・解答速度の確認・学習履歴の可視化を組み合わせて設計しています。",
    homeQualityP2:
      "学習では「分かること」と「速く答えること」は別の力なので、通常モードとチャレンジモードを分けて精度と速度を個別に鍛えられます。",
    homeTipsTitle: "保護者・先生向けの推奨利用方法",
    homeTips1: "1回10〜15分の短時間を、週5回以上くり返す方法を推奨します。",
    homeTips2: "正答率90%以上が3回以上続いたら、次の段に広げてください。",
    homeTips3: "ミス集中モードは苦手問題を短時間で補強するのに最も効果的です。",
    homeTips4: "長時間学習は避け、達成感が残るうちに終える方が継続しやすくなります。",
    homeTipsLinkPrefix: "より詳しい運用のコツは",
    homeTipsLinkSuffix: "で確認できます。",
    homePolicyTitle: "広告とポリシーの案内",
    homePolicyP1Prefix:
      "本サイトは無料運営のため Google AdSense を利用する場合があり、広告・個人情報の取り扱い基準は",
    homePolicyP1Middle: "と",
    homePolicyP1Suffix: "で公開しています。",
    homePolicyP2Prefix: "運営者情報と問い合わせ窓口は",
    homePolicyP2Middle: "と",
    homePolicyP2Suffix: "ページで確認できます。",
    chartAria: "正答率グラフ",
    applause: ["すごい！", "天才！", "完璧！", "いいね！", "正解！"],
    gentle: ["大丈夫、もう一回！", "あと少し！", "次はできるよ！"],
  },
  es: {
    badge: "Tablas del día",
    siteBrand: "Parque de Quiz de Tablas",
    title: "Parque de Quiz de Tablas",
    subtitle: "Un método de tablas para la nueva era: concentración tipo juego y progreso medible.",
    heroStory: "Un papá lo creó directamente con IA para ayudar a su propio hijo con las tablas, para que niños de todo el mundo las aprendan con facilidad.",
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
    sessionWrong: "Errores",
    timeLimitLabel: "Límite de tiempo",
    timeLimitHelp: "En el modo desafío, responde en el tiempo indicado.",
    countLabel: "Número de preguntas",
    starsLabel: "Estrellas",
    starsSuffix: "",
    startBtn: "Iniciar aprendizaje",
    startBtnRestart: "Reiniciar aprendizaje",
    startHelp: "Elige la configuración y pulsa Iniciar aprendizaje.",
    wrongPracticeHelp: "Puedes practicar solo con tus errores frecuentes del historial. Pulsa Iniciar aprendizaje.",
    wrongPracticeEmpty: "Aún no hay errores guardados. Haz primero una sesión en modo normal.",
    pauseBtn: "Pausar",
    resumeBtn: "Reanudar",
    paused: "Pausado. Pulsa Reanudar para continuar.",
    ttsNoVoice: "No hay voz TTS disponible",
    skipBtn: "Saltar",
    nextBtn: "Siguiente",
    resultTitle: "Resultado de hoy",
    resultStarsSuffix: " estrellas conseguidas!",
    resultRateLabel: "Precisión",
    resultTimeLabel: "Tiempo",
    restartBtn: "Reintentar",
    reviewBtn: "Ver errores",
    historyTitle: "Historial",
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
    wrongMeta: "Errores",
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
    footerAbout: "Acerca del sitio",
    footerPrivacy: "Política de privacidad",
    footerContact: "Contacto",
    navGuide: "Guía de estudio",
    navTerms: "Términos de uso",
    homeQualityTitle: "Por qué este quiz ayuda al aprendizaje",
    homeQualityP1:
      "Este servicio no es solo un generador de preguntas aleatorias. Está diseñado para combinar repaso de errores, seguimiento de velocidad de respuesta y visualización del historial de aprendizaje.",
    homeQualityP2:
      "En la práctica, saber la respuesta y responder rápido son habilidades distintas. Por eso se separan el modo normal y el modo desafío para entrenar precisión y velocidad.",
    homeTipsTitle: "Uso recomendado para padres y docentes",
    homeTips1: "Mantén sesiones cortas (10-15 minutos), al menos 5 veces por semana.",
    homeTips2: "Si la precisión se mantiene por encima del 90% durante tres sesiones, pasa a la siguiente tabla.",
    homeTips3: "El modo Enfoque en Errores es la forma más eficaz de reforzar rápidamente las preguntas débiles.",
    homeTips4: "No alargues demasiado las sesiones. Terminar con motivación alta mejora la constancia.",
    homeTipsLinkPrefix: "Puedes encontrar más consejos en la",
    homeTipsLinkSuffix: "página.",
    homePolicyTitle: "Anuncios y aviso de políticas",
    homePolicyP1Prefix:
      "Este sitio puede usar Google AdSense para mantenerse gratuito, y las reglas de anuncios y privacidad se publican de forma transparente en las páginas de",
    homePolicyP1Middle: "y",
    homePolicyP1Suffix: ".",
    homePolicyP2Prefix: "La información del operador y los canales de contacto están disponibles en las páginas de",
    homePolicyP2Middle: "y",
    homePolicyP2Suffix: ".",
    chartAria: "Gráfico de precisión",
    applause: ["¡Genial!", "¡Eres un genio!", "¡Perfecto!", "¡Muy bien!", "¡Correcto!"],
    gentle: ["No pasa nada, intenta otra vez.", "¡Casi!", "¡La próxima lo logras!"],
  },
  fr: {
    badge: "Tables du jour",
    siteBrand: "Terrain de Quiz des Tables",
    title: "Terrain de Quiz des Tables",
    subtitle: "Une méthode de tables pour la nouvelle ère : immersion ludique et progression mesurable.",
    heroStory: "Créé directement avec l'IA par un papa pour aider son propre enfant à apprendre les tables, afin que les enfants du monde entier y arrivent facilement.",
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
    sessionWrong: "Erreurs ciblées",
    timeLimitLabel: "Limite de temps",
    timeLimitHelp: "En mode défi, réponds dans le temps imparti.",
    countLabel: "Nombre de questions",
    starsLabel: "Étoiles",
    starsSuffix: "",
    startBtn: "Commencer",
    startBtnRestart: "Recommencer",
    startHelp: "Choisis les options puis clique sur Commencer.",
    wrongPracticeHelp: "Entraîne-toi uniquement sur les erreurs fréquentes de ton historique. Clique sur Commencer.",
    wrongPracticeEmpty: "Aucune erreur enregistrée pour l'instant. Fais d'abord une session en mode normal.",
    pauseBtn: "Pause",
    resumeBtn: "Reprendre",
    paused: "En pause. Clique sur Reprendre pour continuer.",
    ttsNoVoice: "Aucune voix TTS disponible",
    skipBtn: "Passer",
    nextBtn: "Suivant",
    resultTitle: "Résultat du jour",
    resultStarsSuffix: " étoiles collectées !",
    resultRateLabel: "Précision",
    resultTimeLabel: "Temps",
    restartBtn: "Recommencer",
    reviewBtn: "Voir les erreurs",
    historyTitle: "Historique",
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
    wrongMeta: "Erreurs ciblées",
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
    footerAbout: "À propos",
    footerPrivacy: "Politique de confidentialité",
    footerContact: "Contact",
    navGuide: "Guide d'apprentissage",
    navTerms: "Conditions d'utilisation",
    homeQualityTitle: "Pourquoi ce quiz aide à apprendre",
    homeQualityP1:
      "Ce service n'est pas un simple générateur de questions aléatoires. Il combine la révision des erreurs, le suivi de la vitesse de réponse et la visualisation de l'historique d'apprentissage.",
    homeQualityP2:
      "En pratique, connaître la réponse et répondre vite sont deux compétences différentes. C'est pourquoi les modes normal et défi sont séparés pour entraîner la précision et la vitesse.",
    homeTipsTitle: "Utilisation recommandée pour les parents et les enseignants",
    homeTips1: "Gardez des sessions courtes (10-15 minutes), au moins 5 fois par semaine.",
    homeTips2: "Si la précision reste au-dessus de 90% pendant trois sessions, passez à la table suivante.",
    homeTips3: "Le mode Erreurs ciblées est le plus efficace pour corriger rapidement les points faibles.",
    homeTips4: "N'allongez pas trop les sessions. Terminer avec une bonne motivation améliore la régularité.",
    homeTipsLinkPrefix: "Vous trouverez plus de conseils dans la",
    homeTipsLinkSuffix: "page.",
    homePolicyTitle: "Annonces et informations de politique",
    homePolicyP1Prefix:
      "Ce site peut utiliser Google AdSense pour rester gratuit, et les règles liées aux annonces et à la confidentialité sont publiées de manière transparente dans les pages",
    homePolicyP1Middle: "et",
    homePolicyP1Suffix: ".",
    homePolicyP2Prefix: "Les informations sur l'opérateur et les canaux de contact sont disponibles dans les pages",
    homePolicyP2Middle: "et",
    homePolicyP2Suffix: ".",
    chartAria: "Graphique de précision",
    applause: ["Super !", "Génial !", "Parfait !", "Bravo !", "Correct !"],
    gentle: ["Ce n'est pas grave, réessaie.", "Presque !", "Tu y arriveras !"],
  },
  de: {
    badge: "Heutige Einmaleins",
    siteBrand: "Einmaleins-Quiz Spielplatz",
    title: "Einmaleins-Quiz Spielplatz",
    subtitle: "Eine Einmaleins-Lernmethode für die neue Zeit: spielerischer Fokus und messbarer Fortschritt.",
    heroStory: "Ein Vater hat es mit KI direkt für das Einmaleins-Lernen seines eigenen Kindes gebaut, damit Kinder weltweit leichter lernen können.",
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
    sessionWrong: "Fehlerfokus",
    timeLimitLabel: "Zeitlimit",
    timeLimitHelp: "Im Challenge-Modus musst du rechtzeitig antworten.",
    countLabel: "Anzahl der Fragen",
    starsLabel: "Sterne",
    starsSuffix: "",
    startBtn: "Lernen starten",
    startBtnRestart: "Lernen neu starten",
    startHelp: "Wähle Einstellungen und klicke dann auf Lernen starten.",
    wrongPracticeHelp: "Hier übst du gezielt mit häufig falschen Aufgaben aus deinem Verlauf. Klicke auf Lernen starten.",
    wrongPracticeEmpty: "Noch keine Fehlerdaten vorhanden. Bitte zuerst eine normale Runde abschließen.",
    pauseBtn: "Pausieren",
    resumeBtn: "Fortsetzen",
    paused: "Pausiert. Klicke auf Fortsetzen, um weiterzumachen.",
    ttsNoVoice: "Keine TTS-Stimme verfügbar",
    skipBtn: "Überspringen",
    nextBtn: "Weiter",
    resultTitle: "Ergebnis heute",
    resultStarsSuffix: " Sterne gesammelt!",
    resultRateLabel: "Genauigkeit",
    resultTimeLabel: "Zeit",
    restartBtn: "Nochmal",
    reviewBtn: "Fehler ansehen",
    historyTitle: "Verlauf",
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
    wrongMeta: "Fehlerfokus",
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
    footerAbout: "Über die Website",
    footerPrivacy: "Datenschutz",
    footerContact: "Kontakt",
    navGuide: "Lernleitfaden",
    navTerms: "Nutzungsbedingungen",
    homeQualityTitle: "Warum dieses Quiz beim Lernen hilft",
    homeQualityP1:
      "Dieser Dienst ist nicht nur ein zufälliger Quiz-Generator. Er kombiniert Fehlerwiederholung, Antwortgeschwindigkeits-Tracking und die Visualisierung des Lernverlaufs.",
    homeQualityP2:
      "In der Praxis sind Wissen und schnelles Antworten unterschiedliche Fähigkeiten. Deshalb sind Normalmodus und Challenge-Modus getrennt, um Genauigkeit und Tempo gezielt zu trainieren.",
    homeTipsTitle: "Empfohlene Nutzung für Eltern und Lehrkräfte",
    homeTips1: "Halte die Einheiten kurz (10-15 Minuten), aber wiederhole sie mindestens 5-mal pro Woche.",
    homeTips2: "Wenn die Genauigkeit in drei Einheiten über 90% bleibt, wechsle zur nächsten Reihe.",
    homeTips3: "Der Fehlerfokus-Modus ist am effektivsten, um schwache Aufgaben schnell zu verbessern.",
    homeTips4: "Ziehe die Lernzeit nicht zu lang. Ein Ende mit hoher Motivation verbessert die Regelmäßigkeit.",
    homeTipsLinkPrefix: "Weitere Tipps findest du auf der",
    homeTipsLinkSuffix: "Seite.",
    homePolicyTitle: "Hinweise zu Werbung und Richtlinien",
    homePolicyP1Prefix:
      "Diese Seite kann Google AdSense nutzen, um kostenlos zu bleiben. Regeln zu Werbung und Datenschutz sind transparent auf den Seiten",
    homePolicyP1Middle: "und",
    homePolicyP1Suffix: "veröffentlicht.",
    homePolicyP2Prefix: "Informationen zum Betreiber und Kontaktkanäle findest du auf den Seiten",
    homePolicyP2Middle: "und",
    homePolicyP2Suffix: ".",
    chartAria: "Genauigkeitsdiagramm",
    applause: ["Super!", "Genial!", "Perfekt!", "Toll!", "Richtig!"],
    gentle: ["Nicht schlimm, nochmal.", "Fast!", "Beim nächsten Mal klappt's!"],
  },
  pt: {
    badge: "Tabuadas do dia",
    siteBrand: "Parque de Quiz da Tabuada",
    title: "Parque de Quiz da Tabuada",
    subtitle: "Um novo jeito de aprender tabuada para esta era: foco de jogo e progresso visível.",
    heroStory: "Um pai criou isso diretamente com IA para ajudar o próprio filho a estudar tabuada, para que crianças do mundo todo aprendam com mais facilidade.",
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
    sessionWrong: "Foco nos erros",
    timeLimitLabel: "Limite de tempo",
    timeLimitHelp: "No modo desafio, responda dentro do tempo.",
    countLabel: "Número de questões",
    starsLabel: "Estrelas",
    starsSuffix: "",
    startBtn: "Iniciar estudo",
    startBtnRestart: "Reiniciar estudo",
    startHelp: "Escolha as opções e toque em Iniciar estudo.",
    wrongPracticeHelp: "Pratique só as questões que você mais erra no histórico. Toque em Iniciar estudo.",
    wrongPracticeEmpty: "Ainda não há erros registrados. Faça primeiro uma sessão no modo normal.",
    pauseBtn: "Pausar",
    resumeBtn: "Retomar",
    paused: "Pausado. Toque em Retomar para continuar.",
    ttsNoVoice: "Sem voz TTS disponível",
    skipBtn: "Pular",
    nextBtn: "Próxima",
    resultTitle: "Resultado de hoje",
    resultStarsSuffix: " estrelas!",
    resultRateLabel: "Precisão",
    resultTimeLabel: "Tempo",
    restartBtn: "Tentar novamente",
    reviewBtn: "Ver erros",
    historyTitle: "Histórico",
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
    wrongMeta: "Foco nos erros",
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
    footerAbout: "Sobre o site",
    footerPrivacy: "Política de privacidade",
    footerContact: "Contato",
    navGuide: "Guia de estudo",
    navTerms: "Termos de uso",
    homeQualityTitle: "Por que este quiz ajuda no aprendizado",
    homeQualityP1:
      "Este serviço não é apenas um gerador aleatório de perguntas. Ele combina revisão de erros, acompanhamento da velocidade de resposta e visualização do histórico de estudo.",
    homeQualityP2:
      "Na prática, saber responder e responder rápido são habilidades diferentes. Por isso, os modos normal e desafio são separados para treinar precisão e velocidade.",
    homeTipsTitle: "Uso recomendado para pais e professores",
    homeTips1: "Mantenha sessões curtas (10-15 minutos), pelo menos 5 vezes por semana.",
    homeTips2: "Se a precisão ficar acima de 90% por três sessões, avance para a próxima tabuada.",
    homeTips3: "O modo Foco nos erros é o mais eficaz para corrigir rapidamente os pontos fracos.",
    homeTips4: "Não prolongue demais as sessões. Encerrar com boa motivação melhora a consistência.",
    homeTipsLinkPrefix: "Você pode ver mais dicas na",
    homeTipsLinkSuffix: "página.",
    homePolicyTitle: "Aviso de anúncios e políticas",
    homePolicyP1Prefix:
      "Este site pode usar Google AdSense para continuar gratuito, e as regras de anúncios e privacidade são publicadas com transparência nas páginas de",
    homePolicyP1Middle: "e",
    homePolicyP1Suffix: ".",
    homePolicyP2Prefix: "As informações do operador e os canais de contato estão disponíveis nas páginas de",
    homePolicyP2Middle: "e",
    homePolicyP2Suffix: ".",
    chartAria: "Gráfico de precisão",
    applause: ["Ótimo!", "Gênio!", "Perfeito!", "Muito bem!", "Correto!"],
    gentle: ["Tudo bem, tente de novo.", "Quase!", "Você consegue!"],
  },
  vi: {
    badge: "Bảng cửu chương hôm nay",
    siteBrand: "Sân chơi Quiz Cửu Chương",
    title: "Sân chơi Quiz Cửu Chương",
    subtitle: "Phương pháp học bảng cửu chương cho thời đại mới: tập trung như chơi game và tiến bộ rõ ràng.",
    heroStory: "Đây là sản phẩm do người cha tự làm trực tiếp bằng AI để giúp chính con mình học bảng cửu chương, để trẻ em khắp thế giới cũng học dễ hơn.",
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
    sessionWrong: "Luyện lỗi sai",
    timeLimitLabel: "Giới hạn thời gian",
    timeLimitHelp: "Ở chế độ thử thách, trả lời trong thời gian cho phép.",
    countLabel: "Số câu hỏi",
    starsLabel: "Sao",
    starsSuffix: "",
    startBtn: "Bắt đầu học",
    startBtnRestart: "Bắt đầu lại",
    startHelp: "Chọn cài đặt rồi nhấn Bắt đầu học.",
    wrongPracticeHelp: "Bạn có thể luyện theo các câu hay sai trong lịch sử. Nhấn Bắt đầu học để bắt đầu.",
    wrongPracticeEmpty: "Chưa có dữ liệu câu sai. Hãy làm một phiên ở chế độ bình thường trước.",
    pauseBtn: "Tạm dừng",
    resumeBtn: "Tiếp tục",
    paused: "Đã tạm dừng. Nhấn Tiếp tục để học tiếp.",
    ttsNoVoice: "Không có giọng TTS khả dụng",
    skipBtn: "Bỏ qua",
    nextBtn: "Tiếp theo",
    resultTitle: "Kết quả hôm nay",
    resultStarsSuffix: " sao đã thu thập!",
    resultRateLabel: "Tỉ lệ đúng",
    resultTimeLabel: "Thời gian",
    restartBtn: "Làm lại",
    reviewBtn: "Xem câu sai",
    historyTitle: "Lịch sử học",
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
    wrongMeta: "Luyện lỗi sai",
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
    footerAbout: "Giới thiệu trang",
    footerPrivacy: "Chính sách riêng tư",
    footerContact: "Liên hệ",
    navGuide: "Hướng dẫn học",
    navTerms: "Điều khoản sử dụng",
    homeQualityTitle: "Vì sao bài quiz này giúp học tốt hơn",
    homeQualityP1:
      "Dịch vụ này không chỉ tạo câu hỏi ngẫu nhiên. Nó được thiết kế để kết hợp ôn lại lỗi sai, theo dõi tốc độ trả lời và trực quan hóa lịch sử học tập.",
    homeQualityP2:
      "Trong thực tế, biết đáp án và trả lời nhanh là hai kỹ năng khác nhau. Vì vậy chế độ bình thường và chế độ thử thách được tách riêng để luyện độ chính xác và tốc độ.",
    homeTipsTitle: "Cách dùng khuyến nghị cho phụ huynh và giáo viên",
    homeTips1: "Giữ mỗi buổi học ngắn (10-15 phút), lặp lại ít nhất 5 buổi mỗi tuần.",
    homeTips2: "Nếu tỉ lệ đúng duy trì trên 90% trong 3 buổi, hãy chuyển sang bảng tiếp theo.",
    homeTips3: "Chế độ Luyện lỗi sai là cách hiệu quả nhất để cải thiện nhanh các câu yếu.",
    homeTips4: "Không nên kéo dài buổi học quá lâu. Kết thúc khi còn hứng thú sẽ giúp duy trì đều đặn hơn.",
    homeTipsLinkPrefix: "Bạn có thể xem thêm mẹo vận hành tại trang",
    homeTipsLinkSuffix: ".",
    homePolicyTitle: "Thông báo quảng cáo và chính sách",
    homePolicyP1Prefix:
      "Trang web này có thể dùng Google AdSense để duy trì miễn phí, và các quy định về quảng cáo, quyền riêng tư được công khai minh bạch tại",
    homePolicyP1Middle: "và",
    homePolicyP1Suffix: ".",
    homePolicyP2Prefix: "Thông tin đơn vị vận hành và kênh liên hệ có tại các trang",
    homePolicyP2Middle: "và",
    homePolicyP2Suffix: ".",
    chartAria: "Biểu đồ tỉ lệ đúng",
    applause: ["Tuyệt!", "Thiên tài!", "Hoàn hảo!", "Rất tốt!", "Đúng rồi!"],
    gentle: ["Không sao, thử lại nhé!", "Gần đúng rồi!", "Lần sau sẽ đúng!"],
  },
  th: {
    badge: "ตารางคูณวันนี้",
    siteBrand: "สนามเด็กเล่นควิซตารางคูณ",
    title: "สนามเด็กเล่นควิซตารางคูณ",
    subtitle: "วิธีเรียนตารางคูณยุคใหม่: สนุกแบบเกมและเห็นพัฒนาการได้ชัดเจน",
    heroStory: "พ่อคนหนึ่งสร้างสิ่งนี้ด้วย AI โดยตรงเพื่อช่วยลูกของตัวเองเรียนตารางคูณ เพื่อให้เด็กทั่วโลกเรียนได้ง่ายขึ้น",
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
    sessionWrong: "ฝึกข้อผิดบ่อย",
    timeLimitLabel: "จำกัดเวลา",
    timeLimitHelp: "โหมดท้าทายต้องตอบภายในเวลาที่กำหนด",
    countLabel: "จำนวนข้อ",
    starsLabel: "ดาว",
    starsSuffix: "",
    startBtn: "เริ่มเรียน",
    startBtnRestart: "เริ่มใหม่",
    startHelp: "เลือกการตั้งค่าแล้วกดเริ่มเรียน",
    wrongPracticeHelp: "คุณสามารถฝึกเฉพาะข้อที่ผิดบ่อยจากประวัติได้ กดเริ่มเรียนเพื่อเริ่ม",
    wrongPracticeEmpty: "ยังไม่มีประวัติข้อผิดบ่อย กรุณาฝึกในโหมดปกติก่อน",
    pauseBtn: "หยุดชั่วคราว",
    resumeBtn: "เรียนต่อ",
    paused: "กำลังหยุดชั่วคราว กดเรียนต่อเพื่อทำต่อ",
    ttsNoVoice: "ไม่มีเสียง TTS ที่ใช้ได้",
    skipBtn: "ข้าม",
    nextBtn: "ข้อต่อไป",
    resultTitle: "ผลลัพธ์วันนี้",
    resultStarsSuffix: " ดาวที่ได้!",
    resultRateLabel: "ความถูกต้อง",
    resultTimeLabel: "เวลา",
    restartBtn: "เล่นอีกครั้ง",
    reviewBtn: "ดูข้อผิดพลาด",
    historyTitle: "ประวัติการเรียน",
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
    wrongMeta: "ฝึกข้อผิดบ่อย",
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
    footerAbout: "เกี่ยวกับเว็บไซต์",
    footerPrivacy: "นโยบายความเป็นส่วนตัว",
    footerContact: "ติดต่อ",
    navGuide: "คู่มือการเรียนรู้",
    navTerms: "ข้อกำหนดการใช้งาน",
    homeQualityTitle: "ทำไมควิซนี้จึงช่วยการเรียนรู้",
    homeQualityP1:
      "บริการนี้ไม่ได้เป็นแค่ควิซสุ่มคำถาม แต่ถูกออกแบบให้รวมการทบทวนข้อผิดพลาด การติดตามความเร็วในการตอบ และการแสดงผลประวัติการเรียนรู้",
    homeQualityP2:
      "ในการฝึกจริง ความรู้คำตอบกับการตอบให้เร็วเป็นคนละทักษะ จึงแยกโหมดปกติและโหมดท้าทายเพื่อฝึกความแม่นยำและความเร็วโดยเฉพาะ",
    homeTipsTitle: "แนวทางใช้งานสำหรับผู้ปกครองและครู",
    homeTips1: "ควรฝึกแบบสั้นๆ (10-15 นาที) แต่ทำซ้ำอย่างน้อยสัปดาห์ละ 5 ครั้ง",
    homeTips2: "หากความถูกต้องมากกว่า 90% ต่อเนื่อง 3 ครั้ง ให้ขยับไปตารางถัดไป",
    homeTips3: "โหมดฝึกข้อผิดบ่อยมีประสิทธิภาพที่สุดในการแก้จุดอ่อนได้อย่างรวดเร็ว",
    homeTips4: "ไม่ควรยืดเวลาเรียนให้นานเกินไป การจบตอนที่ยังมีกำลังใจจะช่วยให้ทำได้ต่อเนื่อง",
    homeTipsLinkPrefix: "ดูเคล็ดลับเพิ่มเติมได้ที่หน้า",
    homeTipsLinkSuffix: "",
    homePolicyTitle: "ประกาศโฆษณาและนโยบาย",
    homePolicyP1Prefix:
      "เว็บไซต์นี้อาจใช้ Google AdSense เพื่อให้ใช้งานฟรี และกฎเกี่ยวกับโฆษณาและความเป็นส่วนตัวเผยแพร่อย่างโปร่งใสในหน้า",
    homePolicyP1Middle: "และ",
    homePolicyP1Suffix: "",
    homePolicyP2Prefix: "ข้อมูลผู้ดูแลเว็บไซต์และช่องทางติดต่ออยู่ในหน้า",
    homePolicyP2Middle: "และ",
    homePolicyP2Suffix: "",
    chartAria: "กราฟความถูกต้อง",
    applause: ["เยี่ยม!", "สุดยอด!", "สมบูรณ์แบบ!", "ดีมาก!", "ถูกต้อง!"],
    gentle: ["ไม่เป็นไร ลองใหม่!", "เกือบแล้ว!", "ครั้งหน้าจะได้!"],
  },
  id: {
    badge: "Tabel hari ini",
    siteBrand: "Taman Kuis Perkalian",
    title: "Taman Kuis Perkalian",
    subtitle: "Metode belajar perkalian untuk era baru: fokus seperti bermain game dengan progres yang terukur.",
    heroStory: "Seorang ayah membuatnya langsung dengan AI untuk membantu anaknya sendiri belajar perkalian, agar anak-anak di seluruh dunia bisa belajar lebih mudah.",
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
    sessionWrong: "Fokus salah",
    timeLimitLabel: "Batas waktu",
    timeLimitHelp: "Pada mode tantangan, jawab dalam waktu yang ditentukan.",
    countLabel: "Jumlah soal",
    starsLabel: "Bintang",
    starsSuffix: "",
    startBtn: "Mulai belajar",
    startBtnRestart: "Mulai ulang",
    startHelp: "Pilih pengaturan lalu klik Mulai belajar.",
    wrongPracticeHelp: "Latih soal yang sering salah berdasarkan riwayat Anda. Klik Mulai belajar untuk memulai.",
    wrongPracticeEmpty: "Belum ada riwayat soal salah. Selesaikan sesi mode normal terlebih dahulu.",
    pauseBtn: "Jeda",
    resumeBtn: "Lanjutkan",
    paused: "Dijeda. Klik Lanjutkan untuk melanjutkan.",
    ttsNoVoice: "Suara TTS tidak tersedia",
    skipBtn: "Lewati",
    nextBtn: "Berikutnya",
    resultTitle: "Hasil hari ini",
    resultStarsSuffix: " bintang terkumpul!",
    resultRateLabel: "Akurasi",
    resultTimeLabel: "Waktu",
    restartBtn: "Coba lagi",
    reviewBtn: "Lihat salah",
    historyTitle: "Riwayat belajar",
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
    wrongMeta: "Fokus salah",
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
    footerAbout: "Tentang situs",
    footerPrivacy: "Kebijakan privasi",
    footerContact: "Kontak",
    navGuide: "Panduan belajar",
    navTerms: "Syarat penggunaan",
    homeQualityTitle: "Mengapa kuis ini membantu belajar",
    homeQualityP1:
      "Layanan ini bukan sekadar pembuat kuis acak. Layanan ini dirancang untuk menggabungkan ulasan kesalahan, pelacakan kecepatan menjawab, dan visualisasi riwayat belajar.",
    homeQualityP2:
      "Dalam latihan, mengetahui jawaban dan menjawab cepat adalah keterampilan yang berbeda. Karena itu mode Normal dan mode Tantangan dipisahkan untuk melatih akurasi dan kecepatan.",
    homeTipsTitle: "Rekomendasi penggunaan untuk orang tua dan guru",
    homeTips1: "Buat sesi singkat (10-15 menit), tetapi ulangi setidaknya 5 kali per minggu.",
    homeTips2: "Jika akurasi tetap di atas 90% selama tiga sesi, lanjut ke tabel berikutnya.",
    homeTips3: "Mode Fokus salah adalah cara paling efektif untuk memperbaiki soal lemah dengan cepat.",
    homeTips4: "Jangan memaksakan sesi terlalu lama. Mengakhiri saat motivasi masih tinggi membantu konsistensi.",
    homeTipsLinkPrefix: "Tips operasional lainnya dapat dilihat di halaman",
    homeTipsLinkSuffix: ".",
    homePolicyTitle: "Pemberitahuan iklan dan kebijakan",
    homePolicyP1Prefix:
      "Situs ini dapat menggunakan Google AdSense agar tetap gratis, dan aturan iklan serta privasi dijelaskan secara transparan pada halaman",
    homePolicyP1Middle: "dan",
    homePolicyP1Suffix: ".",
    homePolicyP2Prefix: "Informasi pengelola dan saluran kontak tersedia di halaman",
    homePolicyP2Middle: "dan",
    homePolicyP2Suffix: ".",
    chartAria: "Grafik akurasi",
    applause: ["Bagus!", "Hebat!", "Sempurna!", "Keren!", "Benar!"],
    gentle: ["Tidak apa-apa, coba lagi!", "Hampir!", "Kamu pasti bisa!"],
  },
};

function t(key, vars = {}) {
  const pack = I18N[state.lang] || I18N.ko;
  const template = pack[key] ?? I18N.en[key] ?? I18N.ko[key] ?? key;
  if (Array.isArray(template)) return template;
  return String(template).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  if (historyChart) {
    historyChart.setAttribute("aria-label", t("chartAria"));
  }
  buildChips();
  updateModeButtons();
  if (state.hasStarted && state.session === "challenge") {
    timerEl.textContent = t("remainingTime", { value: state.timeLimit.toFixed(1) });
  }
  if (state.isPaused) {
    feedbackEl.textContent = t("paused");
  }
  timeLimitValue.textContent = `${state.timeLimit}${t("seconds")}`;
  updateStartButtonLabel();
  updatePauseButtonState();
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
    opt.textContent = t("ttsNoVoice");
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

function getStartLabel() {
  return state.hasStarted ? t("startBtnRestart") : t("startBtn");
}

function getIdleMessage() {
  if (state.session === "wrong") {
    return t("wrongPracticeHelp");
  }
  return t("startHelp");
}

function getPauseLabel() {
  return state.isPaused ? t("resumeBtn") : t("pauseBtn");
}

function normalizeDanSelection() {
  state.maxDan = extendToggle.checked ? 20 : 9;
  state.maxTimes = extendToggle.checked ? 20 : 9;
  for (let dan = state.maxDan + 1; dan <= 20; dan += 1) {
    state.selectedDans.delete(dan);
  }
  if (state.selectedDans.size === 0) {
    state.selectedDans.add(2);
  }
}

function updateStartButtonLabel() {
  if (!startBtn) return;
  startBtn.textContent = getStartLabel();
}

function updatePauseButtonState() {
  if (!pauseBtn) return;
  const isResultVisible = result.style.display === "block";
  pauseBtn.textContent = getPauseLabel();
  pauseBtn.disabled = !state.hasStarted || isResultVisible;
}

function clearAutoNext() {
  if (!state.autoNextTimer) return;
  clearTimeout(state.autoNextTimer);
  state.autoNextTimer = null;
}

function scheduleAutoNext(delay) {
  clearAutoNext();
  state.pendingAutoNext = false;
  state.autoNextTimer = setTimeout(() => {
    state.autoNextTimer = null;
    if (state.isPaused) {
      state.pendingAutoNext = true;
      return;
    }
    nextQuestion();
  }, delay);
}

function renderIdleState() {
  stopTimer();
  stopCountdown();
  clearAutoNext();
  normalizeDanSelection();
  buildChips();

  state.current = 0;
  state.correct = 0;
  state.stars = 0;
  state.hearts = 3;
  state.questions = [];
  state.answers = [];
  state.questionTimes = [];
  state.elapsedMs = 0;
  state.countdownRemainingMs = null;
  state.pendingAutoNext = false;
  state.pauseSnapshot = null;
  state.isPaused = false;

  progressEl.textContent = `0 / ${countRange.value}`;
  questionEl.textContent = "2 × 3 = ?";
  feedbackEl.textContent = getIdleMessage();
  questionTts.textContent = "";
  answersEl.innerHTML = "";
  timerEl.textContent = "00:00";
  starsEl.textContent = "0";
  nextBtn.disabled = true;
  skipBtn.disabled = true;
  nextBtn.textContent = t("nextBtn");
  renderHearts();

  card.style.display = "block";
  result.style.display = "none";
  reviewList.innerHTML = "";
  updateStartButtonLabel();
  updatePauseButtonState();
}

function pauseQuiz() {
  if (!state.hasStarted || state.isPaused || result.style.display === "block") return;
  state.isPaused = true;

  if (state.session === "normal" && state.startedAt) {
    state.elapsedMs = Date.now() - state.startedAt;
    timerEl.textContent = formatTime(state.elapsedMs);
  }
  stopTimer();
  stopCountdown();

  if (state.autoNextTimer) {
    clearAutoNext();
    state.pendingAutoNext = true;
  }

  const answerButtons = Array.from(document.querySelectorAll(".answer-btn"));
  state.pauseSnapshot = {
    nextDisabled: nextBtn.disabled,
    skipDisabled: skipBtn.disabled,
    answerDisabled: answerButtons.map((btn) => btn.disabled),
  };

  answerButtons.forEach((btn) => {
    btn.disabled = true;
  });
  nextBtn.disabled = true;
  skipBtn.disabled = true;
  feedbackEl.textContent = t("paused");
  updatePauseButtonState();
}

function resumeQuiz() {
  if (!state.isPaused) return;
  state.isPaused = false;

  if (state.pendingAutoNext) {
    state.pendingAutoNext = false;
    updatePauseButtonState();
    nextQuestion();
    return;
  }

  if (state.session === "normal") {
    startTimer();
  } else if (state.session === "challenge") {
    startCountdown(state.countdownRemainingMs || state.timeLimit * 1000);
  }

  const snapshot = state.pauseSnapshot;
  const answerButtons = Array.from(document.querySelectorAll(".answer-btn"));
  if (snapshot && snapshot.answerDisabled.length === answerButtons.length) {
    answerButtons.forEach((btn, index) => {
      btn.disabled = snapshot.answerDisabled[index];
    });
    nextBtn.disabled = snapshot.nextDisabled;
    skipBtn.disabled = snapshot.skipDisabled;
  } else {
    skipBtn.disabled = state.session === "challenge";
  }
  state.pauseSnapshot = null;
  updatePauseButtonState();
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
  if (state.hasStarted) {
    startQuiz();
    return;
  }
  progressEl.textContent = `0 / ${countRange.value}`;
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
  const dans = Array.from(state.selectedDans).sort((a, b) => a - b);
  const total = state.total;
  if (state.session === "wrong") {
    state.questions = buildWrongPracticeQuestions(total);
    return;
  }
  const questions = [];
  const wrongPool = getWrongPool();
  const ratio = state.session === "challenge" ? CHALLENGE_WRONG_RATIO : NORMAL_WRONG_RATIO;
  const wrongTarget = Math.floor(total * ratio);
  const wrongCount =
    wrongPool.length >= WRONG_POOL_MIN
      ? Math.min(wrongTarget, wrongPool.length)
      : 0;
  const used = new Set();
  const basePool = [];
  for (let times = 1; times <= state.maxTimes; times += 1) {
    for (let i = 0; i < dans.length; i += 1) {
      const dan = dans[i];
      basePool.push({ dan, times, answer: dan * times });
    }
  }

  if (basePool.length === 0 || total <= 0) {
    state.questions = [];
    return;
  }

  for (let i = 0; i < wrongCount; i += 1) {
    const item = wrongPool[i % wrongPool.length];
    if (!state.selectedDans.has(item.dan) || item.times > state.maxTimes) continue;
    const key = `${item.dan}x${item.times}`;
    if (used.has(key)) continue;
    used.add(key);
    questions.push({ dan: item.dan, times: item.times, answer: item.dan * item.times });
  }

  const remainingUnique = basePool.filter((item) => !used.has(`${item.dan}x${item.times}`));
  if (state.mode !== "sequence") {
    shuffle(remainingUnique);
  }

  for (let i = 0; i < remainingUnique.length && questions.length < total; i += 1) {
    questions.push(remainingUnique[i]);
  }

  // If total is larger than available unique combinations, repeat safely.
  let cursor = 0;
  while (questions.length < total) {
    if (state.mode === "sequence") {
      const item = basePool[cursor % basePool.length];
      questions.push({ dan: item.dan, times: item.times, answer: item.answer });
      cursor += 1;
      continue;
    }
    const item = basePool[Math.floor(Math.random() * basePool.length)];
    questions.push({ dan: item.dan, times: item.times, answer: item.answer });
  }

  state.questions = questions;
}

function buildWrongPracticeQuestions(total) {
  const wrongPool = getWrongPool().filter((item) => {
    return state.selectedDans.has(item.dan) && item.times <= state.maxTimes;
  });
  if (wrongPool.length === 0 || total <= 0) {
    return [];
  }

  const counter = {};
  wrongPool.forEach((item) => {
    const key = `${item.dan}x${item.times}`;
    counter[key] = (counter[key] || 0) + 1;
  });

  const ranked = Object.entries(counter)
    .map(([key, count]) => {
      const [dan, times] = key.split("x");
      const danNum = Number(dan);
      const timesNum = Number(times);
      return { dan: danNum, times: timesNum, answer: danNum * timesNum, count };
    })
    .sort((a, b) => b.count - a.count || a.dan - b.dan || a.times - b.times);

  const firstPass = ranked.slice();
  if (state.mode !== "sequence") {
    shuffle(firstPass);
  }

  const questions = [];
  for (let i = 0; i < firstPass.length && questions.length < total; i += 1) {
    const item = firstPass[i];
    questions.push({ dan: item.dan, times: item.times, answer: item.answer });
  }

  const weightedPool = [];
  ranked.forEach((item) => {
    for (let i = 0; i < item.count; i += 1) {
      weightedPool.push(item);
    }
  });

  if (weightedPool.length === 0) {
    return questions;
  }

  let cursor = 0;
  while (questions.length < total) {
    let item;
    if (state.mode === "sequence") {
      item = ranked[cursor % ranked.length];
      cursor += 1;
    } else {
      item = weightedPool[Math.floor(Math.random() * weightedPool.length)];
    }
    questions.push({ dan: item.dan, times: item.times, answer: item.answer });
  }

  return questions;
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
  state.startedAt = Date.now() - state.elapsedMs;
  state.timer = setInterval(() => {
    state.elapsedMs = Date.now() - state.startedAt;
    timerEl.textContent = formatTime(state.elapsedMs);
  }, 500);
}

function stopTimer() {
  if (state.timer) clearInterval(state.timer);
  state.timer = null;
}

function startCountdown(initialRemainingMs = state.timeLimit * 1000) {
  if (state.countdownTimer) clearInterval(state.countdownTimer);
  state.questionStartedAt = Date.now();
  const limitMs = Math.max(100, initialRemainingMs);
  state.countdownRemainingMs = limitMs;
  const update = () => {
    const elapsed = Date.now() - state.questionStartedAt;
    const remaining = Math.max(0, limitMs - elapsed);
    state.countdownRemainingMs = remaining;
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
  state.pauseSnapshot = null;
  state.pendingAutoNext = false;
  progressEl.textContent = `${state.current + 1} / ${state.total}`;
  questionEl.textContent = `${current.dan} × ${current.times} = ?`;
  feedbackEl.textContent = "";
  nextBtn.disabled = true;
  skipBtn.disabled = state.session === "challenge";
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
    state.countdownRemainingMs = state.timeLimit * 1000;
    startCountdown();
  }
  updatePauseButtonState();
  speakQuestion();
}

function handleAnswer(button, value) {
  if (state.isPaused) return;
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

  scheduleAutoNext(600);
}

function handleSkip() {
  if (state.isPaused) return;
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
  scheduleAutoNext(600);
}

function handleTimeout() {
  if (state.isPaused) return;
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
  scheduleAutoNext(500);
}

function nextQuestion() {
  if (state.isPaused) return;
  clearAutoNext();
  state.pendingAutoNext = false;
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
  clearAutoNext();
  state.pendingAutoNext = false;
  state.pauseSnapshot = null;
  state.isPaused = false;
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

  updatePauseButtonState();
  renderHistory();
}

function startQuiz() {
  state.hasStarted = true;
  state.isPaused = false;
  state.pauseSnapshot = null;
  state.pendingAutoNext = false;
  clearAutoNext();
  state.total = Number(countRange.value);
  state.timeLimit = Number(timeLimitRange.value);
  normalizeDanSelection();
  buildChips();
  state.current = 0;
  state.correct = 0;
  state.stars = 0;
  state.hearts = 3;
  state.questions = [];
  state.answers = [];
  state.questionTimes = [];
  state.elapsedMs = 0;
  state.countdownRemainingMs = null;
  timerEl.textContent = "00:00";
  starsEl.textContent = "0";
  renderHearts();
  nextBtn.textContent = t("nextBtn");
  updateStartButtonLabel();
  updatePauseButtonState();

  buildQuestions();
  if (state.questions.length === 0) {
    state.hasStarted = false;
    renderIdleState();
    feedbackEl.textContent = t("wrongPracticeEmpty");
    return;
  }
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
        : item.session === "wrong"
          ? `${t("wrongMeta")} · ${item.time}`
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
  if (!state.hasStarted) {
    progressEl.textContent = `0 / ${countRange.value}`;
  }
});

countRange.addEventListener("change", () => {
  if (state.hasStarted) {
    startQuiz();
    return;
  }
  renderIdleState();
});

timeLimitRange.addEventListener("input", () => {
  timeLimitValue.textContent = `${timeLimitRange.value}${t("seconds")}`;
});

timeLimitRange.addEventListener("change", () => {
  state.timeLimit = Number(timeLimitRange.value);
  if (state.hasStarted && state.session === "challenge") {
    startQuiz();
  }
});

extendToggle.addEventListener("change", () => {
  if (state.hasStarted) {
    startQuiz();
    return;
  }
  renderIdleState();
});

skipBtn.addEventListener("click", () => {
  handleSkip();
});

if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    if (state.isPaused) {
      resumeQuiz();
      return;
    }
    pauseQuiz();
  });
}

nextBtn.addEventListener("click", () => {
  nextQuestion();
});

restartBtn.addEventListener("click", startQuiz);

if (startBtn) {
  startBtn.addEventListener("click", () => {
    startQuiz();
  });
}

reviewBtn.addEventListener("click", () => {
  reviewList.scrollIntoView({ behavior: "smooth" });
});

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
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
    if (state.hasStarted) {
      startQuiz();
      return;
    }
    renderIdleState();
  });
});

languageSelect.addEventListener("change", () => {
  state.lang = languageSelect.value;
  localStorage.setItem(LANG_KEY, state.lang);
  applyTranslations();
  if (!state.hasStarted) {
    renderIdleState();
  }
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
renderIdleState();
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
  if (state.isPaused) return;
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
