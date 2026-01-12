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
├── backend/                  # Placeholder for future backend implementation
├── frontend/                 # Frontend application code (current project root)
├── tests/                    # Unit tests for application components
├── data/                     # Database files (e.g., database.sqlite, schema.sql)
├── public/                   # Static assets (images, etc.)
├── src/                      # Source code
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript modules
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # Data handling and utility services
│   │   ├── constants.js      # Application constants
│   │   └── main.js           # Main application entry point
│   └── javascript.svg        # Placeholder image
├── index.html                # Main HTML file
├── babel.config.js           # Babel configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
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

## Services

The `src/js/services` directory contains modules for data management and other utilities:

- `db.js`: Handles interactions with the local SQLite database.
- `food.js`: (Likely) provides functionality related to food data or calorie calculations.

## Contributing

Contributions are welcome! Please ensure your code adheres to the existing style and conventions.

## License

(Specify your project's license here)
