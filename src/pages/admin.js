import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { resetDatabase } from '../utils/resetDatabase';
import './AdminPage.css';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const handleResetDatabase = async () => {
    try {
      await resetDatabase();
      alert('Base de données réinitialisée.');
    } catch (error) {
      alert(
        'Erreur lors de la réinitialisation : ' +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  if (status === 'loading') {
    return (
      <div className="admin-login">
        <p>Chargement…</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="admin-panel">
      <h1>Panneau d&apos;administration</h1>
      <p>
        Connecté : {session?.user?.name || session?.user?.email || '—'}
      </p>
      <button type="button" onClick={handleResetDatabase}>
        Réinitialiser la base de données
      </button>
    </div>
  );
}
