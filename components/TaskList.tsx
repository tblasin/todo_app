import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/Home.module.css';

type Task = {
  id: number;
  text: string;
};

type TaskListProps = {
  listName: string;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateContainerHeight: (height: number) => void; // Ajoutez une fonction pour mettre à jour la hauteur du conteneur
};

const TaskList: React.FC<TaskListProps> = ({ listName, tasks, setTasks, updateContainerHeight }) => {
  const taskContainerRef = useRef<HTMLDivElement | null>(null);
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>('');
  const MAX_TASKS = 15;

  useEffect(() => {
    // Calculer la hauteur totale des tâches rendues
    const totalTaskHeight = tasks.length * 50; // Hauteur estimée de chaque tâche (ajustez selon vos besoins)
    // Ajouter une marge supplémentaire pour l'espace entre les tâches
    const totalHeightWithMargin = totalTaskHeight + (tasks.length > 0 ? 20 : 0); // 20px de marge si des tâches sont présentes, ajustez selon vos besoins
    // Mettre à jour la hauteur du conteneur dans le composant parent
    updateContainerHeight(totalHeightWithMargin);
  }, [tasks, updateContainerHeight]);
  

  const saveTasksToLocalStorage = (updatedTasks: Task[]) => {
    localStorage.setItem(`tasks_${listName}`, JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (tasks.length >= 15) {
      alert('Vous ne pouvez pas ajouter plus de 15 tâches.');
      return;
    }
    if (newTaskText.trim() !== '') {
      const newTask: Task = {
        id: tasks.length + 1,
        text: newTaskText.trim(),
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setNewTaskText('');
    }
  };

  const editTask = (id: number, text: string) => {
    setEditingTaskId(id);
    setEditingTaskText(text);
  };

  const saveEditedTask = () => {
    const updatedTasks = tasks.map(task => {
      if (task.id === editingTaskId) {
        return { ...task, text: editingTaskText };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    const renumberedTasks = updatedTasks.map((task, index) => ({
      ...task,
      id: index + 1
    }));
    setTasks(renumberedTasks);
    saveTasksToLocalStorage(renumberedTasks);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className={styles.addTaskContainer} ref={taskContainerRef}>
      <input
        type="text"
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Entrez votre tâche ici..."
        style={{ marginRight: '10px', height: '25px', verticalAlign: 'middle' }}
      />
      <button onClick={addTask} className='addbutton' style={{ height: '25px', verticalAlign: 'middle' }}>
        <FontAwesomeIcon icon={faPlus} style={{ width: '20px', height: '15px' }} />
      </button>

      <ul className={styles.taskList}>
  {tasks.length >= MAX_TASKS && (
    <li className={styles.taskItem}>
      <span className={styles.errorMessage}>Vous avez atteint le nombre maximum de tâches.</span>
    </li>
  )}
  {tasks.map(task => (
    <li key={task.id} className={styles.taskItem} style={{ marginBottom: '10px' }}>
      {editingTaskId === task.id ? (
        <div style={{ marginTop: '5px' }}>
          <input
            type="text"
            value={editingTaskText}
            onChange={(e) => setEditingTaskText(e.target.value)}
          />
          <button onClick={saveEditedTask}>Enregistrer</button>
          <button onClick={() => setEditingTaskId(null)}>Annuler</button>
        </div>
      ) : (
        <>
          <span>{task.id}. {task.text}</span>

          <div className={styles.taskButtons}>
            <button onClick={() => editTask(task.id, task.text)}>
              <FontAwesomeIcon icon={faEdit} style={{ width: '20px', height: '15px' }} />
            </button>
            <button onClick={() => deleteTask(task.id)}>
              <FontAwesomeIcon icon={faTrash} style={{ width: '20px', height: '15px' }} />
            </button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>

    </div>
  );
};

export default TaskList;