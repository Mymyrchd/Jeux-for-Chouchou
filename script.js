let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let character = { x: 50, y: 300, width: 40, height: 40, vy: 0, jumping: false, vx: 0 };
let ground = 340;
let name = "";
let obstacles = [{ x: 400, width: 40 }];
let moveSpeed = 5;

// Fonction pour démarrer le jeu
function startGame() {
  name = document.getElementById("playerName").value || "Mon Héros";
  document.getElementById("startScreen").style.display = "none";
  canvas.style.display = "block";
  document.getElementById("startButton").disabled = true;
  requestAnimationFrame(gameLoop);
}

// Fonction principale du jeu
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fond coucher de soleil
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#f9d29d");
  gradient.addColorStop(1, "#ffb07c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // obstacles
  ctx.fillStyle = "#ff6f61";
  obstacles.forEach(ob => {
    ob.x -= 2;
    ctx.fillRect(ob.x, ground, ob.width, 60);
  });

  // dessiner le personnage
  ctx.fillStyle = "#444"; // corps
  ctx.fillRect(character.x, character.y, character.width, character.height);
 
  // tête
  ctx.beginPath();
  ctx.arc(character.x + character.width / 2, character.y - 10, 15, 0, Math.PI * 2); // tête du bonhomme
  ctx.fillStyle = "#F0C674"; // peau
  ctx.fill();
 
  // lunettes
  ctx.fillStyle = "#fff"; // couleur des lunettes
  ctx.fillRect(character.x + 5, character.y - 20, 10, 10); // gauche
  ctx.fillRect(character.x + 25, character.y - 20, 10, 10); // droite
  ctx.strokeStyle = "#000"; // contour des lunettes
  ctx.beginPath();
  ctx.moveTo(character.x + 15, character.y - 15);
  ctx.lineTo(character.x + 25, character.y - 15);
  ctx.stroke();
 
  // nom
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText(name, character.x - 10, character.y - 40);

  // saut / gravité
  if (character.jumping) {
    character.vy += 1.2;
    character.y += character.vy;
    if (character.y >= ground) {
      character.y = ground;
      character.jumping = false;
    }
  }

  // déplacer le personnage
  character.x += character.vx;

  if (character.x < 0) {
    character.x = 0;
  } else if (character.x > canvas.width - character.width) {
    character.x = canvas.width - character.width;
  }

  if (obstacles[0].x + obstacles[0].width < 0) {
    showFinalMessage();
    return;
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", e => {
  if ((e.key === "ArrowUp" || e.key === " ") && !character.jumping) {
    character.vy = -18;
    character.jumping = true;
  }
  if (e.key === "ArrowLeft") {
    character.vx = -moveSpeed;
  }
  if (e.key === "ArrowRight") {
    character.vx = moveSpeed;
  }
});

window.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    character.vx = 0;
  }
});

// Fonction pour afficher le message final
function showFinalMessage() {
  canvas.style.display = "none";
  document.getElementById("finalMessage").style.display = "block";
}
