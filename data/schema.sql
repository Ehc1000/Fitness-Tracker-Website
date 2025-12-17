CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT,
  password TEXT,
  created_at DATETIME
);

CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  type TEXT,
  duration INTEGER,
  intensity TEXT,
  date DATETIME,
  calories_burned REAL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS calorie_logs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  food_item TEXT,
  calories INTEGER,
  date DATETIME,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  type TEXT,
  target REAL,
  deadline DATETIME,
  description TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
