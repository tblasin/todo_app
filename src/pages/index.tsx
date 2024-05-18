import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

type Task = {
  id: number;
  text: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>('');
  const [formContainerHeight, setFormContainerHeight] = useState<string>('4rem');
  const [taskLimitReached, setTaskLimitReached] = useState<boolean>(false);

  const addTask = () => {
    if (newTaskText.trim() !== '' && tasks.length < 15) {
      const newTask: Task = {
        id: tasks.length + 1,
        text: newTaskText.trim(),
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTaskText('');
      const newHeight = `${4 + updatedTasks.length * 2}rem`;
      if (updatedTasks.length === 15) {
        // Ajouter une ligne supplémentaire si le nombre maximum de tâches est atteint
        setFormContainerHeight(`${parseFloat(newHeight) + 2}rem`);
        setTaskLimitReached(true);
      } else {
        setFormContainerHeight(newHeight);
      }
    }
  };

  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskText(e.target.value);
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
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    const newHeight = `${4 + updatedTasks.length * 2}rem`;
    // Réduire la hauteur si le nombre de tâches est inférieur à 15
    if (updatedTasks.length < 15) {
      setFormContainerHeight(newHeight);
      setTaskLimitReached(false);
    } else {
      // Garder la hauteur inchangée si le nombre maximum de tâches est atteint
      setFormContainerHeight(`${parseFloat(newHeight) + 2}rem`);
    }
  };

  const deleteAllTasks = () => {
    setTasks([]);
    setFormContainerHeight('4rem');
    setTaskLimitReached(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <>
      <Head>
        <title>Todo-List App</title>
        <meta name="description" content="Todo-List App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>TO DO LIST</h1>
        <div className={`${styles.centerContent} task-form-container`} style={{ height: formContainerHeight }}>
          <input
            type="text"
            value={newTaskText}
            onChange={handleNewTaskChange}
            onKeyDown={handleKeyDown}
            placeholder="Entrez votre tâche ici..."
            style={{ marginRight: '10px', height: '25px', verticalAlign: 'middle' }}
          />
          <button onClick={addTask} style={{ height: '25px', verticalAlign: 'middle' }}>
            <FontAwesomeIcon icon={faPlus} style={{ width: '20px', height: '15px' }} />
          </button>
          {taskLimitReached && <p style={{ color: 'red', marginTop: '10px' }}>Vous avez atteint le nombre maximum de tâches.</p>}
          
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px' }}>
            {tasks.map((task, index) => (
              <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ marginRight: '8px' }}>{index + 1}</span>
                {editingTaskId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTaskText}
                      onChange={(e) => setEditingTaskText(e.target.value)}
                      style={{
                        width: '80%',
                        display: 'block',
                        margin: '0 auto',
                        textAlign: 'center',
                        maxWidth: '100%',
                      }}
                    />
                    <button onClick={saveEditedTask}>Enregistrer</button>
                    <button onClick={cancelEditTask}>Annuler</button>
                  </>
                ) : (
                  <>
                    <span>{task.text}</span>
                    <div>
                      <button onClick={() => editTask(task.id, task.text)} style={{ marginRight: '10px' }}>
                        <FontAwesomeIcon icon={faEdit} style={{ width: '20px', height: '15px' }} viewBox="0 0 448 512" />
                      </button>
                      <button onClick={() => deleteTask(task.id)}>
                        <FontAwesomeIcon icon={faTrash} style={{ width: '20px', height: '15px' }} viewBox="0 0 448 512" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <br />
        <button onClick={deleteAllTasks}>
          <FontAwesomeIcon icon={faTrash} style={{ width: '28px', height: '25px' }} viewBox="0 0 448 512" />
        </button>
        <footer style={{ textAlign: 'center', marginTop: '60px', color: 'white', fontSize: 'x-small' }}>
          <a href="http://www.creativenumerik.com" target="_blank" rel="noopener noreferrer">
            <Image className="logo" src="/images/CreativeNumerik.png" alt="Logo de Creative Numerik" width={100} height={100} />
          </a>
          <p>Visitez notre site web :</p>
          <a href="http://www.creativenumerik.com" target="_blank" rel="noopener noreferrer">
            www.creativenumerik.com
          </a><br />
        
        </footer>
        <div className="compteurcontainer">
                        <div className="compteur"><a href="http://www.mon-compteur.fr">
                           <Image 
                              src="http://www.mon-compteur.fr/html_c02genv2-77655-1"
                              width='80'
                              height='18'
                              border="0"
                              alt="compteur visiteurs"/></a>
            </div>
          </div>
      </main>
    </>
  );
}
