import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddTransaction from "../../app/components/AddTransaction";

// Mock framer motion
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the transaction service
jest.mock("../../app/services/transaction-service", () => ({
  createTransaction: jest.fn(() => Promise.resolve()),
}));

// Mock the categories hook
jest.mock("../../app/hooks/useCategoriesByMonth", () => ({
  useCategoriesForMonth: jest.fn(() => [
    { uid: "cat-1", name: "Salary", type: "income", endDate: null },
    { uid: "cat-2", name: "Groceries", type: "expense", endDate: null },
  ]),
}));

import { createTransaction } from "../../app/services/transaction-service";
import { create } from "node:domain";
import { btn } from "../../app/lib/button";

const renderComponent = () => render(<AddTransaction id="book-1" />);
const openModal = () => fireEvent.click(screen.getByTestId("add-transaction-modal-button"));

describe("AddTransaction", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("modal open/close", () => {
    it("does not show the modal on initial render", () => {
      renderComponent();
      expect(screen.queryByTestId("add-transaction-modal")).not.toBeInTheDocument();
    });

    it("shows the modal when Add Transaction button is clicked", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-transaction-modal-button"));
      expect(screen.queryByTestId("add-transaction-modal")).toBeInTheDocument();
    });

    it("closes the modal when Cancel is clicked", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-transaction-modal-button"));
      fireEvent.click(screen.getByText("Cancel"));
      expect(screen.queryByTestId("add-transaction-modal")).not.toBeInTheDocument();
    });
  });

  describe("form behaviour", () => {
    it("defaults to income type", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-transaction-modal-button"));
      expect(screen.getByText("Income")).toHaveClass(btn.success)
    });

    it("switches to income type when Income is clicked", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-transaction-modal-button"));
      fireEvent.click(screen.getByText("Expense"));
      expect(screen.getByText("Expense")).toHaveClass(btn.danger)
    });

    it("only one type active at a time", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-transaction-modal-button"));
      fireEvent.click(screen.getByText("Income"));

      expect(screen.getByText("Income")).toHaveClass(btn.success)
      expect(screen.getByText("Expense")).toHaveClass(btn.clear)

      fireEvent.click(screen.getByText("Expense"));
      expect(screen.getByText("Expense")).toHaveClass(btn.danger)
      expect(screen.getByText("Income")).toHaveClass(btn.clear)
    });

    it("shows income categories when income is selected", () => {
      renderComponent();
      openModal();
      fireEvent.click(screen.getByText("Income"));
      expect(screen.getByText("Salary")).toBeInTheDocument();
      expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    });

    it("shows expense categories when expense is selected", () => {
      renderComponent();
      openModal();
      fireEvent.click(screen.getByText("Expense"));
      expect(screen.getByText("Groceries")).toBeInTheDocument();
      expect(screen.queryByText("Salary")).not.toBeInTheDocument();
    });

    it("does not submit when amount is empty", async () => {
      renderComponent();
      openModal();
      fireEvent.click(screen.getByText("Add"));
      expect(createTransaction).not.toHaveBeenCalled();
    });
  });

  describe("submitting", () => {
    it("calls createTransaction with correct data for income", async () => {
      renderComponent();
      openModal();
      fireEvent.click(screen.getByText("Income"));
      fireEvent.change(screen.getByPlaceholderText(/Amount/), { target: { value: "1000" } });
      fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "Salary" } });
      fireEvent.click(screen.getByText("Add"));

      await waitFor(() => expect(createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          budgetbook: "book-1",
          amount: 1000,
          description: "Salary",
        })
      ));
    });

    it("calls createTransaction with a negative amount for expense", async () => {
      renderComponent();
      openModal();
      fireEvent.click(screen.getByText("Expense"));
      fireEvent.change(screen.getByPlaceholderText(/Amount/), { target: { value: "50" } });
      fireEvent.click(screen.getByText("Add"));

      await waitFor(() => expect(createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({ amount: -50 })
      ));
    });

    it("closes the modal after successful submit", async () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-transaction-modal-button"));
      fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "Groceries" } });
      fireEvent.change(screen.getByPlaceholderText(/Amount/), { target: { value: "300" } });
      fireEvent.click(screen.getByText("Add"));

      await waitFor(() => expect(createTransaction).toHaveBeenCalled());
      await waitFor(() =>
        expect(screen.queryByRole("heading", { name: "Add Category" })).not.toBeInTheDocument()
      );
    });

    it("resets the name field after submit", async () => {
      renderComponent();
      fireEvent.click(screen.getByTestId("add-transaction-modal-button"));
      fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "Groceries" } });
      fireEvent.change(screen.getByPlaceholderText(/Amount/), { target: { value: "300" } });
      fireEvent.click(screen.getByText("Add"));

      await waitFor(() => expect(createTransaction).toHaveBeenCalled());

      fireEvent.click(screen.getByTestId("add-transaction-modal-button"));
      expect(screen.getByPlaceholderText("Description").value).toBe("");
    });
  });
});
