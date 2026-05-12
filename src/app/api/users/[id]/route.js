import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/models/User";

// PUT - Mettre à jour un utilisateur par ID
export async function PUT(req, { params }) {
  const { id } = params; // Récupérer l'ID de l'utilisateur à partir des paramètres
  try {
    await connectDB();
    const body = await req.json();
    
    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedUser) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ message: "Utilisateur mis à jour", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer un utilisateur par ID
export async function DELETE(req, { params }) {
    const { id } = params; // Récupérer l'ID de l'utilisateur à partir des paramètres
    try {
      await connectDB();
      
      const deletedUser = await User.findByIdAndDelete(id);
      
      if (!deletedUser) {
        return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Utilisateur supprimé" }, { status: 200 });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      return NextResponse.json({ message: "Erreur lors de la suppression de l'utilisateur", error: error.message }, { status: 500 });
    }
  }
  