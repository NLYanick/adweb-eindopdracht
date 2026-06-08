"use client";

import { useState } from "react";
import { Transaction } from "../lib/schemas";
import { deleteTransaction, updateTransaction } from "../services/transaction-service";
import { useCategoriesForMonth } from "../hooks/useCategoriesByMonth";
import { btn } from "../lib/button";

type Props = {
    transaction: Transaction;
    onClose: () => void;
    ref?: React.Ref<HTMLButtonElement>;
};

export default function EditTransaction({ transaction, onClose, ref }: Props) {
    const [showDelete, setShowDelete] = useState(false);
    const [type, setType] = useState<"expense" | "income">(transaction.amount < 0 ? "expense" : "income");
    const [amount, setAmount] = useState(Math.abs(transaction.amount).toString());
    const [description, setDescription] = useState(transaction.description ?? "");
    const [date, setDate] = useState(transaction.date);
    const [categoryId, setCategoryId] = useState(transaction.category ?? "");

    const allCategories = useCategoriesForMonth(
        transaction.budgetbook,
        parseInt(date.split("-")[0]),
        parseInt(date.split("-")[1])
    );

    const validCategories = allCategories.filter(c =>
        c.type === type &&
        (!c.endDate || c.endDate >= date)
    );

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateTransaction(transaction.uid, {
            budgetbook: transaction.budgetbook,
            amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
            description,
            date,
            category: categoryId && categoryId.length > 0 ? categoryId : null,
        });
        onClose();
    };

    const removeTransaction = async () => {
        await deleteTransaction(transaction.uid);
        onClose();
    };

    return (
        <div>
            <div onClick={() => onClose()} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-6 w-full max-w-md flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Edit Transaction</h2>

                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <div className="flex rounded overflow-hidden border w-full">
                            <button
                                ref={ref}
                                type="button"
                                onClick={() => { setType("expense"); setCategoryId(""); }}
                                className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === "expense" ? btn.danger : btn.clear}`}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => { setType("income"); setCategoryId(""); }}
                                className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === "income" ? btn.success : btn.clear}`}
                            >
                                Income
                            </button>
                        </div>

                        <select
                            className="border p-2 rounded"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">No category</option>
                            {validCategories.map(c => (
                                <option key={c.uid} value={c.uid}>{c.name}</option>
                            ))}
                        </select>

                        <div className="flex items-center">
                            <label className="flex text-3xl w-1/8 justify-center" htmlFor="amount">
                                {type === "expense" && "-" || "+"}
                            </label>
                            <input
                                id="amount"
                                type="number"
                                placeholder="Amount"
                                className="border p-2 rounded w-7/8"
                                required
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Description"
                            className="border p-2 rounded"
                            maxLength={100}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            type="date"
                            className="border p-2 rounded"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />

                        <div className="flex gap-2 justify-between">
                            <button
                                type="button"
                                onClick={() => setShowDelete(true)}
                                className={btn.danger}
                            >
                                Delete
                            </button>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => onClose()}
                                    className={btn.secondary}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={btn.primary}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {showDelete && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-60"
                    onClick={() => setShowDelete(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-sm flex flex-col gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold">Delete Transaction</h2>
                        <p className="text-gray-600">Are you sure you want to delete this transaction? This cannot be undone.</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowDelete(false)}
                                className={btn.secondary}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={removeTransaction}
                                className={btn.danger}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}