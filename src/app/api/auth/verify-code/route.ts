import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "El correo y el código son requeridos" },
        { status: 400 }
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        email_token: {
          email,
          token: code,
        },
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Código incorrecto" },
        { status: 400 }
      );
    }

    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "El código ha expirado" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Código válido" });
  } catch (error) {
    console.error("Error in verify-code:", error);
    return NextResponse.json(
      { error: "Error al verificar el código" },
      { status: 500 }
    );
  }
}
