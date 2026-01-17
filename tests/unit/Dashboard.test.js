import { JSDOM } from 'jsdom';
import { updateCalorieProgressDashboard } from '../../src/js/dashboard';

describe('Dashboard', () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM(`
      <body>
        <main>
          <div id="calorie-progress-container-dashboard">
            <h2>Today's Calorie Intake</h2>
            <p><span id="current-calories-dashboard">0</span> / <span id="calorie-goal-dashboard">2000</span> kcal</p>
            <div id="calorie-progress-bar-container-dashboard">
              <div id="calorie-progress-bar-dashboard"></div>
            </div>
          </div>
        </main>
      </body>
    `);
    document = dom.window.document;
    global.document = document;
    localStorage.clear();
  });

  test('should update calorie progress dashboard', () => {
    const calorieLogs = [
      { date: new Date().toISOString(), calories: 500 },
      { date: new Date().toISOString(), calories: 300 },
    ];
    updateCalorieProgressDashboard(calorieLogs);
    expect(document.getElementById('current-calories-dashboard').textContent).toBe('800');
    expect(document.getElementById('calorie-goal-dashboard').textContent).toBe('2000');
    expect(document.getElementById('calorie-progress-bar-dashboard').style.width).toBe('40%');
  });

  test('should update calorie progress dashboard with new goal', () => {
    localStorage.setItem('calorieGoal', '2500');
    const calorieLogs = [
      { date: new Date().toISOString(), calories: 500 },
      { date: new Date().toISOString(), calories: 300 },
    ];
    updateCalorieProgressDashboard(calorieLogs);
    expect(document.getElementById('current-calories-dashboard').textContent).toBe('800');
    expect(document.getElementById('calorie-goal-dashboard').textContent).toBe('2500');
    expect(document.getElementById('calorie-progress-bar-dashboard').style.width).toBe('32%');
  });
});
