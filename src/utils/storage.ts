import type { Task, TaskList } from "@/types/task";

const STORAGE_KEY = "todoApp:lists";
const LEGACY_KEY = "taskLists";

export function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeEmptyList(title = ""): TaskList {
  return { id: uid(), title, tasks: [] };
}

export function defaultLists(): TaskList[] {
  return [makeEmptyList(""), makeEmptyList(""), makeEmptyList("")];
}

type LegacyTask = { id: number; text: string };
type LegacyList = { title: string; tasks: LegacyTask[] };

function migrateLegacy(legacy: LegacyList[]): TaskList[] {
  return legacy.map((l) => ({
    id: uid(),
    title: l.title ?? "",
    tasks: (l.tasks ?? []).map((t) => ({
      id: uid(),
      text: t.text,
      completed: false,
      priority: null,
      createdAt: Date.now(),
    })),
  }));
}

function isNewShape(value: unknown): value is TaskList[] {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return true;
  const first = value[0] as Partial<TaskList>;
  return (
    typeof first.id === "string" &&
    Array.isArray(first.tasks) &&
    (first.tasks.length === 0 ||
      typeof (first.tasks[0] as Partial<Task>).completed === "boolean")
  );
}

export function loadLists(): TaskList[] {
  if (typeof window === "undefined") return defaultLists();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isNewShape(parsed)) return parsed;
    }
    const legacyRaw = window.localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as LegacyList[];
      const migrated = migrateLegacy(legacy);
      saveLists(migrated);
      return migrated;
    }
  } catch (err) {
    console.warn("loadLists: parsing failed, using defaults", err);
  }
  return defaultLists();
}

export function saveLists(lists: TaskList[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (err) {
    console.warn("saveLists failed", err);
  }
}

export function createTask(text: string): Task {
  return {
    id: uid(),
    text: text.trim(),
    completed: false,
    priority: null,
    createdAt: Date.now(),
  };
}

export function createList(title = ""): TaskList {
  return makeEmptyList(title);
}
