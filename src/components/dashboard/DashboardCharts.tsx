"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface ChartData {
  monthlyComparison: { name: string; ingresos: number; gastos: number }[];
  lastMonthComparison: { name: string; ingresos: number; gastos: number }[];
  balanceHistory: { date: string; balance: number }[];
  categoryDistribution: { name: string; value: number; color: string }[];
}

export default function DashboardCharts({ data }: { data: ChartData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-80 bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Comparativa Mensual */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm min-w-0">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Flujo de Caja (Este Mes)</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="ingresos" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" fill="#fca5a5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Histórico de Balance (Tipo Montaña) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm min-w-0">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Evolución del Balance</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.balanceHistory}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribución por Categorías (Pie Chart) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm min-w-0">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Gastos por Categoría</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Comparativa Mes Pasado */}
       <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm min-w-0">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Cierre Mes Pasado</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.lastMonthComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="ingresos" fill="#6ee7b7" opacity={0.8} radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" fill="#fca5a5" opacity={0.8} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
