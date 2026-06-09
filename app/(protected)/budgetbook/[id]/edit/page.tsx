"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateBudgetBook, getBudgetBook, archiveBudgetBook, shareBudgetBook } from "@/app/services/budgetbook-service";
import { useAuth } from "@/app/context/AuthContext";
import { watchUsers } from "@/app/services/user-service";
import { UserProfile } from "@/app/lib/schemas";
import SearchableDropdown from "@/app/components/SearchableDropdown";
import { btn } from "@/app/lib/button";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

export default function EditBudgetBookPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sharedWith, setSharedWith] = useState<string[]>([]);
    const [owner, setOwner] = useState<string>("");

    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [users, setUsers] = useState<UserProfile[]>([]);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const data = await getBudgetBook(id as string);
            if (!data || data.archived == true) {
                router.push(`/budgetbook/${id}`);
                return;
            }

            if (data.owner !== user?.uid && !data.sharedWith?.includes(user.uid)) {
                router.push(`/budgetbook/${id}`);
                return;
            }

            setName(data.name);
            setDescription(data.description || "");
            setSharedWith(data.sharedWith || []);
            setOwner(data.owner);
        };

        fetchData();
    }, [id, user, router, sharedWith]);

    useEffect(() => {
        const unsubscribe = watchUsers((users) => {
            const filteredUsers = users
                .filter(u => u.uid !== user?.uid)
                .filter(u => u.uid !== owner)
                .filter(u => !sharedWith.includes(u.uid));
            setUsers(filteredUsers.slice(0, 15));
        });

        return () => unsubscribe();
    }, [id, sharedWith]);


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
        if (selectedUser) {
            shareBudgetBook(id as string, selectedUser.email)
        }
        setSelectedUser(null);
    }

    return (
        <main className="p-20">
            <div className="mb-8">
                <h1 className="text-2xl font-medium tracking-tight text-gray-900">Edit budget book</h1>
                <p className="text-xs font-mono text-gray-400 mt-1">{name}</p>
            </div>

            <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h2 className="text-sm font-mono tracking-widest text-gray-400 uppercase mb-5">Information</h2>
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
                    <div className="flex items-center justify-between pt-1">
                        <button type="button" onClick={() => setShowModal(true)} className={btn.danger}>
                            Archive
                        </button>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => router.push(`/budgetbook/${id}`)} className={btn.secondary}>Cancel</button>
                            <button type="submit" className={btn.primary}>Save changes</button>
                        </div>
                    </div>
                </form>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-sm font-mono tracking-widest text-gray-400 uppercase mb-5">Share with others</h2>
                <div className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                        <SearchableDropdown array={users} onClick={setSelectedUser} />
                        {selectedUser && (
                            <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-xs font-mono text-gray-700">
                                {selectedUser.email}
                                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-red-600 font-bold leading-none">&times;</button>
                            </div>
                        )}
                    </div>
                    <button onClick={handleOnClick} disabled={!selectedUser} className={`${btn.success} disabled:opacity-40 disabled:cursor-not-allowed`}>
                        Invite
                    </button>
                </div>
            </section>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="bg-white rounded-xl border border-gray-200 p-6 max-w-sm w-full mx-4 flex flex-col gap-4"
                        >
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Archive <strong>{name}</strong>? It will be hidden from your active books and can be restored later.
                            </p>
                            <div className="flex gap-2 justify-between">
                                <button onClick={() => setShowModal(false)} className={btn.secondary}>Cancel</button>
                                <button onClick={handleArchive} className={btn.danger}>Yes, archive</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
