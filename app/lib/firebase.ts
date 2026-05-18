import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "adweb-eindopdracht-33ef7.firebaseapp.com",
  projectId: "adweb-eindopdracht-33ef7",
  storageBucket: "adweb-eindopdracht-33ef7.firebasestorage.app",
  messagingSenderId: "358119888730",
  appId: "1:358119888730:web:65cb6b69ea53ae5466c563",
  measurementId: "G-8G23DVCTH5"
};

const db = initializeApp(firebaseConfig);
const analytics = getAnalytics(db);

export { 
    db, 
    analytics 
};