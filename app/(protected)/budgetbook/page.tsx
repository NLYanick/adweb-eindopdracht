"use client";
import Link from "next/link";
import { Budgetbook } from "../../lib/schemas";
import { watchBudgetBooks } from "../../services/budgetbook-service";
import { restoreBudgetBook } from "@/app/services/budgetbook-service";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";
import BudgetBookItem from "@/app/components/BudgeBookRow";

export default function Home() {
  const searchParams = useSearchParams();
  const [showArchived, setArchived] = useState(false);
  const { loading, user } = useAuth();
  const [budgetbooks, setBudgetBooks] = useState<Budgetbook[]>([]);

  useEffect(() => {
    if (loading || !user) return;
    const unsubscribe = watchBudgetBooks(user.uid, showArchived, (budgetbooks) => {
      setBudgetBooks(budgetbooks);
    });

    return () => unsubscribe();
  }, [user, loading, showArchived]);

  return (
    <main className="p-24">
      <div className="flex items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold underline">
            {showArchived ? "Archived books" : "Budget books"}
          </h1>
          <button
            onClick={() => setArchived(!showArchived)}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            {showArchived ? "Show active" : "Show archived"}
          </button>
        </div>
        {!showArchived &&
          <Link
            href="/budgetbook/create"
            className="bg-blue-500 text-white p-2 rounded  hover:bg-blue-400"
          >
            Create new
          </Link>
        }
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

