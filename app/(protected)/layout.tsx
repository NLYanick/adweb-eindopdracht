"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return null;
    }

    return (
        <>
            <nav className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between gap-6">
                <div className="flex gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/budgetbook"
                        className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
                    >
                        Budget Books
                    </Link>
                </div>
                <button onClick={logout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                    Log out
                </button>
            </nav>
            {children}
        </>
    );
}