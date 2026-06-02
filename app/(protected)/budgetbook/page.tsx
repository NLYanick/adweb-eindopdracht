"use client";
import Link from "next/link";
import { Budgetbook } from "../../lib/schemas";
import { watchBudgetBooks } from "../../services/budgetbook-service";
import { restoreBudgetBook } from "@/app/services/budgetbook-service";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const showArchived = searchParams.get("archived") === "true";
  const { loading, user } = useAuth();
  const [budgetbooks, setBudgetBooks] = useState<Budgetbook[]>([]);

  useEffect(() => {
    if (loading || !user) return;
    const unsubscribe = watchBudgetBooks(user.uid, showArchived ,(budgetbooks) => {
      setBudgetBooks(budgetbooks);
    });

    return () => unsubscribe();
  }, [user, loading,showArchived]);

  return (
    <main className="p-24">
      <div className="flex items-center gap-4 justify-between">
        <div>
        <h1 className="text-3xl font-bold underline">
          {showArchived ? "Archived books" : "Budget books"}
        </h1>
        <Link
          href={showArchived ? "/budgetbook" : "/budgetbook?archived=true"}
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          {showArchived ? "Show active" : "Show archived"}
        </Link>
        </div>
        <Link 
          href="/budgetbook/create"
          className="bg-blue-500 text-white p-2 rounded  hover:bg-blue-400"
        >
          Create new
        </Link>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
          {budgetbooks.map((budgetbook) => (
          <BudgetBookItem
            key={budgetbook.uid}
            budgetbook={budgetbook}
          />
        ))}
      </ul>
    </main>
  );
}

function BudgetBookItem({ budgetbook }: { budgetbook: Budgetbook }) {
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
          href={`/budgetbook/${budgetbook.uid}/edit`}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400"
        >
          Edit
        </Link>
      )}
    </li>
  );
}

