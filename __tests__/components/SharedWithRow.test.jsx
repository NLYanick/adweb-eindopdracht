import { render, screen, fireEvent } from "@testing-library/react";
import SharedWithRow from "../../app/components/SharedWithRow";

describe("SharedWithRow", () => {
  const mockUser = { uid: "user-1", email: "john@test.com", name: "John Doe" };
  const mockClick = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders the user name and email", () => {
    render(<SharedWithRow user={mockUser} onClick={mockClick} />);
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/john@test\.com/)).toBeInTheDocument();
  });

  it("renders a remove button", () => {
    render(<SharedWithRow user={mockUser} onClick={mockClick} />);
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("calls onClick with the user when remove is clicked", () => {
    render(<SharedWithRow user={mockUser} onClick={mockClick} />);
    fireEvent.click(screen.getByText("Remove"));
    expect(mockClick).toHaveBeenCalledWith(mockUser);
  });

  it("calls onClick exactly once", () => {
    render(<SharedWithRow user={mockUser} onClick={mockClick} />);
    fireEvent.click(screen.getByText("Remove"));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
