"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const router = useRouter();
  const { register, user } = useAuth();

  useEffect(() => {
    if(user) {
      router.push("/");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!email || !password || !name) {
        alert("Please fill in all fields.");
        return;
    }

    const isRegistered = await register(email, password, name);
    if (isRegistered) {
        router.push("/");
    } else {
        alert("Registration failed. Please try again.");
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4 max-w-sm w-full text-center">
        <h1>Register</h1>

        <form className="flex flex-col gap-4 max-w-sm" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Register
          </button>
        </form>

        <hr />

        <p>Already have an account? <Link href="/auth/login" className="text-blue-500 hover:underline">Login here</Link></p>
      </div>
    </main>
  );
}