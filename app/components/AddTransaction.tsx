"use client";

import { createTransaction } from "@/app/services/transaction-service";
import { useEffect, useRef, useState } from "react";
import { btn } from "../lib/button";
import { useCategoriesForMonth } from "../hooks/useCategoriesByMonth";
import { AnimatePresence, motion } from "motion/react";
type Props = {
    id: string;
    className?: string;
};
export default function AddTransaction({ id, className }: Props) {
    const [show, setShow] = useState(false);

    const today = new Date().toISOString().split("T")[0];
    const [type, setType] = useState<"expense" | "income">("income");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(today);

    const typeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (show) {
            typeRef.current?.focus();
        }
    }, [show]);

    const allCategories = useCategoriesForMonth(
        id,
        parseInt(date.split("-")[0]),
        parseInt(date.split("-")[1])
    );

    const validCategories = allCategories.filter(c =>
        c.type === type &&
        (!c.endDate || c.endDate >= date)
    );

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        await createTransaction({
            budgetbook: id,
            category: categoryId,
            amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
            description,
            date,
        });

        setShow(false);
        setAmount("");
        setDescription("");
        setDate(today);
        setType("expense");
        setCategoryId("");
    };

    return (
        <div className={className ?? ""} onClick={() => setShow(false)}>
            <button
                data-testid="add-transaction-modal-button"
                onClick={(e) => { setShow(true); e.stopPropagation() }}
                className={btn.primary}
            >
                Add Transaction
            </button>

            <AnimatePresence>
                {show && (
                    <motion.div
                        data-testid="add-transaction-modal"
                        key="add-category-backdrop"
                        onClick={() => setShow(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    >
                        <motion.div
                            key="add-category-dialog"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, y: 16, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.97 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="bg-white text-black rounded-xl p-6 w-full max-w-md flex flex-col gap-4"
                        >
                            <h2 className="text-xl font-bold">Add Transaction</h2>

                            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                                <div className="flex rounded overflow-hidden border w-full">
                                    <button
                                        ref={typeRef}
                                        type="button"
                                        onClick={() => { setType("expense"); setCategoryId("") }}
                                        className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === "expense"
                                            ? btn.danger
                                            : btn.clear
                                            }`}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setType("income"); setCategoryId("") }}
                                        className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === "income"
                                            ? btn.success
                                            : btn.clear
                                            }`}
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
                                    required
                                    min="1950-01-01"
                                />

                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShow(false)}
                                        className={btn.secondary}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={btn.primary}
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}