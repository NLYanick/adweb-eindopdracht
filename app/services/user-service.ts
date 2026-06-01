import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function watchUsers(callback: (users: any[]) => void) {
    const usersCollection = collection(db, "users");

    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
        const users = snapshot.docs.map(doc => doc.data());
        
        callback(users);
    });

    return unsubscribe;
}