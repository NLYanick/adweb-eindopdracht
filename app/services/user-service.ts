import { db } from "../lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";

export async function getUsers() {
    const userDocs = await getDocs(collection(db, "users"));
    const users = userDocs.docs.map(doc => doc.data());
    
    return users as any[];
}