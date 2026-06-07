import { useState } from "react";
import { useCategoriesForMonth } from "../hooks/useCategoriesByMonth";
import { useTransactionsByMonth } from "../hooks/useTransactionsByMonth";
import { btn } from "../lib/button";
import { Category, CategoryType } from "../lib/schemas";
import AddCategory from "./AddCategory";
import ExpenseCategoryCard from "./ExpenseCategoryCard";
import IncomeCategoryCard from "./IncomeCategoryCard";
import EditCategory from "./EditCategory";

interface CategoryListProps {
  budgetbookId: string;
  month: number;
  year: number;
};

export default function CategoryList({
  budgetbookId,
  year,
  month,
}: CategoryListProps) {

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const transactions = useTransactionsByMonth(
    budgetbookId,
    year,
    month
  );

  const categories = useCategoriesForMonth(
    budgetbookId,
    year,
    month
  );
  let addButton = <div className="flex justify-end" ><AddCategory className={btn.primary} budgetbookId={budgetbookId} ></AddCategory></div>

  if (categories.length === 0) {
    return (
      <>
        {addButton}
        <p className="text-sm text-gray-400 text-center py-8">
          No categories yet. Add one to get started.
        </p>
      </>
    );
  }

  const expenseCategories = categories.filter((c) => c.type == CategoryType.Expense);
  const incomeCategories = categories.filter((c) => c.type == CategoryType.Income);

  // transactions per category — passed down so cards don't fetch individually
  const transactionsForCategory = (category: Category) =>
    transactions.filter((t) => t.category === category.uid);
  return (
    <>
      {addButton}
      <div className="flex flex-col gap-6">
        {incomeCategories.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Income
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {incomeCategories.map((category) => (
                <IncomeCategoryCard
                  key={category.uid}
                  category={category}
                  transactions={transactionsForCategory(category)}
                  onEdit={setEditingCategory} />
              ))}
            </div>
          </div>
        )}

        {expenseCategories.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Expenses
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expenseCategories.map((category) => (
                <ExpenseCategoryCard
                  key={category.uid}
                  category={category}
                  transactions={transactionsForCategory(category)}
                  onEdit={setEditingCategory} />
              ))}
            </div>
          </div>
        )}
      </div>
      {
        editingCategory && (
          <EditCategory
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
          />
        )
      }
    </>
  );
}
