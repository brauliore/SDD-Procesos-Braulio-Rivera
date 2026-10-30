import { TaskService } from "./application/task-service";
import type { Task, TaskFilter } from "./application/task";
import { LocalStorageTaskRepository } from "./persistence/local-storage-task-repository";
import { createDetailScreen } from "./ui/detail-screen";
import { createListScreen } from "./ui/list-screen";
import { createTaskForm } from "./ui/task-form";
import "./ui/styles.css";

const rootElement = document.querySelector<HTMLElement>("#app");
if (!rootElement) {
  throw new Error("Application root element was not found.");
}
const root: HTMLElement = rootElement;

document.title = "Curso-PSWE-07";

const taskService = new TaskService(
  new LocalStorageTaskRepository(window.localStorage),
);

type Screen = "list" | "detail" | "add" | "edit";
let screen: Screen = "list";
let selectedTaskId: string | null = null;
let activeFilter: TaskFilter = "all";

function findSelectedTask(): Task {
  const task = taskService
    .listTasks()
    .find((candidate) => candidate.id === selectedTaskId);
  if (!task) {
    throw new Error("The selected task no longer exists.");
  }
  return task;
}

function render(): void {
  if (screen === "list") {
    root.replaceChildren(
      createListScreen({
        tasks: taskService.listTasks(activeFilter),
        filter: activeFilter,
        onAddTask: () => {
          screen = "add";
          render();
        },
        onFilterChange: (filter) => {
          activeFilter = filter;
          render();
        },
        onOpenTask: (id) => {
          selectedTaskId = id;
          screen = "detail";
          render();
        },
      }),
    );
    return;
  }

  if (screen === "add") {
    root.replaceChildren(
      createTaskForm({
        onSave: (title, description) => {
          taskService.createTask(title, description);
          screen = "list";
          render();
        },
      }),
    );
    return;
  }

  const task = findSelectedTask();
  if (screen === "edit") {
    root.replaceChildren(
      createTaskForm({
        task,
        onSave: (title, description) => {
          taskService.updateTask(task.id, title, description);
          screen = "detail";
          render();
        },
        onCancel: () => {
          screen = "detail";
          render();
        },
      }),
    );
    return;
  }

  root.replaceChildren(
    createDetailScreen({
      task,
      onBack: () => {
        selectedTaskId = null;
        screen = "list";
        render();
      },
      onEdit: () => {
        screen = "edit";
        render();
      },
      onToggleCompletion: () => {
        taskService.toggleCompletion(task.id);
        render();
      },
      onDelete: () => {
        if (window.confirm("Delete this task?")) {
          taskService.deleteTask(task.id);
          selectedTaskId = null;
          screen = "list";
          render();
        }
      },
    }),
  );
}

render();
