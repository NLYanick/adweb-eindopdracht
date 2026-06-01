"use client";
import Link from 'next/link'
import { User } from "./lib/schemas";
import { watchUsers } from "./services/user-service";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const unsubscribe = watchUsers((users) => {
      setUsers(users);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="p-24">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      <Link href="/budgetbook">Dashboard</Link>
      <hr />

      <ul>
        {users.map((user: User) => (
          <li key={user.uid}>{user.name}</li>
        ))}
      </ul>
    </main>
  );
}
