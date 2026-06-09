import { useEffect, useRef, useState } from "react";
import { useCategoriesForMonth } from "../hooks/useCategoriesByMonth";
import { useTransactionsByMonth } from "../hooks/useTransactionsByMonth";
import { Category, CategoryType } from "../lib/schemas";
import AddCategory from "./AddCategory";
import ExpenseCategoryCard from "./ExpenseCategoryCard";
import IncomeCategoryCard from "./IncomeCategoryCard";
import EditCategory from "./EditCategory";

interface Props {
  budgetbookId: string;
  month: number;
  year: number;
}

export default function CategoryList({ budgetbookId, year, month }: Props) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const transactions = useTransactionsByMonth(budgetbookId, year, month);
  const categories   = useCategoriesForMonth(budgetbookId, year, month);

  const incomeCategories  = categories.filter(c => c.type === CategoryType.Income);
  const expenseCategories = categories.filter(c => c.type === CategoryType.Expense);

  const typeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
      if (editingCategory) {
          typeRef.current?.focus();
      } else {
          returnRef.current?.focus();
      }
  }, [editingCategory]);

  const transactionsForCategory = (category: Category) =>
    transactions.filter(t => t.category === category.uid);

  const addButton = (
    <div className="flex justify-end mb-5">
      <AddCategory budgetbookId={budgetbookId} />
    </div>
  );

  if (categories.length === 0) {
    return (
      <>
        {addButton}
        <p className="font-mono text-sm text-gray-400 text-center py-12">
          No categories yet. Add one to get started.
        </p>
      </>
    );
  }

  return (
    <>
      {addButton}

      <div className="flex flex-col gap-8">
        {incomeCategories.length > 0 && (
          <section>
            <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase mb-3">
              Income
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {incomeCategories.map(category => (
                <IncomeCategoryCard
                  key={category.uid}
                  category={category}
                  transactions={transactionsForCategory(category)}
                  onEdit={setEditingCategory}
                />
              ))}
            </div>
          </section>
        )}

        {expenseCategories.length > 0 && (
          <section>
            <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase mb-3">
              Expenses
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expenseCategories.map(category => (
                <ExpenseCategoryCard
                  key={category.uid}
                  category={category}
                  transactions={transactionsForCategory(category)}
                  onEdit={setEditingCategory}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {editingCategory && (
        <EditCategory
          ref={typeRef}
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </>
  );
}