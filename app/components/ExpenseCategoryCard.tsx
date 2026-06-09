import { useEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { Category, Transaction } from "../lib/schemas";

interface ExpenseCategoryCardProps {
  category: Category;
  transactions: Transaction[];
  onEdit: (category: Category) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  className?: string;
}

function AnimatedNumber({ value, prefix = "€" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prevRef.current = value;
    return () => controls.stop();
  }, [value]);

  return <span>{prefix}{display.toFixed(2)}</span>;
}

export default function ExpenseCategoryCard({
  category,
  transactions,
  onEdit,
  onDragOver,
  onDragLeave,
  onDrop,
  className = "",
}: ExpenseCategoryCardProps) {
  const expenses = transactions
    .filter(t => t.amount < 0 && t.category === category.uid)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const income = transactions
    .filter(t => t.amount > 0 && t.category === category.uid)
    .reduce((sum, t) => sum + t.amount, 0);

  const effectiveBudget = category.budget ? category.budget + income : income;
  const remaining  = effectiveBudget - expenses;
  const percentage = effectiveBudget > 0
    ? Math.min(Math.round((expenses / effectiveBudget) * 100), 100)
    : 0;

  const status =
    expenses > effectiveBudget ? "over"  :
    percentage > 95            ? "maxed" :
    percentage >= 80           ? "almost": "ok";

  const statusConfig = {
    ok:     { badge: "bg-green-50 text-green-800 border-green-200",  bar: "#97C459", label: "OK"     },
    almost: { badge: "bg-amber-50 text-amber-800 border-amber-200",  bar: "#FAC775", label: "Almost" },
    maxed:  { badge: "bg-red-50 text-red-800 border-red-200",        bar: "#FAC775", label: "Max"    },
    over:   { badge: "bg-red-100 text-red-900 border-red-300",       bar: "#E24B4A", label: "Over"   },
  }[status];

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
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[10px] tracking-wide px-2 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200">
            Expense
          </span>
          <span className={`font-mono text-[10px] tracking-wide px-2 py-0.5 rounded-full border ${statusConfig.badge}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-1.5 rounded-full"
          style={{ background: statusConfig.bar }}
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between font-mono text-[11px] text-gray-500">
        <span><AnimatedNumber value={expenses} /> spent</span>
        <span><AnimatedNumber value={effectiveBudget} /> budget</span>
      </div>

      {income > 0 && (
        <p className="font-mono text-[11px] text-[#3B6D11]">
          +<AnimatedNumber value={income} /> income added
        </p>
      )}

      {remaining < 0 && (
        <p className="font-mono text-[11px] text-[#791F1F]">
          <AnimatedNumber value={Math.abs(remaining)} /> over budget
        </p>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => onEdit(category)}
          className="font-mono text-[11px] px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:border-gray-300 hover:text-gray-900 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
}