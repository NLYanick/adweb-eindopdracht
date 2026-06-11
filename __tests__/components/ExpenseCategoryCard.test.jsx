import { render, screen, fireEvent } from "@testing-library/react";
import ExpenseCategoryCard from "../../app/components/ExpenseCategoryCard";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock("../../app/components/AnimatedNumber", () => ({
  __esModule: true,
  default: ({ value }) => <span>{value}</span>,
}));

jest.mock("../../app/hooks/useExpenseCardData", () => ({
  useExpenseCardData: jest.fn(),
}));

import { useExpenseCardData } from "../../app/hooks/useExpenseCardData";

const mockCategory = {
  uid: "cat-1",
  budgetbook: "book-1",
  type: "expense",
  name: "Groceries",
  budget: 500,
  endDate: null,
};

const mockTransactions = [
  { uid: "tx-1", budgetbook: "book-1", amount: -100, date: "2026-06-01", category: "cat-1" },
  { uid: "tx-2", budgetbook: "book-1", amount: -200, date: "2026-06-10", category: "cat-1" },
];

const defaultCardData = {
  expenses: 300,
  income: 0,
  effectiveBudget: 500,
  remaining: 200,
  percentage: 60,
};

const renderCard = (overrides = {}) => {
  useExpenseCardData.mockReturnValue({ ...defaultCardData, ...overrides });
  return render(
    <ExpenseCategoryCard
      category={mockCategory}
      transactions={mockTransactions}
      onEdit={jest.fn()}
    />
  );
};

describe("ExpenseCategoryCard", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("rendering", () => {
    it("renders the category name", () => {
      renderCard();
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });

    it("renders the Expense badge", () => {
      renderCard();
      expect(screen.getByText("Expense")).toBeInTheDocument();
    });

    it("renders spent and budget amounts", () => {
      renderCard();
      expect(screen.getByText(/300/)).toBeInTheDocument();
      expect(screen.getByText(/500/)).toBeInTheDocument();
    });

    it("shows no end date text when endDate is not set", () => {
      renderCard();
      expect(screen.getByText("No end date")).toBeInTheDocument();
    });

    it("shows end date when set", () => {
      const categoryWithEndDate = { ...mockCategory, endDate: "2026-08-01" };
      useExpenseCardData.mockReturnValue(defaultCardData);
      render(
        <ExpenseCategoryCard
          category={categoryWithEndDate}
          transactions={mockTransactions}
          onEdit={jest.fn()}
        />
      );
      expect(screen.getByText(/Aug 2026/)).toBeInTheDocument();
    });

    it("renders the edit button", () => {
      renderCard();
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });
  });

  describe("status badge", () => {
    it("shows OK when under 80%", () => {
      renderCard({ percentage: 60 });
      expect(screen.getByText("OK")).toBeInTheDocument();
    });

    it("shows Almost when between 80% and 95%", () => {
      renderCard({ percentage: 85 });
      expect(screen.getByText("Almost")).toBeInTheDocument();
    });

    it("shows Max when above 95% but not over budget", () => {
      renderCard({ percentage: 96, expenses: 480, remaining: 20 });
      expect(screen.getByText("Max")).toBeInTheDocument();
    });

    it("shows Over when expenses exceed budget", () => {
      renderCard({ percentage: 110, expenses: 550, remaining: -50 });
      expect(screen.getByText("Over")).toBeInTheDocument();
    });
  });

  describe("conditional sections", () => {
    it("shows income added when income > 0", () => {
      renderCard({ income: 100 });
      expect(screen.getByText(/income added/)).toBeInTheDocument();
    });

    it("does not show income added when income is 0", () => {
      renderCard({ income: 0 });
      expect(screen.queryByText(/income added/)).not.toBeInTheDocument();
    });

    it("shows over budget message when remaining is negative", () => {
      renderCard({ remaining: -50, expenses: 550, percentage: 110 });
      expect(screen.getByText(/over budget/)).toBeInTheDocument();
    });

    it("does not show over budget when remaining is positive", () => {
      renderCard({ remaining: 200 });
      expect(screen.queryByText(/over budget/)).not.toBeInTheDocument();
    });
  });

  describe("edit button", () => {
    it("calls onEdit with the category when clicked", () => {
      const mockOnEdit = jest.fn();
      useExpenseCardData.mockReturnValue(defaultCardData);
      render(
        <ExpenseCategoryCard
          category={mockCategory}
          transactions={mockTransactions}
          onEdit={mockOnEdit}
        />
      );
      fireEvent.click(screen.getByText("Edit"));
      expect(mockOnEdit).toHaveBeenCalledWith(mockCategory, expect.any(Function));
    });
  });
});
