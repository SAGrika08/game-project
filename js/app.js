/*------------------------ Cached Elements ------------------------*/
const startScreen = document.querySelector(".start-screen");
const gameScreen = document.querySelector(".game-screen");

const startBtn = document.querySelector("#start");
const backBtn = document.querySelector("#back");
const resetBtn = document.querySelector("#reset");

const board = document.querySelector("#board");
const player = document.querySelector("#player");
const bushes = document.querySelectorAll(".bush");

/*------------------------ Variables ------------------------*/
let gameActive = false;
let gameInterval;
let bombInterval;

let bullets = [];
let bombs = []; 
let enemies = [];
let score = 0;
let lives = 3;


// Bushes
const placeBushes = () => {
  const positions = [40, 180, 320, 460];
  bushes.forEach((bush, index) => {
    bush.style.left = `${positions[index]}px`;
  });
};

//Start Game
const startGame = () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";
  score = 0;
  lives = 3;
  placeBushes();
  gameActive = true;
  };

/*------------------------ Event Listeners ------------------------*/
startBtn.addEventListener("click", startGame);
backBtn.addEventListener("click", goBack);
resetBtn.addEventListener("click", startGame);