"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import BudgetModal from "@/components/ui/BudgetModal";

export default function BudgetActions({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
      >
        <Target className="w-5 h-5 mr-2" />
        Nuevo Presupuesto
      </button>

      <BudgetModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        categories={categories} 
      />
    </>
  );
}
