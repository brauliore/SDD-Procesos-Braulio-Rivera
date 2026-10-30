import type { TaskRepository } from "../application/task-repository";
import type { Task } from "../application/task";

const STORAGE_KEY = "curso-pswe-07.tasks";

export class LocalStorageTaskRepository implements TaskRepository {
  constructor(private readonly storage: Storage) {}

  loadAll(): Task[] {
    const serialized = this.storage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return [];
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(serialized);
    } catch {
      throw new Error("Saved tasks could not be read.");
    }

    if (!Array.isArray(parsed) || !parsed.every(isTask)) {
      throw new Error("Saved tasks have an invalid format.");
    }

    return parsed.map((task) => ({ ...task }));
  }

  saveAll(tasks: readonly Task[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    task.title.trim().length > 0 &&
    typeof task.description === "string" &&
    typeof task.completed === "boolean"
  );
}
