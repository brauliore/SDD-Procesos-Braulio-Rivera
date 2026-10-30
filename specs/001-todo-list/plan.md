# Implementation Plan: Curso-PSWE-07 To-Do List

**Branch**: `001-todo-list` | **Date**: 2026-10-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-todo-list/spec.md`

## Summary

Build a responsive, single-user web application for creating, viewing, editing, filtering, completing, and deleting tasks. Use a small TypeScript application with browser-native UI, local browser storage behind a persistence interface, and acceptance tests that exercise the three user journeys. No accounts, network services, or out-of-scope task features are planned.

## Technical Context

**Language/Version**: TypeScript, targeting modern browsers  
**Primary Dependencies**: Vite for development/build, Vitest for unit tests, Playwright for browser acceptance tests; no UI framework  
**Storage**: Browser local storage, accessed only through a task persistence interface  
**Testing**: Vitest unit tests for business logic; Playwright acceptance tests for each user story  
**Target Platform**: Responsive web browsers on mobile and desktop  
**Project Type**: Web application  
**Performance Goals**: No domain-specific performance target in the spec; the app operates on a local task list  
**Constraints**: Local persistence across close/reopen; no accounts, categories, due dates, priorities, search, or sync; interactive targets at least 44 by 44 px  
**Scale/Scope**: One local user, one task list, two screens plus add/edit form states

### Technical Decisions

- Use TypeScript and browser-native DOM APIs rather than a UI framework; the specified screens and interactions do not justify framework abstractions.
- Use local storage for persistence so saved tasks survive application restarts without accounts, network services, or additional infrastructure.
- Define the small task persistence interface in the application layer and implement it in the persistence layer. This keeps dependencies flowing UI -> application -> persistence; UI code never accesses storage.
- Give each task an internal stable identifier so edit, completion, and deletion operations can target an individual task; the identifier is not user-visible.
- Use Vite, Vitest, and Playwright as the minimal planned toolchain for serving/building the browser app, fast unit tests, and browser acceptance tests. These dependencies are justified by the browser target and the constitution's required unit and acceptance testing.

## Constitution Check

| Principle | Gate | Plan |
|---|---|---|
| Simplicity First (YAGNI) | Pass | Implement only the spec's task flows; no UI framework, accounts, remote services, or speculative features. The toolchain choices and reasons are documented above. |
| Simple, Clear Design | Pass | Organize small, single-purpose UI and application modules; avoid single-use abstractions and premature optimization. |
| Structured Architecture | Pass | Enforce UI -> application logic -> persistence; UI has no storage access, and persistence is accessed through an interface. |
| Test-Driven Development | Pass | Write failing unit or acceptance tests before production code; implement the minimum to pass, then refactor. Cover business logic with unit tests and every user story with acceptance tests. |
| Spec Is the Source of Truth | Pass | Trace implementation and tests to FR-001–FR-017 and the three user stories; exclude all features listed as out of scope. |

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-list/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
src/
├── main.ts
├── application/
│   ├── task-repository.ts
│   ├── task-service.ts
│   └── task.ts
├── persistence/
│   └── local-storage-task-repository.ts
└── ui/
    ├── list-screen.ts
    ├── detail-screen.ts
    ├── task-form.ts
    └── styles.css
tests/
├── unit/
│   ├── local-storage-task-repository.test.ts
│   └── task-service.test.ts
└── acceptance/
    ├── create-and-view-tasks.spec.ts
    ├── manage-a-task.spec.ts
    └── filter-tasks.spec.ts
```

**Structure Decision**: Use one web application with UI, application, and persistence layers. Keep task types, operations, and the repository interface in the application layer; keep browser storage implementation in persistence. Acceptance tests correspond directly to the three independently testable user stories.

## Implementation Sequence

1. Write failing unit tests for task creation, title trimming and validation, editing, status changes, and filtering; implement the minimum application logic to pass.
2. Write failing persistence tests for saving, loading, and deleting tasks through the repository interface; implement browser local storage behind that interface.
3. Write acceptance tests for the create/view/persist user journey; implement the task list, add form, navigation, and empty states.
4. Write acceptance tests for task management; implement detail, edit/cancel/save, status toggling, and confirmed deletion.
5. Write acceptance tests for status filters; implement the active filter and matching empty state.
6. Verify visual and responsive requirements against the spec: application name, status styling, contrast, warning color, 44 by 44 px targets, and mobile/desktop layouts. Add or adjust tests before any production changes required by failures.

## Requirement Traceability

| User story / requirements | Planned coverage |
|---|---|
| Story 1; FR-001–FR-006; FR-013–FR-016 | Create/view/persist acceptance test; title-validation and application-logic unit tests; responsive and visual verification |
| Story 2; FR-003–FR-004; FR-009–FR-013; FR-017 | Manage-task acceptance test; title validation and status/update unit tests; delete confirmation and warning styling verification |
| Story 3; FR-002; FR-007–FR-008; FR-014–FR-016 | Filter acceptance test; filtering unit test; active-filter, completed-row, empty-state, and responsive verification |

## Complexity Tracking

No constitution violations are planned. Vite, Vitest, and Playwright are the only planned development/test dependencies; their purpose and necessity are documented in Technical Decisions.
