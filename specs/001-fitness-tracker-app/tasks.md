# Tasks: Fitness Tracker Application

**Input**: Design documents from `C:\Users\ecao3\FITNESS_APP\specs\001-fitness-tracker-app\`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Constitution**: All tasks must adhere to the principles in .specify/memory/constitution.md.

## Phase 1: Setup (Shared Infrastructure)
- [ ] T001 Initialize Vite project using `npm create vite@latest . -- --template vanilla --yes`
- [ ] T002 [P] Install dependencies: `npm install chart.js sqlite3`
- [ ] T003 [P] Install development dependencies: `npm install -D jest`
- [ ] T004 [P] Configure Jest in `package.json` and create `jest.config.js`

## Phase 2: Foundational (Blocking Prerequisites)
- [ ] T005 Setup SQLite database in `data/database.sqlite`
- [ ] T006 Create database service in `src/js/services/db.js` to handle all database interactions
- [ ] T007 Create initial database schema based on `data-model.md` in `data/schema.sql`
- [ ] T008 [P] Create basic HTML structure in `src/index.html` for the main layout
- [ ] T009 [P] Create basic CSS in `src/css/style.css` for the main layout

## Phase 3: User Story 1 - Log a Workout (Priority: P1) 🎯 MVP
**Goal**: Allow users to log their daily workouts.
**Independent Test**: A user can add a workout and see it in their activity history.

### Implementation for User Story 1
- [ ] T010 [P] [US1] Unit test for WorkoutForm component in `tests/unit/WorkoutForm.test.js`
- [ ] T011 [P] [US1] Create UI component for the workout log form in `src/js/components/WorkoutForm.js`
- [ ] T012 [US1] Implement `addWorkout` function in `src/js/services/db.js`
- [ ] T013 [US1] Implement logic in `src/js/main.js` to handle form submission, save the workout, and update the UI
- [ ] T014 [P] [US1] Create UI component to display workout history in `src/js/components/WorkoutList.js`

## Phase 4: User Story 2 - Track Calories (Priority: P1)
**Goal**: Allow users to log their daily calorie intake.
**Independent Test**: A user can add a meal and see the updated calorie count.

### Implementation for User Story 2
- [ ] T015 [P] [US2] Unit test for CalorieForm component in `tests/unit/CalorieForm.test.js`
- [ ] T016 [P] [US2] Create UI component for the calorie log form in `src/js/components/CalorieForm.js`
- [ ] T017 [US2] Implement `addCalorieLog` function in `src/js/services/db.js`
- [ ] T018 [US2] Implement logic in `src/js/main.js` to handle form submission, save the calorie log, and update the UI
- [ ] T019 [P] [US2] Create UI component to display the daily calorie summary in `src/js/components/CalorieSummary.js`

## Phase 5: User Story 3 - View Progress (Priority: P2)
**Goal**: Allow users to view their progress over time.
**Independent Test**: A user can see charts for their workouts and calorie intake.

### Implementation for User Story 3
- [ ] T020 [P] [US3] Unit test for ProgressCharts component in `tests/unit/ProgressCharts.test.js`
- [ ] T021 [P] [US3] Create UI component for the progress charts in `src/js/components/ProgressCharts.js`
- [ ] T022 [US3] Implement `getWorkouts` and `getCalorieLogs` functions in `src/js/services/db.js`
- [ ] T023 [US3] Implement logic in `src/js/components/ProgressCharts.js` to fetch data and render charts using Chart.js

## Phase 6: User Story 4 - Set and Track Goals (Priority: P2)
**Goal**: Allow users to set and track their fitness goals.
**Independent Test**: A user can add a new goal and see their progress towards it.

### Implementation for User Story 4
- [ ] T024 [P] [US4] Create UI component for the goal-setting form in `src/js/components/GoalForm.js`
- [ ] T025 [US4] Implement `addGoal` and `getGoals` functions in `src/js/services/db.js`
- [ ] T026 [US4] Implement logic in `src/js/main.js` to handle form submission, save the goal, and update the UI
- [ ] T027 [P] [US4] Create UI component to display goals and progress in `src/js/components/GoalList.js`

## Phase N: Polish & Cross-Cutting Concerns
- [ ] T028 [P] Add styling to all components in `src/css/style.css`
- [ ] T029 Implement responsive design for mobile devices
- [ ] T030 Add error handling and user feedback for all user interactions
- [ ] T031 Write unit tests for database services in `tests/unit/db.test.js`

## Dependencies & Execution Order
- **Phase 1** must be completed before **Phase 2**.
- **Phase 2** must be completed before any User Story phases.
- User stories can be implemented in parallel after Phase 2 is complete.

## Implementation Strategy
### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready


### Incremental Delivery
1.  Complete Setup + Foundational
2.  Add User Story 1 → Test independently → Deploy/Demo
3.  Add User Story 2 → Test independently → Deploy/Demo
4.  Add User Story 3 → Test independently → Deploy/Demo
