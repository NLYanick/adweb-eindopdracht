"use client";

import { deleteCategory, updateCategory } from "@/app/services/category-service";
import { useState } from "react";
import { btn } from "../lib/button";
import { Category, CategoryType } from "../lib/schemas";
import { AnimatePresence, motion } from "motion/react";

type Props = {
    category: Category;
    onClose: () => void;
    ref?: React.Ref<HTMLButtonElement>;
};

export default function EditCategory({ category, onClose, ref }: Props) {
    const [showDelete, setShowDelete] = useState(false);
    const [type, setType] = useState<CategoryType>(category.type);
    const [name, setName] = useState(category.name);
    const [budget, setBudget] = useState(category.budget?.toString());
    const [endDate, setEndDate] = useState(category.endDate ?? "");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await updateCategory(category.uid, {
            budgetbook: category.budgetbook,
            type,
            name,
            budget: parseFloat(budget || "") || null,
            endDate: endDate || undefined,
        });

        onClose();
    };

    const removeCategory = async () => {
        await deleteCategory(category.uid);
        onClose();
    };

    return (
        <div>

            <motion.div
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="bg-white text-black rounded-xl p-6 w-full max-w-md flex flex-col gap-4"
                >
                    <h2 className="text-xl font-bold">Edit Category</h2>

                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <div className="flex rounded overflow-hidden border w-full">
                            <button
                                ref={ref}
                                type="button"
                                onClick={() => setType(CategoryType.Expense)}
                                className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === CategoryType.Expense ? btn.danger : btn.clear}`}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setType(CategoryType.Income)}
                                className={`px-6 py-2 text-sm font-medium transition-colors w-1/2 ${type === CategoryType.Income ? btn.success : btn.clear}`}
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
                            <label className="text-sm text-gray-500" htmlFor="end-date">
                                End date (optional)
                            </label>
                            <input
                                id="end-date"
                                type="date"
                                className="border p-2 rounded"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between gap-2">
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
                                    onClick={onClose}
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
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {showDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-60"
                        onClick={() => setShowDelete(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="bg-white rounded-lg p-6 w-full max-w-sm flex flex-col gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold">Delete Category</h2>
                            <p className="text-gray-600">Are you sure you want to delete this category? This cannot be undone.</p>
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
                                    onClick={removeCategory}
                                    className={btn.danger}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}