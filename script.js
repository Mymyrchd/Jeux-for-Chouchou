const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let playerName = "Stefan";
let player = { x: 50, y: 250, width: 30, height: 30, color: "black", vy: 0, jump: -8, gravity: 0.4 };
let obstacles = [];
let keys = {};
let score = 0;
let gameInterval;
let difficultyLevel = 1;

function startGame() {
  const inputName = document.getElementById("playerName").value;
  if (inputName.trim()) playerName = inputName;

  document.getElementById("final-message").classList.add("hidden");
  player.y = 250;
  obstacles = [];
  score = 0;
  difficultyLevel = 1;

  gameInterval = setInterval(gameLoop, 1000 / 60);
}

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Personnage
  if (keys["Space"] && player.y >= 250) {
    player.vy = player.jump;
  }
  player.vy += player.gravity;
  player.y += player.vy;
  if (player.y > 250) player.y = 250;

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillText(playerName, player.x - 5, player.y - 10);

  // Obstacles
  updateObstacles();
  drawObstacles();

  // Score
  score++;
  ctx.fillStyle = "white";
  ctx.fillText("Score : " + score, 700, 20);

  // Collision
  for (let o of obstacles) {
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      endGame();
    }
  }

  // Augmenter la difficulté
  if (score % 100 === 0 && difficultyLevel < 10) {
    difficultyLevel++;
  }

  if (score >= 500) {
    endGame(true);
  }
}

function updateObstacles() {
  if (Math.random() < 0.02 * difficultyLevel) {
    obstacles.push({
      x: canvas.width,
      y: 270,
      width: 20 + Math.random() * 20,
      height: 30,
      speed: 2 + difficultyLevel
    });
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= obstacles[i].speed;
  }

  obstacles = obstacles.filter(o => o.x + o.width > 0);
}

function drawObstacles() {
  ctx.fillStyle = "red";
  for (let o of obstacles) {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  }
}

function endGame(won = false) {
  clearInterval(gameInterval);
  document.getElementById("final-message").classList.remove("hidden");

  if (won) {
    document.getElementById("final-message").innerHTML = `
      <p>
        TOUTES MES FÉLICITATIONS ! 🎉 <br><br>
        Coucou mon Stefan, j'espère que tu as aimé ce petit jeu 😊<br>
        Bon, ce que j'ai fait n'est pas ouf mais voilà 😅<br>
        J'espère que ça t'a plu ! Je voulais te montrer de quoi j'étais capable 😎😂<br>
        Après pour le mini-jeu, c'est pas le meilleur 😅<br>
        En espérant que tu as apprécié 😘<br><br>
        GROS BISOUS, TA Mymy ! ❤️
      </p>`;
  }
}
