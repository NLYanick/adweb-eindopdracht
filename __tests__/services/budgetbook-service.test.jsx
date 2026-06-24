import {
  createBudgetBook,
  updateBudgetBook,
  archiveBudgetBook,
  restoreBudgetBook,
  getBudgetBook,
  shareBudgetBook,
  unshareBudgetBook,
  watchBudgetBooks,
  watchBudgetBook,
} from "../../app/services/budgetbook-service";

jest.mock("../../app/lib/firebase", () => ({ db: {} }));

jest.mock("../../app/services/user-service", () => ({
  getUsersByEmail: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection:      jest.fn(() => "collection-ref"),
  doc:             jest.fn(() => "doc-ref"),
  addDoc:          jest.fn(() => Promise.resolve({ id: "new-book" })),
  updateDoc:       jest.fn(() => Promise.resolve()),
  getDoc:          jest.fn(),
  onSnapshot:      jest.fn(),
  query:           jest.fn(() => "query-ref"),
  where:           jest.fn(() => "where-clause"),
  and:             jest.fn(() => "and-clause"),
  or:              jest.fn(() => "or-clause"),
  serverTimestamp: jest.fn(() => "server-timestamp"),
}));

import { addDoc, updateDoc, getDoc, doc, onSnapshot } from "firebase/firestore";
import { getUsersByEmail } from "../../app/services/user-service";

beforeEach(() => jest.clearAllMocks());

const mockBudgetbook = {
  uid: "book-1",
  name: "My Budget",
  description: "Test",
  owner: "user-1",
  archived: false,
  sharedWith: [],
};

describe("createBudgetBook", () => {
  it("calls addDoc with correct data", async () => {
    await createBudgetBook({
      name: "My Budget",
      description: "Test",
      owner: "user-1",
      archived: false,
    });

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: "My Budget",
        description: "Test",
        owner: "user-1",
        archived: false,
      })
    );
  });
});

describe("updateBudgetBook", () => {
  it("calls updateDoc with correct data", async () => {
    await updateBudgetBook("book-1", { name: "Updated", description: "New desc" });
    expect(updateDoc).toHaveBeenCalledWith(
      "doc-ref",
      expect.objectContaining({ name: "Updated", description: "New desc" })
    );
  });
});

describe("archiveBudgetBook", () => {
  it("calls updateDoc with archived: true", async () => {
    await archiveBudgetBook("book-1");
    expect(updateDoc).toHaveBeenCalledWith("doc-ref", { archived: true });
    expect(doc).toHaveBeenCalledWith(expect.anything(), "budgetbooks", "book-1");
  });
});

describe("restoreBudgetBook", () => {
  it("calls updateDoc with archived: false", async () => {
    await restoreBudgetBook("book-1");
    expect(updateDoc).toHaveBeenCalledWith("doc-ref", { archived: false });
    expect(doc).toHaveBeenCalledWith(expect.anything(), "budgetbooks", "book-1");
  });
});

describe("getBudgetBook", () => {
  it("returns budgetbook when doc exists", async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({ name: "My Budget", owner: "user-1", archived: false, sharedWith: [] }),
    });

    const result = await getBudgetBook("book-1");
    expect(result).toEqual({
      uid: "book-1",
      name: "My Budget",
      owner: "user-1",
      archived: false,
      sharedWith: [],
    });
  });

  it("returns null when doc does not exist", async () => {
    getDoc.mockResolvedValue({ exists: () => false });
    const result = await getBudgetBook("book-1");
    expect(result).toBeNull();
  });
});

