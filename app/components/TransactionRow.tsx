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
        if(!transaction.category && category) {
            setCategory(null);
        }
    }, [transaction, category]);

    const onDrop = async (e: React.DragEvent) => {
        const categoryId = e.dataTransfer.getData("category");
        
        const newCategory = categories.find(c => c.uid === categoryId);

        if(!category || (newCategory && category.uid !== categoryId)) {
            if(newCategory?.type === CategoryType.Expense && transaction.amount < 0) {
                setCategory(newCategory || category);
                await changeCategory(transaction.uid, categoryId || null);
            } else if(newCategory?.type === CategoryType.Income && transaction.amount > 0) {
                setCategory(newCategory || category);
                await changeCategory(transaction.uid, categoryId || null);
            }
        }
    }

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="border rounded-lg px-4 py-3 flex justify-between items-center gap-4"
        >
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <span className="font-medium">{transaction.description || "<No description>"}</span>
                    <span className="text-sm text-gray-400">{transaction.date}</span>
                </div>
                <div className={`text-xs ${category ? "p-1 border rounded-xl" : ""}`}>{category ? category.name : ""}</div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`font-semibold text-lg ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                    {transaction.amount > 0 ? "+" : "-"}€{Math.abs(transaction.amount).toFixed(2)}
                </span>
                <button
                    onClick={() => onEdit(transaction)}
                    className={btn.success}
                >
                    Edit
                </button>
            </div>
        </div>
    )
}