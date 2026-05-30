"use client";

import { useState, useTransition } from "react";
import Modal from "./Modal";
import { createBudget } from "@/app/actions/finance";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
}

export default function BudgetModal({ isOpen, onClose, categories }: BudgetModalProps) {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createBudget(formData);
        onClose();
      } catch (error) {
        console.error(error);
        alert("Error al crear el presupuesto.");
      }
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Establecer Presupuesto">
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
          <select
            name="categoryId"
            required
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          >
            <option value="">Selecciona una categoría</option>
            {categories.filter(c => c.type === 'EXPENSE').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Límite Mensual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              name="limitAmount"
              required
              step="0.01"
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isPending ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : "Guardar Presupuesto"}
        </button>
      </form>
    </Modal>
  );
}
