import { Category, Transaction } from "../lib/schemas";


interface ExpenseCategoryCardProps {
  category: Category;
  transactions: Transaction[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export default function ExpenseCategoryCard({
  category,
  transactions,
  onEdit,
  onDelete,
}: ExpenseCategoryCardProps) {
  const expenses = transactions
    .filter((t) => t.amount < 0 && t.category === category.uid)
    .reduce((sum, t) => sum + t.amount, 0);

  const income = transactions
    .filter((t) => t.amount > 0 && t.category === category.uid)
    .reduce((sum, t) => sum + t.amount, 0);

  const effectiveBudget = category.budget + income;
  const remaining = effectiveBudget - expenses;
  const percentage = Math.min((expenses / effectiveBudget) * 100, 100);

  const status =
    percentage >= 100 ? "over" : percentage >= 80 ? "almost" : "ok";

  const statusStyles = {
    ok: {
      badge: "bg-green-100 text-green-800",
      label: "OK",
      bar: "bg-green-500",
    },
    almost: {
      badge: "bg-yellow-100 text-yellow-800",
      label: "Almost",
      bar: "bg-yellow-400",
    },
    over: {
      badge: "bg-red-100 text-red-800",
      label: "Over",
      bar: "bg-red-500",
    },
  };

  const style = statusStyles[status];

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
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
            Expense
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${style.badge}`}>
            {style.label}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${style.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>€{expenses.toFixed(2)} spent</span>
        <span>€{effectiveBudget.toFixed(2)} budget</span>
      </div>

      {income > 0 && (
        <p className="text-xs text-green-600">+€{income.toFixed(2)} income added</p>
      )}

      {remaining < 0 && (
        <p className="text-xs text-red-500">€{Math.abs(remaining).toFixed(2)} over budget</p>
      )}

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit(category)}
          className="text-xs px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category.uid)}
          className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-md hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
