"use client";

import { useEffect } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";

interface StoreHydratorProps {
  data: {
    accounts: any[];
    categories: any[];
    transactions: any[];
    budgets: any[];
  };
}

export default function StoreHydrator({ data }: StoreHydratorProps) {
  const setInitialData = useFinanceStore((state) => state.setInitialData);

  useEffect(() => {
    setInitialData(data);
  }, [data, setInitialData]);

  return null;
}
