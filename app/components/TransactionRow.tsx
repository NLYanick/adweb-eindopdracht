"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Category, Transaction } from "../lib/schemas";

type Props = {
  transaction: Transaction;
  onEdit: (transaction: Transaction, returnFocus: () => void) => void;
  categories: Category[];
};

export default function TransactionRow({ transaction, onEdit, categories }: Props) {
  const [category, setCategory] = useState<Category | null>(
    categories.find(c => c.uid === transaction.category) ?? null
  );
  const editButtonRef = useRef<HTMLButtonElement>(null);

  const transactionDate = new Date(transaction.date).toLocaleDateString();

  useEffect(() => {
    if (!transaction.category && category) setCategory(null);
  }, [transaction, category]);

  useEffect(() => {
    setCategory(categories.find(c => c.uid === transaction.category) ?? null);
  }, [categories]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      draggable
      onDragStart={(e) => (e as unknown as React.DragEvent).dataTransfer.setData("transactionId", transaction.uid)}
      className="group bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: transaction.amount > 0 ? "#639922" : "#E24B4A" }}
        />
        <div className="min-w-0">
          <h3 className="font-medium text-sm text-gray-900 truncate">
            {transaction.description || "Untitled transaction"}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wide">
              {transactionDate}
            </span>
            {category && (
              <span className="font-mono text-[10px] tracking-wide px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
                {category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`font-medium text-sm ${transaction.amount > 0 ? "text-[#639922]" : "text-[#E24B4A]"}`}>
          {transaction.amount > 0 ? "+" : "−"} €{Math.abs(transaction.amount).toFixed(2)}
        </span>
        <button
          ref={editButtonRef}
          onClick={() => onEdit(transaction, () => editButtonRef.current?.focus())}
          className="border border-gray-200 rounded-lg px-3 py-1.5 font-mono text-[11px] text-gray-500 hover:border-gray-300 hover:text-gray-900 transition-colors"
        >
          Edit
        </button>
      </div>
    </motion.div>
  );
}