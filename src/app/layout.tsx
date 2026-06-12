import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finanzas Personales | Gestiona tus finanzas",
  description: "Plataforma intuitiva para la gestión de finanzas personales. Controla tus ingresos, gastos, presupuestos y visualiza estadísticas en tiempo real.",
  keywords: ["finanzas", "finanzas personales", "presupuesto", "dinero", "gastos", "ingresos"],
  authors: [{ name: "Juan Taguado" }],
  openGraph: {
    title: "Finanzas Personales",
    description: "Gestión de finanzas personales simplificada",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
