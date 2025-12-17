/*------------------------ Cached Elements ------------------------*/
const startScreen = document.querySelector(".start-screen");
const gameScreen = document.querySelector(".game-screen");

const startBtn = document.querySelector("#start");
const backBtn = document.querySelector("#back");
const resetBtn = document.querySelector("#reset");

const board = document.querySelector("#board");
const player = document.querySelector("#player");
const bushes = document.querySelectorAll(".bush");

const scoreEl = document.querySelector("#score");
const livesEl = document.querySelector("#lives");

/*------------------------ Variables ------------------------*/
let gameActive = false;
let gameInterval;
let bombInterval;

let playerLeft = 270;
const playerSpeed = 8;
let leftPressed = false;
let rightPressed = false;  
let respawning = false;

const bulletSpeed = 15;
let enemyDirection = 1;
const enemySpeed = 2; 
const enemyDrop = 20;
let enemyTick = 0; 
let enemyMoveEvery = 10;
const bombSpeed = 10; 

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

// Setup bushes
const setupBushes = () => {
  bushes.forEach((bush) => {
    bush.hp = 8;    
    bush.style.opacity = 1;
    bush.style.display = "block"; 
  });
};

// Damage bushes
const damageBush = (bush) => {
  bush.hp -= 1;            

  bush.style.opacity = bush.hp / 5; 

  if (bush.hp <= 0) {
    bush.style.display = "none"; 
  }
};

//Start Game
const startGame = () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";
  score = 0;
  lives = 3;
  placeBushes();
  setupBushes();
  createEnemies();
  gameActive = true;

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 50);
   clearInterval(bombInterval);
  bombInterval = setInterval(enemyShoot, 1000);

  scoreEl.textContent = "Score: " + score;
  livesEl.style.width = (lives * 40) + "px";
  
};

  //Back Button
  const goBack = () => {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(bombInterval);

   clearGameObjects();

  playerLeft = 270;
  player.style.left = `${playerLeft}px`;

  gameScreen.style.display = "none";
  startScreen.style.display = "flex";
};

//Reset Game 
 const resetGameState = () => {
   clearGameObjects();
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
  if (bullets.length > 0) return;
  const bullet = document.createElement("img");
  bullet.src = "./assets/bullet.png";
  bullet.className = "bullet";

  bullet.style.left = (playerLeft + player.offsetWidth / 2 - 10) + "px";
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

  const cols = 11;

  const startX = 20;
  const startY = 30;
  const gapX = 50;
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

      if (bugSrc.includes("hopper")) {
      enemy.classList.add("hopper");
      }

      enemy.style.left = `${startX + col * gapX}px`;
      enemy.style.top = `${startY + row * gapY}px`;

      board.appendChild(enemy);
      enemies.push(enemy);
    }
  }
};

// move enemies
const moveEnemies = () => {
  if (enemies.length === 0) return;

  let hitEdge = false;

  enemies.forEach((enemy) => {
    const newLeft = enemy.offsetLeft + enemySpeed * enemyDirection;
    enemy.style.left = newLeft + "px";

    if (newLeft <= 0 || newLeft + enemy.offsetWidth >= board.clientWidth) {
      hitEdge = true;
    }
  });

  if (hitEdge) {
    enemyDirection *= -1;

    enemies.forEach((enemy) => {
      enemy.style.top = (enemy.offsetTop + enemyDrop) + "px";
    });
  }
};

//check if enemies hit bushes
const checkEnemyHitsBushes = () => {
  for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < bushes.length; j++) {
      const bush = bushes[j];
      if (bush.style.display === "none") continue;

      if (isColliding(enemies[i], bush)) {
        loseLife();
        return;
      }
    }
  }
};

