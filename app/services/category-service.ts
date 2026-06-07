import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { Category } from "../lib/schemas";
import { db } from "../lib/firebase";

export function watchCategoriesForMonth(
    budgetbookId: string,
    monthStart: string,
    callback: (categories: Category[]) => void
) {
    if (!budgetbookId) return () => {};

    const q = query(
        collection(db, "categories"),
        where("budgetbook", "==", budgetbookId),
    );

    return onSnapshot(q, (snapshot) => {
        const categories: Category[] = snapshot.docs
            .map(d => ({ uid: d.id, ...(d.data() as Omit<Category, "uid">) }))
            .filter(c => !c.endDate || c.endDate >= monthStart);

        callback(categories);
    });
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

export const updateCategory = async (
    uid: string,
    data: Omit<Category, "uid">
) => {
    const docRef = doc(db, "categories", uid);
    await updateDoc(docRef, { ...data, endDate: data.endDate ?? null, });
};

export const deleteCategory = async (uid: string) => {
    const docRef = doc(db, "categories", uid);
    await deleteDoc(docRef);
};