describe("shareBudgetBook", () => {
  it("does nothing when userEmail is undefined", async () => {
    await shareBudgetBook("book-1", undefined);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it("adds user to sharedWith", async () => {
    getUsersByEmail.mockResolvedValue([{ uid: "user-2", email: "bob@test.com" }]);
    getDoc.mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({ ...mockBudgetbook, sharedWith: [] }),
    });

    await shareBudgetBook("book-1", "bob@test.com");

    expect(updateDoc).toHaveBeenCalledWith(
      "doc-ref",
      { sharedWith: ["user-2"] }
    );
  });

  it("does not add user if already shared", async () => {
    getUsersByEmail.mockResolvedValue([{ uid: "user-2", email: "bob@test.com" }]);
    getDoc.mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({ ...mockBudgetbook, sharedWith: ["user-2"] }),
    });

    await shareBudgetBook("book-1", "bob@test.com");
    expect(updateDoc).not.toHaveBeenCalled();
  });
});

describe("unshareBudgetBook", () => {
  it("does nothing when userEmail is undefined", async () => {
    await unshareBudgetBook("book-1", undefined);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it("removes user from sharedWith", async () => {
    getUsersByEmail.mockResolvedValue([{ uid: "user-2", email: "bob@test.com" }]);
    getDoc.mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({ ...mockBudgetbook, sharedWith: ["user-2"] }),
    });

    await unshareBudgetBook("book-1", "bob@test.com");

    expect(updateDoc).toHaveBeenCalledWith(
      "doc-ref",
      { sharedWith: [] }
    );
  });

  it("does nothing if user does not have access", async () => {
    getUsersByEmail.mockResolvedValue([{ uid: "user-2", email: "bob@test.com" }]);
    getDoc.mockResolvedValue({
      exists: () => true,
      id: "book-1",
      data: () => ({ ...mockBudgetbook, sharedWith: [] }),
    });

    await unshareBudgetBook("book-1", "bob@test.com");
    expect(updateDoc).not.toHaveBeenCalled();
  });
});

describe("watchBudgetBooks", () => {
  it("returns empty function when userId is empty", () => {
    const result = watchBudgetBooks("", false, jest.fn());
    expect(typeof result).toBe("function");
    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it("calls onSnapshot and returns unsubscribe", () => {
    const mockUnsubscribe = jest.fn();
    onSnapshot.mockReturnValue(mockUnsubscribe);

    const result = watchBudgetBooks("user-1", false, jest.fn());
    expect(onSnapshot).toHaveBeenCalled();
    expect(result).toBe(mockUnsubscribe);
  });

  it("calls callback with mapped budget books on snapshot", () => {
    const callback = jest.fn();
    onSnapshot.mockImplementation((q, cb) => {
      cb({
        docs: [
          { id: "book-1", data: () => ({ name: "My Budget", owner: "user-1", archived: false, sharedWith: [] }) },
        ],
      });
      return jest.fn();
    });

    watchBudgetBooks("user-1", false, callback);
    expect(callback).toHaveBeenCalledWith([
      { uid: "book-1", name: "My Budget", owner: "user-1", archived: false, sharedWith: [] },
    ]);
  });
});

describe("watchBudgetBook", () => {
  it("calls callback with the budget book when it exists", () => {
    const callback = jest.fn();
    onSnapshot.mockImplementation((ref, cb) => {
      cb({
        exists: () => true,
        id: "book-1",
        data: () => ({ name: "My Budget", owner: "user-1", archived: false, sharedWith: [] }),
      });
      return jest.fn();
    });

    watchBudgetBook("book-1", callback);
    expect(callback).toHaveBeenCalledWith({
      uid: "book-1",
      name: "My Budget",
      owner: "user-1",
      archived: false,
      sharedWith: [],
    });
  });

  it("calls callback with null when the budget book does not exist", () => {
    const callback = jest.fn();
    onSnapshot.mockImplementation((ref, cb) => {
      cb({ exists: () => false });
      return jest.fn();
    });

    watchBudgetBook("missing-book", callback);
    expect(callback).toHaveBeenCalledWith(null);
  });

  it("returns the unsubscribe function from onSnapshot", () => {
    const mockUnsubscribe = jest.fn();
    onSnapshot.mockReturnValue(mockUnsubscribe);

    const result = watchBudgetBook("book-1", jest.fn());
    expect(result).toBe(mockUnsubscribe);
  });
});
