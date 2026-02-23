import { updateCalorieProgressDashboard } from '../../src/js/dashboard';

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
});
