import initSqlJs from 'sql.js';

let SQL;
try {
  SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
} catch (err) {
  alert(err);
}


let db;

export async function initDB() {
  try {
    const response = await fetch('/data/database.sqlite');
    const buffer = await response.arrayBuffer();
    db = new SQL.Database(new Uint8Array(buffer));
    const schema = await fetch('/data/schema.sql').then(res => res.text());
    db.exec(schema);
  } catch (err) {
    alert(err);
  }
}

export async function addWorkout(workout) {
  db.run(
    'INSERT INTO workouts (user_id, type, duration, intensity, date, calories_burned) VALUES (?, ?, ?, ?, ?, ?)',
    [workout.user_id, workout.type, workout.duration, workout.intensity, workout.date, workout.calories_burned]
  );
}

export async function getWorkouts() {
    const res = db.exec('SELECT * FROM workouts');
    if (res.length === 0) {
        return [];
    }
    const columns = res[0].columns;
    return res[0].values.map(row => {
        const workout = {};
        columns.forEach((col, i) => {
            workout[col] = row[i];
        });
        return workout;
    });
}

export async function addCalorieLog(calorieLog) {
  db.run(
    'INSERT INTO calorie_logs (user_id, food_item, calories, date) VALUES (?, ?, ?, ?)',
    [calorieLog.user_id, calorieLog.food_item, calorieLog.calories, calorieLog.date]
  );
}

export async function getCalorieLogs() {
    const res = db.exec('SELECT * FROM calorie_logs');
    if (res.length === 0) {
        return [];
    }
    const columns = res[0].columns;
    return res[0].values.map(row => {
        const calorieLog = {};
        columns.forEach((col, i) => {
            calorieLog[col] = row[i];
        });
        return calorieLog;
    });
}

export async function deleteWorkout(id) {
  db.run('DELETE FROM workouts WHERE id = ?', [id]);
}

export async function clearAllWorkouts() {
  db.run('DELETE FROM workouts');
}

export async function updateWorkout(workout) {
  db.run(
    'UPDATE workouts SET type = ?, duration = ?, intensity = ?, date = ?, calories_burned = ? WHERE id = ?',
    [workout.type, workout.duration, workout.intensity, workout.date, workout.calories_burned, workout.id]
  );
}

export async function deleteCalorieLog(id) {
  db.run('DELETE FROM calorie_logs WHERE id = ?', [id]);
}

export async function clearAllCalorieLogs() {
  db.run('DELETE FROM calorie_logs');
}

export async function updateCalorieLog(calorieLog) {
  db.run(
    'UPDATE calorie_logs SET food_item = ?, calories = ?, date = ? WHERE id = ?',
    [calorieLog.food_item, calorieLog.calories, calorieLog.date, calorieLog.id]
  );
}
