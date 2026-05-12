import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { Priority, Task } from "@/types/task";
import { createTask } from "@/utils/storage";
import TaskItem from "./TaskItem";
import styles from "@/styles/Home.module.css";

type Props = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

const MAX_TASKS = 30;

export default function TaskList({ tasks, setTasks }: Props) {
  const [newTaskText, setNewTaskText] = useState("");

  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;
    if (tasks.length >= MAX_TASKS) return;
    setTasks([...tasks, createTask(text)]);
    setNewTaskText("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const editTask = (id: string, text: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const setPriority = (id: string, priority: Priority) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, priority } : t)));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  const reachedMax = tasks.length >= MAX_TASKS;
  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className={styles.taskListWrap}>
      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            reachedMax ? "Limite atteinte" : "Nouvelle tâche…"
          }
          disabled={reachedMax}
        />
        <button
          type="button"
          onClick={addTask}
          className={styles.addBtn}
          disabled={reachedMax || !newTaskText.trim()}
          aria-label="Ajouter la tâche"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className={styles.emptyState}>
          Aucune tâche. Ajoute-en une ci-dessus.
        </p>
      ) : (
        <ul className={styles.taskUl}>
          {tasks.map((task, i) => (
            <TaskItem
              key={task.id}
              task={task}
              index={i}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
              onPriorityChange={setPriority}
            />
          ))}
        </ul>
      )}

      {tasks.length > 0 && (
        <div className={styles.taskMeta}>
          {remaining} sur {tasks.length} restante{remaining > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
