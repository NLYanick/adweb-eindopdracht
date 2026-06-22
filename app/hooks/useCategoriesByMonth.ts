import { useEffect, useState } from "react";
import { Category } from "../lib/schemas";
import { watchCategoriesForMonth } from "../services/category-service";

export function useCategoriesForMonth(budgetbookId: string, year: number, month: number) {
    const [categories, setCategories] = useState<Category[]>([]);

    const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;

    useEffect(() => {
        if (!budgetbookId) return;
        return watchCategoriesForMonth(budgetbookId, monthStart, setCategories);
    }, [budgetbookId, monthStart]);

    return categories;
}