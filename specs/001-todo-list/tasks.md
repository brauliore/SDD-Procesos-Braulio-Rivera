# Tasks: Curso-PSWE-07 To-Do List

**Input**: Design documents from `specs/001-todo-list/`

**Prerequisites**: `plan.md` and `spec.md`

**Tests**: Test tasks are required by the project constitution. For each production change, write and run a failing test first, implement the minimum to pass, then refactor.

**Organization**: Tasks are grouped by user story and ordered so each story's tests precede its production implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with another task in the phase (different files and no dependencies).
- **[Story]**: User story mapped to the specification (`US1`, `US2`, or `US3`).
- Every task names the paths it creates or changes.

## Phase 1: Setup

**Purpose**: Set up only the browser application and test tooling chosen in the plan.

- [x] T001 Create the TypeScript/Vite project manifest and scripts for development, production build, unit tests, and browser acceptance tests in `package.json`.
- [x] T002 [P] Configure TypeScript, Vite, Vitest, and Playwright for the planned application and test directories in `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, and `playwright.config.ts`.

## Phase 2: User Story 1 - Create and view tasks (Priority: P1)

**Goal**: Create tasks with validated titles, view them in the list and detail screen, and retain them after reopening the app.

**Independent Test**: Add a task with a title and optional description, verify its Pending list row and detail view, close and reopen the app, and verify its saved values remain.

### Tests - write first

- [x] T003 [P] [US1] Write unit tests for task creation, initial Pending status, title trimming, blank-title validation, and listing tasks in `tests/unit/task-service.test.ts`.
- [x] T004 [P] [US1] Write persistence tests for saving, loading, and updating stored tasks through the repository contract in `tests/unit/local-storage-task-repository.test.ts`.
- [x] T005 [P] [US1] Write browser acceptance tests for app/window naming, add form, valid and invalid titles, list row, opening task detail, empty description, empty list, light background, one sans-serif font, title/description hierarchy, WCAG AA text contrast, 44 by 44 px controls, responsive layout, and persistence after reload in `tests/acceptance/create-and-view-tasks.spec.ts`.

### Implementation

- [x] T006 [US1] Implement the Task type, application-layer task repository interface, and create/list application operations required by the unit tests in `src/application/task.ts`, `src/application/task-repository.ts`, and `src/application/task-service.ts`.
- [x] T007 [US1] Implement browser-local task storage behind the repository interface and pass the persistence tests in `src/persistence/local-storage-task-repository.ts`.
- [x] T008 [US1] Implement the app entry, To-Do List and read-only To-Do Detail screens, task form, navigation, empty states, and responsive baseline layout to pass the US1 acceptance tests in `index.html`, `src/main.ts`, `src/ui/list-screen.ts`, `src/ui/detail-screen.ts`, `src/ui/task-form.ts`, and `src/ui/styles.css`.

**Checkpoint**: US1 acceptance tests pass, including task retention after browser reload.

## Phase 3: User Story 2 - Manage a task (Priority: P2)

**Goal**: Edit task details, mark a task done or pending, and delete it only after confirmation.

**Independent Test**: Open a task, edit and save valid details, cancel an unsaved edit, toggle status in both directions, and test both canceling and confirming deletion.

### Tests - write first

- [x] T009 [P] [US2] Add unit tests for editing with title validation, cancel-safe updates, status toggling, and task deletion in `tests/unit/task-service.test.ts`.
- [x] T010 [P] [US2] Write browser acceptance tests for prefilled edit values, Save, Cancel, blank-title validation, both status-action labels, completed-task strikethrough and muted color, distinct warning color, and confirmed/canceled deletion in `tests/acceptance/manage-a-task.spec.ts`.

### Implementation

- [x] T011 [US2] Implement validated task update, status toggle, and delete operations to pass the US2 service tests in `src/application/task-service.ts`.
- [x] T012 [US2] Add edit mode with Save and Cancel, dynamic status actions, and warning-colored Delete with confirmation to pass the management acceptance tests in `src/ui/detail-screen.ts`, `src/ui/task-form.ts`, and `src/ui/styles.css`.

**Checkpoint**: US2 acceptance tests pass, including preservation of task data when an edit or delete is canceled.

## Phase 4: User Story 3 - Filter the task list (Priority: P3)

**Goal**: Show all, pending, or done tasks according to the active filter.

**Independent Test**: With at least one task in each status, select each filter and verify the visible rows and active filter.

### Tests - write first

- [x] T013 [P] [US3] Write unit tests that All includes every task and Pending and Done return only matching tasks in `tests/unit/task-service.test.ts`.
- [x] T014 [P] [US3] Write browser acceptance tests for all three filters, active-filter highlighting, and the no-match empty state in `tests/acceptance/filter-tasks.spec.ts`.

### Implementation

- [x] T015 [US3] Implement status-based task filtering to pass the service tests in `src/application/task-service.ts`.
- [x] T016 [US3] Connect the All, Pending, and Done controls to application filtering and render the active filter and filtered empty state in `src/ui/list-screen.ts` and `src/ui/styles.css`.

**Checkpoint**: US3 acceptance tests pass for each filter and for a filter with no matching tasks.

## Phase 5: Polish and Verification

**Purpose**: Verify remaining visual and accessibility-related requirements without adding out-of-scope functionality.

- [x] T017 [P] Verify Edit mode text contrast and 44 by 44 px controls at mobile and desktop viewport sizes in `tests/acceptance/create-and-view-tasks.spec.ts`.
- [x] T018 Adjust the single-font, light-background, spacing, text hierarchy, contrast, active-filter, completed-row, and warning-action styling to meet FR-008 and FR-015–FR-017 in `src/ui/styles.css`.
- [x] T019 Run the full unit and browser acceptance test suites and production build; fix only failures traced to requirements in `specs/001-todo-list/spec.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; required before running tests or application code.
- **US1 (Phase 2)**: Depends on Setup. All US1 tests (T003–T005) must be written and confirmed failing before production implementation (T006–T008).
- **US2 (Phase 3)**: Depends on US1 task model, repository, and working app. Write and confirm T009–T010 fail before implementing T011–T012.
- **US3 (Phase 4)**: Depends on US1 list and task service. Write and confirm T013–T014 fail before implementing T015–T016.
- **Polish (Phase 5)**: Depends on all three user stories; visual requirements checks precede the final styling and suite verification.

