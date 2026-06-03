"use client";

import { createTransaction } from "@/app/services/transaction-service";
import { useParams } from "next/navigation";
import { useState } from "react";
type Props = {
    id: string;
    className?: string;
};
export default function AddTransaction({ id, className }: Props) {
    const [show, setShow] = useState(false);

    const today = new Date().toISOString().split("T")[0];
    const [type, setType] = useState<"expense" | "income">("income");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(today);

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        await createTransaction({
            budgetbook: id,
            amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
            description,
            date,
        });

        setShow(false);
        setAmount("");
        setDescription("");
        setDate(today);
        setType("expense");
    };

    return (
        <div className={className ?? ""}>
            <button
                onClick={() => setShow(true)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
            >
                Add Transaction
            </button>

            {show && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Add Transaction</h2>

                        <form onSubmit={onSubmit} className="flex flex-col gap-4">
                            <div className="flex rounded overflow-hidden border w-full">
                                <button
                                    type="button"
                                    onClick={() => setType("expense")}
                                    className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === "expense"
                                        ? "bg-red-500 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("income")}
                                    className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === "income"
                                        ? "bg-green-500 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    Income
                                </button>
                            </div>
                            <div className="flex items-center">
                                <label className="flex text-3xl w-1/8 justify-center">{type === "expense" && "-" || "+"}</label>
                                <input
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

                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShow(false)}
                                    className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}