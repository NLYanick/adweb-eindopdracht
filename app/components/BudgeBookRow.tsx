import Link from "next/link";
import { restoreBudgetBook } from "../services/budgetbook-service";
import { Budgetbook } from "../lib/schemas";

export default function BudgetBookItem({ budgetbook }: { budgetbook: Budgetbook }) {
  return (
    <li className="border p-3 rounded grid grid-cols-[20ch_1fr_auto] items-center gap-4">
      <span className="truncate font-medium">
        {budgetbook.name}
      </span>

      <span className="text-gray-600 truncate">
        {budgetbook.description}
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
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400"
        >
          Detail
        </Link>
      )}
    </li>
  );
}