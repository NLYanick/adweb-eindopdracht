import Link from "next/link";
import { restoreBudgetBook } from "../services/budgetbook-service";
import { Budgetbook } from "../lib/schemas";
import { useAuth } from "../context/AuthContext";

export default function BudgetBookItem({ budgetbook }: { budgetbook: Budgetbook }) {
  const { user } = useAuth();
  const isOwner = budgetbook.owner === user?.uid;

  return (
    <div className="grid grid-cols-[18ch_1fr_auto_auto] items-center gap-4 bg-white border border-gray-200 rounded-lg px-5 py-3.5 hover:border-gray-300 transition-colors">
      <span className="truncate font-semibold text-[15px] text-gray-900">
        {budgetbook.name}
      </span>

      <span className="truncate font-mono text-[13px] text-gray-500">
        {budgetbook.description}
      </span>

      <span className={`text-[11px] font-mono tracking-wide px-2.5 py-0.5 rounded-full ${
        isOwner
          ? "bg-green-50 text-green-800"
          : "bg-blue-50 text-blue-800"
      }`}>
        {isOwner ? "Owner" : "Shared"}
      </span>

      {budgetbook.archived ? (
        <button
          onClick={() => restoreBudgetBook(budgetbook.uid)}
          className="text-[11px] font-mono tracking-wide border border-blue-400 text-blue-700 rounded-md px-3.5 py-1.5 hover:bg-blue-50 transition-colors"
        >
          Restore
        </button>
      ) : (
        <Link
          href={`/budgetbook/${budgetbook.uid}`}
          className="text-[11px] font-mono tracking-wide border border-gray-400 text-gray-700 rounded-md px-3.5 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Detail →
        </Link>
      )}
    </div>
  );
}