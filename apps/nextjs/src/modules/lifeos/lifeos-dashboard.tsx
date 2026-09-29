"use client";

import { useMemo, useState } from "react";
import type { LifePriority } from "@5am/lifeos-core";
import { useLifeOsStore } from "./lifeos-store";
import classes from "./lifeos.module.css";

function isoToday() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function LifeOsToday() {
  const today = isoToday();
  const { state, addTask, toggleTask, deleteTask, metrics } = useLifeOsStore(today);
  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState("");
  const [priority, setPriority] = useState<LifePriority>("normal");

  const tasks = useMemo(() => state.tasks.filter((task) => task.status === "open" && (task.dueDate === today || task.dueDate === null)), [state.tasks, today]);
  const completed = useMemo(() => state.tasks.filter((task) => task.status === "done" && task.completedAt?.slice(0, 10) === today), [state.tasks, today]);

  function submit() {
    addTask({ title, goalId: goalId || null, priority, dueDate: today });
    setTitle("");
  }

  return (
    <div className={classes.lifeGrid}>
      <section className={classes.primaryPanel}>
        <div className={classes.panelHeading}>
          <div><span className={classes.kicker}>TODAY</span><h2>Your day starts here.</h2></div>
          <span className={classes.dateChip}>{today}</span>
        </div>

        <div className={classes.quickAdd}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} placeholder="Add today's task…" aria-label="Task title" />
          <select value={goalId} onChange={(e) => setGoalId(e.target.value)} aria-label="Goal">
            <option value="">No goal</option>
            {state.goals.filter((goal) => goal.status === "active").map((goal) => <option key={goal.id} value={goal.id}>{goal.title}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value as LifePriority)} aria-label="Priority">
            <option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option>
          </select>
          <button type="button" onClick={submit}>ADD</button>
        </div>

        <div className={classes.taskList}>
          {tasks.length === 0 ? <div className={classes.emptyState}>No open tasks for today. Add the first one above.</div> : tasks.map((task) => {
            const goal = state.goals.find((item) => item.id === task.goalId);
            return (
              <article className={classes.taskRow} key={task.id} data-priority={task.priority}>
                <button type="button" className={classes.checkButton} onClick={() => toggleTask(task.id)} aria-label={`Complete ${task.title}`}>○</button>
                <div className={classes.taskCopy}><strong>{task.title}</strong><small>{goal?.title ?? "Standalone task"} · {task.priority.toUpperCase()}</small></div>
                <button type="button" className={classes.deleteButton} onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>×</button>
              </article>
            );
          })}
        </div>
      </section>

      <aside className={classes.sideColumn}>
        <section className={classes.metricPanel}>
          <span>OPEN TODAY</span><strong>{metrics.openToday}</strong>
        </section>
        <section className={classes.metricPanel}>
          <span>COMPLETED</span><strong>{metrics.completedToday}</strong>
        </section>
        <section className={classes.metricPanel}>
          <span>ACTIVE GOALS</span><strong>{metrics.activeGoals}</strong>
        </section>
        <section className={classes.completedPanel}>
          <div className={classes.panelMiniTitle}>DONE TODAY</div>
          {completed.length === 0 ? <p>Nothing completed yet.</p> : completed.slice(0, 6).map((task) => <button key={task.id} type="button" onClick={() => toggleTask(task.id)}>✓ {task.title}</button>)}
        </section>
      </aside>
    </div>
  );
}

export function LifeOsGoals() {
  const today = isoToday();
  const { state, addGoal, addTask, toggleTask, deleteTask, deleteGoal, goalProgress } = useLifeOsStore(today);
  const [goalTitle, setGoalTitle] = useState("");
  const [taskDrafts, setTaskDrafts] = useState<Record<string, string>>({});

  function createGoal() {
    addGoal(goalTitle);
    setGoalTitle("");
  }

  return (
    <section className={classes.goalsSurface}>
      <div className={classes.panelHeading}>
        <div><span className={classes.kicker}>GOALS</span><h2>Turn direction into action.</h2></div>
        <div className={classes.goalAdd}><input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") createGoal(); }} placeholder="New goal…" /><button type="button" onClick={createGoal}>ADD GOAL</button></div>
      </div>

      <div className={classes.goalGrid}>
        {state.goals.length === 0 ? <div className={classes.emptyState}>No goals yet. Create one and attach tasks to it.</div> : state.goals.map((goal) => {
          const tasks = state.tasks.filter((task) => task.goalId === goal.id);
          const progress = goalProgress(goal.id);
          return (
            <article className={classes.goalCard} key={goal.id}>
              <div className={classes.goalTop}><div><span>ACTIVE GOAL</span><h3>{goal.title}</h3></div><button type="button" onClick={() => deleteGoal(goal.id)} aria-label={`Delete ${goal.title}`}>×</button></div>
              <div className={classes.progressTrack}><i style={{ width: `${progress}%` }} /></div>
              <div className={classes.progressMeta}><span>{progress}% complete</span><span>{tasks.filter((task) => task.status === "done").length}/{tasks.length} tasks</span></div>
              <div className={classes.goalTasks}>
                {tasks.map((task) => <div key={task.id} className={classes.goalTask} data-done={task.status === "done"}><button type="button" onClick={() => toggleTask(task.id)}>{task.status === "done" ? "✓" : "○"}</button><span>{task.title}</span><button type="button" onClick={() => deleteTask(task.id)}>×</button></div>)}
              </div>
              <div className={classes.inlineTaskAdd}>
                <input value={taskDrafts[goal.id] ?? ""} onChange={(e) => setTaskDrafts((current) => ({ ...current, [goal.id]: e.target.value }))} placeholder="Add task to this goal…" />
                <button type="button" onClick={() => { const value = taskDrafts[goal.id] ?? ""; addTask({ title: value, goalId: goal.id, dueDate: null }); setTaskDrafts((current) => ({ ...current, [goal.id]: "" })); }}>+</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
