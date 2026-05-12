export type Priority = "low" | "medium" | "high" | null;

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
};

export type TaskList = {
  id: string;
  title: string;
  tasks: Task[];
  /** Si absent ou null : utilise le fond par défaut de l’app (localStorage). */
  backgroundImage?: string | null;
};
