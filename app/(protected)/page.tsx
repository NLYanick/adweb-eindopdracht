"use client";
import Link from 'next/link'
import { watchUsers } from "../services/user-service";
import { useEffect, useState } from "react";
import { UserProfile } from '../lib/schemas';
import { useAuth } from '../context/AuthContext';
import { useRouter,useSearchParams } from 'next/navigation';

export default function Home() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  const router = useRouter();
  const { user, loading, logout } = useAuth();

  return (
    <main className="p-24">
      <h1 className="text-3xl font-bold underline">Hello!</h1>
      <h2>Welcome to this Web Application <span>{ user ? user.name : "Person" }</span></h2>
      <hr />
    </main>
  );
}
