"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AccountModal from "@/components/ui/AccountModal";

export default function AccountsActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
      >
        <Plus className="w-5 h-5 mr-2" />
        Nueva Cuenta
      </button>

      <AccountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
