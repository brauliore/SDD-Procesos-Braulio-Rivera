import type { Task, TaskFilter } from "../application/task";

interface ListScreenOptions {
  tasks: Task[];
  filter: TaskFilter;
  onAddTask: () => void;
  onFilterChange: (filter: TaskFilter) => void;
  onOpenTask: (id: string) => void;
}

const filters: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "done", label: "Done" },
];

export function createListScreen(options: ListScreenOptions): HTMLElement {
  const main = document.createElement("main");
  main.className = "app-shell";

  const header = document.createElement("header");
  header.className = "app-header";
  const heading = document.createElement("h1");
  heading.textContent = "Curso-PSWE-07";
  header.append(heading);

  const actions = document.createElement("div");
  actions.className = "list-actions";
  const filterGroup = document.createElement("nav");
  filterGroup.className = "filter-group";
  filterGroup.setAttribute("aria-label", "Filter tasks");

  for (const filter of filters) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    if (options.filter === filter.value) {
      button.classList.add("is-active");
    }
    button.setAttribute("aria-pressed", String(options.filter === filter.value));
    button.textContent = filter.label;
    button.addEventListener("click", () => options.onFilterChange(filter.value));
    filterGroup.append(button);
  }

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "primary-button add-task-button";
  addButton.textContent = "Add task";
  addButton.addEventListener("click", options.onAddTask);
  actions.append(filterGroup, addButton);

  const taskList = document.createElement("section");
  taskList.className = "task-list";
  taskList.setAttribute("aria-label", "Tasks");

  if (options.tasks.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent =
      options.filter === "all"
        ? "No tasks yet. Add one to get started."
        : `No ${options.filter} tasks.`;
    taskList.append(emptyState);
  } else {
    for (const task of options.tasks) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "task-row";
      row.setAttribute(
        "aria-label",
        `Task: ${task.title}, ${task.completed ? "Done" : "Pending"}`,
      );
      row.addEventListener("click", () => options.onOpenTask(task.id));

      const status = document.createElement("span");
      status.className = `task-status ${task.completed ? "status-done" : "status-pending"}`;
      status.textContent = task.completed ? "Done" : "Pending";

      const title = document.createElement("span");
      title.className = "task-title";
      if (task.completed) {
        title.classList.add("task-title-done");
      }
      title.textContent = task.title;

      row.append(status, title);
      taskList.append(row);
    }
  }

  main.append(header, actions, taskList);
  return main;
}
