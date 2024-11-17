// pages/api/visits.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('myAppDB');  // Assure-toi que le nom de la base de données correspond
  const collection = db.collection('visits');

  if (req.method === 'POST') {
    // Incrémenter le compteur de visites
    await collection.updateOne(
      { _id: 'visitCount' }, 
      { $inc: { count: 1 } }, 
      { upsert: true }
    );
    res.status(200).json({ message: 'Visite ajoutée' });
  } else if (req.method === 'GET') {
    // Récupérer le compteur de visites
    const visitDoc = await collection.findOne({ _id: 'visitCount' });
    res.status(200).json({ count: visitDoc ? visitDoc.count : 0 });
  } else {
    res.status(405).end(); // Méthode non autorisée
  }
}
