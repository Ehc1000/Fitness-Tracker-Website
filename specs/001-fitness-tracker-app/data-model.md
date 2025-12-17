# Data Model: Fitness Tracker Application

This document outlines the data model for the fitness tracker application, based on the key entities defined in the feature specification.

## Tables

### `users`
Represents an individual using the application.

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary Key |
| `username` | TEXT | User's username |
| `password` | TEXT | User's hashed password |
| `created_at` | DATETIME | Timestamp of user creation |

### `workouts`
Represents a single workout session.

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary Key |
| `user_id` | INTEGER | Foreign Key to `users` table |
| `type` | TEXT | Type of workout (e.g., "Running", "Weightlifting") |
| `duration` | INTEGER | Duration of the workout in minutes |
| `intensity`| TEXT | Intensity of the workout (e.g., "Low", "Medium", "High") |
| `date` | DATETIME | Date and time of the workout |

### `calorie_logs`
Represents a food entry with calorie information.

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary Key |
| `user_id` | INTEGER | Foreign Key to `users` table |
| `food_item`| TEXT | Name of the food item |
| `calories` | INTEGER | Number of calories |
| `date` | DATETIME | Date and time of the log |

### `goals`
Represents a user-defined fitness goal.

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary Key |
| `user_id` | INTEGER | Foreign Key to `users` table |
| `type` | TEXT | Type of goal (e.g., "Weight Loss", "Workout Frequency") |
| `target` | REAL | Target value for the goal |
| `deadline` | DATETIME | Deadline for the goal |
| `description` | TEXT | Free-text description of the goal |
