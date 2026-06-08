"use client";
import AuthInput from "@/app/components/AuthInput";
import { useAuth } from "@/app/context/AuthContext";
import { btn } from "@/app/lib/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { register, user } = useAuth();

  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("Please fill in all fields.");
      return;
    }
    const isRegistered = await register(email, password, name);
    if (isRegistered) router.push("/");
    else setError("Registration failed. Please try again.");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl px-8 py-10 w-full max-w-md">

        <p className="text-center font-mono text-[11px] tracking-widest text-gray-400 uppercase mb-8">
          Budgetbook
        </p>

        <h1 className="text-2xl font-medium text-gray-900 text-center">Create account</h1>
        <p className="text-center font-mono text-xs text-gray-400 mt-1 mb-8">Start managing your finances</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput 
            id="name" 
            label="Name" 
            type="text" 
            placeholder="Name"
            required={true}
            value={name} 
            onChange={setName} 
          />
          <AuthInput 
            id="email" 
            label="Email" 
            type="email" 
            placeholder="user@example.com"
            required={true}
            value={email} 
            onChange={setEmail} 
          />
          <AuthInput 
            id="password" 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            required={true} 
            value={password} 
            onChange={setPassword} 
          />

          <button type="submit"
            className={btn.primary + " mt-2 py-3"}>
            Create account
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        <div className="flex items-center gap-3 my-6">
          <hr className="flex-1 border-gray-100" />
          <span className="font-mono text-[11px] text-gray-400">or</span>
          <hr className="flex-1 border-gray-100" />
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-gray-900 font-medium underline underline-offset-2 hover:text-gray-600">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}