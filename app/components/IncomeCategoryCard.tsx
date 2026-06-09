import { useRef } from "react";
import { Category, Transaction } from "../lib/schemas";

interface IncomeCategoryCardProps {
  category: Category;
  transactions: Transaction[];
  onEdit: (category: Category, returnFocus: () => void) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  className?: string;
}

export default function IncomeCategoryCard({
  category,
  transactions,
  onEdit,
  onDragOver,
  onDragLeave,
  onDrop,
  className = "",
}: IncomeCategoryCardProps) {
  const totalIncome = transactions
    .filter(t => t.amount > 0 && t.category === category.uid)
    .reduce((sum, t) => sum + t.amount, 0);

  const transactionCount = transactions.filter(t => t.category === category.uid).length;

  const editButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 transition-colors ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-900 text-sm">{category.name}</p>
          <p className="font-mono text-[10px] text-gray-400 mt-0.5">
            {category.endDate
              ? `Ends ${new Date(category.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
              : "No end date"}
          </p>
        </div>
        <span className="font-mono text-[10px] tracking-wide px-2 py-0.5 rounded-full bg-green-50 text-green-800 border border-green-200">
          Income
        </span>
      </div>

      <div>
        <p className="text-xl font-medium text-[#27500A]">+€{totalIncome.toFixed(2)}</p>
        <p className="font-mono text-[10px] text-gray-400 mt-0.5">
          total earned · {transactionCount} {transactionCount === 1 ? "transaction" : "transactions"}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          ref={editButtonRef}
          onClick={() => onEdit(category, () => editButtonRef.current?.focus())}
          className="font-mono text-[11px] px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:border-gray-300 hover:text-gray-900 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
}