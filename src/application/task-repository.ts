import type { Task } from "./task";

export interface TaskRepository {
  loadAll(): Task[];
  saveAll(tasks: readonly Task[]): void;
}
