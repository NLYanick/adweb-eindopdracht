import { render, screen, fireEvent } from "@testing-library/react";
import TransactionsMonthNav from "../../app/components/TransactionsMonthNav";
import "@testing-library/jest-dom";

jest.mock("motion/react", () => ({
  motion: {
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("TransactionsMonthNav", () => {
  const mockPrev = jest.fn();
  const mockNext = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders the month label", () => {
    render(<TransactionsMonthNav monthLabel="June 2026" prevMonth={mockPrev} nextMonth={mockNext} />);
    expect(screen.getByText("June 2026")).toBeInTheDocument();
  });

  it("calls prevMonth when previous button is clicked", () => {
    render(<TransactionsMonthNav monthLabel="June 2026" prevMonth={mockPrev} nextMonth={mockNext} />);
    fireEvent.click(screen.getByLabelText("Previous month"));
    expect(mockPrev).toHaveBeenCalledTimes(1);
  });

  it("calls nextMonth when next button is clicked", () => {
    render(<TransactionsMonthNav monthLabel="June 2026" prevMonth={mockPrev} nextMonth={mockNext} />);
    fireEvent.click(screen.getByLabelText("Next month"));
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("renders prev and next buttons", () => {
    render(<TransactionsMonthNav monthLabel="June 2026" prevMonth={mockPrev} nextMonth={mockNext} />);
    expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
    expect(screen.getByLabelText("Next month")).toBeInTheDocument();
  });
});
