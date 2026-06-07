import { db } from "../lib/firebase";
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, updateDoc, query, where, or, and } from "firebase/firestore";
import { Budgetbook } from "../lib/schemas";
import { getUsersByEmail } from "./user-service";

export function watchBudgetBooks(userId: string, showArchived:boolean,callback: (budgetBooks: Budgetbook[]) => void) {
    if(!userId) return function(){};
    const budgetBooksCollection = query(
        collection(db, "budgetbooks"),
        and(
            or(
                where("owner", "==", userId),
                where("sharedWith", "array-contains", userId)
            ),
            where("archived", "==", showArchived)
        )
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

export async function getBudgetBook(id: string): Promise<Budgetbook | null> {
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

export async function updateBudgetBook (
    uid: string,
    data: {
        name: string;
        description?: string;
    }
) {
    const docRef = doc(db, "budgetbooks", uid);

    await updateDoc(docRef, {
        ...data,
    });
};


export async function archiveBudgetBook (uid: string) {
    const docRef = doc(db, "budgetbooks", uid);
    
    await updateDoc(docRef, {
        archived: true,
    });
};

export async function restoreBudgetBook (uid: string) {
    const docRef = doc(db, "budgetbooks", uid);
    
    await updateDoc(docRef, {
        archived: false,
    });
};

export async function shareBudgetBook(uid: string, userEmail: string | undefined) {
    if (!userEmail) return;
    
    const userArray = await getUsersByEmail(userEmail, "", 1);
    if(!userArray) {
        console.error("User not found with email:", userEmail);
        return;
    }
    const user = userArray[0];

    const docRef = doc(db, "budgetbooks", uid);

    const budgetBook = await getBudgetBook(uid);

    if (budgetBook?.sharedWith?.includes(user.uid)) {
        console.warn("User already has access to this budget book:", userEmail);
        return;
    }

    await updateDoc(docRef, {
        sharedWith: [...budgetBook?.sharedWith || [], user.uid],
    });
}
