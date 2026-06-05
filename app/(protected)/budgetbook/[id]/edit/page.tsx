"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateBudgetBook, getBudgetBook, archiveBudgetBook, shareBudgetBook, watchSharedWith } from "@/app/services/budgetbook-service";
import { useAuth } from "@/app/context/AuthContext";
import { watchUsers } from "@/app/services/user-service";
import { UserProfile } from "@/app/lib/schemas";
import SearchableDropdown from "@/app/components/SearchableDropdown";

export default function EditBudgetBookPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [sharedWith, setSharedWith] = useState<string[]>([]);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const data = await getBudgetBook(id as string);
            if (!data || data.archived == true) {
                router.push(`/budgetbook/${id}`);
                return;
            }

            if (data.owner !== user?.uid) {
                router.push(`/budgetbook/${id}`);
                return;
            }

            setName(data.name);
            setDescription(data.description || "");
        };

        fetchData();
    }, [id, user, router]);

    useEffect(() => {
        const unsubscribe = watchUsers((users) => {
            const filteredUsers = users
                .filter(u => u.uid !== user?.uid)
                .filter(u => !sharedWith.includes(u.uid));
            setUsers(filteredUsers.slice(0, 15));
        });

        const unsubscribe2 = watchSharedWith(id as string, (sharedWith) => {
            setSharedWith(sharedWith);
        });

        return () => {
            unsubscribe();
            unsubscribe2();
        };
    }, [users, id, sharedWith]);


    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        await updateBudgetBook(id as string, {
            name: name,
            description: description,
        });
        router.push(`/budgetbook/${id}`);
    };

    const handleArchive = async () => {
        await archiveBudgetBook(id as string);
        router.push(`/budgetbook`);
    };

    const handleOnClick = () => {
        if(selectedUser) {
            shareBudgetBook(id as string, selectedUser.email)
        }
        setSelectedUser(null);
    } 

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
                            onClick={() => router.push(`/budgetbook/${id}`)}
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

            <div className="mt-6 border rounded p-4">
                <h2 className="text-xl font-bold mb-4">Share Budget Book</h2>

                <div className="flex gap-2">
                    <div className="relative space-y-2 flex-1">
                        <SearchableDropdown array={users} onClick={setSelectedUser} />
                        
                        <div className="flex items-center gap-2">
                            {selectedUser && (
                                <div className="flex items-center gap-2 border-2 p-2 rounded shadow-lg">
                                    <span>{selectedUser.email}</span>
                                    <button onClick={() => setSelectedUser(null)} className="text-red-500 hover:text-red-700">&times;</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-400 h-max"
                        onClick={handleOnClick}
                        disabled={!selectedUser}
                    >
                        Invite
                    </button>
                </div>
            </div>

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
