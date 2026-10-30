import { describe, expect, it } from "vitest";
import type { Task } from "../../src/application/task";
import { LocalStorageTaskRepository } from "../../src/persistence/local-storage-task-repository";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("LocalStorageTaskRepository", () => {
  it("saves and loads tasks through the repository interface", () => {
    const repository = new LocalStorageTaskRepository(new MemoryStorage());
    const tasks: Task[] = [
      {
        id: "task-1",
        title: "Read a book",
        description: "",
        completed: false,
      },
    ];

    repository.saveAll(tasks);

    expect(repository.loadAll()).toEqual(tasks);
  });

  it("replaces stored tasks when saving an update", () => {
    const repository = new LocalStorageTaskRepository(new MemoryStorage());
    repository.saveAll([
      {
        id: "task-1",
        title: "Draft",
        description: "",
        completed: false,
      },
    ]);

    repository.saveAll([
      {
        id: "task-1",
        title: "Final",
        description: "Updated",
        completed: true,
      },
    ]);

    expect(repository.loadAll()).toEqual([
      {
        id: "task-1",
        title: "Final",
        description: "Updated",
        completed: true,
      },
    ]);
  });

  it("reports invalid stored data instead of silently discarding it", () => {
    const storage = new MemoryStorage();
    storage.setItem("curso-pswe-07.tasks", "{invalid");
    const repository = new LocalStorageTaskRepository(storage);

    expect(() => repository.loadAll()).toThrow("Saved tasks could not be read.");
  });
});
