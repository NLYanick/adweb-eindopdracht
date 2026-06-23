import { renderHook, act } from "@testing-library/react";
import { useCategoriesForMonth } from "../../app/hooks/useCategoriesByMonth";
import { useTransactionsByMonth } from "../../app/hooks/useTransactionsByMonth";

jest.mock("../../app/services/category-service", () => ({
  watchCategoriesForMonth: jest.fn(),
}));

jest.mock("../../app/services/transaction-service", () => ({
  watchTransactionsByMonth: jest.fn(),
}));

import { watchCategoriesForMonth } from "../../app/services/category-service";
import { watchTransactionsByMonth } from "../../app/services/transaction-service";

const mockUnsubscribe = jest.fn();

describe("useCategoriesForMonth", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns empty array initially", () => {
    watchCategoriesForMonth.mockReturnValue(mockUnsubscribe);
    const { result } = renderHook(() => useCategoriesForMonth("book-1", 2026, 6));
    expect(result.current).toEqual([]);
  });

  it("calls watchCategoriesForMonth with correct budgetbookId and monthStart", () => {
    watchCategoriesForMonth.mockReturnValue(mockUnsubscribe);
    renderHook(() => useCategoriesForMonth("book-1", 2026, 6));
    expect(watchCategoriesForMonth).toHaveBeenCalledWith(
      "book-1",
      "2026-06-01",
      expect.any(Function)
    );
  });

  it("pads single digit months correctly", () => {
    watchCategoriesForMonth.mockReturnValue(mockUnsubscribe);
    renderHook(() => useCategoriesForMonth("book-1", 2026, 3));
    expect(watchCategoriesForMonth).toHaveBeenCalledWith(
      "book-1",
      "2026-03-01",
      expect.any(Function)
    );
  });

  it("updates categories when the callback is called", () => {
    let capturedCallback;
    watchCategoriesForMonth.mockImplementation((id, start, cb) => {
      capturedCallback = cb;
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useCategoriesForMonth("book-1", 2026, 6));

    const mockCategories = [
      { uid: "cat-1", budgetbook: "book-1", type: "expense", name: "Groceries", budget: 500 },
    ];

    act(() => capturedCallback(mockCategories));
    expect(result.current).toEqual(mockCategories);
  });

  it("does not call watch when budgetbookId is empty", () => {
    watchCategoriesForMonth.mockReturnValue(mockUnsubscribe);
    renderHook(() => useCategoriesForMonth("", 2026, 6));
    expect(watchCategoriesForMonth).not.toHaveBeenCalled();
  });

  it("calls unsubscribe on unmount", () => {
    watchCategoriesForMonth.mockReturnValue(mockUnsubscribe);
    const { unmount } = renderHook(() => useCategoriesForMonth("book-1", 2026, 6));
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});

describe("useTransactionsByMonth", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns empty array initially", () => {
    watchTransactionsByMonth.mockReturnValue(mockUnsubscribe);
    const { result } = renderHook(() => useTransactionsByMonth("book-1", 2026, 6));
    expect(result.current).toEqual([]);
  });

  it("calls watchTransactionsByMonth with correct args", () => {
    watchTransactionsByMonth.mockReturnValue(mockUnsubscribe);
    renderHook(() => useTransactionsByMonth("book-1", 2026, 6));
    expect(watchTransactionsByMonth).toHaveBeenCalledWith(
      "book-1",
      2026,
      6,
      expect.any(Function)
    );
  });

  it("updates transactions when callback is called", () => {
    let capturedCallback;
    watchTransactionsByMonth.mockImplementation((id, year, month, cb) => {
      capturedCallback = cb;
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useTransactionsByMonth("book-1", 2026, 6));

    const mockTransactions = [
      { uid: "tx-1", budgetbook: "book-1", amount: -100, date: "2026-06-01", category: "cat-1" },
    ];

    act(() => capturedCallback(mockTransactions));
    expect(result.current).toEqual(mockTransactions);
  });

  it("calls unsubscribe on unmount", () => {
    watchTransactionsByMonth.mockReturnValue(mockUnsubscribe);
    const { unmount } = renderHook(() => useTransactionsByMonth("book-1", 2026, 6));
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("re-subscribes when budgetbookId changes", () => {
    watchTransactionsByMonth.mockReturnValue(mockUnsubscribe);
    const { rerender } = renderHook(
      ({ id }) => useTransactionsByMonth(id, 2026, 6),
      { initialProps: { id: "book-1" } }
    );
    rerender({ id: "book-2" });
    expect(watchTransactionsByMonth).toHaveBeenCalledTimes(2);
    expect(watchTransactionsByMonth).toHaveBeenLastCalledWith("book-2", 2026, 6, expect.any(Function));
  });
});
