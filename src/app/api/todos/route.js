import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Todo from "@/models/Todo";

export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find();
    return NextResponse.json(todos, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Erreur lors de la récupération des todos", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { title, completed } = await request.json();
    if (!title) {
      return NextResponse.json(
        { message: "Le titre est requis" },
        { status: 400 }
      );
    }
    const newTodo = new Todo({ title, completed: completed || false });
    const saved = await newTodo.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Erreur lors de la création du todo", error: err.message },
      { status: 500 }
    );
  }
}
