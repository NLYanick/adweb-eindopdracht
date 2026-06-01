"use client";
import Link from 'next/link'
import { watchUsers } from "./services/user-service";
import { useEffect, useState } from "react";
import { UserProfile } from './lib/schemas';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if(!user) {
      router.push("/auth/login");
    }

    const unsubscribe = watchUsers((users) => {
      setUsers(users);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="p-24">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      <Link href="/budgetbook" className="text-blue-500 hover:underline">
        Dashboard
      </Link>
      <hr />

      <p>Current User: { user ? user.name : "No user logged in" }</p>

      <hr />

      <ul>
        {users.map((user: UserProfile) => (
          <li key={user.uid}>{user.name}</li>
        ))}
      </ul>

      <hr />

      <button onClick={logout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
        Log out
      </button>
    </main>
  );
}
