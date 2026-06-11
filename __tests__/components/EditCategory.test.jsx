import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditCategory from "../../app/components/EditCategory";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock("../../app/services/category-service", () => ({
  updateCategory: jest.fn(() => Promise.resolve()),
  deleteCategory: jest.fn(() => Promise.resolve()),
}));

import { deleteCategory, updateCategory } from "../../app/services/category-service";
const mockCategory = {
  uid: "cat-1",
  budgetbook: "book-1",
  type: "expense",
  name: "drumsticks",
  budget: null,
};

const onCloseMock = jest.fn()
const renderComponent = () => render(<EditCategory category={mockCategory} onClose={onCloseMock} />);

describe("EditCategory", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("modal open/close", () => {
    it("shows the modal when EditingCategory is supplied", () => {
      renderComponent();
      expect(screen.getByRole("heading", { name: "Edit Category" })).toBeInTheDocument();
    });

    it("calls close function the modal when Cancel is clicked", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Cancel"));
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("switches to income type when Income is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Income"));
    // budget field should NOT be required for income
    expect(screen.getByPlaceholderText(/Budget/)).not.toBeRequired();
  });

  it("shows optional budget placeholder for income", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Income"));
    expect(screen.getByPlaceholderText(/Optional/)).toBeInTheDocument();
  });

  describe("submitting", () => {
    it("calls updateCategory with correct data for expense", async () => {
      renderComponent();
      fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Groceries" } });
      fireEvent.change(screen.getByPlaceholderText(/Budget/), { target: { value: "300" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() =>
        expect(updateCategory).toHaveBeenCalledWith(
          "cat-1", {
          budgetbook: "book-1",
          type: "expense",
          name: "Groceries",
          budget: 300,
          endDate: undefined,
        })
      );
    });

    it("calls updateCategory with correct data for income", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Income"));
      fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Salary" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() =>

        expect(updateCategory).toHaveBeenCalledWith(
          "cat-1",
          {
            budgetbook: "book-1",
            type: "income",
            name: "Salary",
            budget: null,
          }
        ));
    });

    it("closes the modal after successful submit", async () => {
      renderComponent();
      fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Groceries" } });
      fireEvent.change(screen.getByPlaceholderText(/Budget/), { target: { value: "300" } });
      fireEvent.click(screen.getByText("Save"));

      await waitFor(() =>
        expect(onCloseMock).toHaveBeenCalled()
      );
    });

    it("shows delete modal when pressing delete", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Delete"));
      expect(screen.getByText("Delete Category")).toBeInTheDocument();
      fireEvent.click(screen.queryByTestId("delete-category-modal"));

      await waitFor(() =>
        expect(deleteCategory).toHaveBeenCalled()
      );
    });

    it("calls delete when pressing delete second delete", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Delete"));
      expect(screen.getByText("Delete Category")).toBeInTheDocument();
      fireEvent.click(screen.queryByTestId("delete-category-modal"));

      await waitFor(() =>
        expect(deleteCategory).toHaveBeenCalled()
      );
    });

    it("closes modal after successful delete", async () => {
      renderComponent();
      fireEvent.click(screen.getByText("Delete"));
      expect(screen.getByText("Delete Category")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("delete-category-modal"));

      await waitFor(() =>
        expect(onCloseMock).toHaveBeenCalled()
      );
    });
  });
});
