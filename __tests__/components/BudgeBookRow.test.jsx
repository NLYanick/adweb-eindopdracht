import { render, screen, fireEvent } from "@testing-library/react";
import BudgetBookItem from "../../app/components/BudgeBookRow";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>,
}));

jest.mock("../../app/services/budgetbook-service", () => ({
  restoreBudgetBook: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../app/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "../../app/context/AuthContext";
import { restoreBudgetBook } from "../../app/services/budgetbook-service";

const ownerBudgetbook = {
  uid: "book-1",
  name: "My Budget",
  description: "Personal finances",
  owner: "user-1",
  archived: false,
};

const sharedBudgetbook = {
  uid: "book-2",
  name: "Shared Budget",
  description: "Family finances",
  owner: "user-2",
  archived: false,
};

const archivedBudgetbook = {
  uid: "book-3",
  name: "Old Budget",
  description: "Archived",
  owner: "user-1",
  archived: true,
};

describe("BudgetBookItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: { uid: "user-1" } });
  });

  describe("rendering", () => {
    it("renders the budget book name", () => {
      render(<BudgetBookItem budgetbook={ownerBudgetbook} />);
      expect(screen.getByText("My Budget")).toBeInTheDocument();
    });

    it("renders the budget book description", () => {
      render(<BudgetBookItem budgetbook={ownerBudgetbook} />);
      expect(screen.getByText("Personal finances")).toBeInTheDocument();
    });
  });

  describe("owner vs shared badge", () => {
    it("shows Owner badge when user is the owner", () => {
      render(<BudgetBookItem budgetbook={ownerBudgetbook} />);
      expect(screen.getByText("Owner")).toBeInTheDocument();
    });

    it("shows Shared badge when user is not the owner", () => {
      render(<BudgetBookItem budgetbook={sharedBudgetbook} />);
      expect(screen.getByText("Shared")).toBeInTheDocument();
    });

    it("does not show Shared when user is owner", () => {
      render(<BudgetBookItem budgetbook={ownerBudgetbook} />);
      expect(screen.queryByText("Shared")).not.toBeInTheDocument();
    });

    it("does not show Owner when user is not owner", () => {
      render(<BudgetBookItem budgetbook={sharedBudgetbook} />);
      expect(screen.queryByText("Owner")).not.toBeInTheDocument();
    });
  });

  describe("archived vs active", () => {
    it("shows Detail link when not archived", () => {
      render(<BudgetBookItem budgetbook={ownerBudgetbook} />);
      expect(screen.getByText("Detail →")).toBeInTheDocument();
    });

    it("Detail link points to correct budgetbook url", () => {
      render(<BudgetBookItem budgetbook={ownerBudgetbook} />);
      expect(screen.getByText("Detail →").closest("a")).toHaveAttribute(
        "href",
        "/budgetbook/book-1"
      );
    });

    it("shows Restore button when archived", () => {
      render(<BudgetBookItem budgetbook={archivedBudgetbook} />);
      expect(screen.getByText("Restore")).toBeInTheDocument();
    });

    it("does not show Detail link when archived", () => {
      render(<BudgetBookItem budgetbook={archivedBudgetbook} />);
      expect(screen.queryByText("Detail →")).not.toBeInTheDocument();
    });

    it("does not show Restore when not archived", () => {
      render(<BudgetBookItem budgetbook={ownerBudgetbook} />);
      expect(screen.queryByText("Restore")).not.toBeInTheDocument();
    });
  });

  describe("restore action", () => {
    it("calls restoreBudgetBook with correct id when Restore is clicked", () => {
      render(<BudgetBookItem budgetbook={archivedBudgetbook} />);
      fireEvent.click(screen.getByText("Restore"));
      expect(restoreBudgetBook).toHaveBeenCalledWith("book-3");
    });

    it("calls restoreBudgetBook exactly once", () => {
      render(<BudgetBookItem budgetbook={archivedBudgetbook} />);
      fireEvent.click(screen.getByText("Restore"));
      expect(restoreBudgetBook).toHaveBeenCalledTimes(1);
    });
  });
});
