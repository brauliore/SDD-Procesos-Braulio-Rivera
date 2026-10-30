import { describe, expect, it } from "vitest";
import { TaskService } from "../../src/application/task-service";
import type { TaskRepository } from "../../src/application/task-repository";
import type { Task } from "../../src/application/task";

class MemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  loadAll(): Task[] {
    return structuredClone(this.tasks);
  }

  saveAll(tasks: readonly Task[]): void {
    this.tasks = [...structuredClone(tasks)];
  }
}

describe("TaskService", () => {
  it("creates a pending task and trims the title", () => {
    const service = new TaskService(new MemoryTaskRepository());

    const task = service.createTask("  Buy groceries  ", "Milk and bread");

    expect(task).toMatchObject({
      title: "Buy groceries",
      description: "Milk and bread",
      completed: false,
    });
    expect(task.id).not.toBe("");
    expect(service.listTasks()).toEqual([task]);
  });

  it("rejects a title that is empty after trimming", () => {
    const service = new TaskService(new MemoryTaskRepository());

    expect(() => service.createTask(" \t ", "")).toThrow(
      "Title is required.",
    );
    expect(service.listTasks()).toEqual([]);
  });

  it("returns an independent task list", () => {
    const service = new TaskService(new MemoryTaskRepository());
    service.createTask("Read", "");

    const tasks = service.listTasks();
    tasks[0]!.title = "Changed outside service";

    expect(service.listTasks()[0]?.title).toBe("Read");
  });

  it("updates task details and rejects an empty replacement title", () => {
    const service = new TaskService(new MemoryTaskRepository());
    const original = service.createTask("Draft", "First");

    expect(service.updateTask(original.id, " Final ", "Second")).toMatchObject({
      title: "Final",
      description: "Second",
      completed: false,
    });
    expect(() => service.updateTask(original.id, "  ", "Invalid")).toThrow(
      "Title is required.",
    );
    expect(service.listTasks()[0]).toMatchObject({
      title: "Final",
      description: "Second",
    });
  });

  it("toggles completion status in both directions", () => {
    const service = new TaskService(new MemoryTaskRepository());
    const task = service.createTask("Read", "");

    expect(service.toggleCompletion(task.id).completed).toBe(true);
    expect(service.toggleCompletion(task.id).completed).toBe(false);
  });

  it("deletes a task without changing other tasks", () => {
    const service = new TaskService(new MemoryTaskRepository());
    const first = service.createTask("First", "");
    const second = service.createTask("Second", "");

    service.deleteTask(first.id);

    expect(service.listTasks()).toEqual([second]);
  });

  it("filters tasks by completion status", () => {
    const service = new TaskService(new MemoryTaskRepository());
    const pending = service.createTask("Pending task", "");
    const done = service.createTask("Done task", "");
    service.toggleCompletion(done.id);

    expect(service.listTasks("all")).toHaveLength(2);
    expect(service.listTasks("pending")).toEqual([pending]);
    expect(service.listTasks("done")).toHaveLength(1);
    expect(service.listTasks("done")[0]?.completed).toBe(true);
  });
});
