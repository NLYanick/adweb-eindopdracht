"use client";
import Link from "next/link";
import { Budgetbook } from "../../lib/schemas";
import { watchBudgetBooks } from "../../services/budgetbook-service";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import BudgetBookItem from "@/app/components/BudgeBookRow";
import { btn } from "@/app/lib/button";

export default function Home() {
  const [showArchived, setArchived] = useState(false);
  const { loading, user } = useAuth();
  const [budgetbooks, setBudgetBooks] = useState<Budgetbook[]>([]);

  useEffect(() => {
    if (loading || !user) return;
    const unsubscribe = watchBudgetBooks(user.uid, showArchived, setBudgetBooks);
    return () => unsubscribe();
  }, [user, loading, showArchived]);

  return (
    <main className="p-20">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-gray-900">
            {showArchived ? "Archived books" : "Budget books"}
          </h1>
          <button
            onClick={() => setArchived(!showArchived)}
            className="mt-1 text-xs font-mono text-gray-500 underline underline-offset-2 hover:text-gray-900 transition-colors"
          >
            {showArchived ? "Show active" : "Show archived"}
          </button>
        </div>
        {!showArchived && (
          <Link href="/budgetbook/create" className={btn.primary}>
            + New book
          </Link>
        )}
      </div>

      {budgetbooks.length === 0 ? (
        <p className="text-center font-mono text-sm text-gray-400 py-16">
          {showArchived ? "No archived books." : "No budget books yet."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {budgetbooks.map((budgetbook) => (
            <BudgetBookItem key={budgetbook.uid} budgetbook={budgetbook} />
          ))}
        </ul>
      )}
    </main>
  );
}