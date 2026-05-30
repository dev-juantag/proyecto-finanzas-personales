"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import BudgetActions from "@/components/dashboard/BudgetActions";
import { Trash2 } from "lucide-react";
import { deleteBudget } from "@/app/actions/finance";
import { useTransition } from "react";

export default function BudgetsPage() {
  const { budgets, categories, isLoaded } = useFinanceStore();
  const [isPending, startTransition] = useTransition();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Presupuestos
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Controla tus límites de gasto mensual por categoría.
          </p>
        </div>
        <BudgetActions categories={categories} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length > 0 ? budgets.map((budget) => {
          const isWarning = budget.percent >= 80;
          const isDanger = budget.percent >= 100;

          let colorClass = "bg-emerald-500";
          if (isDanger) colorClass = "bg-red-500";
          else if (isWarning) colorClass = "bg-amber-500";

          return (
            <div key={budget.id} className="group bg-white dark:bg-slate-800 shadow rounded-2xl border border-slate-100 dark:border-slate-700 p-6 relative transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{budget.category.name}</h3>
                
                <button 
                  disabled={isPending}
                  onClick={() => {
                    if(confirm("¿Eliminar presupuesto?")) startTransition(() => deleteBudget(budget.id));
                  }}
                  className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-2 flex justify-between items-end">
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ${budget.spent.toLocaleString('es-ES')}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  de ${budget.limitAmount.toLocaleString('es-ES')}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className={`${colorClass} h-3 rounded-full transition-all duration-1000`} 
                  style={{ width: `${budget.percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-xs font-bold ${isDanger ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-400'}`}>
                  {budget.percent.toFixed(0)}% utilizado
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Mensual</p>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">Aún no has creado ningún presupuesto.</p>
          </div>
        )}
      </div>
    </div>
  );
}
