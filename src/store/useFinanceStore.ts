import { create } from 'zustand';

interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string | null;
  date: Date | string;
  category: { name: string; icon?: string };
  account: { name: string };
  accountId: string;
  categoryId: string;
}

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
  isPrimary: boolean;
}

interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon: string;
  userId: string | null;
}

interface Budget {
  id: string;
  limitAmount: number;
  categoryId: string;
  period: string;
  category: { name: string };
  spent: number;
  percent: number;
}

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  isLoaded: boolean;
  
  setInitialData: (data: { 
    accounts: Account[], 
    categories: Category[], 
    transactions: Transaction[],
    budgets: Budget[] 
  }) => void;
  
  addOptimisticTransaction: (transaction: any) => void;
  updateAccountBalance: (accountId: string, amount: number) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  accounts: [],
  categories: [],
  transactions: [],
  budgets: [],
  isLoaded: false,

  setInitialData: (data) => set({ 
    ...data, 
    isLoaded: true 
  }),

  addOptimisticTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),

  updateAccountBalance: (accountId, amount) => set((state) => ({
    accounts: state.accounts.map(acc => 
      acc.id === accountId ? { ...acc, balance: acc.balance + amount } : acc
    )
  })),
}));
