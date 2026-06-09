import { useEffect, useRef, useState } from "react";
import AddTransaction from "./AddTransaction";
import { Transaction } from "../lib/schemas";
import TransactionRow from "./TransactionRow";
import EditTransaction from "./EditTransaction";
import { useTransactionsByMonth } from "../hooks/useTransactionsByMonth";
import { useCategoriesForMonth } from "../hooks/useCategoriesByMonth";
import DraggableCategory from "./DraggableCategory";

type Props = {
  budgetbookId: string;
  month: number;
  year: number;
};

export default function TransactionPanel({ budgetbookId, month, year }: Props) {
  const transactions = useTransactionsByMonth(budgetbookId, year, month);
  const categories = useCategoriesForMonth(budgetbookId, year, month);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const typeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
      if (editingTransaction) {
          typeRef.current?.focus();
      }
  }, [editingTransaction]);

  const sorted = transactions.toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddTransaction id={budgetbookId} />
      </div>

      <p className="font-mono text-[11px] text-gray-400 mb-3">
        {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
      </p>

      <div className="my-6 flex gap-3">
        {categories.map(c => <DraggableCategory key={c.uid} category={c} />)}
      </div>

      <div className="flex flex-col gap-2">
        {sorted.map((t) => (
          <TransactionRow key={t.uid} transaction={t} onEdit={setEditingTransaction} categories={categories} />
        ))}
      </div>

      {editingTransaction && (
        <EditTransaction
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          ref={typeRef}
        />
      )}
    </div>
  );
}