// enemy bombs
  const enemyShoot = () => {
  //if (enemies.length === 0) return;
  if (bombs.length > 0) return;

  const shooter = enemies[Math.floor(Math.random() * enemies.length)];

  const bomb = document.createElement("img");
  bomb.src = "../assets/bomb.png";
  bomb.className = "bomb";

  bomb.style.left = `${shooter.offsetLeft + shooter.offsetWidth / 2 - 7}px`;
  bomb.style.top = `${shooter.offsetTop + shooter.offsetHeight}px`;

  board.appendChild(bomb);
  bombs.push(bomb);
};

// move bombs
const moveBombs = () => {
  bombs = bombs.filter((bomb) => {
    bomb.style.top = `${bomb.offsetTop + bombSpeed}px`;

    if (bomb.offsetTop > board.clientHeight) {
      bomb.remove();
      return false;
    }
    return true;
  });
};

//clear game objects
const clearGameObjects = () => {
  enemies.forEach(e => e.remove());
  enemies = [];

  bullets.forEach(b => b.remove());
  bullets = [];

  bombs.forEach(b => b.remove());
  bombs = [];
};
//update score
const scoreIncrease = (points) => {
  score += points;
  scoreEl.textContent = "Score: " + score;
};


//update lives
const loseLife = () => {
  lives -= 1;
  livesEl.style.width = (lives * 40) + "px";

  respawning = true;
  player.style.display = "none";

  bombs.forEach(b => b.remove());
  bombs = [];

  bullets.forEach(b => b.remove());
  bullets = [];

  if (lives <= 0) {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(bombInterval);
    alert("Game Over!");
    goBack();
    return;
  }
  setTimeout(() => {
    player.style.display = "block";
    respawning = false;
  }, 2000);   
};  

// collision detection
const isColliding = (a, b) => {
  return (
    a.offsetLeft < b.offsetLeft + b.offsetWidth &&
    a.offsetLeft + a.offsetWidth > b.offsetLeft &&
    a.offsetTop < b.offsetTop + b.offsetHeight &&
    a.offsetTop + a.offsetHeight > b.offsetTop
  );
};
//check collisions
const checkCollisions = () => {
  const bushList = Array.from(bushes);

  // 1) Bullet ↔ Enemy  (remove both + score)
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];

      if (isColliding(bullet, enemy)) {
        bullet.remove();
        enemy.remove();
        bullets.splice(i, 1);
        enemies.splice(j, 1);

        scoreIncrease(100);
        break; // bullet is gone
      }
    }
  }

  // 2) Bomb ↔ Player (remove bomb + lose life)
  for (let i = bombs.length - 1; i >= 0; i--) {
    const bomb = bombs[i];

    if (isColliding(bomb, player)) {
      bomb.remove();
      bombs.splice(i, 1);
      loseLife();
    }
  }

  // 3) Bullet ↔ Bush (remove bullet + damage bush)
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    for (let k = 0; k < bushList.length; k++) {
      const bush = bushList[k];
      if (bush.style.display === "none") continue;

      if (isColliding(bullet, bush)) {
        bullet.remove();
        bullets.splice(i, 1);
        damageBush(bush);
        break;
      }
    }
  }

  // 4) Bomb ↔ Bush (remove bomb + damage bush)
  for (let i = bombs.length - 1; i >= 0; i--) {
    const bomb = bombs[i];

    for (let k = 0; k < bushList.length; k++) {
      const bush = bushList[k];
      if (bush.style.display === "none") continue;

      if (isColliding(bomb, bush)) {
        bomb.remove();
        bombs.splice(i, 1);
        damageBush(bush);
        break;
      }
    }
  }
};
// check game over

 

// Game Loop
const gameLoop = () => {
  if (!gameActive) return;
    movePlayer();
    moveBullets();
    moveBombs(); 
    enemyTick++;
  if (enemyTick >= enemyMoveEvery) {
    moveEnemies();
    enemyTick = 0;
  }
  checkCollisions();
   checkEnemyHitsBushes(); 
}; 

 
/*------------------------ Event Listeners ------------------------*/
startBtn.addEventListener("click", startGame);
backBtn.addEventListener("click", goBack);
resetBtn.addEventListener("click", resetGameState);

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