"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPERADMIN") {
    throw new Error("No autorizado");
  }
}

export async function getUsers() {
  await checkAdmin();
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function createUser(data: any) {
  await checkAdmin();
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role as Role,
    },
  });
  
  revalidatePath("/dashboard/admin/users");
  return user;
}

export async function updateUser(id: string, data: any) {
  await checkAdmin();
  
  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role as Role,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/dashboard/admin/users");
  return user;
}

export async function deleteUser(id: string) {
  await checkAdmin();
  
  // Prevent deleting self
  const session = await getServerSession(authOptions);
  if (session?.user?.id === id) {
    throw new Error("No puedes eliminarte a ti mismo");
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/dashboard/admin/users");
}
