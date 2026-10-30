# Feature Specification: Curso-PSWE-07 To-Do List

**Feature Branch**: `001-todo-list`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: Build a simple to-do list application named "Curso-PSWE-07" that helps users organize and track their daily tasks.

## User Scenarios & Testing

### User Story 1 - Create and view tasks (Priority: P1)

As a user, I want to add tasks and see them in a to-do list so that I can keep track of what I need to do.

**Why this priority**: Creating and viewing tasks is the core value of the application.

**Independent Test**: Add a task with a title and optional description, verify it appears in the list and opens in detail, then close and reopen the application and verify it remains.

**Acceptance Scenarios**:

1. **Given** the To-Do List screen, **When** I select "Add task", **Then** a task form opens with title and description fields.
2. **Given** the task form, **When** I submit a title that is non-empty after trimming leading and trailing whitespace and an optional description, **Then** the trimmed title is saved, the task is created with Pending status, and it appears as a row in the list.
3. **Given** a task row in the list, **When** I select the row, **Then** its To-Do Detail screen opens.
4. **Given** a saved task, **When** I close and reopen the application, **Then** the task and its title, description, and completion status are retained.
5. **Given** the task form with an empty title, **When** I submit it, **Then** a validation message is shown and no task is created.

### User Story 2 - Manage a task (Priority: P2)

As a user, I want to edit, complete, reopen, or delete a task so that my list reflects its current state.

**Why this priority**: Managing tasks keeps the list accurate after tasks have been created.

**Independent Test**: Open a task, edit and save its details, toggle its completion status in both directions, and delete it after confirming.

**Acceptance Scenarios**:

1. **Given** a task's detail screen, **When** I select "Edit", **Then** an edit form opens with the task's current title and description and offers Save and Cancel.
2. **Given** an edit form with changed valid values, **When** I select "Save", **Then** the task is updated and the detail screen shows the saved values.
3. **Given** an edit form with an empty title, **When** I select "Save", **Then** a validation message is shown and the task is not saved with an empty title.
4. **Given** an edit form with unsaved changes, **When** I select "Cancel", **Then** those changes are discarded and the task remains unchanged.
5. **Given** a Pending task, **When** I select "Mark as done", **Then** its status becomes Done and the available status action changes to "Mark as not done".
6. **Given** a Done task, **When** I select "Mark as not done", **Then** its status becomes Pending and the available status action changes to "Mark as done".
7. **Given** a task's detail screen, **When** I select "Delete", **Then** a confirmation is requested before deletion.
8. **Given** the delete confirmation, **When** I cancel, **Then** the task remains; **when** I confirm, **Then** the task is deleted and is no longer in the list.

### User Story 3 - Filter the task list (Priority: P3)

As a user, I want to filter tasks by completion status so that I can focus on all tasks, pending tasks, or completed tasks.

**Why this priority**: Filtering makes task lists easier to scan while preserving the core create-and-manage workflow.

**Independent Test**: Create at least one Pending task and one Done task, switch between each filter, and verify only matching rows are shown.

**Acceptance Scenarios**:

1. **Given** tasks with both statuses, **When** I select "All", **Then** both Pending and Done tasks are shown and "All" is highlighted as active.
2. **Given** tasks with both statuses, **When** I select "Pending", **Then** only Pending tasks are shown and "Pending" is highlighted as active.
3. **Given** tasks with both statuses, **When** I select "Done", **Then** only Done tasks are shown and "Done" is highlighted as active.
4. **Given** there are no tasks, or no tasks matching the active filter, **When** the list is shown, **Then** a short, friendly empty-state message is displayed.

### Edge Cases

- Leading and trailing whitespace in a valid title is trimmed when saved.
- A title that is empty after trimming whitespace is invalid; the task is not created or saved, and a validation message is displayed.
- A task with no description displays a muted "No description" on its detail screen.
- An empty list and a filter with no matching tasks each display a friendly empty state.
- Canceling the delete confirmation leaves the task unchanged.
- Closing and reopening the application preserves all saved tasks and their completion statuses.

## Requirements

### Functional Requirements

- **FR-001**: The application MUST be named "Curso-PSWE-07"; that name MUST appear in the To-Do List header and as the application or window title.
- **FR-002**: The To-Do List screen MUST show task rows, a three-option completion filter ("All", "Pending", "Done"), and a clearly visible "Add task" action.
- **FR-003**: Each task MUST have a required title, an optional description, and a completion status of Done or Pending; newly created tasks MUST start as Pending.
- **FR-004**: The task form MUST allow entry of a title and optional description. On save, the application MUST trim leading and trailing whitespace from the title. If the trimmed title is empty, the application MUST show a validation message and MUST NOT create or save the task.
- **FR-005**: Selecting "Add task" MUST open the task form; submitting valid values MUST create and display the task in the list.
- **FR-006**: Selecting a task row MUST open its To-Do Detail screen.
- **FR-007**: The list MUST filter tasks to all, Pending, or Done according to the active filter, and MUST visibly highlight the active filter.
- **FR-008**: Each task row MUST show a status indicator and title. Done task titles MUST have strikethrough styling and muted color.
- **FR-009**: The To-Do Detail screen MUST provide a back control, a prominent title, the description below it (or muted "No description" when absent), and a visible "Done" or "Pending" status label.
- **FR-010**: The detail screen MUST provide "Edit", a status action labeled "Mark as done" or "Mark as not done" as appropriate, and "Delete".
- **FR-011**: Edit mode MUST reuse the task form with current values and provide Save and Cancel. Save MUST validate the title; Cancel MUST discard unsaved changes.
- **FR-012**: Deleting a task MUST require confirmation. Confirming MUST remove the task; canceling MUST leave it unchanged.
- **FR-013**: Tasks and their saved values and statuses MUST persist when the application is closed and reopened.
- **FR-014**: When there are no tasks or the active filter has no matches, the list MUST display a short, friendly empty-state message.
- **FR-015**: The interface MUST use a clean, minimal design with a light background, generous white space, one sans-serif font family, and a single accent color for primary actions and the active filter. Titles MUST be larger and bolder than descriptions. Text contrast MUST meet WCAG AA: at least 4.5:1 for normal text and 3:1 for large text.
- **FR-016**: Interactive controls MUST have touch/click targets at least 44 by 44 pixels, and the layout MUST be responsive on mobile and desktop.
- **FR-017**: The Delete action MUST use a distinct warning color.

### Key Entities

- **Task**: A user-created item with a required title, optional description, and completion status (Done or Pending).

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of valid tasks created in a session appear in the list and remain available with the same title, description, and status after closing and reopening the application.
- **SC-002**: 100% of tested blank or whitespace-only title submissions are blocked with a visible validation message and do not create or save a task.
- **SC-003**: For every tested task set, All shows every task, Pending shows only Pending tasks, and Done shows only Done tasks.
- **SC-004**: Every interactive control has a target measuring at least 44 by 44 pixels, all listed screens and actions remain usable at mobile and desktop viewport sizes, and text meets WCAG AA contrast ratios.

## Assumptions

- The application serves one local user; accounts, multi-user access, and synchronization are not required.
- Task data is retained in the application's local environment and is available when that application is reopened.
- Leading and trailing whitespace is removed from titles on save; a title containing only whitespace is treated as empty.
- When the list first opens, "All" is the active filter.
- The task list has no required ordering beyond showing tasks that match the selected filter.

## Out of Scope

- Accounts, categories, due dates, priorities, search, and synchronization.
- Any functionality not specified in this document.
