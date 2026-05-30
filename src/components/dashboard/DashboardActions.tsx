"use client";

import { useState } from "react";
import { Plus, ArrowRight, CreditCard, Tags } from "lucide-react";
import Link from "next/link";
import TransactionModal from "@/components/ui/TransactionModal";

interface DashboardActionsProps {
  accounts: any[];
  categories: any[];
}

export default function DashboardActions({ accounts, categories }: DashboardActionsProps) {
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Resumen Financiero
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gestiona tus ingresos y gastos en tiempo real.
          </p>
        </div>
        <button 
          onClick={() => setIsTransModalOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Transacción
        </button>
      </div>

      <TransactionModal 
        isOpen={isTransModalOpen} 
        onClose={() => setIsTransModalOpen(false)} 
        accounts={accounts}
        categories={categories}
      />
    </>
  );
}
