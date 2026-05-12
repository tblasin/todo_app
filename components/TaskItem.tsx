import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPen,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { Priority, Task } from "@/types/task";
import styles from "@/styles/Home.module.css";

type Props = {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
};

const PRIORITIES: { value: Exclude<Priority, null>; label: string }[] = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
];

export default function TaskItem({
  task,
  index,
  onToggle,
  onDelete,
  onEdit,
  onPriorityChange,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const priorityWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!priorityOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        priorityWrapRef.current &&
        !priorityWrapRef.current.contains(e.target as Node)
      ) {
        setPriorityOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [priorityOpen]);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(task.id, trimmed);
    } else {
      setDraft(task.text);
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(task.text);
    setEditing(false);
  };

  const priorityClass = task.priority
    ? styles[`priority_${task.priority}`]
    : styles.priority_none;

  return (
    <li
      className={`${styles.taskItem} ${task.completed ? styles.taskItemDone : ""}`}
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
    >
      <button
        type="button"
        className={`${styles.checkbox} ${task.completed ? styles.checkboxChecked : ""}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Marquer comme à faire" : "Marquer comme terminé"}
      >
        {task.completed && <FontAwesomeIcon icon={faCheck} />}
      </button>

      <div className={styles.taskBody}>
        {editing ? (
          <input
            ref={inputRef}
            className={styles.taskEditInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              else if (e.key === "Escape") cancelEdit();
            }}
          />
        ) : (
          <span
            className={styles.taskText}
            onDoubleClick={() => setEditing(true)}
          >
            {task.text}
          </span>
        )}
      </div>

      <div className={styles.taskActions}>
        <div className={styles.priorityWrap} ref={priorityWrapRef}>
          <button
            type="button"
            className={`${styles.priorityDot} ${priorityClass}`}
            onClick={() => setPriorityOpen((v) => !v)}
            aria-label="Changer la priorité"
            title="Priorité"
          />
          {priorityOpen && (
            <div className={styles.priorityMenu} role="menu">
              <button
                type="button"
                className={styles.priorityMenuItem}
                onClick={() => {
                  onPriorityChange(task.id, null);
                  setPriorityOpen(false);
                }}
              >
                <span className={`${styles.priorityDot} ${styles.priority_none}`} />
                Aucune
              </button>
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p.value}
                  className={styles.priorityMenuItem}
                  onClick={() => {
                    onPriorityChange(task.id, p.value);
                    setPriorityOpen(false);
                  }}
                >
                  <span
                    className={`${styles.priorityDot} ${styles[`priority_${p.value}`]}`}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {editing ? (
          <>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={commitEdit}
              aria-label="Valider"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={cancelEdit}
              aria-label="Annuler"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setEditing(true)}
              aria-label="Modifier"
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              onClick={() => onDelete(task.id)}
              aria-label="Supprimer"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
