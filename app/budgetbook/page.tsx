"use client";
import Link from "next/link";
import { Budgetbook } from "../lib/schemas";
import { watchBudgetBooks } from "../services/budgetbook-service";
import { useEffect, useState } from "react";

export default function Home() {
  const [budgetbooks, setBudgetBooks] = useState<Budgetbook[]>([]);

  useEffect(() => {
    const unsubscribe = watchBudgetBooks((budgetbooks) => {
      setBudgetBooks(budgetbooks);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="p-24">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      <ul>
        {budgetbooks.map((budgetbook: Budgetbook) => (
          <li key={budgetbook.uid}>{budgetbook.name}</li>
        ))}
      </ul>

      <hr />
      <Link href="/budgetbook/create">Create New Budget Book</Link>
    </main>
  );
}
