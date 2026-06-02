import { db } from "../lib/firebase";
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, updateDoc, query, where } from "firebase/firestore";
import { Budgetbook } from "../lib/schemas";

export function watchBudgetBooks(userId: string, showArchived:boolean,callback: (budgetBooks: Budgetbook[]) => void) {
    if(!userId) return function(){};
    const budgetBooksCollection = query(
        collection(db, "budgetbooks"),
        where("owner", "==", userId),
        where("archived", "==", showArchived)
    )

    const unsubscribe = onSnapshot(budgetBooksCollection, (snapshot) => {
    
    const budgetBooks: Budgetbook[] = snapshot.docs.map(doc => ({
    uid: doc.id,
    ...(doc.data() as Omit<Budgetbook, "uid">),
    }));

    callback(budgetBooks);
    });

    return unsubscribe;
}


export const getBudgetBook = async (id: string): Promise<Budgetbook | null> => {
    const docRef = doc(db, "budgetbooks", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        uid: docSnap.id,
        ...(docSnap.data() as Omit<Budgetbook, "uid">),
    };
};


export async function createBudgetBook(budgetBook: Omit<Budgetbook, "uid" | "sharedWith">) {
    try {
        await addDoc(collection(db, "budgetbooks"), {
            owner: budgetBook.owner,
            name: budgetBook.name,
            description: budgetBook.description,
            archived: false,
            createdAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error creating budgetbook:", e);
    }
}

export const updateBudgetBook = async (
    uid: string,
    data: {
        name: string;
        description?: string;
    }
    ) => {
    const docRef = doc(db, "budgetbooks", uid);

    await updateDoc(docRef, {
        ...data,
    });
};


export const archiveBudgetBook = async (uid: string) => {
    const docRef = doc(db, "budgetbooks", uid);
    
    await updateDoc(docRef, {
        archived: true,
    });
};

export const restoreBudgetBook = async (uid: string) => {
    const docRef = doc(db, "budgetbooks", uid);
    
    await updateDoc(docRef, {
        archived: false,
    });
};