### User Story Dependencies

- **US1 (P1)**: First independently deliverable slice; depends only on project setup.
- **US2 (P2)**: Uses the task model, persistence, and detail screen established in US1.
- **US3 (P3)**: Uses the task list and service established in US1; the Done state is exercised by US2 before filtering is tested.

### Parallel Opportunities

- T002 can run alongside T001 after the project setup starts, provided it does not change `package.json`.
- US1 test tasks T003, T004, and T005 can be authored in parallel because they use separate test files; all must fail before implementation begins.
- US2 test tasks T009 and T010 can be authored in parallel; both precede US2 production changes.
- US3 test tasks T013 and T014 can be authored in parallel; both precede US3 production changes.
- Within a story, do not implement production code before its corresponding tests fail.

## Implementation Strategy

1. Complete setup and run the test tools.
2. Deliver US1 as the MVP: tests first, task logic and persistence, then list/detail UI; verify reload persistence.
3. Deliver US2: add failing service and browser tests, then edit/status/delete behavior.
4. Deliver US3: add failing filtering tests, then filtering behavior.
5. Verify the visual requirements and run the full tests and production build.

## Requirement Traceability

| Requirements | Task coverage |
|---|---|
| FR-001–FR-006, FR-009, FR-013–FR-016; US1 | T003–T008, T017–T019 |
| FR-003–FR-004, FR-009–FR-013, FR-017; US2 | T009–T012, T018–T019 |
| FR-002, FR-007–FR-008, FR-014–FR-016; US3 | T013–T016, T018–T019 |
| SC-001–SC-004 | T005, T010, T014, T017–T019 |
