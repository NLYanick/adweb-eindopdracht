"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateBudgetBook, getBudgetBook, archiveBudgetBook } from "@/app/services/budgetbook-service";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function EditBudgetBookPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const data = await getBudgetBook(id as string);
        if (!data || data.archived == true) {
            router.push("/budgetbook");
            return;
        }

        if (data.owner !== user?.uid) {
            router.push("/budgetbook");
            return;
        }

        setName(data.name);
        setDescription(data.description || "");
        setLoading(false);
    };

    fetchData();
    }, [id, user, router]);
    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        await updateBudgetBook(id as string, {
            name: name,
            description: description,
        });
        router.push("/budgetbook");
    };

    
    const handleArchive = async () => {
        await archiveBudgetBook(id as string);
        router.push("/budgetbook");
    };

    
    return (
        <main className="p-24">
        <h1 className="text-3xl font-bold underline">Edit the Budget Book</h1>

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
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="bg-gray-900 text-white p-2 rounded hover:bg-gray-500"
                >
                    Archive
                </button>
                <div className="flex gap-5">
                    <button
                        type="button"
                        onClick={() => router.push("/budgetbook")}
                        className="bg-gray-400 text-white p-2 rounded  hover:bg-gray-500"
                    >
                        Cancel
                    </button>

                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white p-2 rounded  hover:bg-blue-400"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
        
        {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                <div className="bg-white p-6 rounded shadow flex flex-col gap-4">
                    <p>Are you sure you want to archive this budget book?</p>

                    <div className="flex gap-3 justify-between">
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleArchive}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Yes, archive
                    </button>
                    </div>
                </div>
            </div>
        )}
        </main>
    );
}
