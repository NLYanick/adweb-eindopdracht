import { db } from "../lib/firebase";
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { UserProfile } from "../lib/schemas";

const MAX_SUGGESTIONS = 25;

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

export async function getUsersByEmail(email: string, userUid: string, limit: number = 3): Promise<UserProfile[] | null> {
    if (!email) return null;
    if (limit < 1) limit = 1;
    if (limit > MAX_SUGGESTIONS) limit = MAX_SUGGESTIONS;

    const usersCollection = collection(db, "users");

    const q = query(
        usersCollection,
        where("email", ">=", email),
        where("email", "<=", email + "\uf8ff")
    );
    
    const querySnapshot = await getDocs(q);

    const users = !querySnapshot.empty ? querySnapshot.docs.map(doc => doc.data() as UserProfile) : null
    const filteredUsers = users?.filter(user => user.uid !== userUid);

    return filteredUsers?.slice(0, limit) || null;
}
