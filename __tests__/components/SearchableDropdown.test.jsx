import { render, screen, fireEvent } from "@testing-library/react";
import SearchableDropdown from "../../app/components/SearchableDropdown";

const mockUsers = [
  { uid: "user-1", email: "alice@test.com", name: "Alice" },
  { uid: "user-2", email: "bob@test.com", name: "Bob" },
  { uid: "user-3", email: "charlie@test.com", name: "Charlie" },
];

describe("SearchableDropdown", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  describe("initial state", () => {
    it("renders the search input", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      expect(screen.getByPlaceholderText("Search by email...")).toBeInTheDocument();
    });

    it("does not show the dropdown initially", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      expect(screen.queryByText("alice@test.com")).not.toBeInTheDocument();
    });
  });

  describe("filtering", () => {
    it("shows matching results when typing", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      fireEvent.change(screen.getByPlaceholderText("Search by email..."), { target: { value: "alice" } });
      expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    });

    it("does not show non-matching results", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      fireEvent.change(screen.getByPlaceholderText("Search by email..."), { target: { value: "alice" } });
      expect(screen.queryByText("bob@test.com")).not.toBeInTheDocument();
    });

    it("is case insensitive", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      fireEvent.change(screen.getByPlaceholderText("Search by email..."), { target: { value: "ALICE" } });
      expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    });

    it("shows multiple results when multiple match", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      fireEvent.change(screen.getByPlaceholderText("Search by email..."), { target: { value: "test.com" } });
      expect(screen.getByText("alice@test.com")).toBeInTheDocument();
      expect(screen.getByText("bob@test.com")).toBeInTheDocument();
      expect(screen.getByText("charlie@test.com")).toBeInTheDocument();
    });

    it("hides the dropdown when input is cleared", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      const input = screen.getByPlaceholderText("Search by email...");
      fireEvent.change(input, { target: { value: "alice" } });
      fireEvent.change(input, { target: { value: "" } });
      expect(screen.queryByText("alice@test.com")).not.toBeInTheDocument();
    });
  });

  describe("selecting an item", () => {
    it("calls onClick with the selected user", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      fireEvent.change(screen.getByPlaceholderText("Search by email..."), { target: { value: "alice" } });
      fireEvent.mouseDown(screen.getByText("alice@test.com"));
      expect(mockOnClick).toHaveBeenCalledWith(mockUsers[0]);
    });

    it("calls onClick exactly once", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      fireEvent.change(screen.getByPlaceholderText("Search by email..."), { target: { value: "alice" } });
      fireEvent.mouseDown(screen.getByText("alice@test.com"));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("clears the input after selecting", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      const input = screen.getByPlaceholderText("Search by email...");
      fireEvent.change(input, { target: { value: "alice" } });
      fireEvent.mouseDown(screen.getByText("alice@test.com"));
      expect(input.value).toBe("");
    });

    it("closes the dropdown after selecting", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      fireEvent.change(screen.getByPlaceholderText("Search by email..."), { target: { value: "alice" } });
      fireEvent.mouseDown(screen.getByText("alice@test.com"));
      expect(screen.queryByText("alice@test.com")).not.toBeInTheDocument();
    });
  });

  describe("keyboard", () => {
    it("closes the dropdown on Escape", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      fireEvent.change(screen.getByPlaceholderText("Search by email..."), { target: { value: "alice" } });
      fireEvent.keyDown(screen.getByText("alice@test.com"), { key: "Escape" });
      expect(screen.queryByText("alice@test.com")).not.toBeInTheDocument();
    });
  });

  describe("blur behaviour", () => {
    it("reopens dropdown on focus if search term is not empty", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      const input = screen.getByPlaceholderText("Search by email...");
      fireEvent.change(input, { target: { value: "alice" } });
      fireEvent.blur(input);
      fireEvent.focus(input);
      expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    });

    it("does not reopen dropdown on focus if search term is empty", () => {
      render(<SearchableDropdown array={mockUsers} onClick={mockOnClick} />);
      const input = screen.getByPlaceholderText("Search by email...");
      fireEvent.focus(input);
      expect(screen.queryByText("alice@test.com")).not.toBeInTheDocument();
    });
  });
});
