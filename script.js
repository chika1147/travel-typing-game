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

const bgm = document.getElementById("bgm");

const words = ["train", "ticket", "station", "travel", "express"];
let currentWord = "";
let score = 0;
let round = 0;
const maxRounds = 5;

function showScreen(screenElement) {
  startScreen.classList.remove("active");
  typingScreen.classList.remove("active");
  resultScreen.classList.remove("active");

  screenElement.classList.add("active");
}

function setNextWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  targetWord.textContent = currentWord;
}

function startGame() {
  score = 0;
  round = 0;
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
    resultText.textContent = "ミス！もう一度！";
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
