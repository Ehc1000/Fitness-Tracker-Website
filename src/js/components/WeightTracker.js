import { addWeightLog, getWeightLogs } from '../services/db.js';

export default class WeightTracker {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (this.container) {
      this.render();
      this.init();
    }
  }

  async init() {
    this.updateWeightList();
    this.attachEventListeners(); 
  }

  attachEventListeners() {
    const addBtn = document.getElementById('add-weight-btn');
    const input = document.getElementById('weight-input');

    if (addBtn && input) {
      addBtn.addEventListener('click', async () => {
        const weight = parseFloat(input.value);
        if (!isNaN(weight)) {
          await addWeightLog({
            user_id: 1, // hardcoded for now
            weight: weight,
            date: new Date().toISOString()
          });
          input.value = '';
          this.updateWeightList();
        }
      });
    }
  }

  async updateWeightList() {
    const weightListEl = document.getElementById('weight-list');
    if (!weightListEl) return;

    const weights = await getWeightLogs();
    weightListEl.innerHTML = weights.map(w => `
      <li>
        ${new Date(w.date).toLocaleDateString()}: <strong>${w.weight} kg</strong>
      </li>
    `).join('');
  }

  render() {
    this.container.innerHTML = `
      <div id="weight-tracker">
        <h2>Weight Tracker</h2>
        <div class="weight-input-group">
          <input type="number" id="weight-input" step="0.1" placeholder="Enter weight (kg)" />
          <button id="add-weight-btn">Log Weight</button>
        </div>
        <ul id="weight-list"></ul>
      </div>
    `;
  }
}
