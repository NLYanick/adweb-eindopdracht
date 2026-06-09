import { Category, Transaction } from "../lib/schemas";

export function useExpenseCardData(transactions: Transaction[], category: Category) {
  const expenses = transactions
    .filter(t => t.amount < 0 && t.category === category.uid)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const income = transactions
    .filter(t => t.amount > 0 && t.category === category.uid)
    .reduce((sum, t) => sum + t.amount, 0);

  const effectiveBudget = category.budget ? category.budget + income : income;
  const remaining  = effectiveBudget - expenses;
  const percentage = effectiveBudget > 0
    ? Math.min(Math.round((expenses / effectiveBudget) * 100), 100)
    : 0;

    return { expenses, income, effectiveBudget, remaining, percentage };
}