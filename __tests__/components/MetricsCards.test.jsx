import { render, screen } from "@testing-library/react";
import MetricsCards from "../../app/components/MetricsCards";

describe("MetricsCards", () => {
  it("renders balance, income and expenses", () => {
    render(<MetricsCards income={1000} expenses={500} />);

    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
  });

  it("formats amounts in euros", () => {
    render(<MetricsCards income={1100} expenses={600} />);

    expect(screen.getByText(/1\.100/)).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it("shows negative balance correctly", () => {
    render(<MetricsCards income={300} expenses={500} />);
    expect(screen.getByText(/-\s?200/)).toBeInTheDocument();
  });

  it("shows zero values", () => {
    render(<MetricsCards income={0} expenses={0} />);
    const zeros = screen.getAllByText(/0,00/);
    expect(zeros.length).toBe(3);
  });
});
