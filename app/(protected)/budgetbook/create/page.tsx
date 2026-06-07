"use client";
import { useAuth } from "@/app/context/AuthContext";
import { btn } from "@/app/lib/button";
import { createBudgetBook } from "@/app/services/budgetbook-service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function New() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();
  const { user } = useAuth();

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    createBudgetBook({
      owner: user?.uid || "",
      name,
      description,
    });

    router.push("/budgetbook");
  }

  return (
    <main className="p-20">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight text-gray-900">Create New Budget Book</h1>
        <p className="text-xs font-mono text-gray-400 mt-1">{name}</p>
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-mono text-gray-500 mb-1.5" htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Name" required maxLength={50}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-black/5"
              value={name} onChange={(e) => setName(e.target.value)} />
            <p className="text-[11px] font-mono text-gray-400 mt-1">Max 50 characters</p>
          </div>
          <div>
            <label className="block text-sm font-mono text-gray-500 mb-1.5" htmlFor="desc">Description</label>
            <textarea id="desc" placeholder="Description" rows={3} maxLength={500}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 resize-none focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-black/5"
              value={description} onChange={(e) => setDescription(e.target.value)} />
            <p className="text-[11px] font-mono text-gray-400 mt-1">Max 500 characters</p>
          </div>
          <div className="flex gap-2 justify-start mt-2">
            <button type="button" onClick={() => router.push("/budgetbook")} className={btn.secondary}>Cancel</button>
            <button type="submit" className={btn.primary}>Create Budget Book</button>
          </div>
        </form>
      </section>
    </main>
  );
}