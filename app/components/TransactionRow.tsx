"use client";

import { useEffect, useState } from "react";
import { btn } from "../lib/button";
import { Category, CategoryType, Transaction } from "../lib/schemas";
import { changeCategory } from "../services/transaction-service";

type Props = {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    categories: Category[];
};

export default function TransactionRow({ transaction, onEdit, categories }: Props) {
    const [category, setCategory] = useState<Category | null>(categories.find(c => c.uid === transaction.category) || null);

    useEffect(() => {
        if (!transaction.category && category) {
            setCategory(null);
        }
    }, [transaction, category]);

    const onDrop = async (e: React.DragEvent) => {
        const categoryId = e.dataTransfer.getData("category");

        const newCategory = categories.find(c => c.uid === categoryId);

        if (!category || (newCategory && category.uid !== categoryId)) {
            if (newCategory?.type === CategoryType.Expense && transaction.amount < 0) {
                setCategory(newCategory || category);
                await changeCategory(transaction.uid, categoryId || null);
            } else if (newCategory?.type === CategoryType.Income && transaction.amount > 0) {
                setCategory(newCategory || category);
                await changeCategory(transaction.uid, categoryId || null);
            }
        }
    }

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="group bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between transition-all hover:border-gray-300"
        >
            <div className="flex items-center gap-5 min-w-0">
                <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                        {transaction.description || "Untitled transaction"}
                    </h3>

                    <div className="flex items-center gap-3 mt-1">
                        <span className="font-mono text-[11px] tracking-wide text-gray-400 uppercase">{transaction.date}</span>

                        {category && (
                            <span className="font-mono text-[10px] tracking-wide uppercase px-2 py-1 rounded-full border border-gray-200 text-gray-500">
                                {category.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">

                <div className="text-right">
                    <div className={`font-medium text-lg ${transaction.amount > 0 ? "text-[#639922]" : "text-[#E24B4A]" }`}>
                        {transaction.amount > 0 ? "+" : "-"}€
                        {Math.abs(transaction.amount).toFixed(2)}
                    </div>

                    <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                        {transaction.amount > 0 ? "Income" : "Expense"}
                    </p>
                </div>

                <button
                    onClick={() => onEdit(transaction)}
                    className="border border-gray-200 rounded-lg px-3 py-2 font-mono text-xs text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
                >
                    Edit
                </button>
            </div>
        </div>
    )
}