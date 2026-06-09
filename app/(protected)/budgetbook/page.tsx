"use client";

import Link from "next/link";
import { Budgetbook } from "../../lib/schemas";
import { watchBudgetBooks } from "../../services/budgetbook-service";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import BudgetBookItem from "@/app/components/BudgeBookRow";
import { btn } from "@/app/lib/button";
import { AnimatePresence, motion } from "motion/react";

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
        <header>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={showArchived ? "archived" : "active"}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: 6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="text-2xl font-medium tracking-tight text-gray-900"
            >
              {showArchived ? "Archived books" : "Budget books"}
            </motion.h1>
          </AnimatePresence>
          <button
            onClick={() => setArchived(!showArchived)}
            className="mt-1 text-xs font-mono text-gray-500 underline underline-offset-2 hover:text-gray-900 transition-colors"
          >
            {showArchived ? "Show active" : "Show archived"}
          </button>
        </header>

        <AnimatePresence>
          {!showArchived && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{    opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <Link href="/budgetbook/create" className={btn.primary}>
                + New book
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section>
        <AnimatePresence mode="wait">
          <motion.ul
            key={showArchived ? "archived-list" : "active-list"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2.5"
          >
            <AnimatePresence initial={false}>
              {budgetbooks.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center font-mono text-sm text-gray-400 py-16"
                >
                  {showArchived ? "No archived books." : "No budget books yet."}
                </motion.p>
              ) : (
                budgetbooks.map((budgetbook, i) => (
                  <motion.li
                    key={budgetbook.uid}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{    opacity: 0, x: -12 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: i * 0.05 }}
                  >
                    <BudgetBookItem budgetbook={budgetbook} />
                  </motion.li>
                ))
              )}
            </AnimatePresence>
          </motion.ul>
        </AnimatePresence>
      </section>
    </main>
  );
}