"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { ArrowRight, CreditCard, Tags, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import DashboardActions from "@/components/dashboard/DashboardActions";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function DashboardPage() {
  const { accounts, categories, transactions, budgets, isLoaded } = useFinanceStore();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Basic Stats
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const primaryAccount = accounts.find(a => a.isPrimary) || accounts[0];

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Pastel color palette for categories
  const pastelColors = [
    "#fca5a5", // pastel red
    "#fdba74", // pastel orange
    "#fde047", // pastel yellow
    "#a7f3d0", // pastel green
    "#99f6e4", // pastel teal
    "#bfdbfe", // pastel blue
    "#c084fc", // pastel purple
    "#f472b6", // pastel pink
  ];
  
  const thisMonthTxs = transactions.filter(t => new Date(t.date) >= firstDayOfMonth);
  const monthlyIncome = thisMonthTxs.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
  const monthlyExpense = thisMonthTxs.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);

  // 2. Prepare Chart Data
  const chartData = {
    monthlyComparison: [
      { name: 'Este Mes', ingresos: monthlyIncome, gastos: monthlyExpense }
    ],
    lastMonthComparison: [
      { name: 'Mes Pasado', ingresos: 0, gastos: 0 } // Simplified for now
    ],
    balanceHistory: [
      { date: 'Inicio', balance: totalBalance * 0.95 },
      { date: 'Hoy', balance: totalBalance }
    ],
    categoryDistribution: categories
      .filter(c => c.type === 'EXPENSE')
      .map((c, index) => {
        const spent = thisMonthTxs
          .filter(t => t.categoryId === c.id)
          .reduce((a, b) => a + b.amount, 0);
        return { name: c.name, value: spent, color: pastelColors[index % pastelColors.length] };
      })
      .filter(c => c.value > 0)
      .slice(0, 5)
  };

  // 3. Month Closure Logic (Fin de Mes)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = lastDayOfMonth - now.getDate();
  const totalBudgeted = budgets.reduce((acc, b) => acc + b.limitAmount, 0);
  const totalSpentInBudgets = budgets.reduce((acc, b) => acc + b.spent, 0);
  const remainingBudget = Math.max(totalBudgeted - totalSpentInBudgets, 0);

  return (
    <div className="space-y-6 pb-12">
      <DashboardActions accounts={accounts} categories={categories} />

      {/* Main Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Balance Total */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Balance Total</p>
              <h2 className="text-3xl font-bold mt-1">${totalBalance.toLocaleString('es-ES')}</h2>
            </div>
            <Wallet className="opacity-20 w-10 h-10" />
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-500/30 flex justify-between items-center text-sm">
            <span>Ingresos este mes</span>
            <span className="font-bold">+${monthlyIncome.toLocaleString('es-ES')}</span>
          </div>
        </div>

        {/* 2. Cuenta Principal */}
        {primaryAccount && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Principal</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{primaryAccount.name}</p>
            <h2 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">${primaryAccount.balance.toLocaleString('es-ES')}</h2>
            <div className="mt-4 flex items-center text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Cuenta Activa</span>
            </div>
          </div>
        )}

        {/* 3. Cierre de Mes */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Cierre de Mes</h3>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Día {now.getDate()} de {lastDayOfMonth}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Restante del Presupuesto</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">${remainingBudget.toLocaleString('es-ES')}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Días Restantes</p>
                <p className="text-xl font-bold text-emerald-600">{daysLeft} días</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(now.getDate() / lastDayOfMonth) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <DashboardCharts data={chartData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions initialTransactions={transactions.slice(0, 5) as any} />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Presupuestos</h3>
            <Link href="/dashboard/budgets" className="text-emerald-600 text-xs font-bold hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-5">
            {budgets.length > 0 ? budgets.slice(0, 3).map(budget => (
              <div key={budget.id}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{budget.category.name}</span>
                  <span className="text-slate-500">${budget.spent.toFixed(0)} / ${budget.limitAmount.toFixed(0)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${budget.percent > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${budget.percent}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-4">No tienes presupuestos activos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
