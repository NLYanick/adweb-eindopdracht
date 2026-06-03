import { db } from "../lib/firebase";
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { Transaction } from "../lib/schemas";

export function watchTransactions(budgetbookId: string, callback: (transactions: Transaction[]) => void) {
    if (!budgetbookId) return function () {};

    const transactionsCollection = query(
        collection(db, "transactions"),
        where("budgetbook", "==", budgetbookId),
    );

    const unsubscribe = onSnapshot(transactionsCollection, (snapshot) => {
        const transactions: Transaction[] = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...(doc.data() as Omit<Transaction, "uid">),
        }));
        callback(transactions);
    });

    return unsubscribe;
}

export function watchTransactionsByMonth(
    budgetbookId: string,
    year: number,
    month: number, // 1-12
    callback: (transactions: Transaction[]) => void
) {
    if (!budgetbookId) return function () {};

    // Create date range for the month
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = `${year}-${String(month + 1).padStart(2, "0")}-01`;

    const transactionsCollection = query(
        collection(db, "transactions"),
        where("budgetbook", "==", budgetbookId),
        where("date", ">=", start),
        where("date", "<", end),
    );

    const unsubscribe = onSnapshot(transactionsCollection, (snapshot) => {
        const transactions: Transaction[] = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...(doc.data() as Omit<Transaction, "uid">),
        }));
        callback(transactions);
    });

    return unsubscribe;
}

export const getTransaction = async (id: string): Promise<Transaction | null> => {
    const docRef = doc(db, "transactions", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        uid: docSnap.id,
        ...(docSnap.data() as Omit<Transaction, "uid">),
    };
};

export async function createTransaction(transaction: Omit<Transaction, "uid">) {
    try {
        await addDoc(collection(db, "transactions"), {
            ...transaction,
        });
    } catch (e) {
        console.error("Error creating transaction:", e);
    }
}

export const updateTransaction = async (
    uid: string,
    data: Omit<Transaction, "uid">
) => {
    const docRef = doc(db, "transactions", uid);
    await updateDoc(docRef, { ...data });
};

export const deleteTransaction = async (uid: string) => {
    const docRef = doc(db, "transactions", uid);
    await deleteDoc(docRef);
};