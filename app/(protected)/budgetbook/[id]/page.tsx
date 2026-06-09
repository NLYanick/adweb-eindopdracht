"use client";

import { useAuth } from "@/app/context/AuthContext";
import { getBudgetBook } from "@/app/services/budgetbook-service";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { btn } from "@/app/lib/button";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Legend,
} from "recharts";
import MetricsCards from "@/app/components/MetricsCards";
import TransactionsMonthNav from "@/app/components/TransactionsMonthNav";
import { useCategoriesForMonth } from "@/app/hooks/useCategoriesByMonth";
import BackButton from "@/app/components/BackButton";
import { useTransactionsByMonth } from "@/app/hooks/useTransactionsByMonth";
import TransactionPanel from "@/app/components/TransactionsPanel";
import CategoryList from "@/app/components/CategoryList";

export default function BudgetBookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [debouncedMonth, setDebouncedMonth] = useState(month);
  const [debouncedYear, setDebouncedYear] = useState(year);

  const transactions = useTransactionsByMonth(id, debouncedYear, debouncedMonth);
  const categories   = useCategoriesForMonth(id, debouncedYear, debouncedMonth);

  useEffect(() => {
    if (!user) return;
    getBudgetBook(id).then((data) => {
      if (!data || data.archived) { router.push("/budgetbook"); return; }
      if (data.owner !== user.uid && !data.sharedWith?.includes(user.uid)) {
        router.push("/budgetbook"); return;
      }
      setName(data.name);
      setDescription(data.description || "");
    });
  }, [id, user]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedMonth(month);
      setDebouncedYear(year);
    }, 200);
    return () => clearTimeout(t);
  }, [month, year]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthLabel = new Date(year, month - 1).toLocaleString("default", {
    month: "long", year: "numeric",
  });

  const total    = transactions.reduce((s, t) => s + t.amount, 0);
  const income   = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);

  // Line data
  type DayEntry = { day: number; income: number; expenses: number };
  const byDay = new Map<number, DayEntry>();

  for (const t of transactions) {
    const day = new Date(t.date).getDate();
    const entry = byDay.get(day) ?? { day, income: 0, expenses: 0 };

    if (t.amount > 0) entry.income   += t.amount;
    else              entry.expenses += Math.abs(t.amount);

    byDay.set(day, entry);
  }

  const lineData = Array.from(byDay.values()).sort((a, b) => a.day - b.day);

  // Bar data
  type CategoryEntry = { category: string; amount: number };
  const byCategory: Record<string, number> = {};
  const categoryMap = Object.fromEntries(categories.map(c => [c.uid, c.name]));

  for (const t of transactions.filter(t => t.amount < 0)) {
    const cat = categoryMap[t.category || ""] || "Other";
    byCategory[cat] = (byCategory[cat] ?? 0) + Math.abs(t.amount);
  }

  const barData: CategoryEntry[] = Object.entries(byCategory)
    .map(([category, amount]) => ({ category, amount }));

  return (
    <main className="p-20">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-gray-900">{name}</h1>
          {description && <p className="font-mono text-xs text-gray-400 mt-1">{description}</p>}
        </div>
        <Link href={`/budgetbook/${id}/edit`} className={btn.success}>Edit</Link>
      </div>

      <BackButton href="/budgetbook" label="Back To Budget Books" />

      <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase mb-3 mt-8">Overview</p>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-3">
            Income &amp; expenses — monthly
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontFamily: "DM Mono", fontSize: 10 }} />
              <YAxis tick={{ fontFamily: "DM Mono", fontSize: 10 }} />
              <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11 }} />
              <Line type="monotone" dataKey="income"   stroke="#639922" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="#E24B4A" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-3">
            Expenses by category
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontFamily: "DM Mono", fontSize: 10 }} />
              <YAxis tick={{ fontFamily: "DM Mono", fontSize: 10 }} />
              <Bar dataKey="amount" fill="#7F77DD" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <TransactionsMonthNav monthLabel={monthLabel} prevMonth={prevMonth} nextMonth={nextMonth} />

      <MetricsCards total={total} income={income} expenses={expenses} />

      {/* Two-column layout — no tabs */}
      <div className="grid grid-cols-2 gap-4 mt-6 items-start">
        <TransactionPanel budgetbookId={id} month={month} year={year} />
        <CategoryList     budgetbookId={id} month={month} year={year} />
      </div>
    </main>
  );
}