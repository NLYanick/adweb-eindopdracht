import { renderHook, act } from "@testing-library/react";
import { useMonthNavigation } from "../../app/hooks/useMonthNavigation";

// Fix date so tests don't depend on when they're run
const FIXED_DATE = new Date(2026, 5, 1); // June 2026
beforeAll(() => jest.useFakeTimers().setSystemTime(FIXED_DATE));
afterAll(() => jest.useRealTimers());

describe("useMonthNavigation", () => {
  describe("initial state", () => {
    it("starts on the current month", () => {
      const { result } = renderHook(() => useMonthNavigation());
      expect(result.current.month).toBe(6); // June
    });

    it("starts on the current year", () => {
      const { result } = renderHook(() => useMonthNavigation());
      expect(result.current.year).toBe(2026);
    });

    it("returns a formatted month label", () => {
      const { result } = renderHook(() => useMonthNavigation());
      expect(result.current.monthLabel).toMatch(/June/);
      expect(result.current.monthLabel).toMatch(/2026/);
    });
  });

  describe("prevMonth", () => {
    it("decrements the month by 1", () => {
      const { result } = renderHook(() => useMonthNavigation());
      act(() => result.current.prevMonth());
      expect(result.current.month).toBe(5); // May
    });

    it("wraps from January to December and decrements year", () => {
      const jan = new Date(2026, 0, 1);
      jest.setSystemTime(jan);
      const { result } = renderHook(() => useMonthNavigation());
      act(() => result.current.prevMonth());
      expect(result.current.month).toBe(12);
      expect(result.current.year).toBe(2025);
      jest.setSystemTime(FIXED_DATE); // reset
    });
  });

  describe("nextMonth", () => {
    it("increments the month by 1", () => {
      const { result } = renderHook(() => useMonthNavigation());
      act(() => result.current.nextMonth());
      expect(result.current.month).toBe(7); // July
    });

    it("wraps from December to January and increments year", () => {
      const dec = new Date(2026, 11, 1);
      jest.setSystemTime(dec);
      const { result } = renderHook(() => useMonthNavigation());
      act(() => result.current.nextMonth());
      expect(result.current.month).toBe(1);
      expect(result.current.year).toBe(2027);
      jest.setSystemTime(FIXED_DATE); // reset
    });
  });

  describe("monthLabel", () => {
    it("updates label after navigating forward", () => {
      const { result } = renderHook(() => useMonthNavigation());
      act(() => result.current.nextMonth());
      expect(result.current.monthLabel).toMatch(/July/);
    });

    it("updates label after navigating backward", () => {
      const { result } = renderHook(() => useMonthNavigation());
      act(() => result.current.prevMonth());
      expect(result.current.monthLabel).toMatch(/May/);
    });
  });
});
