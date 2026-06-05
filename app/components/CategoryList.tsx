import { useTransactionsByMonth } from "../hooks/useTransactionsByMonth";
import { Category } from "../lib/schemas";
import ExpenseCategoryCard from "./ExpenseCategoryCard";
import IncomeCategoryCard from "./IncomeCategoryCard";

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
  const transactions = useTransactionsByMonth(
    budgetbookId,
    year,
    month
  );

  const categories = useTransactionsByMonth(
    budgetbookId,
    year,
    month
  );

  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-8">
        No categories yet. Add one to get started.
      </p>
    );
  }

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  // transactions per category — passed down so cards don't fetch individually
  const transactionsForCategory = (category: string) =>
    transactions.filter((t) => t.category === categoryId);

  return (
    <div className="flex flex-col gap-6">
      {incomeCategories.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            Income
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {incomeCategories.map((category) => (
              <IncomeCategoryCard
                key={category.id}
                category={category}
                transactions={transactionsForCategory(category.id)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
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
                key={category.id}
                category={category}
                transactions={transactionsForCategory(category.id)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
