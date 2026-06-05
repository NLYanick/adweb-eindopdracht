"use client";
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="p-24">
      <h1 className="text-3xl font-bold underline">Hello!</h1>
      <h2>Welcome to this Web Application <span>{ user ? user.name : "Person" }</span></h2>
      <hr />
    </main>
  );
}
