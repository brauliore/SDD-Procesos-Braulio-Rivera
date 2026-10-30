import type { TaskRepository } from "./task-repository";
import type { Task, TaskFilter } from "./task";

export class TaskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskValidationError";
  }
}

export class TaskNotFoundError extends Error {
  constructor() {
    super("Task was not found.");
    this.name = "TaskNotFoundError";
  }
}

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  listTasks(filter: TaskFilter = "all"): Task[] {
    const tasks = this.repository.loadAll();
    return tasks
      .filter((task) => {
        if (filter === "pending") {
          return !task.completed;
        }
        if (filter === "done") {
          return task.completed;
        }
        return true;
      })
      .map((task) => ({ ...task }));
  }

  createTask(title: string, description: string): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title: this.normalizeTitle(title),
      description,
      completed: false,
    };
    const tasks = this.repository.loadAll();
    this.repository.saveAll([...tasks, task]);
    return { ...task };
  }

  updateTask(id: string, title: string, description: string): Task {
    const tasks = this.repository.loadAll();
    const index = this.findTaskIndex(tasks, id);
    const updatedTask: Task = {
      ...tasks[index]!,
      title: this.normalizeTitle(title),
      description,
    };
    tasks[index] = updatedTask;
    this.repository.saveAll(tasks);
    return { ...updatedTask };
  }

  toggleCompletion(id: string): Task {
    const tasks = this.repository.loadAll();
    const index = this.findTaskIndex(tasks, id);
    const updatedTask: Task = {
      ...tasks[index]!,
      completed: !tasks[index]!.completed,
    };
    tasks[index] = updatedTask;
    this.repository.saveAll(tasks);
    return { ...updatedTask };
  }

  deleteTask(id: string): void {
    const tasks = this.repository.loadAll();
    const remaining = tasks.filter((task) => task.id !== id);
    if (remaining.length === tasks.length) {
      throw new TaskNotFoundError();
    }
    this.repository.saveAll(remaining);
  }

  private findTaskIndex(tasks: Task[], id: string): number {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new TaskNotFoundError();
    }
    return index;
  }

  private normalizeTitle(title: string): string {
    const normalized = title.trim();
    if (!normalized) {
      throw new TaskValidationError("Title is required.");
    }
    return normalized;
  }
}
