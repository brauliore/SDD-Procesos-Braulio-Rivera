import type { Task } from "../application/task";

interface DetailScreenOptions {
  task: Task;
  onBack: () => void;
  onEdit: () => void;
  onToggleCompletion: () => void;
  onDelete: () => void;
}

export function createDetailScreen(options: DetailScreenOptions): HTMLElement {
  const main = document.createElement("main");
  main.className = "app-shell detail-shell";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "back-button";
  backButton.textContent = "Back to task list";
  backButton.addEventListener("click", options.onBack);

  const heading = document.createElement("h1");
  heading.className = "detail-title";
  heading.textContent = options.task.title;

  const description = document.createElement("p");
  description.className = "task-description";
  description.textContent = options.task.description || "No description";
  if (!options.task.description) {
    description.classList.add("muted");
  }

  const status = document.createElement("p");
  status.className = "detail-status";
  const statusLabel = document.createElement("span");
  statusLabel.className = `task-status ${options.task.completed ? "status-done" : "status-pending"}`;
  statusLabel.textContent = options.task.completed ? "Done" : "Pending";
  status.append(statusLabel);

  const actions = document.createElement("div");
  actions.className = "detail-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "secondary-button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", options.onEdit);

  const statusButton = document.createElement("button");
  statusButton.type = "button";
  statusButton.className = "primary-button";
  statusButton.textContent = options.task.completed
    ? "Mark as not done"
    : "Mark as done";
  statusButton.addEventListener("click", options.onToggleCompletion);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "warning-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", options.onDelete);

  actions.append(editButton, statusButton, deleteButton);
  main.append(backButton, heading, description, status, actions);
  return main;
}
