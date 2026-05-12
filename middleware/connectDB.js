import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI); // Supprimez les options obsolètes
      console.log('Connecté à MongoDB');
    } catch (err) {
      console.error('Erreur de connexion à MongoDB:', err.message);
      throw new Error('Erreur de connexion à la base de données');
    }
  }
};

export default connectDB;