"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  completedToday,
  emptyLifeOsState,
  goalProgress,
  todayTasks,
  type LifeGoal,
  type LifeOsState,
  type LifePriority,
  type LifeTask,
} from "@5am/lifeos-core";

const STORAGE_KEY = "5am-lifeos-v1";

function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadState(): LifeOsState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyLifeOsState();
    const parsed = JSON.parse(raw) as LifeOsState;
    return parsed.version === 1 ? parsed : emptyLifeOsState();
  } catch {
    return emptyLifeOsState();
  }
}

export function useLifeOsStore(today: string) {
  const [state, setState] = useState<LifeOsState>(() => emptyLifeOsState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const addGoal = useCallback((title: string) => {
    const clean = title.trim();
    if (!clean) return;
    const goal: LifeGoal = { id: id("goal"), title: clean, status: "active", createdAt: new Date().toISOString() };
    setState((current) => ({ ...current, goals: [goal, ...current.goals] }));
  }, []);

  const addTask = useCallback((input: { title: string; goalId?: string | null; priority?: LifePriority; dueDate?: string | null }) => {
    const clean = input.title.trim();
    if (!clean) return;
    const task: LifeTask = {
      id: id("task"),
      title: clean,
      goalId: input.goalId ?? null,
      status: "open",
      priority: input.priority ?? "normal",
      dueDate: input.dueDate ?? today,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setState((current) => ({ ...current, tasks: [task, ...current.tasks] }));
  }, [today]);

  const toggleTask = useCallback((taskId: string) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === taskId
        ? { ...task, status: task.status === "done" ? "open" : "done", completedAt: task.status === "done" ? null : new Date().toISOString() }
        : task),
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setState((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== taskId) }));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setState((current) => ({
      ...current,
      goals: current.goals.filter((goal) => goal.id !== goalId),
      tasks: current.tasks.map((task) => task.goalId === goalId ? { ...task, goalId: null } : task),
    }));
  }, []);

  const metrics = useMemo(() => ({
    openToday: todayTasks(state.tasks, today).length,
    completedToday: completedToday(state.tasks, today).length,
    activeGoals: state.goals.filter((goal) => goal.status === "active").length,
  }), [state, today]);

  return { state, hydrated, addGoal, addTask, toggleTask, deleteTask, deleteGoal, metrics, goalProgress: (goalId: string) => goalProgress(goalId, state.tasks) };
}
