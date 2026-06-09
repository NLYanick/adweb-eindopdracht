import { useEffect, useRef, useState } from "react";
import { useCategoriesForMonth } from "../hooks/useCategoriesByMonth";
import { useTransactionsByMonth } from "../hooks/useTransactionsByMonth";
import { Category, CategoryType, Transaction } from "../lib/schemas";
import AddCategory from "./AddCategory";
import ExpenseCategoryCard from "./ExpenseCategoryCard";
import IncomeCategoryCard from "./IncomeCategoryCard";
import EditCategory from "./EditCategory";
import { changeCategory } from "../services/transaction-service";
import { AnimatePresence } from "motion/react";

interface Props {
  budgetbookId: string;
  month: number;
  year: number;
}

export default function CategoryList({ budgetbookId, year, month }: Props) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [overCategoryId, setOverCategoryId] = useState<string | null>(null);

  const transactions = useTransactionsByMonth(budgetbookId, year, month);
  const categories = useCategoriesForMonth(budgetbookId, year, month);

  const incomeCategories = categories.filter(c => c.type === CategoryType.Income);
  const expenseCategories = categories.filter(c => c.type === CategoryType.Expense);

  const typeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (editingCategory) typeRef.current?.focus();
    else returnRef.current?.focus();
  }, [editingCategory]);

  const transactionsForCategory = (category: Category) =>
    transactions.filter(t => t.category === category.uid);

  const handleDrop = async (e: React.DragEvent, category: Category) => {
    e.preventDefault();
    setOverCategoryId(null);
    const transactionId = e.dataTransfer.getData("transactionId");
    if (!transactionId) return;

    const transaction = transactions.find(t => t.uid === transactionId);
    if (!transaction) return;

    // Type guard: only allow income on income categories, expenses on expense categories
    const isCompatible =
      (category.type === CategoryType.Income && transaction.amount > 0) ||
      (category.type === CategoryType.Expense && transaction.amount < 0);

    if (!isCompatible) return;

    await changeCategory(transactionId, category.uid);
  };

  const dropHandlers = (category: Category) => ({
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setOverCategoryId(category.uid); },
    onDragLeave: () => setOverCategoryId(null),
    onDrop: (e: React.DragEvent) => handleDrop(e, category),
  });

  const renderCard = (category: Category) => {
    const isOver = overCategoryId === category.uid;
    const cardTransactions = transactionsForCategory(category);
    const commonProps = {
      category,
      transactions: cardTransactions,
      onEdit: setEditingCategory,
      className: isOver ? "ring-2 ring-green-400" : "",
      ...dropHandlers(category),
    };

    return category.type === CategoryType.Income
      ? <IncomeCategoryCard key={category.uid} {...commonProps} />
      : <ExpenseCategoryCard key={category.uid} {...commonProps} />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase">Categories</p>
        <AddCategory budgetbookId={budgetbookId} />
      </div>

      {categories.length === 0 ? (
        <p className="font-mono text-sm text-gray-400 text-center py-12">
          No categories yet. Add one to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {incomeCategories.length > 0 && (
            <section>
              <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase mb-3">Income</p>
              <div className="grid grid-cols-1 gap-3">
                {incomeCategories.map(renderCard)}
              </div>
            </section>
          )}

          {expenseCategories.length > 0 && (
            <section>
              <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase mb-3">Expenses</p>
              <div className="grid grid-cols-1 gap-3">
                {expenseCategories.map(renderCard)}
              </div>
            </section>
          )}
        </div>
      )}

      <AnimatePresence>
        {editingCategory && (
          <EditCategory
            ref={typeRef}
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}