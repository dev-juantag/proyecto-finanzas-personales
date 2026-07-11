"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { ArrowUpRight, ArrowDownRight, Trash2, Calendar, CreditCard, ChevronLeft, ChevronRight, Filter, X, TrendingUp } from "lucide-react";
import DashboardActions from "@/components/dashboard/DashboardActions";
import { deleteTransaction } from "@/app/actions/finance";
import { useTransition, useState } from "react";

export default function TransactionsPage() {
  const { transactions, accounts, categories, isLoaded } = useFinanceStore();
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Estados de filtros
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filtrado de transacciones
  const filteredTransactions = transactions.filter((tx) => {
    if (selectedAccount && tx.accountId !== selectedAccount) return false;
    if (selectedCategory && tx.categoryId !== selectedCategory) return false;
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const txDate = new Date(tx.date);
      if (txDate < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      const txDate = new Date(tx.date);
      if (txDate > end) return false;
    }
    return true;
  });

  // Totales de las transacciones filtradas
  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Lógica de Ordenamiento y Paginación
  const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar esta transacción?")) return;
    
    startTransition(async () => {
      try {
        await deleteTransaction(id);
      } catch (error) {
        alert("Error al eliminar");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Título y Filtros */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Transacciones
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Mostrando {sortedTransactions.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, sortedTransactions.length)} de {sortedTransactions.length} movimientos.
            </p>
          </div>

          {/* Barra de Filtros Minimalista (Estilo Unificado con Divisores) */}
          <div className="flex flex-wrap items-center gap-y-3 bg-white dark:bg-slate-800/80 rounded-2xl md:rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-1.5 w-fit">
            {/* Selector de Cuenta */}
            <div className="px-1">
              <select
                value={selectedAccount}
                onChange={(e) => {
                  setSelectedAccount(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-transparent text-xs text-slate-805 dark:text-slate-100 focus:outline-none cursor-pointer font-medium"
              >
                <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Todas las cuentas</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Divisor */}
            <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Selector de Categoría agrupado */}
            <div className="px-1">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-transparent text-xs text-slate-805 dark:text-slate-100 focus:outline-none cursor-pointer font-medium"
              >
                <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Todas las categorías</option>
                <optgroup label="Ingresos" className="font-bold text-emerald-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {categories.filter(c => c.type === 'INCOME').map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-normal">
                      {cat.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Gastos" className="font-bold text-red-650 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {categories.filter(c => c.type === 'EXPENSE').map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-normal">
                      {cat.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Divisor */}
            <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Rango de Fechas Estilizado */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-1 bg-emerald-600 px-2.5 py-1 rounded-full border border-emerald-600">
                <Calendar className="w-4 h-4 text-white flex-shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none outline-none focus:ring-0 text-white w-[100px] text-center text-[10px] cursor-pointer p-0"
                />
              </div>
              <span className="text-slate-450 font-medium text-[10px]">-</span>
              <div className="flex items-center gap-1 bg-emerald-600 px-2.5 py-1 rounded-full border border-emerald-600">
                <Calendar className="w-4 h-4 text-white flex-shrink-0" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none outline-none focus:ring-0 text-white w-[100px] text-center text-[10px] cursor-pointer p-0"
                />
              </div>
            </div>

            {/* Botón de limpiar filtros */}
            {(selectedAccount || selectedCategory || startDate || endDate) && (
              <>
                {/* Divisor */}
                <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-700" />
                <div className="px-2">
                  <button
                    onClick={() => {
                      setSelectedAccount("");
                      setSelectedCategory("");
                      setStartDate("");
                      setEndDate("");
                      setCurrentPage(1);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold transition-all"
                  >
                    <X className="w-3.5 h-3.5" /> Limpiar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Columna Derecha: Resumen Financiero y Totales */}
        <div className="lg:col-span-5 flex flex-col items-end gap-3 w-full">
          <DashboardActions accounts={accounts} categories={categories} />
          
          {/* Totales Compactos debajo de Resumen Financiero y Nueva Transacción */}
          <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-full border border-slate-150 dark:border-slate-800">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Ingresos:</span> <span className="text-emerald-600 dark:text-emerald-400 font-bold">+${totalIncome.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-slate-500 dark:text-slate-400">Gastos:</span> <span className="text-red-650 dark:text-red-400 font-bold">-${totalExpense.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-slate-500 dark:text-slate-400">Neto:</span> <span className={`font-black ${netBalance >= 0 ? "text-emerald-600 dark:text-emerald-405" : "text-red-650 dark:text-red-405"}`}>{netBalance >= 0 ? "+" : "-"}${Math.abs(netBalance).toLocaleString("es-ES", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        
        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
          {currentTransactions.length > 0 ? (
            currentTransactions.map((tx) => (
              <div key={tx.id} className="p-4 bg-white dark:bg-slate-800 flex justify-between items-center group">
                <div className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${
                    tx.type === "INCOME" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"
                  }`}>
                    {tx.type === "INCOME" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {tx.description || tx.category.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {tx.account?.name} • {tx.category?.name}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className={`text-sm font-black ${tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>
                    {tx.type === "INCOME" ? "+" : "-"}${tx.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                    {new Date(tx.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      disabled={isPending}
                      className="ml-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              No se encontraron transacciones.
            </div>
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Detalle
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Cuenta / Categoría
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Monto
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${
                          tx.type === "INCOME" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"
                        }`}>
                          {tx.type === "INCOME" ? (
                            <ArrowUpRight className="h-5 w-5" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {tx.description || tx.category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {tx.account?.name || 'Cuenta'}
                        </div>
                        <div className="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                          {tx.category?.name || 'Categoría'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(tx.date).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-black">
                      <span className={tx.type === "INCOME" ? "text-emerald-600" : "text-red-600"}>
                        {tx.type === "INCOME" ? "+" : "-"}${tx.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        disabled={isPending}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron transacciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Controles de Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                .map((p, i, arr) => (
                  <span key={p} className="inline-flex items-center">
                    {i > 0 && arr[i-1] !== p - 1 && <span className="text-slate-400 px-1">...</span>}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === p 
                          ? 'bg-emerald-600 text-white' 
                          : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
