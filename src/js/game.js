const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let score = 0;
let timeLeft = 30;

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

  foodItem.addEventListener('click', () => {
    if (foodItem.dataset.healthy === 'true') {
      score++;
    } else {
      score--;
    }
    scoreDisplay.textContent = `Score: ${score}`;
    foodItem.remove();
  });

  setTimeout(() => {
    foodItem.style.top = `${gameArea.clientHeight}px`;
  }, 100);

  setTimeout(() => {
    foodItem.remove();
  }, 2000);
}

function startGame() {
  const gameInterval = setInterval(createFoodItem, 1000);
  const timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      alert(`Game over! Your score is ${score}`);
    }
  }, 1000);
}

function main() {
    startGame();
}

main();
