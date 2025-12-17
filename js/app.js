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

let playerLeft = 270;
const playerSpeed = 8;
let leftPressed = false;
let rightPressed = false;  

const bulletSpeed = 15;

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

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 50);
  };

  //Back Button
  const goBack = () => {
  gameActive = false;
  clearInterval(gameInterval);

  playerLeft = 270;
  player.style.left = `${playerLeft}px`;

  gameScreen.style.display = "none";
  startScreen.style.display = "flex";
};

//Reset Game 
 const resetGameState = () => {
  score = 0;
  lives = 3;
  playerLeft = 270;
  player.style.left = `${playerLeft}px`;

};

//Player Movement
const movePlayer = () => {
  if (leftPressed) playerLeft -= playerSpeed;
  if (rightPressed) playerLeft += playerSpeed;

  const maxLeft = board.clientWidth - player.clientWidth;

  if (playerLeft < 0) playerLeft = 0;
  if (playerLeft > maxLeft) playerLeft = maxLeft;

  player.style.left = `${playerLeft}px`;
};


//shoot bullets
const shootBullet = () => {
  const bullet = document.createElement("img");
  bullet.src = "./assets/bullet.png";
  bullet.className = "bullet";

  bullet.style.left = `${playerLeft + 24}px`;
  bullet.style.top = (board.clientHeight - 70) + "px";

  board.appendChild(bullet);
  bullets.push(bullet);
  console.log("shoot!", gameActive, board.clientHeight);
};

// move bullets
const moveBullets = () => {
  bullets = bullets.filter((bullet) => {
    bullet.style.top = (bullet.offsetTop - bulletSpeed) + "px";

    if (bullet.offsetTop < 0) {
      bullet.remove();
      return false;
    }
    return true;
  });
};

// create enemies 
const createEnemies = () => {
  enemies.forEach((enemy) => enemy.remove());
  enemies = [];

  const cols = 7;

  const startX = 40;
  const startY = 30;
  const gapX = 80;
  const gapY = 45;

  const enemyRows = [
    "./assets/bug.png",
    "./assets/bee.png",
    "./assets/bee.png",
    "./assets/bee.png",
    "./assets/hopper.png",
    "./assets/hopper.png",
  ];

  for (let row = 0; row < enemyRows.length; row++) {
    const bugSrc = enemyRows[row];

    for (let col = 0; col < cols; col++) {
      const enemy = document.createElement("img");
      enemy.src = bugSrc;
      enemy.className = "enemy";

      enemy.style.left = `${startX + col * gapX}px`;
      enemy.style.top = `${startY + row * gapY}px`;

      board.appendChild(enemy);
      enemies.push(enemy);
    }
  }
};

// Game Loop
const gameLoop = () => {
  if (!gameActive) return;
    movePlayer();
    moveBullets();
}; 

 
/*------------------------ Event Listeners ------------------------*/
startBtn.addEventListener("click", startGame);
backBtn.addEventListener("click", goBack);
resetBtn.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    leftPressed = true;
  }

  if (e.key === "ArrowRight") {
    rightPressed = true;
  }
   if (e.key === " " && gameActive) 
    shootBullet();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") {
    leftPressed = false;
  }

  if (e.key === "ArrowRight") {
    rightPressed = false;
  }
});