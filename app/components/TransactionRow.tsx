"use client";

import { btn } from "../lib/button";
import { Transaction } from "../lib/schemas";

type Props = {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
};

export default function TransactionRow({ transaction, onEdit }: Props) {
    return (
    <div className="border rounded-lg px-4 py-3 flex justify-between items-center gap-4">
        <div className="flex flex-col">
            <span className="font-medium">{transaction.description || "No description"}</span>
            <span className="text-sm text-gray-400">{transaction.date}</span>
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