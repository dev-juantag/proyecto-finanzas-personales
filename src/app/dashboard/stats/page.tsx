"use client";

import { useState } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { Calendar, Filter, Download, TrendingUp, TrendingDown } from "lucide-react";

export default function StatsPage() {
  const { transactions, categories, isLoaded } = useFinanceStore();
  const [filter, setFilter] = useState("this_month");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filtrado de datos según el periodo seleccionado
  const filteredTxs = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    const now = new Date();
    
    if (filter === "this_month") {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }
    if (filter === "custom" && dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start + "T00:00:00");
      const endDate = new Date(dateRange.end + "T23:59:59");
      return txDate >= startDate && txDate <= endDate;
    }
    return true; // "historic"
  });

  const income = filteredTxs.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
  const expense = filteredTxs.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
  const savings = income - expense;

  const chartData = {
    monthlyComparison: [
      { name: filter === "this_month" ? 'Este Mes' : 'Periodo Seleccionado', ingresos: income, gastos: expense }
    ],
    lastMonthComparison: [],
    balanceHistory: [
      { date: 'Inicio', balance: income * 0.1 },
      { date: 'Fin', balance: savings }
    ],
    categoryDistribution: categories
      .filter(c => c.type === 'EXPENSE')
      .map(c => {
        const spent = filteredTxs
          .filter(t => t.categoryId === c.id)
          .reduce((a, b) => a + b.amount, 0);
        return { name: c.name, value: spent, color: `#${Math.floor(Math.random()*16777215).toString(16)}` };
      })
      .filter(c => c.value > 0)
      .slice(0, 10)
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Estadísticas Generales</h1>
          <p className="text-sm text-slate-500">Analiza profundamente tus hábitos financieros.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex text-xs font-bold">
            <button 
              onClick={() => setFilter("this_month")}
              className={`px-4 py-2 rounded-lg transition-all ${filter === 'this_month' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Este Mes
            </button>
            <button 
              onClick={() => setFilter("historic")}
              className={`px-4 py-2 rounded-lg transition-all ${filter === 'historic' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Histórico
            </button>
            <button 
              onClick={() => setFilter("custom")}
              className={`px-4 py-2 rounded-lg transition-all ${filter === 'custom' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Personalizado
            </button>
          </div>
          <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 hover:text-emerald-600 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {filter === 'custom' && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fecha Inicio</label>
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fecha Fin</label>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Resumen de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Ingresos Totales</p>
          <div className="flex items-center mt-1">
            <h2 className="text-2xl font-bold text-emerald-600">${income.toLocaleString('es-ES')}</h2>
            <TrendingUp className="w-4 h-4 ml-2 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Gastos Totales</p>
          <div className="flex items-center mt-1">
            <h2 className="text-2xl font-bold text-red-600">-${expense.toLocaleString('es-ES')}</h2>
            <TrendingDown className="w-4 h-4 ml-2 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Ahorro Neto</p>
          <div className="flex items-center mt-1">
            <h2 className={`text-2xl font-bold ${savings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              ${savings.toLocaleString('es-ES')}
            </h2>
            <div className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${savings >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
              {income > 0 ? ((savings / income) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>

      <DashboardCharts data={chartData} />
    </div>
  );
}
