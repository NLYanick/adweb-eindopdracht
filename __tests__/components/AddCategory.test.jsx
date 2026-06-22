import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddCategory from "../../app/components/AddCategory";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock("../../app/services/category-service", () => ({
  createCategory: jest.fn(() => Promise.resolve()),
}));

import { createCategory } from "../../app/services/category-service";

const renderComponent = () => render(<AddCategory budgetbookId="book-1" />);

describe("AddCategory", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("modal open/close", () => {
    it("does not show the modal on initial render", () => {
      renderComponent();
      expect(screen.queryByTestId("add-category-modal")).not.toBeInTheDocument();
    });

    it("shows the modal when Add Category button is clicked", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      expect(screen.getByRole("heading", { name: "Add Category" })).toBeInTheDocument();
    });

    it("closes the modal when Cancel is clicked", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      fireEvent.click(screen.getByText("Cancel"));
      expect(screen.queryByRole("heading", { name: "Add Category" })).not.toBeInTheDocument();
    });
  });

  describe("form behaviour", () => {
    it("defaults to expense type", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      // budget field should be required for expense
      expect(screen.getByPlaceholderText(/Budget/)).toBeRequired();
    });

    it("switches to income type when Income is clicked", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      fireEvent.click(screen.getByText("Income"));
      // budget field should NOT be required for income
      expect(screen.getByPlaceholderText(/Budget/)).not.toBeRequired();
    });

    it("shows optional budget placeholder for income", () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      fireEvent.click(screen.getByText("Income"));
      expect(screen.getByPlaceholderText(/Optional/)).toBeInTheDocument();
    });
  });

  describe("submitting", () => {
    it("calls createCategory with correct data for expense", async () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Groceries" } });
      fireEvent.change(screen.getByPlaceholderText(/Budget/), { target: { value: "300" } });
      fireEvent.click(screen.getByText("Add"));

      await waitFor(() =>
        expect(createCategory).toHaveBeenCalledWith({
          budgetbook: "book-1",
          type: "expense",
          name: "Groceries",
          budget: 300,
          endDate: undefined,
        })
      );
    });

    it("calls createCategory with correct data for income", async () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      fireEvent.click(screen.getByText("Income"));
      fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Salary" } });
      fireEvent.click(screen.getByText("Add"));

      await waitFor(() =>
        expect(createCategory).toHaveBeenCalledWith({
          budgetbook: "book-1",
          type: "income",
          name: "Salary",
          budget: null,
          endDate: undefined,
        })
      );
    });

    it("closes the modal after successful submit", async () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Groceries" } });
      fireEvent.change(screen.getByPlaceholderText(/Budget/), { target: { value: "300" } });
      fireEvent.click(screen.getByText("Add"));

      await waitFor(() =>
        expect(screen.queryByRole("heading", { name: "Add Category" })).not.toBeInTheDocument()
      );
    });

    it("resets the name field after submit", async () => {
      renderComponent();
      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Groceries" } });
      fireEvent.change(screen.getByPlaceholderText(/Budget/), { target: { value: "300" } });
      fireEvent.click(screen.getByText("Add"));

      await waitFor(() => expect(createCategory).toHaveBeenCalled());

      fireEvent.click(screen.queryByTestId("add-category-modal-button"));
      expect(screen.getByPlaceholderText("Name").value).toBe("");
    });
  });
});
