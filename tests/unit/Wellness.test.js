import { initStepTracker, initSleepTracker } from '../../src/js/wellness';
import { getStepLogs, addStepLog, getSleepLogs, addSleepLog, initDB } from '../../src/js/services/db.js';

jest.mock('../../src/js/services/db.js', () => ({
  initDB: jest.fn().mockResolvedValue(),
  getStepLogs: jest.fn(),
  addStepLog: jest.fn().mockResolvedValue(),
  getSleepLogs: jest.fn(),
  addSleepLog: jest.fn().mockResolvedValue()
}));

describe('Wellness Trackers', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="sleep-tracker-container">
        <input type="number" id="sleep-input" />
        <button id="add-sleep-btn">Log Sleep</button>
        <div id="sleep-progress-container">
          <p><span id="current-sleep">0</span> / <span id="sleep-goal">8</span> hours</p>
          <div class="progress-bar-container">
            <div id="sleep-progress-bar"></div>
          </div>
        </div>
      </div>
      <div id="step-tracker-container">
        <input type="number" id="step-input" />
        <button id="add-step-btn">Log Steps</button>
        <div id="step-progress-container">
          <p><span id="current-steps">0</span> / <span id="step-goal">10000</span> steps</p>
          <div class="progress-bar-container">
            <div id="step-progress-bar"></div>
          </div>
        </div>
      </div>
    `;
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should initialize and update step tracker', async () => {
    const stepLogs = [
      { steps: 2000, date: new Date().toISOString() },
      { steps: 3000, date: new Date().toISOString() }
    ];
    getStepLogs.mockResolvedValue(stepLogs);

    await initStepTracker();

    const currentSteps = document.getElementById('current-steps');
    const progressBar = document.getElementById('step-progress-bar');
    const addStepBtn = document.getElementById('add-step-btn');
    const stepInput = document.getElementById('step-input');

    expect(currentSteps.textContent).toBe('5,000');
    expect(progressBar.style.width).toBe('50%');

    // Add steps
    stepInput.value = '1000';
    getStepLogs.mockResolvedValue([...stepLogs, { steps: 1000, date: new Date().toISOString() }]);
    
    await addStepBtn.click();
    
    // The click handler is async, so we need to wait for it.
    // However, in initStepTracker, the listener is not returning the promise.
    // So we might need to wait manually or use a flushPromises helper.
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(addStepLog).toHaveBeenCalledWith(expect.objectContaining({
      steps: 1000
    }));
    expect(currentSteps.textContent).toBe('6,000');
    expect(progressBar.style.width).toBe('60%');
  });

  test('should initialize and update sleep tracker', async () => {
    const sleepLogs = [
      { duration: 4, date: new Date().toISOString() },
      { duration: 2, date: new Date().toISOString() }
    ];
    getSleepLogs.mockResolvedValue(sleepLogs);

    await initSleepTracker();

    const currentSleep = document.getElementById('current-sleep');
    const progressBar = document.getElementById('sleep-progress-bar');
    const addSleepBtn = document.getElementById('add-sleep-btn');
    const sleepInput = document.getElementById('sleep-input');

    expect(currentSleep.textContent).toBe('6');
    expect(progressBar.style.width).toBe('75%');

    // Add sleep
    sleepInput.value = '1';
    getSleepLogs.mockResolvedValue([...sleepLogs, { duration: 1, date: new Date().toISOString() }]);
    
    await addSleepBtn.click();
    
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(addSleepLog).toHaveBeenCalledWith(expect.objectContaining({
      duration: 1
    }));
    expect(currentSleep.textContent).toBe('7');
    expect(progressBar.style.width).toBe('87.5%');
  });
});
