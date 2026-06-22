import { render, screen, fireEvent } from "@testing-library/react";
import ArchiveModal from "../../app/components/ArchiveModal";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("ArchiveModal", () => {
  const mockCancel = jest.fn();
  const mockConfirm = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders the budget book name", () => {
    render(<ArchiveModal name="My Budget" onCancel={mockCancel} onConfirm={mockConfirm} />);
    expect(screen.getByText(/My Budget/)).toBeInTheDocument();
  });

  it("renders cancel and confirm buttons", () => {
    render(<ArchiveModal name="My Budget" onCancel={mockCancel} onConfirm={mockConfirm} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Yes, archive")).toBeInTheDocument();
  });

  it("calls onCancel when cancel is clicked", () => {
    render(<ArchiveModal name="My Budget" onCancel={mockCancel} onConfirm={mockConfirm} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when archive is clicked", () => {
    render(<ArchiveModal name="My Budget" onCancel={mockCancel} onConfirm={mockConfirm} />);
    fireEvent.click(screen.getByText("Yes, archive"));
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });

  it("does not call onConfirm when cancel is clicked", () => {
    render(<ArchiveModal name="My Budget" onCancel={mockCancel} onConfirm={mockConfirm} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockConfirm).not.toHaveBeenCalled();
  });
});
