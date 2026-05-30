"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AccountType, TransactionType, Period } from "@prisma/client";

// --- ACCOUNTS ---
export async function createAccount(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autorizado");

  const name = formData.get("name") as string;
  const type = formData.get("type") as AccountType;
  const balance = parseFloat(formData.get("balance") as string) || 0;

  await prisma.account.create({
    data: {
      userId: session.user.id,
      name,
      type,
      balance,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
}

export async function deleteAccount(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autorizado");

  await prisma.account.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
}

export async function setPrimaryAccount(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autorizado");

  await prisma.$transaction([
    // Unset current primary
    prisma.account.updateMany({
      where: { userId: session.user.id, isPrimary: true },
      data: { isPrimary: false },
    }),
    // Set new primary
    prisma.account.update({
      where: { id, userId: session.user.id },
      data: { isPrimary: true },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
}

// --- CATEGORIES ---
export async function createCategory(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autorizado");

  const name = formData.get("name") as string;
  const type = formData.get("type") as TransactionType;
  const icon = (formData.get("icon") as string) || "Tag";

  await prisma.category.create({
    data: {
      userId: session.user.id,
      name,
      type,
      icon,
    },
  });

  revalidatePath("/dashboard/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No session found");

  const name = formData.get("name") as string;
  const type = formData.get("type") as TransactionType;
  const icon = formData.get("icon") as string;

  // Permitir actualizar si es propia o si es una categoría base (userId null)
  await prisma.category.update({
    where: { 
      id,
      OR: [
        { userId: session.user.id },
        { userId: null }
      ]
    },
    data: { 
      name, 
      type, 
      icon,
      userId: session.user.id // Al editar una de sistema, se vuelve propiedad del usuario
    }
  });

  revalidatePath('/dashboard/categories');
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autorizado");

  await prisma.category.delete({
    where: { 
      id,
      OR: [
        { userId: session.user.id },
        { userId: null }
      ]
    },
  });

  revalidatePath("/dashboard/categories");
}

// --- TRANSACTIONS ---
export async function createTransaction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autorizado");

  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as TransactionType;
  const accountId = formData.get("accountId") as string;
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  // Usamos mediodía para evitar que desfases horarios (UTC-3, etc) muevan la fecha al día anterior
  const date = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();

  // Create transaction in a transaction to update account balance too
  await prisma.$transaction(async (tx) => {
    // Create transaction
    await tx.transaction.create({
      data: {
        userId: session.user.id,
        accountId,
        categoryId,
        amount,
        type,
        description,
        date,
      },
    });

    // Update account balance
    const balanceChange = type === "INCOME" ? amount : -amount;
    await tx.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

export async function deleteTransaction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autorizado");

  const transaction = await prisma.transaction.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!transaction) throw new Error("Transacción no encontrada");

  await prisma.$transaction(async (tx) => {
    // Revert account balance
    const balanceChange = transaction.type === "INCOME" ? -transaction.amount : transaction.amount;
    await tx.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    });

    // Delete transaction
    await tx.transaction.delete({
      where: { id },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

// --- BUDGETS ---
export async function createBudget(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autorizado");

  const categoryId = formData.get("categoryId") as string;
  const limitAmount = parseFloat(formData.get("limitAmount") as string);
  const period = (formData.get("period") as Period) || "MONTHLY";

  await prisma.budget.upsert({
    where: { 
      id: formData.get("id") as string || "new-budget" // This is a bit simplified
    },
    update: {
      limitAmount,
      period,
    },
    create: {
      userId: session.user.id,
      categoryId,
      limitAmount,
      period,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/budgets");
}

export async function deleteBudget(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autorizado");

  await prisma.budget.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/budgets");
}
