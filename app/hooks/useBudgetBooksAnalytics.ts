import { Category, Transaction } from "../lib/schemas";

export function useBudgetBooksAnalytics(transactions: Transaction[], categories: Category[]) {
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

  return { total, income, expenses, lineData, barData };
}