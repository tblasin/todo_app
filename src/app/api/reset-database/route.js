import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/database";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/User";
import Todo from "@/models/Todo";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const authHeader = req.headers.get("authorization");
  const allowBySecret =
    process.env.RESET_SECRET &&
    authHeader === process.env.RESET_SECRET;
  if (!session?.user && !allowBySecret) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
  }

  try {
    await connectDB();
    await Todo.deleteMany({});
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash("TestPassword123!", 10);
    const testUser = await User.create({
      name: "Test",
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
    });
    return NextResponse.json({
      message: "Base de données réinitialisée",
      testUser: { email: testUser.email },
    });
  } catch (error) {
    console.error("reset-database:", error);
    return NextResponse.json(
      { message: "Échec de la réinitialisation", error: error.message },
      { status: 500 }
    );
  }
}
