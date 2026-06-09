"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { btn } from "../lib/button";

export default function ProtectedLayout({ children }: { children: React.ReactNode; }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <>
        <nav className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between gap-6">
          <div className="flex gap-6">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        </nav>
        <main className="p-24">
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <nav className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between gap-6">
        <div className="flex gap-6">
          <Link href="/" className="text-sm font-mono tracking-widest text-gray-500 uppercase hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/budgetbook" className="text-sm font-mono tracking-widest text-gray-500 uppercase hover:text-black transition-colors">
            Budget Books
          </Link>
        </div>
        <button onClick={logout} className={btn.danger}>
          Log out
        </button>
      </nav>
      {children}
    </>
  );
}