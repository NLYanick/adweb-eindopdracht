import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  changeCategory,
  getTransaction,
  watchTransactionsByMonth,
  watchTransactions,
} from "../../app/services/transaction-service";

jest.mock("../../app/lib/firebase", () => ({ db: {} }));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => "collection-ref"),
  doc:        jest.fn(() => "doc-ref"),
  addDoc:     jest.fn(() => Promise.resolve({ id: "new-tx" })),
  updateDoc:  jest.fn(() => Promise.resolve()),
  deleteDoc:  jest.fn(() => Promise.resolve()),
  getDoc:     jest.fn(),
  onSnapshot: jest.fn(),
  query:      jest.fn(() => "query-ref"),
  where:      jest.fn(() => "where-clause"),
  orderBy:    jest.fn(() => "orderby-clause"),
}));

import { addDoc, updateDoc, deleteDoc, getDoc, onSnapshot, doc, collection, query, where } from "firebase/firestore";

beforeEach(() => jest.clearAllMocks());

describe("createTransaction", () => {
  it("calls addDoc with correct transaction data", async () => {
    await createTransaction({
      budgetbook: "book-1",
      amount: -100,
      description: "Groceries",
      date: "2026-06-01",
      category: "cat-1",
    });

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        budgetbook: "book-1",
        amount: -100,
        description: "Groceries",
        date: "2026-06-01",
        category: "cat-1",
      })
    );
  });

  it("sets category to null when empty string", async () => {
    await createTransaction({
      budgetbook: "book-1",
      amount: -100,
      description: "Test",
      date: "2026-06-01",
      category: "",
    });

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ category: null })
    );
  });
});

describe("updateTransaction", () => {
  it("calls updateDoc with correct data", async () => {
    await updateTransaction("tx-1", {
      budgetbook: "book-1",
      amount: -200,
      description: "Updated",
      date: "2026-06-01",
      category: "cat-1",
    });

    expect(updateDoc).toHaveBeenCalledWith(
      "doc-ref",
      expect.objectContaining({ amount: -200, description: "Updated" })
    );
  });
});

describe("deleteTransaction", () => {
  it("calls deleteDoc with correct ref", async () => {
    await deleteTransaction("tx-1");
    expect(deleteDoc).toHaveBeenCalledWith("doc-ref");
    expect(doc).toHaveBeenCalledWith(expect.anything(), "transactions", "tx-1");
  });
});

describe("changeCategory", () => {
  it("calls updateDoc with the new category", async () => {
    await changeCategory("tx-1", "cat-2");
    expect(updateDoc).toHaveBeenCalledWith("doc-ref", { category: "cat-2" });
  });

  it("can set category to null", async () => {
    await changeCategory("tx-1", null);
    expect(updateDoc).toHaveBeenCalledWith("doc-ref", { category: null });
  });
});

describe("getTransaction", () => {
  it("returns transaction when doc exists", async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      id: "tx-1",
      data: () => ({
        budgetbook: "book-1",
        amount: -100,
        description: "Test",
        date: "2026-06-01",
        category: "cat-1",
      }),
    });

    const result = await getTransaction("tx-1");
    expect(result).toEqual({
      uid: "tx-1",
      budgetbook: "book-1",
      amount: -100,
      description: "Test",
      date: "2026-06-01",
      category: "cat-1",
    });
  });

  it("returns null when doc does not exist", async () => {
    getDoc.mockResolvedValue({ exists: () => false });
    const result = await getTransaction("tx-1");
    expect(result).toBeNull();
  });
});

describe("watchTransactionsByMonth", () => {
  it("returns empty function when budgetbookId is empty", () => {
    const result = watchTransactionsByMonth("", 2026, 6, jest.fn());
    expect(typeof result).toBe("function");
    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it("calls onSnapshot and returns unsubscribe", () => {
    const mockUnsubscribe = jest.fn();
    onSnapshot.mockReturnValue(mockUnsubscribe);

    const callback = jest.fn();
    const result = watchTransactionsByMonth("book-1", 2026, 6, callback);

    expect(onSnapshot).toHaveBeenCalled();
    expect(result).toBe(mockUnsubscribe);
  });

  it("calls callback with mapped transactions on snapshot", () => {
    const callback = jest.fn();
    onSnapshot.mockImplementation((q, cb) => {
      cb({
        docs: [
          { id: "tx-1", data: () => ({ budgetbook: "book-1", amount: -100, date: "2026-06-01", category: "cat-1" }) },
        ],
      });
      return jest.fn();
    });

    watchTransactionsByMonth("book-1", 2026, 6, callback);
    expect(callback).toHaveBeenCalledWith([
      { uid: "tx-1", budgetbook: "book-1", amount: -100, date: "2026-06-01", category: "cat-1" },
    ]);
  });
});

describe("watchTransactions", () => {
  it("returns empty function when budgetbookId is empty", () => {
    const result = watchTransactions("", jest.fn());
    expect(typeof result).toBe("function");
    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it("calls onSnapshot and returns unsubscribe", () => {
    const mockUnsubscribe = jest.fn();
    onSnapshot.mockReturnValue(mockUnsubscribe);

    const result = watchTransactions("book-1", jest.fn());
    expect(onSnapshot).toHaveBeenCalled();
    expect(result).toBe(mockUnsubscribe);
  });

  it("calls callback with mapped transactions on snapshot", () => {
    const callback = jest.fn();
    onSnapshot.mockImplementation((q, cb) => {
      cb({
        docs: [
          { id: "tx-1", data: () => ({ budgetbook: "book-1", amount: -50, date: "2026-06-15", category: "cat-2" }) },
        ],
      });
      return jest.fn();
    });

    watchTransactions("book-1", callback);
    expect(callback).toHaveBeenCalledWith([
      { uid: "tx-1", budgetbook: "book-1", amount: -50, date: "2026-06-15", category: "cat-2" },
    ]);
  });
});
