// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// Initialiser le client et la promesse si nécessaire
if (!client) {
  client = new MongoClient(uri, options);
  clientPromise = client.connect(); // Assigner la promesse ici
} else {
  clientPromise = Promise.resolve(client); // Renvoie la promesse résolue si le client existe déjà
}

export default clientPromise;
