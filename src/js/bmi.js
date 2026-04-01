import WeightTracker from './components/WeightTracker.js';
import { initDB } from './services/db.js';
import ChatWidget from './components/ChatWidget.js';

async function main() {
  try {
    await initDB();
    new ChatWidget();
    new WeightTracker('weight-tracker-container');
  } catch (err) {
    console.error(err);
    alert('An error occurred. Check the console for details.');
  }
}

window.addEventListener('DOMContentLoaded', main);
