"use client";

import { createCategory } from "@/app/services/category-service";
import { useState } from "react";
import { btn } from "../lib/button";
import { CategoryType } from "../lib/schemas";

type Props = {
    budgetbookId: string;
    className?: string;
};

export default function AddCategory({ budgetbookId, className }: Props) {
    const [show, setShow] = useState(false);

    const [type, setType] = useState<CategoryType>(CategoryType.Expense);
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [endDate, setEndDate] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await createCategory({
            budgetbook: budgetbookId,
            type,
            name,
            budget: parseFloat(budget || "") || null,
            endDate: endDate || undefined,
        });

        setShow(false);
        setName("");
        setBudget("");
        setEndDate("");
        setType(CategoryType.Expense);
    };

    return (
        <div className={className ?? ""}>
            <button
                onClick={() => setShow(true)}
                className={btn.primary}
            >
                Add Category
            </button>

            {show && (
                <div onClick={() => setShow(false)} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white text-black rounded-lg p-6 w-full max-w-md flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Add Category</h2>

                        <form onSubmit={onSubmit} className="flex flex-col gap-4">
                            <div className="flex rounded overflow-hidden border w-full">
                                <button
                                    type="button"
                                    onClick={() => setType(CategoryType.Expense)}
                                    className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === CategoryType.Expense ? btn.danger : btn.clear
                                        }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType(CategoryType.Income)}
                                    className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === CategoryType.Income ? btn.success : btn.clear
                                        }`}
                                >
                                    Income
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder="Name"
                                className="border p-2 rounded"
                                required
                                maxLength={50}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder={`Budget ${type === CategoryType.Income ? "(Optional)" : ""}`}
                                className="border p-2 rounded"
                                required={type === CategoryType.Expense}
                                min="0.01"
                                step="0.01"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            />
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-500">End date (optional)</label>
                                <input
                                    type="date"
                                    className="border p-2 rounded"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

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
                    </div>
                </div>
            )}
        </div>
    );
}