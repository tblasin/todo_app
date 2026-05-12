import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import TaskList from "../../components/TaskList";
import type { Task, TaskList as TaskListType } from "@/types/task";
import {
  createList,
  defaultLists,
  loadLists,
  saveLists,
} from "@/utils/storage";
import styles from "@/styles/Home.module.css";

const BACKGROUNDS = [
  "/images/backgrounds/morocco.jpg",
  "/images/backgrounds/boreale.jpeg",
  "/images/backgrounds/clouds.jpeg",
  "/images/backgrounds/desert.jpeg",
  "/images/backgrounds/underwater.jpeg",
  "/images/backgrounds/butterfly.jpeg",
  "/images/backgrounds/moon.webp",
];

const BACKGROUND_KEY = "todoApp:background";

function sanitizeLists(raw: TaskListType[]): TaskListType[] {
  return raw.map((l) => {
    const bg = l.backgroundImage;
    if (bg != null && bg !== "" && BACKGROUNDS.includes(bg)) {
      return { ...l, backgroundImage: bg };
    }
    const { backgroundImage: _removed, ...rest } = l;
    return rest as TaskListType;
  });
}

const Home: React.FC = () => {
  const [lists, setLists] = useState<TaskListType[]>(() => defaultLists());
  const [activeId, setActiveId] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);
  const [defaultBackground, setDefaultBackground] = useState<string>(BACKGROUNDS[0]);
  const [bgPanelOpen, setBgPanelOpen] = useState(false);

  useEffect(() => {
    const loaded = loadLists();
    const base = loaded.length > 0 ? loaded : defaultLists();
    const safe = sanitizeLists(base);
    setLists(safe);
    setActiveId(safe[0].id);
    const storedBg = window.localStorage.getItem(BACKGROUND_KEY);
    if (storedBg && BACKGROUNDS.includes(storedBg)) {
      setDefaultBackground(storedBg);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveLists(lists);
  }, [lists, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(BACKGROUND_KEY, defaultBackground);
  }, [defaultBackground, hydrated]);

  const activeList = useMemo(
    () => lists.find((l) => l.id === activeId) ?? lists[0],
    [lists, activeId]
  );

  const effectiveBackground = useMemo(() => {
    const override = activeList?.backgroundImage;
    if (override && BACKGROUNDS.includes(override)) return override;
    return defaultBackground;
  }, [activeList, defaultBackground]);

  const setBackgroundForActiveList = (bg: string) => {
    if (!BACKGROUNDS.includes(bg)) return;
    setLists((prev) =>
      prev.map((l) => {
        if (l.id !== activeId) return l;
        if (bg === defaultBackground) {
          const { backgroundImage: _r, ...rest } = l;
          return rest as TaskListType;
        }
        return { ...l, backgroundImage: bg };
      })
    );
  };

  const updateActiveTitle = (title: string) => {
    setLists((prev) =>
      prev.map((l) => (l.id === activeId ? { ...l, title } : l))
    );
  };

  const updateActiveTasks = (tasks: Task[]) => {
    setLists((prev) =>
      prev.map((l) => (l.id === activeId ? { ...l, tasks } : l))
    );
  };

  const addList = () => {
    const newList = createList("");
    setLists((prev) => [...prev, newList]);
    setActiveId(newList.id);
  };

  const removeList = (id: string) => {
    setLists((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((l) => l.id !== id);
      if (id === activeId) {
        setActiveId(next[0].id);
      }
      return next;
    });
  };

  const clearActiveTasks = () => {
    if (!activeList || activeList.tasks.length === 0) return;
    setLists((prev) =>
      prev.map((l) => (l.id === activeId ? { ...l, tasks: [] } : l))
    );
  };

  if (!activeList) return null;

  return (
    <>
      <Head>
        <title>DONE — Todo App</title>
        <meta name="description" content="Application de gestion de tâches DONE" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageRoot}>
        <div
          className={styles.bgLayer}
          style={{ backgroundImage: `url(${effectiveBackground})` }}
          aria-hidden
        />
        <div className={styles.bgOverlay} aria-hidden />

        <main className={styles.main}>
        <div className={styles.headerBar}>
          <header className={styles.header}>
            <div className={styles.brand}>
              <span className={styles.brandTitle}>DONE</span>
              <span className={styles.brandTagline}>Getting Things Done</span>
            </div>
          </header>
          <button
            type="button"
            className={styles.headerBtn}
            onClick={() => setBgPanelOpen((v) => !v)}
            aria-label="Personnaliser le fond"
          >
            <Image
              src="/images/camera-icon.png"
              alt=""
              width={20}
              height={20}
              className={styles.headerBtnImg}
            />
          </button>
        </div>

        {bgPanelOpen && (
          <section className={styles.bgPanel} role="dialog" aria-label="Choix du fond">
            <header className={styles.bgPanelHeader}>
              <div className={styles.bgPanelTitleBlock}>
                <span>Fond d’écran</span>
                <span className={styles.bgPanelHint}>
                  Vous pouvez appliquer une image différente par liste.
                </span>
              </div>
              <button
                type="button"
                className={`${styles.iconBtn} ${styles.bgPanelClose}`}
                onClick={() => setBgPanelOpen(false)}
                aria-label="Fermer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </header>
            <div className={styles.bgGrid}>
              {BACKGROUNDS.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  className={`${styles.bgThumb} ${
                    bg === effectiveBackground ? styles.bgThumbActive : ""
                  }`}
                  style={{ backgroundImage: `url(${bg})` }}
                  onClick={() => setBackgroundForActiveList(bg)}
                  aria-label={`Appliquer le fond ${bg.split("/").pop()} à cette liste`}
                />
              ))}
            </div>
          </section>
        )}

        <section className={styles.tabs} aria-label="Mes listes">
          <div className={styles.tabsRow}>
            {lists.map((list, i) => {
              const isActive = list.id === activeId;
              return (
                <div
                  key={list.id}
                  className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                  onClick={() => setActiveId(list.id)}
                >
                  <input
                    type="text"
                    className={styles.tabInput}
                    value={list.title}
                    placeholder={`Liste ${i + 1}`}
                    onFocus={() => setActiveId(list.id)}
                    onChange={(e) => {
                      if (isActive) updateActiveTitle(e.target.value);
                      else
                        setLists((prev) =>
                          prev.map((l) =>
                            l.id === list.id ? { ...l, title: e.target.value } : l
                          )
                        );
                    }}
                  />
                  {lists.length > 1 && (
                    <button
                      type="button"
                      className={styles.tabClose}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeList(list.id);
                      }}
                      aria-label="Supprimer la liste"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              className={styles.tabAdd}
              onClick={addList}
              aria-label="Nouvelle liste"
              title="Nouvelle liste"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <TaskList
            key={activeId}
            tasks={activeList.tasks}
            setTasks={updateActiveTasks}
          />
        </section>

        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.dangerBtn}
            onClick={clearActiveTasks}
            disabled={activeList.tasks.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} />
            Vider la liste
          </button>
        </div>

        <footer className={styles.footer}>
          <a
            href="http://www.creativenumerik.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <Image
              src="/images/CreativeNumerik.png"
              alt="Logo Creative Numerik"
              width={64}
              height={64}
            />
            <span>www.creativenumerik.com</span>
          </a>
        </footer>
        </main>
      </div>
    </>
  );
};

export default Home;
