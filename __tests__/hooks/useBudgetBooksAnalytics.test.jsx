import { useBudgetBooksAnalytics } from "../../app/hooks/useBudgetBooksAnalytics";

const categories = [
  { uid: "cat-1", budgetbook: "book-1", type: "expense", name: "Groceries", budget: 500, endDate: null },
  { uid: "cat-2", budgetbook: "book-1", type: "income",  name: "Salary",    budget: null, endDate: null },
];

const transactions = [
  { uid: "tx-1", budgetbook: "book-1", amount:  1000, date: "2026-06-01", category: "cat-2" },
  { uid: "tx-2", budgetbook: "book-1", amount: -200,  date: "2026-06-05", category: "cat-1" },
  { uid: "tx-3", budgetbook: "book-1", amount: -100,  date: "2026-06-05", category: "cat-1" },
  { uid: "tx-4", budgetbook: "book-1", amount: -50,   date: "2026-06-10", category: null    },
];

describe("useBudgetBooksAnalytics", () => {
  describe("totals", () => {
    it("calculates total as sum of all amounts", () => {
      const { total } = useBudgetBooksAnalytics(transactions, categories);
      expect(total).toBe(650); // 1000 - 200 - 100 - 50
    });

    it("calculates income as sum of positive amounts", () => {
      const { income } = useBudgetBooksAnalytics(transactions, categories);
      expect(income).toBe(1000);
    });

    it("calculates expenses as sum of negative amounts", () => {
      const { expenses } = useBudgetBooksAnalytics(transactions, categories);
      expect(expenses).toBe(-350);
    });

    it("returns zeros for empty transactions", () => {
      const { total, income, expenses } = useBudgetBooksAnalytics([], categories);
      expect(total).toBe(0);
      expect(income).toBe(0);
      expect(expenses).toBe(0);
    });
  });

  describe("lineData", () => {
    it("groups transactions by day", () => {
      const { lineData } = useBudgetBooksAnalytics(transactions, categories);
      expect(lineData).toHaveLength(3);
    });

    it("sorts line data by day ascending", () => {
      const { lineData } = useBudgetBooksAnalytics(transactions, categories);
      const days = lineData.map(d => d.day);
      expect(days).toEqual([...days].sort((a, b) => a - b));
    });

    it("accumulates income per day correctly", () => {
      const { lineData } = useBudgetBooksAnalytics(transactions, categories);
      const day1 = lineData.find(d => d.day === 1);
      expect(day1?.income).toBe(1000);
    });

    it("accumulates expenses per day correctly", () => {
      const { lineData } = useBudgetBooksAnalytics(transactions, categories);
      const day5 = lineData.find(d => d.day === 5);
      expect(day5?.expenses).toBe(300); // 200 + 100
    });
  });

  describe("barData", () => {
    it("groups expenses by category name", () => {
      const { barData } = useBudgetBooksAnalytics(transactions, categories);
      const groceries = barData.find(b => b.category === "Groceries");
      expect(groceries?.amount).toBe(300);
    });

    it("uses Other for uncategorised transactions", () => {
      const { barData } = useBudgetBooksAnalytics(transactions, categories);
      const other = barData.find(b => b.category === "Other");
      expect(other?.amount).toBe(50);
    });

    it("does not include income transactions in bar data", () => {
      const { barData } = useBudgetBooksAnalytics(transactions, categories);
      const salary = barData.find(b => b.category === "Salary");
      expect(salary).toBeUndefined();
    });

    it("returns empty barData when no expense transactions", () => {
      const incomeOnly = [
        { uid: "tx-1", budgetbook: "book-1", amount: 1000, date: "2026-06-01", category: "cat-2" },
      ];
      const { barData } = useBudgetBooksAnalytics(incomeOnly, categories);
      expect(barData).toHaveLength(0);
    });
  });
});
