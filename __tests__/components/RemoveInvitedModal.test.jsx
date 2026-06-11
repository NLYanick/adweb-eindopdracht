import { render, screen, fireEvent } from "@testing-library/react";
import RemoveInvitedModal from "../../app/components/RemoveInvitedModal";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("RemoveInvitedModal", () => {
  const mockCancel = jest.fn();
  const mockConfirm = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders the user name", () => {
    render(<RemoveInvitedModal name="John Doe" onCancel={mockCancel} onConfirm={mockConfirm} />);
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it("renders cancel and remove buttons", () => {
    render(<RemoveInvitedModal name="John Doe" onCancel={mockCancel} onConfirm={mockConfirm} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Yes, remove")).toBeInTheDocument();
  });

  it("calls onCancel when cancel is clicked", () => {
    render(<RemoveInvitedModal name="John Doe" onCancel={mockCancel} onConfirm={mockConfirm} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when remove is clicked", () => {
    render(<RemoveInvitedModal name="John Doe" onCancel={mockCancel} onConfirm={mockConfirm} />);
    fireEvent.click(screen.getByText("Yes, remove"));
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });
});
