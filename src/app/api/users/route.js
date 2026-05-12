import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database"; // Vérifie que le chemin est correct
import User from "@/models/User"; // Vérifie également ce chemin
import bcrypt from 'bcryptjs';


// GET - Récupérer tous les utilisateurs
export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password");
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error); // Ajoute une console pour le débogage
    return NextResponse.json(
      { message: "Erreur lors de la récupération des utilisateurs", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Ajouter un nouvel utilisateur
export async function POST(req) {
  try {
    await connectDB(); // Connexion à la base de données
    const body = await req.json(); // Récupération du corps de la requête

    // Vérification des données reçues
    if (!body.username || !body.name || !body.email || !body.password) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ message: "Un utilisateur avec cet email existe déjà" }, { status: 409 });
    }

    // Hachage du mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = new User({
      username: body.username,
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });

    await newUser.save();
    const userObj = newUser.toObject();
    delete userObj.password;
    return NextResponse.json(
      { message: "Utilisateur créé", user: userObj },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error); // Ajoute une console pour le débogage
    return NextResponse.json(
      { message: "Erreur lors de la création de l'utilisateur", error: error.message },
      { status: 500 }
    );
  }
}
