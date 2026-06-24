import {
  createCategory,
  updateCategory,
  deleteCategory,
  watchCategoriesForMonth,
} from "../../app/services/category-service";

jest.mock("../../app/lib/firebase", () => ({ db: {} }));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => "collection-ref"),
  doc:        jest.fn(() => "doc-ref"),
  addDoc:     jest.fn(() => Promise.resolve({ id: "new-cat" })),
  updateDoc:  jest.fn(() => Promise.resolve()),
  deleteDoc:  jest.fn(() => Promise.resolve()),
  onSnapshot: jest.fn(),
  query:      jest.fn(() => "query-ref"),
  where:      jest.fn(() => "where-clause"),
}));

import { addDoc, updateDoc, deleteDoc, onSnapshot, doc } from "firebase/firestore";

beforeEach(() => jest.clearAllMocks());

describe("createCategory", () => {
  it("calls addDoc with correct category data", async () => {
    await createCategory({
      budgetbook: "book-1",
      type: "expense",
      name: "Groceries",
      budget: 300,
      endDate: undefined,
    });

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        budgetbook: "book-1",
        type: "expense",
        name: "Groceries",
        budget: 300,
        endDate: null,
      })
    );
  });

  it("sets endDate to null when not provided", async () => {
    await createCategory({
      budgetbook: "book-1",
      type: "income",
      name: "Salary",
      budget: null,
      endDate: undefined,
    });

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ endDate: null })
    );
  });
});

describe("updateCategory", () => {
  it("calls updateDoc with correct data", async () => {
    await updateCategory("cat-1", {
      budgetbook: "book-1",
      type: "expense",
      name: "Updated Groceries",
      budget: 400,
      endDate: undefined,
    });

    expect(updateDoc).toHaveBeenCalledWith(
      "doc-ref",
      expect.objectContaining({ name: "Updated Groceries", budget: 400, endDate: null })
    );
    expect(doc).toHaveBeenCalledWith(expect.anything(), "categories", "cat-1");
  });
});

describe("deleteCategory", () => {
  it("calls deleteDoc with correct ref", async () => {
    await deleteCategory("cat-1");
    expect(deleteDoc).toHaveBeenCalledWith("doc-ref");
    expect(doc).toHaveBeenCalledWith(expect.anything(), "categories", "cat-1");
  });
});

describe("watchCategoriesForMonth", () => {
  it("returns empty function when budgetbookId is empty", () => {
    const result = watchCategoriesForMonth("", "2026-06-01", jest.fn());
    expect(typeof result).toBe("function");
    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it("calls onSnapshot and returns unsubscribe", () => {
    const mockUnsubscribe = jest.fn();
    onSnapshot.mockReturnValue(mockUnsubscribe);

    const result = watchCategoriesForMonth("book-1", "2026-06-01", jest.fn());
    expect(onSnapshot).toHaveBeenCalled();
    expect(result).toBe(mockUnsubscribe);
  });

  it("filters out categories with endDate before monthStart", () => {
    const callback = jest.fn();
    onSnapshot.mockImplementation((q, cb) => {
      cb({
        docs: [
          { id: "cat-1", data: () => ({ budgetbook: "book-1", type: "expense", name: "Active",  budget: 100, endDate: "2026-07-01" }) },
          { id: "cat-2", data: () => ({ budgetbook: "book-1", type: "expense", name: "Expired", budget: 100, endDate: "2026-05-01" }) },
          { id: "cat-3", data: () => ({ budgetbook: "book-1", type: "income",  name: "NoEnd",   budget: null, endDate: null }) },
        ],
      });
      return jest.fn();
    });

    watchCategoriesForMonth("book-1", "2026-06-01", callback);

    expect(callback).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: "Active" }),
        expect.objectContaining({ name: "NoEnd" }),
      ])
    );
    expect(callback).toHaveBeenCalledWith(
      expect.not.arrayContaining([
        expect.objectContaining({ name: "Expired" }),
      ])
    );
  });
});
