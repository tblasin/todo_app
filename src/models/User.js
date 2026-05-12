import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Champ requis
  },
  username: {
    type: String,
    required: true, // Champ requis
  },
  email: {
    type: String,
    required: true,
    unique: true, // L'email doit être unique
  },
  password: {
    type: String,
    required: true, // Champ requis pour le mot de passe
  },
  createdAt: {
    type: Date,
    default: Date.now, // Date de création par défaut
  },
});

// Vérifie si le modèle existe déjà, sinon le crée
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
