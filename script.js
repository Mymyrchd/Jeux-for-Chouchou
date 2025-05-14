const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerName = "Stefan";
let player = {
  x: 50,
  y: 250,
  width: 30,
  height: 50,
  vy: 0,
  vx: 0,
  jump: -9,
  gravity: 0.5,
  grounded: true,
};

let obstacles = [];
let keys = {};
let score = 0;
let gameInterval;
let difficultyLevel = 1;

function startGame() {
  const nameInput = document.getElementById("playerName").value;
  if (nameInput.trim()) playerName = nameInput;

  document.getElementById("final-message").classList.add("hidden");
  canvas.style.display = "block";

  player.y = 250;
  player.vy = 0;
  score = 0;
  difficultyLevel = 1;
  obstacles = [];

  clearInterval(gameInterval);
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

  // Saut
  if (keys["ArrowUp"] && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }

  // Gauche/Droite
  if (keys["ArrowLeft"]) player.vx = -3;
  else if (keys["ArrowRight"]) player.vx = 3;
  else player.vx = 0;

  // Mouvement
  player.vy += player.gravity;
  player.y += player.vy;
  player.x += player.vx;

  if (player.y >= 250) {
    player.y = 250;
    player.vy = 0;
    player.grounded = true;
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // Dessiner personnage
  drawCharacter();

  // Obstacles
  updateObstacles();
  drawObstacles();

  // Score
  score++;
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 700, 20);

  // Collision
  for (let o of obstacles) {
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      endGame(false);
      return;
    }
  }

  // Difficulté
  if (score % 100 === 0 && difficultyLevel < 10) difficultyLevel++;

  // Gagner
  if (score >= 500) endGame(true);
}

function drawCharacter() {
  // Tête
  ctx.fillStyle = "black";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Lunettes
  ctx.fillStyle = "white";
  ctx.fillRect(player.x + 5, player.y + 10, 8, 8);
  ctx.fillRect(player.x + 17, player.y + 10, 8, 8);
  ctx.strokeStyle = "black";
  ctx.strokeRect(player.x + 5, player.y + 10, 8, 8);
  ctx.strokeRect(player.x + 17, player.y + 10, 8, 8);
  ctx.beginPath();
  ctx.moveTo(player.x + 13, player.y + 14);
  ctx.lineTo(player.x + 17, player.y + 14);
  ctx.stroke();

  // Nom
  ctx.fillStyle = "black";
  ctx.fillText(playerName, player.x - 5, player.y - 10);
}

function updateObstacles() {
  if (Math.random() < 0.01 * difficultyLevel) {
    obstacles.push({
      x: canvas.width,
      y: 270,
      width: 20 + Math.random() * 20,
      height: 30,
      speed: 2 + difficultyLevel,
    });
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= obstacles[i].speed;
  }

  obstacles = obstacles.filter((o) => o.x + o.width > 0);
}

function drawObstacles() {
  ctx.fillStyle = "red";
  for (let o of obstacles) {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  }
}

function endGame(won = false) {
  clearInterval(gameInterval);
  const canvas = document.getElementById("gameCanvas");
  const messageBox = document.getElementById("final-message");

  // Cacher le jeu
  canvas.style.display = "none";

  // Afficher le message de fin
  messageBox.classList.remove("hidden");

  if (won) {
    messageBox.innerHTML = `
      <p>
        TOUTES MES FÉLICITATIONS ! 🎉<br /><br />
        Coucou mon Stefan, j'espère que tu as aimé ce petit jeu 😊<br />
        Bon, ce que j'ai fait n'est pas ouf mais voilà 😅<br />
        J'espère que ça t'a plu ! Je voulais te montrer de quoi j'étais capable 😎😂<br />
        Après pour le mini-jeu, c'est pas le meilleur 😅<br />
        En espérant que tu as apprécié 😘<br /><br />
        GROS BISOUS, TA Mymy ! ❤️
      </p>
      <button onclick="startGame()">Rejouer</button>
    `;
  } else {
    messageBox.innerHTML = `
      <p>
        Oups 😅 Tu as perdu !<br /><br />
        Tu veux recommencer ? 😇
      </p>
      <button onclick="startGame()">Rejouer</button>
    `;
  }
}
