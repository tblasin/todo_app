import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


// Définition du type pour une tâche
type Task = {
  id: number;
  text: string;
};

export default function Home() {
  // Déclaration d'un état pour les tâches
  const [tasks, setTasks] = useState<Task[]>([]);
  // Déclaration d'un état pour le texte de la nouvelle tâche
  const [newTaskText, setNewTaskText] = useState<string>('');
  // Déclaration d'un état pour l'ID de la tâche en cours de modification
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  // Déclaration d'un état pour le texte de la tâche en cours de modification
  const [editingTaskText, setEditingTaskText] = useState<string>('');

  // Compteur utilisateurs
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    setVisitCount(visitCount + 1);
  }, []);

  // Fonction pour ajouter une nouvelle tâche
  const addTask = () => {
    if (newTaskText.trim() !== '' && tasks.length < 16) {
      const newTask: Task = {
        id: tasks.length + 1,
        text: newTaskText.trim(),
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  // Fonction pour modifier le texte de la nouvelle tâche
  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskText(e.target.value);
  };

  // Fonction pour activer le mode d'édition de la tâche
  const editTask = (id: number, text: string) => {
    setEditingTaskId(id);
    setEditingTaskText(text);
  };

  // Fonction pour sauvegarder les modifications de la tâche
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

  // Fonction pour annuler l'édition de la tâche
  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  // Fonction pour supprimer une tâche
  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  // Fonction pour supprimer toutes les tâches
  const deleteAllTasks = () => {
    setTasks([]);
  };

  // Fonction pour gérer les pressions de touche dans l'input
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
        {/* Titre TODO LIST */}
        <h1 className={styles.title}>TO DO LIST</h1>
        {/* Barre de création de nouvelle tâche */}
        <div className={`${styles.centerContent} task-form-container`}>
          <input 
            type="text" 
            value={newTaskText} 
            onChange={handleNewTaskChange}
            onKeyDown={handleKeyDown} // Gestionnaire d'événements pour les pressions de touche 
            placeholder="Entrez votre tâche ici..." />
          <button onClick={addTask}>
            <FontAwesomeIcon icon={faPlus}style={{ width: '10px', height: '10px' }} />
          </button>
           
       {/* Liste des tâches */}
<ul style={{ listStyleType: 'none', padding: 0 }}>
  {tasks.map((task, index) => (
    <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Numéro de la tâche */}
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
            {/* Bouton de modification */}
            <button onClick={() => editTask(task.id, task.text)}>
              <FontAwesomeIcon icon={faEdit} style={{ width: '10px', height: '10px' }} viewBox="0 0 448 512" />
            </button>
            {/* Bouton de suppression */}
            <button onClick={() => deleteTask(task.id)}>
              <FontAwesomeIcon icon={faTrash} style={{ width: '10px', height: '10px' }} viewBox="0 0 448 512" />
            </button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>

        </div><br />
        {/* Bouton pour supprimer toutes les tâches */}
  <button onClick={deleteAllTasks}>Delete all</button>
        <footer style={{ textAlign: 'center', marginTop: '60px', color: 'white' }}>
          <a href="http://www.creativenumerik.com" target="_blank" rel="noopener noreferrer">
            <Image className="logo" src="/images/CreativeNumerik.png" alt="Logo de Creative Numerik" width={100} height={100} />
          </a>
          <p>Visitez notre site web :</p>
          <a href="http://www.creativenumerik.com" target="_blank" rel="noopener noreferrer">
            www.creativenumerik.com
          </a><br />
          <p>Users : {visitCount}</p>
        </footer>
      </main>
    </>
  );
}


