"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import CategoriesActions from "@/components/dashboard/CategoriesActions";
import CategoryList from "@/components/dashboard/CategoryList";

export default function CategoriesPage() {
  const { categories, isLoaded } = useFinanceStore();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const incomeCategories = categories.filter(c => c.type === 'INCOME');
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categorías</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Organiza tus ingresos y gastos por categorías.</p>
        </div>
        <CategoriesActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Ingresos Section */}
        <div className="space-y-4">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
            <ArrowUpCircle className="w-5 h-5 mr-2" />
            <h3>Ingresos</h3>
          </div>
          <CategoryList categories={incomeCategories} type="INCOME" />
        </div>

        {/* Gastos Section */}
        <div className="space-y-4">
          <div className="flex items-center text-red-600 dark:text-red-400 font-bold">
            <ArrowDownCircle className="w-5 h-5 mr-2" />
            <h3>Gastos</h3>
          </div>
          <CategoryList categories={expenseCategories} type="EXPENSE" />
        </div>
      </div>
    </div>
  );
}
