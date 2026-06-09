import { useEffect, useRef, useState } from "react";
import AddTransaction from "./AddTransaction";
import { Transaction } from "../lib/schemas";
import TransactionRow from "./TransactionRow";
import EditTransaction from "./EditTransaction";
import { useTransactionsByMonth } from "../hooks/useTransactionsByMonth";
import { useCategoriesForMonth } from "../hooks/useCategoriesByMonth";
import { AnimatePresence } from "motion/react";

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
    if (editingTransaction) typeRef.current?.focus();
  }, [editingTransaction]);

  const categorised = transactions.filter(t => t.category);
  const uncategorised = transactions.filter(t => !t.category);

  const sorted = (list: Transaction[]) =>
    list.toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase">Transactions</p>
          <p className="font-mono text-[11px] text-gray-400 mt-0.5">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <AddTransaction id={budgetbookId} />
      </div>

      {uncategorised.length > 0 && (
        <div className="mb-4">
          <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-2">
            Uncategorised — drag to a category
          </p>
          <div className="flex flex-col gap-2">
            {sorted(uncategorised).map(t => (
              <TransactionRow
                key={t.uid}
                transaction={t}
                onEdit={setEditingTransaction}
                categories={categories}
              />
            ))}
          </div>
        </div>
      )}

      {categorised.length > 0 && (
        <div>
          <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-2">
            Categorised
          </p>
          <div className="flex flex-col gap-2">
            {sorted(categorised).map(t => (
              <TransactionRow
                key={t.uid}
                transaction={t}
                onEdit={setEditingTransaction}
                categories={categories}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {editingTransaction && (
          <EditTransaction
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
            ref={typeRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
}