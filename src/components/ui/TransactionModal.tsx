"use client";

import { useState, useTransition } from "react";
import Modal from "./Modal";
import { createTransaction } from "@/app/actions/finance";
import { TransactionType } from "@prisma/client";
import { useFinanceStore } from "@/store/useFinanceStore";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: any[];
  categories: any[];
}

export default function TransactionModal({ isOpen, onClose, accounts, categories }: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [isPending, startTransition] = useTransition();
  const { addOptimisticTransaction } = useFinanceStore();

  const filteredCategories = categories.filter(c => c.type === type);

  async function handleSubmit(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const categoryName = categories.find(c => c.id === categoryId)?.name || "Categoría";

    // Actualización Optimista: Se refleja en la UI instantáneamente antes de ir al servidor
    addOptimisticTransaction({
      id: Math.random().toString(),
      amount,
      type,
      description,
      date: new Date().toISOString(),
      category: { name: categoryName },
      accountId: formData.get("accountId") as string,
      categoryId
    });

    startTransition(async () => {
      try {
        await createTransaction(formData);
        onClose();
      } catch (error) {
        console.error(error);
        alert("Error al crear la transacción. Verifica tu conexión.");
      }
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Transacción">
      <form action={handleSubmit} className="space-y-4">
        {/* Tipo de Transacción */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              type === "EXPENSE" 
                ? "bg-white dark:bg-slate-800 text-red-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              type === "INCOME" 
                ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Ingreso
          </button>
          <input type="hidden" name="type" value={type} />
        </div>

        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monto</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              name="amount"
              step="0.01"
              required
              autoFocus
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Cuenta */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cuenta</label>
          <select
            name="accountId"
            required
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          >
            <option value="">Selecciona una cuenta</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance.toFixed(2)})</option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
          <select
            name="categoryId"
            required
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          >
            <option value="">Selecciona una categoría</option>
            {filteredCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
          <input
            type="date"
            name="date"
            defaultValue={new Date().toLocaleDateString('en-CA')}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
          <input
            type="text"
            name="description"
            placeholder="Ej: Almuerzo con amigos"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Guardando...
            </>
          ) : "Crear Transacción"}
        </button>
      </form>
    </Modal>
  );
}
