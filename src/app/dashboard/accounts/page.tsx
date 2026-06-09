"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { Landmark as Bank, Wallet as Cash, Trash2 as Delete, Star as Fav } from "lucide-react";
import AccountsActions from "@/components/dashboard/AccountsActions";
import { deleteAccount, setPrimaryAccount } from "@/app/actions/finance";
import { useTransition } from "react";

export default function AccountsPage() {
  const { accounts, isLoaded } = useFinanceStore();
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mis Cuentas</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestiona tus cuentas bancarias y efectivo.</p>
        </div>
        <AccountsActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {accounts.length > 0 ? (
          accounts.map(acc => (
            <div key={acc.id} className="group bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`${acc.type === 'CASH' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'} p-3 rounded-xl`}>
                  {acc.type === 'CASH' ? <Cash className="w-6 h-6" /> : <Bank className="w-6 h-6" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {acc.type === 'CASH' ? 'Efectivo' : acc.type === 'BANK' ? 'Banco' : 'Crédito'}
                  </span>
                  
                  {/* Marcar como Principal */}
                  <button 
                    disabled={isPending}
                    onClick={() => startTransition(() => setPrimaryAccount(acc.id))}
                    className={`p-1.5 transition-colors ${acc.isPrimary ? 'text-emerald-500' : 'text-slate-200 hover:text-emerald-300'}`}
                  >
                    <Fav className="w-4 h-4 fill-current" />
                  </button>

                  <button 
                    disabled={isPending}
                    onClick={() => {
                      if(confirm("¿Eliminar cuenta?")) startTransition(() => deleteAccount(acc.id));
                    }}
                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{acc.name}</h3>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                ${acc.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400">No tienes cuentas registradas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
