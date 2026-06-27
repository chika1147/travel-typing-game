// ====== 画面の要素を取得 ======
const startScreen = document.getElementById("startScreen");
const typingScreen = document.getElementById("typingScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const checkButton = document.getElementById("checkButton");
const restartButton = document.getElementById("restartButton");

const typingInput = document.getElementById("typingInput");
const targetWord = document.getElementById("targetWord");
const resultText = document.getElementById("resultText");

const scoreText = document.getElementById("score");
const comboText = document.getElementById("combo");
const remainingText = document.getElementById("remaining");
const finalScoreText = document.getElementById("finalScore");
const maxComboText = document.getElementById("maxCombo");
const goalText = document.getElementById("goalText");

const categorySelect = document.getElementById("categorySelect");
const gradeSelect = document.getElementById("gradeSelect");
const currentCategoryLabel = document.getElementById("currentCategoryLabel");
const currentGradeLabel = document.getElementById("currentGradeLabel");
const questionLabel = document.getElementById("questionLabel");

const stationsBox = document.getElementById("stations");
const train = document.getElementById("train");

const bgm = document.getElementById("bgm");

// ====== 旅のルート（駅）======
// 駅は8つ。問題を解くたびに電車が次の駅へ進み、福岡でゴール！
const stations = ["東京", "横浜", "静岡", "名古屋", "京都", "大阪", "広島", "福岡"];

// ====== 問題データ（各学年7問）======
const questionData = {
  hiragana: {
    g1: ["あさ", "いぬ", "うみ", "えき", "おと", "そら", "はな"],
    g2: ["さくら", "みずうみ", "たんけん", "ひこうき", "でんしゃ", "おみやげ", "とうきょう"],
    g3: ["しんごう", "とけい", "きょうしつ", "しぜん", "たいせつ", "りょこう", "ちず"],
    g4: ["やくそく", "れんしゅう", "せつめい", "あんしん", "しゅっぱつ", "とうちゃく", "きっぷ"],
    g5: ["きょうりょく", "はっけん", "けんきゅう", "かんしゃ", "せいちょう", "けしき", "めいしょ"],
    g6: ["せきにん", "ちょうせん", "どりょく", "しんらい", "ゆうしょう", "ぼうけん", "たびびと"],
    j1: ["ぶんぽう", "りかい", "がくしゅう", "じっせん", "ひょうげん", "こうつう", "うんちん"],
    j2: ["かだい", "はんだん", "けいかく", "どっかい", "せんたく", "しゅうへん", "ていしゃ"],
    j3: ["しんろ", "もくひょう", "じこくひょう", "かんけい", "たいさく", "のりかえ", "しゅうてん"]
  },
  katakana: {
    g1: ["イス", "エキ", "バス", "パン", "ネコ", "タビ", "マチ"],
    g2: ["ゲーム", "キップ", "ノート", "ボール", "ホテル", "カメラ", "バッグ"],
    g3: ["タイピング", "キャラクター", "マップ", "チケット", "スタート", "ルート", "ターミナル"],
    g4: ["アドベンチャー", "ステージ", "スコア", "チャレンジ", "ゴール", "コース", "ガイド"],
    g5: ["トレーニング", "プログラム", "ミュージック", "ルール", "アイテム", "コイン", "シート"],
    g6: ["レベルアップ", "コンビネーション", "サポート", "メッセージ", "ジャンル", "リズム", "パターン"],
    j1: ["コミュニケーション", "テクニック", "バランス", "コントロール", "インタビュー", "ナビゲーション", "アクセス"],
    j2: ["シミュレーション", "トラブル", "イメージ", "スケジュール", "アクセント", "プロセス", "データ"],
    j3: ["プレゼンテーション", "インフォメーション", "コンディション", "モチベーション", "ディスカッション", "コミュニティ", "ストラテジー"]
  },
  kanji: {
    g1: ["山", "川", "人", "口", "学校", "木", "空"],
    g2: ["電車", "公園", "時計", "黄色", "読書", "地図", "道"],
    g3: ["旅館", "駅前", "宿題", "勉強", "安心", "出発", "切符"],
    g4: ["説明", "特急", "練習", "案内", "風景", "到着", "観光"],
    g5: ["協力", "観察", "感謝", "責任", "発見", "景色", "名所"],
    g6: ["挑戦", "信頼", "努力", "成長", "優勝", "冒険", "旅人"],
    j1: ["表現", "文法", "理解", "計画", "判断", "交通", "運賃"],
    j2: ["課題", "選択", "関係", "対策", "実験", "周辺", "停車"],
    j3: ["進路", "目標", "情報", "議論", "分析", "乗換", "終点"]
  }
};

const categoryNames = {
  hiragana: "ひらがな",
  katakana: "カタカナ",
  kanji: "漢字"
};

const gradeNames = {
  g1: "小学1年", g2: "小学2年", g3: "小学3年",
  g4: "小学4年", g5: "小学5年", g6: "小学6年",
  j1: "中学1年", j2: "中学2年", j3: "中学3年"
};

// ====== ゲームの状態 ======
let currentWord = "";
let score = 0;
let combo = 0;
let maxCombo = 0;
let round = 0;
const maxRounds = stations.length - 1; // 駅が8なので問題は7問
let selectedCategory = "hiragana";
let selectedGrade = "g1";
let currentQuestions = [];

// ====== 効果音（音声ファイルなしで鳴らす）======
let audioCtx = null;

function playSound(type) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "correct") {
      // 正解：明るい上がる音
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else {
      // ミス：低いブッという音
      osc.type = "square";
      osc.frequency.setValueAtTime(200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    }
  } catch (e) {
    console.log("音を鳴らせませんでした", e);
  }
}

