import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import prisma from "@/lib/prisma";
import StoreHydrator from "@/components/dashboard/StoreHydrator";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Carga MAESTRA de datos al entrar al dashboard
  const [accounts, categories, transactions, budgets] = await Promise.all([
    prisma.account.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ where: { OR: [{ userId: session.user.id }, { userId: null }] } }),
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      include: { category: true, account: true }
    }),
    prisma.budget.findMany({
      where: { userId: session.user.id },
      include: { category: true }
    })
  ]);

  // Procesar presupuestos con sus gastos del mes actual para la hidratación
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonthTxs = transactions.filter(t => new Date(t.date) >= firstDayOfMonth);
  
  const processedBudgets = budgets.map(b => {
    const spent = thisMonthTxs
      .filter(t => t.categoryId === b.categoryId)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { 
      ...b, 
      spent, 
      percent: Math.min((spent / b.limitAmount) * 100, 100) 
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row">
      {/* Hidratamos el Store con los datos iniciales */}
      <StoreHydrator data={{ accounts, categories, transactions, budgets: processedBudgets }} />
      
      <Navbar user={session.user} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
