import { addWeightLog, getWeightLogs } from '../services/db.js';

export default class WeightTracker {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.height = localStorage.getItem('userHeight') || '';
    if (this.container) {
      this.render();
      this.init();
    }
  }

  async init() {
    this.updateWeightList();
    this.attachEventListeners();
    this.calculateBMI();
  }

  attachEventListeners() {
    const addBtn = document.getElementById('add-weight-btn');
    const weightInput = document.getElementById('weight-input');
    const heightInput = document.getElementById('height-input');

    if (addBtn && weightInput) {
      addBtn.addEventListener('click', async () => {
        const weight = parseFloat(weightInput.value);
        if (!isNaN(weight)) {
          await addWeightLog({
            user_id: 1, // hardcoded for now
            weight: weight,
            date: new Date().toISOString()
          });
          weightInput.value = '';
          this.updateWeightList();
          this.calculateBMI();
        }
      });
    }

    if (heightInput) {
      heightInput.addEventListener('change', () => {
        this.height = heightInput.value;
        localStorage.setItem('userHeight', this.height);
        this.calculateBMI();
      });
    }
  }

  async calculateBMI() {
    const bmiResultEl = document.getElementById('bmi-result');
    if (!bmiResultEl) return;

    const weights = await getWeightLogs();
    if (weights.length > 0 && this.height) {
      const latestWeight = weights[weights.length - 1].weight;
      const heightInMeters = parseFloat(this.height) / 100;
      if (heightInMeters > 0) {
        const bmi = (latestWeight / (heightInMeters * heightInMeters)).toFixed(1);
        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';

        bmiResultEl.innerHTML = `Your BMI: <strong>${bmi}</strong> (${category})`;
      } else {
        bmiResultEl.innerHTML = '';
      }
    } else {
      bmiResultEl.innerHTML = 'Enter height and log weight to see BMI';
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
        <h2>Weight Tracker & BMI</h2>
        <div class="weight-input-group">
          <input type="number" id="height-input" step="1" placeholder="Height (cm)" value="${this.height}" />
          <input type="number" id="weight-input" step="0.1" placeholder="Weight (kg)" />
          <button id="add-weight-btn">Log Weight</button>
        </div>
        <div id="bmi-result" class="bmi-info"></div>
        <ul id="weight-list"></ul>
      </div>
    `;
  }
}
