import { render, screen, fireEvent } from "@testing-library/react";
import IncomeCategoryCard from "../../app/components/IncomeCategoryCard";

const mockCategory = {
  uid: "cat-1",
  budgetbook: "book-1",
  type: "income",
  name: "Salary",
  budget: null,
};

const mockTransactions = [
  { uid: "tx-1", budgetbook: "book-1", amount: 1000, date: "2026-06-01", category: "cat-1" },
  { uid: "tx-2", budgetbook: "book-1", amount: 500,  date: "2026-06-15", category: "cat-1" },
  { uid: "tx-3", budgetbook: "book-1", amount: 200,  date: "2026-06-20", category: "other-cat" },
];

describe("IncomeCategoryCard", () => {
  const mockOnEdit = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders the category name", () => {
    render(<IncomeCategoryCard category={mockCategory} transactions={mockTransactions} onEdit={mockOnEdit} />);
    expect(screen.getByText("Salary")).toBeInTheDocument();
  });

  it("renders the Income badge", () => {
    render(<IncomeCategoryCard category={mockCategory} transactions={mockTransactions} onEdit={mockOnEdit} />);
    expect(screen.getByText("Income")).toBeInTheDocument();
  });

  it("calculates total income correctly for this category only", () => {
    render(<IncomeCategoryCard category={mockCategory} transactions={mockTransactions} onEdit={mockOnEdit} />);
    expect(screen.getByText("+€1500.00")).toBeInTheDocument();
  });

  it("shows correct transaction count", () => {
    render(<IncomeCategoryCard category={mockCategory} transactions={mockTransactions} onEdit={mockOnEdit} />);
    expect(screen.getByText(/2 transactions/)).toBeInTheDocument();
  });

  it("shows singular transaction when count is 1", () => {
    const singleTransaction = [mockTransactions[0]];
    render(<IncomeCategoryCard category={mockCategory} transactions={singleTransaction} onEdit={mockOnEdit} />);
    expect(screen.getByText(/1 transaction\b/)).toBeInTheDocument();
  });

  it("shows no end date text when endDate is not set", () => {
    render(<IncomeCategoryCard category={mockCategory} transactions={mockTransactions} onEdit={mockOnEdit} />);
    expect(screen.getByText("No end date")).toBeInTheDocument();
  });

  it("shows end date when set", () => {
    const categoryWithEndDate = { ...mockCategory, endDate: "2026-08-01" };
    render(<IncomeCategoryCard category={categoryWithEndDate} transactions={mockTransactions} onEdit={mockOnEdit} />);
    expect(screen.getByText(/Aug 2026/)).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(<IncomeCategoryCard category={mockCategory} transactions={mockTransactions} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(mockOnEdit).toHaveBeenCalledWith(mockCategory, expect.any(Function));
  });
});
