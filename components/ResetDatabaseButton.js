'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ResetDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleReset = async () => {
    const confirmReset = window.confirm(
      'Voulez-vous vraiment réinitialiser la base de données ?'
    );

    if (!confirmReset) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/reset-database', { 
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Échec de la réinitialisation');
      }

      const result = await response.json();
      
      alert(`Base de données réinitialisée. 
        Utilisateur créé : test@example.com`);
      
      router.push('/login');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      alert('Erreur de réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleReset} 
        disabled={isLoading}
        className="bg-red-500 text-white p-2 rounded"
      >
        {isLoading ? 'Réinitialisation...' : 'Reset Database'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}