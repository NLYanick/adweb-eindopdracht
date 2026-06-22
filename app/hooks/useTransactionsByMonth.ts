import { useEffect, useState } from "react";
import { watchTransactionsByMonth } from "../services/transaction-service";
import { Transaction } from "../lib/schemas";

export function useTransactionsByMonth(
  budgetbookId: string,
  year: number,
  month: number
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = watchTransactionsByMonth(
      budgetbookId,
      year,
      month,
      setTransactions
    );

    return unsubscribe;
  }, [budgetbookId, year, month]);

  return transactions;
}