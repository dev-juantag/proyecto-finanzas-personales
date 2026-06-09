"use client";

import { useState, useTransition } from "react";
import { Edit2, Trash2, Tag, Info, Wallet, TrendingUp, Utensils, Car, Home, Coffee, ShoppingBag, Heart, Smartphone, Gift, Plane, type LucideIcon } from "lucide-react";
import CategoryModal from "@/components/ui/CategoryModal";
import { deleteCategory } from "@/app/actions/finance";
import * as LucideIcons from "lucide-react";

interface CategoryListProps {
  categories: any[];
  type: 'INCOME' | 'EXPENSE';
}

const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name] || Tag;
  return <Icon className={className} />;
};

export default function CategoryList({ categories, type }: CategoryListProps) {
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (cat: any) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${cat.name}"?\n\nAdvertencia: Esto eliminará todas las transacciones asociadas a esta categoría.`)) {
      startTransition(async () => {
        try {
          await deleteCategory(cat.id);
        } catch (error) {
          console.error(error);
          alert("No se pudo eliminar la categoría.");
        }
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden shadow-sm">
      {categories.length > 0 ? categories.map(cat => (
        <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
          <div className="flex items-center space-x-3">
             <div className={`p-2 rounded-lg ${type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                <IconComponent name={cat.icon || "Tag"} className="w-5 h-5" />
             </div>
             <div>
               <span className="text-slate-700 dark:text-slate-300 font-semibold block">{cat.name}</span>
               {!cat.userId && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Predeterminada</span>}
             </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setEditingCategory(cat)}
              disabled={isPending}
              title="Editar categoría"
              className="p-2.5 sm:p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 rounded-lg transition-all"
            >
              <Edit2 className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button 
              onClick={() => handleDelete(cat)}
              disabled={isPending}
              title="Eliminar categoría"
              className="p-2.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )) : (
        <div className="p-12 text-center">
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <Tag className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm text-slate-400 italic">No hay categorías registradas.</p>
        </div>
      )}

      {editingCategory && (
        <CategoryModal 
          isOpen={!!editingCategory} 
          onClose={() => setEditingCategory(null)} 
          category={editingCategory} 
        />
      )}
    </div>
  );
}
