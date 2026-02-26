import { updateCalorieProgressDashboard, initWaterTracker } from '../../src/js/dashboard';

jest.mock('../../src/js/services/db.js');
jest.mock('chart.js', () => {
  const Chart = jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
  }));
  Chart.register = jest.fn();
  return {
    Chart,
    registerables: [],
  };
});

describe('Dashboard', () => {
  beforeEach(() => {
    document.body.innerHTML = `
        <main>
          <div id="calorie-progress-container-dashboard">
            <h2>Today's Calorie Intake</h2>
            <p><span id="current-calories-dashboard">0</span> / <span id="calorie-goal-dashboard">2000</span> kcal</p>
            <p>Remaining: <span id="remaining-calories-dashboard">0</span> kcal</p>
            <div id="calorie-progress-bar-container-dashboard">
              <div id="calorie-progress-bar-dashboard"></div>
            </div>
          </div>
          <div id="water-tracker-container">
            <div class="water-controls">
              <button id="remove-water-btn">-</button>
              <span id="water-count">0</span> / <span id="water-goal">8</span> glasses
              <button id="add-water-btn">+</button>
            </div>
            <div id="water-progress-bar-container">
              <div id="water-progress-bar"></div>
            </div>
          </div>
        </main>
    `;
    localStorage.clear();
  });

  test('should update calorie progress dashboard', () => {
    const today = new Date().toDateString();
    const calorieLogs = [
      { date: today, calories: 500 },
      { date: today, calories: 300 },
    ];
    updateCalorieProgressDashboard(calorieLogs);
    expect(document.getElementById('current-calories-dashboard').textContent).toBe('800');
    expect(document.getElementById('calorie-goal-dashboard').textContent).toBe('2000');
    expect(document.getElementById('remaining-calories-dashboard').textContent).toBe('1200');
    expect(document.getElementById('calorie-progress-bar-dashboard').style.width).toBe('40%');
  });

  test('should update calorie progress dashboard with new goal', () => {
    localStorage.setItem('calorieGoal', '2500');
    const today = new Date().toDateString();
    const calorieLogs = [
      { date: today, calories: 500 },
      { date: today, calories: 300 },
    ];
    updateCalorieProgressDashboard(calorieLogs);
    expect(document.getElementById('current-calories-dashboard').textContent).toBe('800');
    expect(document.getElementById('calorie-goal-dashboard').textContent).toBe('2500');
    expect(document.getElementById('remaining-calories-dashboard').textContent).toBe('1700');
    expect(document.getElementById('calorie-progress-bar-dashboard').style.width).toBe('32%');
  });

  test('should initialize and update water tracker', () => {
    initWaterTracker();
    const waterCount = document.getElementById('water-count');
    const progressBar = document.getElementById('water-progress-bar');
    const addBtn = document.getElementById('add-water-btn');
    const removeBtn = document.getElementById('remove-water-btn');

    expect(waterCount.textContent).toBe('0');
    expect(progressBar.style.width).toBe('0%');

    addBtn.click();
    expect(waterCount.textContent).toBe('1');
    expect(progressBar.style.width).toBe('12.5%');

    addBtn.click();
    expect(waterCount.textContent).toBe('2');
    expect(progressBar.style.width).toBe('25%');

    removeBtn.click();
    expect(waterCount.textContent).toBe('1');
    expect(progressBar.style.width).toBe('12.5%');
  });

  test('should not allow negative water count', () => {
    initWaterTracker();
    const waterCount = document.getElementById('water-count');
    const removeBtn = document.getElementById('remove-water-btn');

    removeBtn.click();
    expect(waterCount.textContent).toBe('0');
  });
});
