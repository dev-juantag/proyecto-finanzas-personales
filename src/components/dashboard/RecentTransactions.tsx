"use client";

import { useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";

interface RecentTransactionsProps {
  initialTransactions: any[];
}

export default function RecentTransactions({ initialTransactions }: RecentTransactionsProps) {
  const transactions = useFinanceStore((state) => state.transactions);
  const displayTransactions = transactions.length > 0 ? transactions.slice(0, 5) : initialTransactions;

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Actividad Reciente
      </h3>
      {displayTransactions.length > 0 ? (
        <div className="space-y-4">
          {displayTransactions.map((tx, idx) => (
            <div key={tx.id || idx} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${tx.type === 'INCOME' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <span className={`font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.type === 'INCOME' ? '↑' : '↓'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{tx.description || tx.category?.name || "Transacción"}</p>
                  <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
              <p className={`text-sm font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No hay transacciones recientes.</p>
        </div>
      )}
    </div>
  );
}
