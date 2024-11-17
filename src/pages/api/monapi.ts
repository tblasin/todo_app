import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb'; // Importer la connexion MongoDB

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise; // Connexion à MongoDB
    const db = client.db(); // Accéder à la base de données

    const usersCollection = db.collection('users'); // Collection 'users'
    const users = await usersCollection.find({}).toArray(); // Lire tous les documents de la collection

    res.status(200).json(users); // Retourner les utilisateurs en format JSON
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    res.status(500).json({ error: 'Échec de la connexion à la base de données' });
  }
}
