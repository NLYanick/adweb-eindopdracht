import { render, screen, fireEvent } from "@testing-library/react";
import TransactionRow from "../../app/components/TransactionRow";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockCategories = [
  { uid: "cat-1", name: "Salary", type: "income", endDate: null },
  { uid: "cat-2", name: "Groceries", type: "expense", endDate: null },
];

const incomeTransaction = {
  uid: "tx-1",
  budgetbook: "book-1",
  amount: 1000,
  date: "2026-06-01",
  description: "June salary",
  category: "cat-1",
};

const expenseTransaction = {
  uid: "tx-2",
  budgetbook: "book-1",
  amount: -50,
  date: "2026-06-05",
  description: "Weekly groceries",
  category: "cat-2",
};

const uncategorisedTransaction = {
  uid: "tx-3",
  budgetbook: "book-1",
  amount: -20,
  date: "2026-06-10",
  description: "Mystery spend",
  category: null,
};

describe("TransactionRow", () => {
  const mockOnEdit = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  describe("rendering", () => {
    it("renders the transaction description", () => {
      render(<TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.getByText("June salary")).toBeInTheDocument();
    });

    it("renders 'Untitled transaction' when description is empty", () => {
      const t = { ...incomeTransaction, description: "" };
      render(<TransactionRow transaction={t} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.getByText("Untitled transaction")).toBeInTheDocument();
    });

    it("renders the transaction date", () => {
      render(<TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.getByText("2026-06-01")).toBeInTheDocument();
    });

    it("renders the category name when category is set", () => {
      render(<TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.getByText("Salary")).toBeInTheDocument();
    });

    it("does not render a category badge when category is null", () => {
      render(<TransactionRow transaction={uncategorisedTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.queryByText("Salary")).not.toBeInTheDocument();
      expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    });
  });

  describe("amount formatting", () => {
    it("shows + prefix for income", () => {
      render(<TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.getByText(/\+/)).toBeInTheDocument();
    });

    it("shows − prefix for expenses", () => {
      render(<TransactionRow transaction={expenseTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.getByText(/−/)).toBeInTheDocument();
    });

    it("formats amount to 2 decimal places", () => {
      render(<TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.getByText(/1000\.00/)).toBeInTheDocument();
    });

    it("uses absolute value for expenses", () => {
      render(<TransactionRow transaction={expenseTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.getByText(/50\.00/)).toBeInTheDocument();
      expect(screen.queryByText(/-50/)).not.toBeInTheDocument();
    });
  });

  describe("edit button", () => {
    it("renders an edit button", () => {
      render(<TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("calls onEdit with the transaction when edit is clicked", () => {
      render(<TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      fireEvent.click(screen.getByText("Edit"));
      expect(mockOnEdit).toHaveBeenCalledWith(incomeTransaction, expect.any(Function));
    });

    it("calls onEdit exactly once", () => {
      render(<TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      fireEvent.click(screen.getByText("Edit"));
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe("category updates", () => {
    it("clears category display when transaction category becomes null", () => {
      const { rerender } = render(
        <TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />
      );
      expect(screen.getByText("Salary")).toBeInTheDocument();

      rerender(
        <TransactionRow
          transaction={{ ...incomeTransaction, category: null }}
          onEdit={mockOnEdit}
          categories={mockCategories}
        />
      );
      expect(screen.queryByText("Salary")).not.toBeInTheDocument();
    });

    it("updates category display when categories prop changes", () => {
      const { rerender } = render(
        <TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />
      );
      expect(screen.getByText("Salary")).toBeInTheDocument();

      rerender(
        <TransactionRow
          transaction={incomeTransaction}
          onEdit={mockOnEdit}
          categories={[{ uid: "cat-1", name: "Updated Salary", type: "income", endDate: null }]}
        />
      );
      expect(screen.getByText("Updated Salary")).toBeInTheDocument();
    });
  });

  describe("drag behaviour", () => {
    it("sets transactionId on dragStart", () => {
      render(<TransactionRow transaction={incomeTransaction} onEdit={mockOnEdit} categories={mockCategories} />);
      const row = screen.getByText("June salary").closest("div");
      const mockSetData = jest.fn();
      fireEvent.dragStart(row, { dataTransfer: { setData: mockSetData } });
      expect(mockSetData).toHaveBeenCalledWith("transactionId", "tx-1");
    });
  });
});
