"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import styles from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Pour l'inscription
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Connexion
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (result.error) {
          alert("Erreur de connexion !");
        } else {
          alert("Connexion réussie !");
          // Redirection ou actions supplémentaires après la connexion réussie
        }
      } else {
        // Inscription
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, name: username }),
        });
        const data = await response.json();

        if (response.ok) {
          alert("Inscription réussie !");
          setIsLogin(true); // Basculer vers la connexion après inscription
        } else {
          alert(data.message || "Erreur lors de l'inscription !");
        }
      }
    } catch (error) {
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2 className={styles.authTitle}>
            {isLogin ? "Connexion" : "Inscription"}
          </h2>
          <p className={styles.authSubtitle}>
            {isLogin ? "Accédez à votre espace personnel" : "Créez votre compte"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Nom d&apos;utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Entrez votre email"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingText}>Chargement...</span>
            ) : (
              isLogin ? "Se connecter" : "S'inscrire"
            )}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className={styles.toggleButton}
          >
            {isLogin ? "Pas encore inscrit ? Crée un compte" : "Déjà inscrit ? Connecte-toi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
