import { db } from "../lib/firebase";
import { addDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import { Budgetbook } from "../lib/schemas";

export function watchBudgetBooks(callback: (budgetBooks: Budgetbook[]) => void) {
    const budgetBooksCollection = collection(db, "budgetbooks");

    const unsubscribe = onSnapshot(budgetBooksCollection, (snapshot) => {
        const budgetBooks = snapshot.docs.map(doc => doc.data() as Budgetbook);
        
        callback(budgetBooks);
    });

    return unsubscribe;
}

export async function createBudgetBook(budgetBook: Omit<Budgetbook, "uid">) {
    try {
        await addDoc(collection(db, "budgetbooks"), {
            owner: budgetBook.owner,
            name: budgetBook.name,
            description: budgetBook.description,
            createdAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error creating budgetbook:", e);
    }
}