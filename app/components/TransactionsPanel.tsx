import { useEffect, useState } from "react";
import AddTransaction from "./AddTransaction";
import { Transaction } from "../lib/schemas";
import { watchTransactionsByMonth } from "../services/transaction-service";
import TransactionRow from "./TransactionRow";
import EditTransaction from "./EditTransaction";
import { useTransactionsByMonth } from "../hooks/useTransactionsByMonth";

type Props = {
  budgetbookId: string;
  month: number;
  year: number;
};

export default function TransactionPanel({ budgetbookId, month, year }: Props) {
  const transactions = useTransactionsByMonth(
    budgetbookId,
    year,
    month
  );

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);


  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddTransaction id={budgetbookId} />
      </div>

      <span className="text-xs text-gray-400">{transactions.length} transactions</span>

      {transactions
        .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((t) => (
          <TransactionRow key={t.uid} transaction={t} onEdit={setEditingTransaction} />
        ))}

      {editingTransaction && (
        <EditTransaction
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
}