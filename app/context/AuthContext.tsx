"use client";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { createUser, getUser } from "../services/user-service";
import { UserProfile } from "../lib/schemas";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
};

// This component will wrap our entire app and provide the authenticated user and functions to all child components
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { // Listen for auth changes of the user
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (user) {
        setLoading(false);
        return;
      }

      getUser(currentUser.uid).then((userProfile) => { // Get the user profile from Firestore
        setUser(userProfile ?? null);
        setLoading(false);
      });
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  async function login(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (!user) return { success: false, error: "Invalid email or password." };

      setUser({
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || ""
      });

      return { success: true };
    } catch (e) {
      console.error("Login error:", e);
      return { success: false, error: "Invalid email or password." };
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  async function register(email: string, password: string, name: string) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (!user) return { success: false, error: "Failed to create user. Please try different credentials." };
      
      await updateProfile(user, { displayName: name });

      await createUser({
        uid: user.uid,
        email: user.email || "",
        name: name
      });

      setUser({
        uid: user.uid,
        email: user.email || "",
        name: name
      });

      return { success: true };
    } catch (e) {
      console.error("Registration error:", e);
      return { success: false, error: "Failed to create user. Please try different credentials." };
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
