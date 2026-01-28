# Fitness Tracker App

A JavaScript-based fitness tracking application developed with Vite, Chart.js, and SQL.js for local data persistence. This application allows users to log their calorie intake and workouts, visualizing their progress through interactive charts.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Running Tests](#running-tests)
- [Code Style](#code-style)
- [Components](#components)
- [Services](#services)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Calorie Tracking:** Log and monitor daily calorie intake.
- **Workout Tracking:** Record workout sessions.
- **Progress Visualization:** View fitness progress using interactive charts (powered by Chart.js).
- **Local Data Persistence:** Utilizes SQL.js for storing data locally in a `database.sqlite` file.
- **Gamified Experience:** An interactive game to make fitness fun.
- **AI-Powered Chat:** Get fitness and nutrition advice from an AI-powered chatbot.

## Technologies Used

- **Frontend:**
  - JavaScript (ES2022)
  - Vite (build tool)
  - Chart.js (for data visualization)
- **Data Storage:**
  - SQL.js (for local SQLite database management)
- **Testing:**
  - Jest

## Project Structure

```
.
├── data/
├── public/
├── src/
├── tests/
├── .gitignore
├── babel.config.js
├── eslint.config.js
├── index.html
├── meals.html
├── workouts.html
├── game.html
├── jest.config.js
├── jest.setup.js
├── package.json
├── README.md
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fitness-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```
This will typically open the application in your browser at `http://localhost:5173` (or similar).

### Running Tests

To execute the unit tests:
```bash
npm test
```

## Code Style

This project adheres to standard JavaScript (ES2022) conventions.

### Linting

This project uses ESLint to enforce code style and catch common errors. To run the linter, use:

```bash
npm run lint
```

## Components

The `src/js/components` directory contains the following UI components:

- `CalorieForm.js`: Form for logging calorie intake.
- `CalorieList.js`: Displays a list of logged calorie entries.
- `ProgressCharts.js`: Renders charts to visualize fitness progress.
- `WorkoutForm.js`: Form for logging workout sessions.
- `WorkoutList.js`: Displays a list of logged workout entries.
- `ChatWidget.js`: A chat widget for interacting with an AI-powered chatbot.
- `Quote.js`: Displays a motivational quote.

## Pages

The application is divided into the following pages:

- **Dashboard (`index.html`):** The main landing page, providing an overview of your fitness progress.
- **Meals (`meals.html`):** Log and view your daily calorie intake.
- **Workouts (`workouts.html`):** Record and track your workout sessions.
- **Game (`game.html`):** An interactive game to make fitness fun.

## Services

The `src/js/services` directory contains modules for data management and other utilities:

- `db.js`: Handles interactions with the local SQLite database.
- `food.js`: (Likely) provides functionality related to food data or calorie calculations.
- `ai.js`: Provides an interface to an AI-powered chatbot.

## Contributing

Contributions are welcome! Please ensure your code adheres to the existing style and conventions.

## License

(Specify your project's license here)
