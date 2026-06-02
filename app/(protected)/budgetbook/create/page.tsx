"use client";
import { useAuth } from "@/app/context/AuthContext";
import { createBudgetBook } from "@/app/services/budgetbook-service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function New() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();
  const { user } = useAuth();
  
  const onSubmit = async (e:React.SubmitEvent) => {
    e.preventDefault()
    createBudgetBook({
      owner: user?.uid || "", 
      name,
      description,
    });
    
    router.push("/budgetbook");
  }
  
  return (
    <main className="p-24">
      <h1 className="text-3xl font-bold underline">Create New Budget Book</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4">
        <input 
          type="text" 
          placeholder="Name" 
          className="border p-2"
          required
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <em>Max 50 characters</em>
        <textarea 
          placeholder="Description" 
          className="border p-2"
          value={description}
          maxLength={500}
          onChange={(e) => setDescription(e.target.value)}
        />
        <em>Max 500 characters</em>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create</button>
      </form>
    </main>
  );
}