// ====== 画面の切りかえ ======
function showScreen(screenElement) {
  startScreen.classList.remove("active");
  typingScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  screenElement.classList.add("active");
}

// ====== 問題のシャッフル ======
function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

// ====== 旅マップ（駅）を作る ======
function renderMap() {
  stationsBox.innerHTML = "";
  const n = stations.length;
  stations.forEach((name, i) => {
    const left = (i / (n - 1)) * 100; // 0%〜100%に均等配置
    const div = document.createElement("div");
    div.className = "station";
    div.style.left = left + "%";
    div.innerHTML = '<div class="dot"></div><div class="name">' + name + "</div>";
    stationsBox.appendChild(div);
  });
  updateTrain();
}

// ====== 電車を今の駅へ動かす ======
function updateTrain() {
  const n = stations.length;
  const left = (round / (n - 1)) * 100;
  train.style.left = left + "%";

  // 通り過ぎた駅に色をつける
  const stationEls = document.querySelectorAll(".station");
  stationEls.forEach((s, i) => {
    s.classList.toggle("passed", i <= round);
  });
}

// ====== 次の問題をセット ======
function setNextWord() {
  if (currentQuestions.length === 0) {
    currentQuestions = shuffleArray(questionData[selectedCategory][selectedGrade]);
  }
  currentWord = currentQuestions.pop();
  targetWord.textContent = currentWord;
  questionLabel.textContent =
    categoryNames[selectedCategory] + " / " + gradeNames[selectedGrade] + " の問題";
}

// ====== ゲーム開始 ======
function startGame() {
  selectedCategory = categorySelect.value;
  selectedGrade = gradeSelect.value;

  currentCategoryLabel.textContent = categoryNames[selectedCategory];
  currentGradeLabel.textContent = gradeNames[selectedGrade];

  score = 0;
  combo = 0;
  maxCombo = 0;
  round = 0;
  currentQuestions = shuffleArray(questionData[selectedCategory][selectedGrade]);

  scoreText.textContent = score;
  comboText.textContent = combo;
  remainingText.textContent = maxRounds - round;
  resultText.textContent = "";
  typingInput.value = "";

  renderMap();
  setNextWord();
  showScreen(typingScreen);
  typingInput.focus();

  bgm.currentTime = 0;
  bgm.play().catch(() => {
    console.log("BGMを再生できませんでした");
  });
}

// ====== 判定 ======
function checkTyping() {
  const typed = typingInput.value.trim();

  if (typed === currentWord) {
    combo += 1;
    if (combo > maxCombo) maxCombo = combo;
    const gain = 10 + (combo - 1) * 2; // コンボが続くほどボーナス
    score += gain;
    resultText.textContent =
      "正解！ +" + gain + "点　🚉 次の駅へ！" + (combo >= 2 ? "（" + combo + "れんさ🔥）" : "");
    resultText.className = "ok";
    playSound("correct");
  } else {
    combo = 0;
    resultText.textContent = "ミス！ 正しい答えは「" + currentWord + "」です";
    resultText.className = "ng";
    playSound("miss");
  }

  round += 1;
  scoreText.textContent = score;
  comboText.textContent = combo;
  remainingText.textContent = maxRounds - round;
  typingInput.value = "";

  updateTrain(); // 電車を進める

  if (round >= maxRounds) {
    finishGame();
    return;
  }

  setNextWord();
  typingInput.focus();
}

// ====== ゴール（結果画面へ）======
function finishGame() {
  finalScoreText.textContent = score;
  maxComboText.textContent = maxCombo;

  if (score >= 100) {
    goalText.textContent = "🏆 パーフェクトな旅！タイピングマスター！";
  } else if (score >= 50) {
    goalText.textContent = "🎉 ぶじ福岡にとうちゃく！おつかれさま！";
  } else {
    goalText.textContent = "🚂 ゴール！つぎはもっと正解をめざそう！";
  }

  showScreen(resultScreen);
}

// ====== もう一度あそぶ ======
function restartGame() {
  showScreen(startScreen);
}

// ====== ボタンの動き ======
startButton.addEventListener("click", startGame);
checkButton.addEventListener("click", checkTyping);
restartButton.addEventListener("click", restartGame);

typingInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkTyping();
  }
});
