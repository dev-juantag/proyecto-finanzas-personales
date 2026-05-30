"use client";

import { useState, useTransition, useEffect } from "react";
import Modal from "./Modal";
import { createCategory, updateCategory } from "@/app/actions/finance";
import * as LucideIcons from "lucide-react";
import { Tag, Search } from "lucide-react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any; // If present, we are editing
}

const COMMON_ICONS = [
  "Tag", "Wallet", "TrendingUp", "Utensils", "Car", "Home", "Coffee", "ShoppingBag", 
  "Heart", "Smartphone", "Gift", "Plane", "Zap", "Music", "Book", "Gamepad", 
  "Dumbbell", "Briefcase", "Banknote", "ShoppingCart", "Bus", "Film", "Tv", 
  "Stethoscope", "GraduationCap", "ShieldCheck", "Hammer", "Wrench", "Pizza",
  "Apple", "Beer", "Wine", "Camera", "Globe", "Lightbulb", "Mail", "Phone"
];

const IconPreview = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name] || Tag;
  return <Icon className={className} />;
};

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [formDataState, setFormDataState] = useState({
    name: "",
    type: "EXPENSE",
    icon: "Tag"
  });

  useEffect(() => {
    if (category) {
      setFormDataState({
        name: category.name || "",
        type: category.type || "EXPENSE",
        icon: category.icon || "Tag"
      });
    } else {
      setFormDataState({ name: "", type: "EXPENSE", icon: "Tag" });
    }
    setSearchTerm("");
  }, [category, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", formDataState.name);
    formData.append("type", formDataState.type);
    formData.append("icon", formDataState.icon);

    startTransition(async () => {
      try {
        if (category) {
          await updateCategory(category.id, formData);
        } else {
          await createCategory(formData);
        }
        onClose();
      } catch (error) {
        console.error(error);
        alert("Error al procesar la categoría.");
      }
    });
  }

  const filteredIcons = COMMON_ICONS.filter(icon => 
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? "Editar Categoría" : "Nueva Categoría"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre y Tipo */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre de la Categoría</label>
            <input
              type="text"
              required
              value={formDataState.name}
              onChange={(e) => setFormDataState({ ...formDataState, name: e.target.value })}
              placeholder="Ej: Entretenimiento"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tipo</label>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setFormDataState({ ...formDataState, type: 'EXPENSE' })}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formDataState.type === 'EXPENSE' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-sm' : 'text-slate-500'}`}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => setFormDataState({ ...formDataState, type: 'INCOME' })}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formDataState.type === 'INCOME' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm' : 'text-slate-500'}`}
              >
                Ingreso
              </button>
            </div>
          </div>
        </div>

        {/* Selector de Iconos */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Seleccionar Icono</label>
            <div className="relative w-40">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-y-auto max-h-[180px]">
            {filteredIcons.map(iconName => (
              <button
                key={iconName}
                type="button"
                onClick={() => setFormDataState({ ...formDataState, icon: iconName })}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${formDataState.icon === iconName ? 'bg-emerald-600 text-white shadow-md scale-110' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
              >
                <IconPreview name={iconName} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Previsualización */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${formDataState.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
            <IconPreview name={formDataState.icon} className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Previsualización</span>
            <span className="text-base font-semibold text-slate-700 dark:text-slate-300">{formDataState.name || "Sin nombre"}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (category ? "Guardar Cambios" : "Crear Categoría")}
        </button>
      </form>
    </Modal>
  );
}
