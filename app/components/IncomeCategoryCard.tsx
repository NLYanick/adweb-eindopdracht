import { Category, Transaction } from "../lib/schemas";

interface IncomeCategoryCardProps {
  category: Category;
  transactions: Transaction[];
  onEdit: (category: Category) => void;
}

export default function IncomeCategoryCard({
  category,
  transactions,
  onEdit,
}: IncomeCategoryCardProps) {
  const totalIncome = transactions
    .filter((t) => t.amount > 0 && t.category === category.uid)
    .reduce((sum, t) => sum + t.amount, 0);

  const transactionCount = transactions.filter(
    (t) => t.category === category.uid
  ).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-900 text-sm">{category.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {category.endDate
              ? `Ends ${new Date(category.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
              : "No end date"}
          </p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
          Income
        </span>
      </div>

      <div className="mt-1">
        <p className="text-2xl font-medium text-green-600">
          €{totalIncome.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          total earned · {transactionCount}{" "}
          {transactionCount === 1 ? "transaction" : "transactions"}
        </p>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit(category)}
          className="text-xs px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 transition"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
