"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    if(user) {
      router.push("/");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      await login(email, password);
      router.push("/");
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <main className="p-24">
      <h1>Login</h1>

      <form className="flex flex-col gap-4 max-w-sm" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>

      <hr />

      <p>Don't have an account? <Link href="/auth/register" className="text-blue-500 hover:underline">Register here</Link></p>
    </main>
  );
}