import { useExpenseCardData } from "../../app/hooks/useExpenseCardData";

const category = {
  uid: "cat-1",
  budgetbook: "book-1",
  type: "expense",
  name: "Groceries",
  budget: 500,
  endDate: null,
};

const transactions = [
  { uid: "tx-1", budgetbook: "book-1", amount: -100, date: "2026-06-01", category: "cat-1" },
  { uid: "tx-2", budgetbook: "book-1", amount: -200, date: "2026-06-10", category: "cat-1" },
  { uid: "tx-3", budgetbook: "book-1", amount: 50,   date: "2026-06-05", category: "cat-1" }, // income on expense category
  { uid: "tx-4", budgetbook: "book-1", amount: -999, date: "2026-06-15", category: "other"  }, // different category
];

describe("useExpenseCardData", () => {
  describe("expenses", () => {
    it("sums only negative transactions for this category", () => {
      const { expenses } = useExpenseCardData(transactions, category);
      expect(expenses).toBe(300);
    });

    it("ignores transactions from other categories", () => {
      const { expenses } = useExpenseCardData(transactions, category);
      expect(expenses).not.toBe(1299);
    });

    it("returns 0 when no expense transactions", () => {
      const { expenses } = useExpenseCardData([], category);
      expect(expenses).toBe(0);
    });
  });

  describe("income", () => {
    it("sums positive transactions for this category", () => {
      const { income } = useExpenseCardData(transactions, category);
      expect(income).toBe(50);
    });

    it("returns 0 when no income transactions", () => {
      const noIncome = transactions.filter(t => t.amount < 0);
      const { income } = useExpenseCardData(noIncome, category);
      expect(income).toBe(0);
    });
  });

  describe("effectiveBudget", () => {
    it("adds income to budget when budget is set", () => {
      const { effectiveBudget } = useExpenseCardData(transactions, category);
      expect(effectiveBudget).toBe(550); // 500 budget + 50 income
    });

    it("uses only income when budget is null", () => {
      const noBudgetCategory = { ...category, budget: null };
      const { effectiveBudget } = useExpenseCardData(transactions, noBudgetCategory);
      expect(effectiveBudget).toBe(50); // just the income
    });

    it("returns 0 when no budget and no income", () => {
      const noBudgetCategory = { ...category, budget: null };
      const noIncome = transactions.filter(t => t.amount < 0);
      const { effectiveBudget } = useExpenseCardData(noIncome, noBudgetCategory);
      expect(effectiveBudget).toBe(0);
    });
  });

  describe("remaining", () => {
    it("calculates remaining as effectiveBudget minus expenses", () => {
      const { remaining } = useExpenseCardData(transactions, category);
      expect(remaining).toBe(250); // 550 - 300
    });

    it("returns negative value when over budget", () => {
      const overBudget = [
        { uid: "tx-1", budgetbook: "book-1", amount: -600, date: "2026-06-01", category: "cat-1" },
      ];
      const { remaining } = useExpenseCardData(overBudget, category);
      expect(remaining).toBe(-100); // 500 - 600
    });
  });

  describe("percentage", () => {
    it("calculates correct percentage of budget used", () => {
      const simple = [
        { uid: "tx-1", budgetbook: "book-1", amount: -250, date: "2026-06-01", category: "cat-1" },
      ];
      const { percentage } = useExpenseCardData(simple, category);
      expect(percentage).toBe(50);
    });

    it("caps percentage at 100 when over budget", () => {
      const overBudget = [
        { uid: "tx-1", budgetbook: "book-1", amount: -600, date: "2026-06-01", category: "cat-1" },
      ];
      const { percentage } = useExpenseCardData(overBudget, category);
      expect(percentage).toBe(100);
    });

    it("returns 0 when effectiveBudget is 0", () => {
      const noBudgetCategory = { ...category, budget: null };
      const { percentage } = useExpenseCardData([], noBudgetCategory);
      expect(percentage).toBe(0);
    });
  });
});
