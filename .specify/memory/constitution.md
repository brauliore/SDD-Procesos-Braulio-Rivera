# Curso-PSWE-07 Constitution

## Core Principles

### 1. SIMPLICITY FIRST (YAGNI)
**Rule:** Implementations MUST include only what the spec requires. Choose the simplest working solution. MUST NOT add speculative features, abstractions, configuration options, or dependencies. Any added complexity MUST be justified in writing in the plan.
**Rationale:** Keeping scope and complexity minimal makes the required behavior easier to build and maintain.

### 2. SIMPLE, CLEAR DESIGN
**Rule:** Code MUST use small, single-responsibility functions and modules with clear, intention-revealing names. Avoid duplication only when it is real; MUST NOT create abstractions for a single use or optimize prematurely.
**Rationale:** Clear, focused code is easier to understand and change safely.

### 3. STRUCTURED ARCHITECTURE
**Rule:** The architecture MUST separate UI, application logic, and persistence, with dependencies flowing UI -> logic -> persistence. UI code MUST NOT access storage directly. Persistence MUST be hidden behind a small interface that can be replaced or faked in tests.
**Rationale:** One-way dependencies preserve separation of concerns and enable isolated testing.

### 4. TEST-DRIVEN DEVELOPMENT (NON-NEGOTIABLE)
**Rule:** Development MUST follow Red-Green-Refactor: write a failing test, implement the minimum to pass, then refactor. No production code MUST be written without a test that required it. Business logic MUST have unit tests; each user story MUST have at least one acceptance test mirroring its acceptance scenarios. Tests MUST be fast and independent.
**Rationale:** Test-first development verifies requirements continuously and keeps changes safe.

### 5. SPEC IS THE SOURCE OF TRUTH
**Rule:** Every implementation task MUST trace to a spec requirement; anything not in the spec is out of scope. Ambiguous requirements MUST be clarified before implementation.
**Rationale:** Traceability prevents unintended scope and resolves uncertainty before it becomes code.

**Version:** 1.0.0 | **Ratified:** 2026-10-22 | **Last Amended:** 2026-10-22
