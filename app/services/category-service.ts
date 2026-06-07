import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { Category } from "../lib/schemas";
import { db } from "../lib/firebase";

export function watchCategoriesForMonth(
    budgetbookId: string,
    monthStart: string,
    callback: (categories: Category[]) => void
) {
    if (!budgetbookId) return () => {};

    const results: { [id: string]: Category } = {};

    const q1 = query(
        collection(db, "categories"),
        where("budgetbook", "==", budgetbookId),
        where("endDate", "==", null)
    );

    const q2 = query(
        collection(db, "categories"),
        where("budgetbook", "==", budgetbookId),
        where("endDate", ">=", monthStart)
    );

    const unsub1 = onSnapshot(q1, (snapshot) => {
        snapshot.docs.forEach(d => {
            results[d.id] = { uid: d.id, ...(d.data() as Omit<Category, "uid">) };
        });
        callback(Object.values(results));
    });

    const unsub2 = onSnapshot(q2, (snapshot) => {
        snapshot.docs.forEach(d => {
            results[d.id] = { uid: d.id, ...(d.data() as Omit<Category, "uid">) };
        });
        callback(Object.values(results));
    });

    return () => { unsub1(); unsub2(); };
}

export async function createCategory(category: Omit<Category, "uid">) {
    try {
        await addDoc(collection(db, "categories"), {
            ...category,
            endDate: category.endDate ?? null,
        });
    } catch (e) {
        console.error("Error creating category:", e);
    }
}