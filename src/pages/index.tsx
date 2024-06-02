import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Agenda from '../../components/Agenda';
import Image from 'next/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import TaskList from '../../components/TaskList'; // Assurez-vous que ce chemin est correct
import styles from '@/styles/Home.module.css'; // Assurez-vous que ce chemin est correct

// Définition du type Task
type Task = {
  id: number;
  text: string;
};

// Composant de flèche personnalisée pour le carrousel suivant
const SampleNextArrow: React.FC<any> = ({ onClick }) => (
  <div className={styles.nextArrow} onClick={onClick}>
    <FontAwesomeIcon icon={faChevronRight} />
  </div>
);

// Composant de flèche personnalisée pour le carrousel précédent
const SamplePrevArrow: React.FC<any> = ({ onClick }) => (
  <div className={styles.prevArrow} onClick={onClick}>
    <FontAwesomeIcon icon={faChevronLeft} />
  </div>
);

// Composant principal de l'application
const Home: React.FC = () => {
  const [activeList, setActiveList] = useState<number>(0); // État pour suivre la liste de tâches active
  const [taskLists, setTaskLists] = useState<Array<{ title: string, tasks: Task[] }>>([
    { title: '', tasks: [] },
    { title: '', tasks: [] },
    { title: '', tasks: [] },
  ]);
  const [backgroundImage, setBackgroundImage] = useState<string>('/images/backgrounds/boreal.png'); // Image de fond
  const [containerHeight, setContainerHeight] = useState<number>(4);

  // Effet pour charger les données depuis le stockage local au chargement de la page
  useEffect(() => {
    const storedTaskLists = localStorage.getItem('taskLists');
    if (storedTaskLists) {
      setTaskLists(JSON.parse(storedTaskLists));
    }
  }, []);

  // Effet pour sauvegarder les données dans le stockage local à chaque changement des listes de tâches
  useEffect(() => {
    localStorage.setItem('taskLists', JSON.stringify(taskLists));
  }, [taskLists]);

  // Mettre à jour la hauteur du conteneur
  const updateContainerHeight = () => {
    const activeTasks = taskLists[activeList].tasks.length;
    setContainerHeight(4 + activeTasks * 2.5);
  };

  // Mettre à jour la hauteur du conteneur quand la liste des tâches change
  useEffect(() => {
    updateContainerHeight();
  }, [taskLists, activeList]);

  // Fonction pour gérer le changement de liste de tâches active lorsqu'un titre est cliqué
  const handleListClick = (index: number) => {
    setActiveList(index); // Mettre à jour l'état activeList avec l'index de la liste de tâches cliquée
  };

  // Fonction pour mettre à jour le titre d'une liste de tâches
  const handleTitleChange = (index: number, newTitle: string) => {
    const updatedTaskLists = taskLists.map((list, i) => i === index ? { ...list, title: newTitle } : list);
    setTaskLists(updatedTaskLists);
  };

  // Fonction pour mettre à jour les tâches d'une liste de tâches
  const handleTasksChange = (index: number, tasks: Task[]) => {
    const updatedTaskLists = taskLists.map((list, i) => i === index ? { ...list, tasks } : list);
    setTaskLists(updatedTaskLists);

    updateContainerHeight();
  };

  // Fonction pour supprimer toutes les tâches de la liste active
  const deleteAllTasks = () => {
    const updatedTaskLists = taskLists.map((list, i) => i === activeList ? { ...list, tasks: [] } : list);
    setTaskLists(updatedTaskLists);

    updateContainerHeight();
  };

  // Configuration du carrousel
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    swipe: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Rendu du composant
  return (
    <>
      <Head>
        <title>Todo-List App</title>
        <meta name="description" content="Todo-List App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
        <h1 className={styles.title1}>DONE</h1>

        {/* Entrées pour le titre de chaque liste */}
        <div className={styles.buttons}>
          {taskLists.map((list, index) => (
            <div key={index} className={index === activeList ? styles.activeList : styles.clickableTitle} onClick={() => handleListClick(index)}>
              {/* Afficher le titre de la liste de tâches */}
              <input
                type="text"
                className={`${styles.titleInput} ${index === activeList ? styles.activeTitleInput : styles.inactiveTitleInput}`}
                value={list.title}
                placeholder={`Liste ${index + 1}`}
                onChange={(e) => handleTitleChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Conteneur de la liste de tâches active */}
        <div className={styles.taskListContainer} style={{ height: `${containerHeight}rem` }}>
          {/* Afficher la liste de tâches active en fonction de l'état activeList */}
          <TaskList
            listName={taskLists[activeList].title}
            tasks={taskLists[activeList].tasks}
            setTasks={(tasks) => handleTasksChange(activeList, tasks)}
            updateContainerHeight={updateContainerHeight}
          />
        </div>

        {/* Bouton pour supprimer toutes les tâches */}
        <div className={styles.deleteButtonContainer}>
          <button className={styles.deleteButton} onClick={deleteAllTasks}>
            <FontAwesomeIcon icon={faTrash} className={styles.deleteIcon} />
          </button>
        </div>
        <h1 className={styles.title2}>AGENDA</h1>
        <Agenda />

        {/* Footer */}
        <footer style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', marginTop: '250px', color: 'white', fontSize: 'x-small' }}>
          {/* Lien vers le site web */}
          <a href="http://www.creativenumerik.com" target="_blank" rel="noopener noreferrer">
            <Image className="logo" src="/images/CreativeNumerik.png" alt="Logo de Creative Numerik" width={80} height={80} />
          </a><br />
          {/* Lien vers le site web avec le texte d'ancre */}
          <a href="http://www.creativenumerik.com" target="_blank" rel="noopener noreferrer" className={styles.blackLink} >
            www.creativenumerik.com
          </a><br />

          {/* Carrousel d'options de fond d'écran */}
          <div className={styles.carousel}>
            <Slider {...settings}>
              {['/images/backgrounds/boreal.png', '/images/backgrounds/clouds.jpeg', '/images/backgrounds/desert.jpeg', '/images/backgrounds/underwater.jpeg', '/images/backgrounds/moon.webp', '/images/backgrounds/morocco.jpg', '/images/backgrounds/tropical.jpg', '/images/backgrounds/butterfly.jpeg'].map((bg, index) => (
                <div key={index} className={styles.backgroundOptionContainer}>
                  <div
                    className={styles.backgroundOption}
                    style={{ backgroundImage: `url(${bg})` }}
                    onClick={() => setBackgroundImage(bg)}
                  ></div>
                </div>
              ))}
            </Slider>
          </div>
        </footer>
      </main>
    </>
  );
}

export default Home;
