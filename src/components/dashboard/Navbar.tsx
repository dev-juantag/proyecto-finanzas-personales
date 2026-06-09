"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  ArrowLeftRight,
  Target, 
  CreditCard, 
  LayoutGrid,
  BarChart3,
  Menu, 
  X, 
  Wallet,
  LogOut,
  Plus,
  ShieldCheck,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transacciones", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Cuentas", href: "/dashboard/accounts", icon: CreditCard },
  { name: "Categorías", href: "/dashboard/categories", icon: LayoutGrid },
  { name: "Estadísticas", href: "/dashboard/stats", icon: BarChart3 },
  { name: "Presupuestos", href: "/dashboard/budgets", icon: Target },
];

export default function Navbar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="flex items-center">
          <Wallet className="w-6 h-6 text-emerald-600 mr-2" />
          <span className="text-lg font-bold text-slate-900 dark:text-white">Contador</span>
        </div>
        <button 
          onClick={toggleMenu}
          className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-[100dvh] md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo - Desktop only */}
          <div className="h-16 hidden md:flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
            <Wallet className="w-6 h-6 text-emerald-600 mr-2" />
            <span className="text-lg font-bold text-slate-900 dark:text-white">Contador Personal</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/30"}
                  `}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}

            {/* Sección de Administración - Justo debajo de Presupuestos */}
            {user.role === 'SUPERADMIN' && (
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/50">
                <p className="px-3 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-500" /> Administración
                </p>
                <Link
                  href="/dashboard/admin/users"
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${pathname === '/dashboard/admin/users' 
                      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/30"}
                  `}
                >
                  <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                  Gestión de Usuarios
                </Link>
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center px-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name || "Usuario"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button 
              onClick={() => signOut()}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-4 text-center">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                &copy; 2026 Juan Taguado<br />Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
