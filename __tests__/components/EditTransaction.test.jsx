import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditTransaction from "../../app/components/EditTransaction";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock("../../app/services/transaction-service", () => ({
  updateTransaction: jest.fn(() => Promise.resolve()),
  deleteTransaction: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../app/hooks/useCategoriesByMonth", () => ({
  useCategoriesForMonth: jest.fn(() => [
    { uid: "cat-1", name: "Salary",    type: "income",  endDate: null },
    { uid: "cat-2", name: "Groceries", type: "expense", endDate: null },
  ]),
}));

import { updateTransaction, deleteTransaction } from "../../app/services/transaction-service";

const mockOnClose = jest.fn();

const incomeTransaction = {
  uid: "tx-1",
  budgetbook: "book-1",
  amount: 1000,
  description: "June salary",
  date: "2026-06-01",
  category: "cat-1",
};

const expenseTransaction = {
  uid: "tx-2",
  budgetbook: "book-1",
  amount: -50,
  description: "Weekly groceries",
  date: "2026-06-05",
  category: "cat-2",
};

const renderComponent = (transaction = incomeTransaction) =>
  render(<EditTransaction transaction={transaction} onClose={mockOnClose} />);

describe("EditTransaction", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("rendering", () => {
    it("shows the modal when rendered", () => {
      renderComponent();
      expect(screen.getByRole("heading", { name: "Edit Transaction" })).toBeInTheDocument();
    });

    it("pre-fills description from transaction", () => {
      renderComponent();
      expect(screen.getByPlaceholderText("Description").value).toBe("June salary");
    });

    it("pre-fills amount from transaction", () => {
      renderComponent();
      expect(screen.getByPlaceholderText("Amount").value).toBe("1000");
    });

    it("pre-fills date from transaction", () => {
      renderComponent();
      expect(screen.getByDisplayValue("2026-06-01")).toBeInTheDocument();
    });

    it("sets type to income when amount is positive", () => {
      renderComponent(incomeTransaction);
      expect(screen.getByText("Income")).toBeInTheDocument();
    });

    it("sets type to expense when amount is negative", () => {
      renderComponent(expenseTransaction);
      // amount should be shown as absolute value
      expect(screen.getByPlaceholderText("Amount").value).toBe("50");
    });

    it("renders Cancel and Save buttons", () => {
      renderComponent();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("renders a Delete button", () => {
      renderComponent();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });
  });

  describe("type switching", () => {
    it("switches to expense type when Expense is clicked", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Expense"));
      // category should reset — only expense categories shown
      expect(screen.getByText("Groceries")).toBeInTheDocument();
      expect(screen.queryByText("Salary")).not.toBeInTheDocument();
    });

    it("switches to income type when Income is clicked", () => {
      renderComponent(expenseTransaction);
      fireEvent.click(screen.getByText("Income"));
      expect(screen.getByText("Salary")).toBeInTheDocument();
      expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    });
  });

  describe("modal close", () => {
    it("calls onClose when Cancel is clicked", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Cancel"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("submitting", () => {
    it("calls updateTransaction with correct data for income", async () => {
      renderComponent();
      fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "Updated salary" } });
      fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "1200" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() =>
        expect(updateTransaction).toHaveBeenCalledWith(
          "tx-1",
          expect.objectContaining({
            amount: 1200,
            description: "Updated salary",
            budgetbook: "book-1",
          })
        )
      );
    });

    it("calls updateTransaction with negative amount for expense", async () => {
      renderComponent(expenseTransaction);
      fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "75" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() =>
        expect(updateTransaction).toHaveBeenCalledWith(
          "tx-2",
          expect.objectContaining({ amount: -75 })
        )
      );
    });

    it("calls updateTransaction with null category when No category is selected", async () => {
      renderComponent();
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() =>
        expect(updateTransaction).toHaveBeenCalledWith(
          "tx-1",
          expect.objectContaining({ category: null })
        )
      );
    });

    it("calls onClose after successful save", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
    });
  });

  describe("deleting", () => {
    it("shows delete confirmation modal when Delete is clicked", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Delete"));
      expect(screen.getByText("Delete Transaction")).toBeInTheDocument();
    });

    it("does not call deleteTransaction before confirming", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Delete"));
      expect(deleteTransaction).not.toHaveBeenCalled();
    });

    it("calls deleteTransaction when delete is confirmed", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Delete"));
      // click the confirm Delete button inside the confirmation modal
      const deleteButtons = screen.getAllByText("Delete");
      fireEvent.click(deleteButtons[deleteButtons.length - 1]);

      await waitFor(() => expect(deleteTransaction).toHaveBeenCalledWith("tx-1"));
    });

    it("calls onClose after successful delete", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Delete"));
      const deleteButtons = screen.getAllByText("Delete");
      fireEvent.click(deleteButtons[deleteButtons.length - 1]);

      await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
    });

    it("hides the delete modal when Cancel is clicked inside it", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Delete"));
      expect(screen.getByText("Delete Transaction")).toBeInTheDocument();

      const cancelButtons = screen.getAllByText("Cancel");
      fireEvent.click(cancelButtons[cancelButtons.length - 1]);

      expect(screen.queryByText("Delete Transaction")).not.toBeInTheDocument();
    });
  });
});