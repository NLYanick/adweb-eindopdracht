import Link from "next/link";
import { restoreBudgetBook } from "../services/budgetbook-service";
import { Budgetbook } from "../lib/schemas";
import { useAuth } from "../context/AuthContext";
import { btn } from "../lib/button";

export default function BudgetBookItem({ budgetbook }: { budgetbook: Budgetbook }) {
  const { user } = useAuth();

  return (
    <li className="border p-3 rounded grid grid-cols-[20ch_1fr_auto_auto] items-center gap-4">
      <span className="truncate font-medium">
        {budgetbook.name}
      </span>

      <span className="text-gray-600 truncate">
        {budgetbook.description}
      </span>

      <span className="text-sm text-gray-500">
        {budgetbook.owner === user?.uid ? "Owner" : "Shared"}
      </span>

      {budgetbook.archived ? (
        <button
          onClick={() => restoreBudgetBook(budgetbook.uid)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
        >
          Restore
        </button>
      ) : (
        <Link
          href={`/budgetbook/${budgetbook.uid}`}
          className={btn.success}
        >
          Detail
        </Link>
      )}
    </li>
  );
}