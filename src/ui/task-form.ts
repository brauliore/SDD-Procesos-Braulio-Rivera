import { TaskValidationError } from "../application/task-service";
import type { Task } from "../application/task";

interface TaskFormOptions {
  task?: Task;
  onSave: (title: string, description: string) => void;
  onCancel?: () => void;
}

export function createTaskForm(options: TaskFormOptions): HTMLElement {
  const main = document.createElement("main");
  main.className = "app-shell form-shell";

  const heading = document.createElement("h1");
  heading.className = "form-heading";
  heading.textContent = options.task ? "Edit task" : "Add task";

  const form = document.createElement("form");
  form.className = "task-form";
  form.noValidate = true;

  const titleField = document.createElement("div");
  titleField.className = "form-field";
  const titleLabel = document.createElement("label");
  titleLabel.htmlFor = "task-title";
  titleLabel.textContent = "Title";
  const titleInput = document.createElement("input");
  titleInput.id = "task-title";
  titleInput.name = "title";
  titleInput.type = "text";
  titleInput.autocomplete = "off";
  titleInput.value = options.task?.title ?? "";
  titleInput.setAttribute("aria-describedby", "title-error");
  const errorMessage = document.createElement("p");
  errorMessage.id = "title-error";
  errorMessage.className = "validation-message";
  errorMessage.setAttribute("role", "alert");
  errorMessage.hidden = true;
  titleField.append(titleLabel, titleInput, errorMessage);

  const descriptionField = document.createElement("div");
  descriptionField.className = "form-field";
  const descriptionLabel = document.createElement("label");
  descriptionLabel.htmlFor = "task-description";
  descriptionLabel.textContent = "Description";
  const descriptionInput = document.createElement("textarea");
  descriptionInput.id = "task-description";
  descriptionInput.name = "description";
  descriptionInput.rows = 5;
  descriptionInput.value = options.task?.description ?? "";
  descriptionField.append(descriptionLabel, descriptionInput);

  const actions = document.createElement("div");
  actions.className = "form-actions";
  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.className = "primary-button";
  saveButton.textContent = "Save";
  actions.append(saveButton);

  if (options.onCancel) {
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "secondary-button";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", options.onCancel);
    actions.append(cancelButton);
  }

  form.append(titleField, descriptionField, actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorMessage.hidden = true;
    titleInput.removeAttribute("aria-invalid");

    try {
      options.onSave(titleInput.value, descriptionInput.value);
    } catch (error) {
      if (!(error instanceof TaskValidationError)) {
        throw error;
      }
      errorMessage.textContent = error.message;
      errorMessage.hidden = false;
      titleInput.setAttribute("aria-invalid", "true");
      titleInput.focus();
    }
  });

  main.append(heading, form);
  return main;
}
