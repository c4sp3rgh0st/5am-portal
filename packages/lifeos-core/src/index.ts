export type LifeGoalStatus = "active" | "completed";
export type LifeTaskStatus = "open" | "done";
export type LifePriority = "high" | "normal" | "low";

export interface LifeGoal {
  id: string;
  title: string;
  status: LifeGoalStatus;
  createdAt: string;
}

export interface LifeTask {
  id: string;
  title: string;
  goalId: string | null;
  status: LifeTaskStatus;
  priority: LifePriority;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface LifeOsState {
  version: 1;
  goals: LifeGoal[];
  tasks: LifeTask[];
}

export const emptyLifeOsState = (): LifeOsState => ({ version: 1, goals: [], tasks: [] });

export function goalProgress(goalId: string, tasks: LifeTask[]) {
  const goalTasks = tasks.filter((task) => task.goalId === goalId);
  if (goalTasks.length === 0) return 0;
  return Math.round((goalTasks.filter((task) => task.status === "done").length / goalTasks.length) * 100);
}

export function todayTasks(tasks: LifeTask[], today: string) {
  return tasks.filter((task) => task.status === "open" && (task.dueDate === today || task.dueDate === null));
}

export function completedToday(tasks: LifeTask[], today: string) {
  return tasks.filter((task) => task.status === "done" && task.completedAt?.slice(0, 10) === today);
}
