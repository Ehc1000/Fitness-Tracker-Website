const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('high-score');
const startButton = document.getElementById('start-button');
const gameOverMessage = document.getElementById('game-over-message');

let score = 0;
let timeLeft = 30;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval = null;
let timerInterval = null;
let gameActive = false;

highScoreDisplay.textContent = `High Score: ${highScore}`;

const healthyFoods = ['apple', 'banana', 'broccoli', 'carrot', 'strawberry'];
const unhealthyFoods = ['pizza', 'burger', 'fries', 'ice-cream', 'donut'];

function createFoodItem() {
  const foodItem = document.createElement('div');
  foodItem.classList.add('food-item');

  const isHealthy = Math.random() > 0.5;
  const foodName = isHealthy
    ? healthyFoods[Math.floor(Math.random() * healthyFoods.length)]
    : unhealthyFoods[Math.floor(Math.random() * unhealthyFoods.length)];

  foodItem.style.backgroundImage = `url('/images/foods/${foodName}.svg')`;
  foodItem.dataset.healthy = isHealthy;

  foodItem.style.left = `${Math.random() * (gameArea.clientWidth - 40)}px`;
  foodItem.style.top = '-40px';

  gameArea.appendChild(foodItem);

  setTimeout(() => {
    if (gameActive) {
      foodItem.style.top = `${gameArea.clientHeight}px`;
    }
  }, 100);

  setTimeout(() => {
    if (foodItem.parentElement) {
      foodItem.remove();
    }
  }, 2000);
}

gameArea.addEventListener('click', (event) => {
  if (gameActive && event.target.classList.contains('food-item')) {
    const foodItem = event.target;
    if (foodItem.dataset.healthy === 'true') {
      score++;
    } else {
      score--;
    }
    scoreDisplay.textContent = `Score: ${score}`;
    foodItem.remove();
  }
});

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  gameOverMessage.textContent = `Game over! Your score is ${score}`;
  gameOverMessage.style.display = 'block';
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreDisplay.textContent = `High Score: ${highScore}`;
  }
  startButton.textContent = 'Play Again?';
  startButton.style.display = 'block';
}

function startGame() {
  gameActive = true;
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  
  startButton.style.display = 'none';
  gameOverMessage.style.display = 'none';

  // Clear any existing food items
  gameArea.innerHTML = '';

  gameInterval = setInterval(createFoodItem, 1000);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function main() {
  startButton.addEventListener('click', startGame);
}

main();
