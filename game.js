import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "./firebase.js";

// UI elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userNameDisplay = document.getElementById("user-name");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

// Login
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Logged in as:", user.displayName);
    })
    .catch((error) => {
      console.error("Login failed:", error.message);
    });
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => console.log("User logged out"))
    .catch((error) => console.error("Logout failed:", error.message));
});

// Update UI on login state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    userNameDisplay.textContent = `Welcome, ${user.displayName}!`;
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userNameDisplay.textContent = "";
  }
});

// ===================== GAME LOGIC =====================

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let fruits = [];
let score = 0;
let lives = 3;

// Fruit & bomb assets
const fruitImages = ["apple.png", "banana.png", "orange.png", "watermelon.png"];
const sliceSound = new Audio("assets/sounds/slice.mp3");

// Spawn fruits or bombs
function spawnFruitOrBomb() {
  const isBomb = Math.random() < 0.2; // 20% chance bomb
  const x = Math.random() * (canvas.width - 60);
  const speed = 3 + Math.random() * 3;
  const img = new Image();
  img.src = isBomb
    ? "assets/objects/bomb.png"
    : `assets/fruits/${fruitImages[Math.floor(Math.random() * fruitImages.length)]}`;
  fruits.push({ x, y: 0, speed, img, isBomb });
}

setInterval(spawnFruitOrBomb, 1000); // spawn every second

// Cut fruit
function cutFruit(index, e) {
  const fruit = fruits[index];
  sliceSound.play();

  // Slice splash
  ctx.beginPath();
  ctx.arc(e.offsetX, e.offsetY, 30, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,0,0,0.3)";
  ctx.fill();

  fruits.splice(index, 1);
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
}

// Click handler
canvas.addEventListener("click", (e) => {
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];
    if (
      e.offsetX >= fruit.x &&
      e.offsetX <= fruit.x + 60 &&
      e.offsetY >= fruit.y &&
      e.offsetY <= fruit.y + 60
    ) {
      if (fruit.isBomb) {
        alert(`💣 Boom! Game Over!\nFinal Score: ${score}`);
        resetGame();
      } else {
        cutFruit(i, e);
      }
      break;
    }
  }
});

// Reset game
function resetGame() {
  fruits = [];
  score = 0;
  lives = 3;
  scoreDisplay.textContent = "Score: 0";
  livesDisplay.textContent = "Lives: 3";
}

// Draw lives
function drawLives() {
  livesDisplay.textContent = `Lives: ${lives}`;
}

// Game loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update fruits
  fruits.forEach((fruit, i) => {
    fruit.y += fruit.speed;
    ctx.drawImage(fruit.img, fruit.x, fruit.y, 60, 60);

    // Missed fruit
    if (fruit.y > canvas.height) {
      fruits.splice(i, 1);
      if (!fruit.isBomb) {
        lives--;
        drawLives();
        if (lives <= 0) {
          alert(`💀 Game Over!\nFinal Score: ${score}`);
          resetGame();
        }
      }
    }
  });

  requestAnimationFrame(animate);
}
animate();