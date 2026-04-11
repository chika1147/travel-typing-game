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
const remainingText = document.getElementById("remaining");
const finalScoreText = document.getElementById("finalScore");

const categorySelect = document.getElementById("categorySelect");
const gradeSelect = document.getElementById("gradeSelect");
const currentCategoryLabel = document.getElementById("currentCategoryLabel");
const currentGradeLabel = document.getElementById("currentGradeLabel");
const questionLabel = document.getElementById("questionLabel");

const bgm = document.getElementById("bgm");

const questionData = {
  hiragana: {
    g1: ["あさ", "いぬ", "うみ", "えき", "おと"],
    g2: ["さくら", "みずうみ", "たんけん", "ひこうき", "でんしゃ"],
    g3: ["しんごう", "とけい", "きょうしつ", "しぜん", "たいせつ"],
    g4: ["やくそく", "れんしゅう", "せつめい", "あんしん", "しゅっぱつ"],
    g5: ["きょうりょく", "はっけん", "けんきゅう", "かんしゃ", "せいちょう"],
    g6: ["せきにん", "ちょうせん", "どりょく", "しんらい", "ゆうしょう"],
    j1: ["ぶんぽう", "りかい", "がくしゅう", "じっせん", "ひょうげん"],
    j2: ["かだい", "はんだん", "けいかく", "どっかい", "せんたく"],
    j3: ["しんろ", "もくひょう", "じこくひょう", "かんけい", "たいさく"]
  },
  katakana: {
    g1: ["イス", "エキ", "バス", "パン", "ネコ"],
    g2: ["ゲーム", "キップ", "ノート", "ボール", "ホテル"],
    g3: ["タイピング", "キャラクター", "マップ", "チケット", "スタート"],
    g4: ["アドベンチャー", "ステージ", "スコア", "チャレンジ", "ゴール"],
    g5: ["トレーニング", "プログラム", "ミュージック", "ルール", "アイテム"],
    g6: ["レベルアップ", "コンビネーション", "サポート", "メッセージ", "ジャンル"],
    j1: ["コミュニケーション", "テクニック", "バランス", "コントロール", "インタビュー"],
    j2: ["シミュレーション", "トラブル", "イメージ", "スケジュール", "アクセント"],
    j3: ["プレゼンテーション", "インフォメーション", "コンディション", "モチベーション", "ディスカッション"]
  },
  kanji: {
    g1: ["山", "川", "人", "口", "学校"],
    g2: ["電車", "公園", "時計", "黄色", "読書"],
    g3: ["旅館", "駅前", "宿題", "勉強", "安心"],
    g4: ["説明", "特急", "練習", "案内", "風景"],
    g5: ["協力", "観察", "感謝", "責任", "発見"],
    g6: ["挑戦", "信頼", "努力", "成長", "優勝"],
    j1: ["表現", "文法", "理解", "計画", "判断"],
    j2: ["課題", "選択", "関係", "対策", "実験"],
    j3: ["進路", "目標", "情報", "議論", "分析"]
  }
};

const categoryNames = {
  hiragana: "ひらがな",
  katakana: "カタカナ",
  kanji: "漢字"
};

const gradeNames = {
  g1: "小学1年",
  g2: "小学2年",
  g3: "小学3年",
  g4: "小学4年",
  g5: "小学5年",
  g6: "小学6年",
  j1: "中学1年",
  j2: "中学2年",
  j3: "中学3年"
};

let currentWord = "";
let score = 0;
let round = 0;
const maxRounds = 5;
let selectedCategory = "hiragana";
let selectedGrade = "g1";
let currentQuestions = [];

function showScreen(screenElement) {
  startScreen.classList.remove("active");
  typingScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  screenElement.classList.add("active");
}

function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function setNextWord() {
  if (currentQuestions.length === 0) {
    currentQuestions = shuffleArray(questionData[selectedCategory][selectedGrade]);
  }

  currentWord = currentQuestions.pop();
  targetWord.textContent = currentWord;
  questionLabel.textContent = `${categoryNames[selectedCategory]} / ${gradeNames[selectedGrade]} の問題`;
}

function startGame() {
  selectedCategory = categorySelect.value;
  selectedGrade = gradeSelect.value;

  currentCategoryLabel.textContent = categoryNames[selectedCategory];
  currentGradeLabel.textContent = gradeNames[selectedGrade];

  score = 0;
  round = 0;
  currentQuestions = shuffleArray(questionData[selectedCategory][selectedGrade]);

  scoreText.textContent = score;
  remainingText.textContent = maxRounds - round;
  resultText.textContent = "";
  typingInput.value = "";

  setNextWord();
  showScreen(typingScreen);
  typingInput.focus();

  bgm.play().catch(() => {
    console.log("BGMを再生できませんでした");
  });
}

function checkTyping() {
  const typed = typingInput.value.trim();

  if (typed === currentWord) {
    score += 10;
    resultText.textContent = "正解！電車が進みます！";
  } else {
    resultText.textContent = `ミス！ 正しい答えは「${currentWord}」です`;
  }

  round += 1;
  scoreText.textContent = score;
  remainingText.textContent = maxRounds - round;
  typingInput.value = "";

  if (round >= maxRounds) {
    finalScoreText.textContent = score;
    showScreen(resultScreen);
    return;
  }

  setNextWord();
  typingInput.focus();
}

function restartGame() {
  showScreen(startScreen);
}

startButton.addEventListener("click", startGame);
checkButton.addEventListener("click", checkTyping);
restartButton.addEventListener("click", restartGame);

typingInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkTyping();
  }
});
});
