import { db } from "../lib/firebase";
import { collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { UserProfile } from "../lib/schemas";

// TODO: Remove in future, is not needed
export function watchUsers(callback: (users: UserProfile[]) => void) {
    const usersCollection = collection(db, "users");

    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
        const users = snapshot.docs.map(doc => doc.data() as UserProfile);
        
        callback(users);
    });

    return unsubscribe;
}

export async function getUser(uid: string): Promise<UserProfile | null> {
    if (!uid) return null;

    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() as UserProfile : null;
}

export async function createUser(user: UserProfile) {
    try {
        return await setDoc(doc(db, "users", user.uid), user);
    } catch (e) {
        console.error("Error creating user:", e);
        return null;
    }
}