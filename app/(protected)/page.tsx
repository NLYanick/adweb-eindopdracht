"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { btn } from "../lib/button";
import { motion } from "motion/react";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-8 py-24">

        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase mb-3">
            Personal Finance
          </p>

          <h1 className="text-5xl font-medium tracking-tight text-gray-900 mb-4">
            Budgeting Made Simple
          </h1>

          <p className="max-w-2xl text-gray-600 leading-relaxed">
            Welcome
            {user && (
              <span className="font-medium text-gray-900">
                {" "}{user.name}
              </span>
            )}
            . Track income, categorize expenses, and understand where
            your money goes with a simple and focused budgeting system.
          </p>
        </motion.header>

        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex gap-3 mb-16"
        >
          <Link
            href="/budgetbook"
            className={btn.success}
          >
            Open Budget Books
          </Link>
        </motion.section>
      </div>
    </main>
  );
}