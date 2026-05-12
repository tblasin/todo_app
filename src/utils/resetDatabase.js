export async function resetDatabase() {
    const response = await fetch('/api/reset-database', {
      method: 'POST'
    });
  
    if (!response.ok) {
      throw new Error('Réinitialisation impossible');
    }
  
    return response.json();
  }