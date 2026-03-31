
const startButton = document.getElementById("startButton");
const checkButton = document.getElementById("checkButton");
const typingInput = document.getElementById("typingInput");
const targetWord = document.getElementById("targetWord");
const resultText = document.getElementById("resultText");

const bgm = document.getElementById("bgm");
const correctSound = document.getElementById("correctSound");
const missSound = document.getElementById("missSound");

const words = ["train", "ticket", "station", "travel", "express"];
let currentWord = words[Math.floor(Math.random() * words.length)];
targetWord.textContent = currentWord;

startButton.addEventListener("click", () => {
  bgm.play().catch(() => {
    console.log("自動再生できませんでした");
  });
  alert("ゲームスタート！");
});

checkButton.addEventListener("click", () => {
  const typed = typingInput.value.trim();

  if (typed === currentWord) {
    resultText.textContent = "正解！電車が進みます！";
    correctSound.currentTime = 0;
    correctSound.play();

    currentWord = words[Math.floor(Math.random() * words.length)];
    targetWord.textContent = currentWord;
    typingInput.value = "";
  } else {
    resultText.textContent = "ミス！もう一度！";
    missSound.currentTime = 0;
    missSound.play();
  }
});
