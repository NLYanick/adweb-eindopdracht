"use client";
import Image from "next/image";
import { getUsers } from "./services/user-service";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getUsers()
    .then(users => {
      setUsers(users);
    });
  }, [])
  

  return (
    <main className="p-24">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </main>
  );
}
