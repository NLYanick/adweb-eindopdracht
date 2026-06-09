"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateBudgetBook, getBudgetBook, archiveBudgetBook, shareBudgetBook, unshareBudgetBook } from "@/app/services/budgetbook-service";
import { useAuth } from "@/app/context/AuthContext";
import { watchUsers } from "@/app/services/user-service";
import { Budgetbook, UserProfile } from "@/app/lib/schemas";
import SearchableDropdown from "@/app/components/SearchableDropdown";
import { btn } from "@/app/lib/button";
import { AnimatePresence } from "motion/react";
import ArchiveModal from "@/app/components/ArchiveModal";
import SharedWithRow from "@/app/components/SharedWithRow";
import RemoveInvitedModal from "@/app/components/RemoveInvitedModal";

export default function EditBudgetBookPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [budgetBook, setBudgetBook] = useState<Budgetbook | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [removingUser, setRemovingUser] = useState<UserProfile | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);

    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const loadBudgetBook = async () => {
        const book = await getBudgetBook(id as string);

        if (!book || book.archived == true) {
            router.push(`/budgetbook/${id}`);
            return;
        }
        if (book.owner !== user?.uid && !book.sharedWith?.includes(user?.uid || "")) {
            router.push(`/budgetbook/${id}`);
            return;
        }

        setBudgetBook(book);
        setName(book.name);
        setDescription(book.description || "");
    }

    // Effects
    useEffect(() => {
        if (!user) return;
        loadBudgetBook();
    }, [id, user, router, budgetBook?.sharedWith]);

    useEffect(() => {
        const unsubscribe = watchUsers((users) => {
            const filteredUsers = users
                .filter(u => u.uid !== user?.uid)
                .filter(u => u.uid !== budgetBook?.owner)
                .filter(u => !budgetBook?.sharedWith?.includes(u.uid));
            
            setFilteredUsers(filteredUsers.slice(0, 15));
            setUsers(users);
        });

        return () => unsubscribe();
    }, [id, budgetBook?.sharedWith]);

    // Handlers
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

    const inviteUser = async () => {
        if (selectedUser) {
            await shareBudgetBook(id as string, selectedUser.email);
        }
        setSelectedUser(null);
    }

    const handleRemoveInvited = async () => {
        if (removingUser) {
            await unshareBudgetBook(id as string, removingUser.email);
        }
        setRemovingUser(null);
        setShowRemoveModal(false);
    }

    const handleSharedWithRemoving = (user: UserProfile) => {
        setRemovingUser(user);
        setShowRemoveModal(true);
    }

    return (
        <main className="p-20">
            <header className="mb-8">
                <h1 className="text-2xl font-medium tracking-tight text-gray-900">Edit budget book</h1>
                <p className="text-xs font-mono text-gray-400 mt-1">{name}</p>
            </header>

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
                        <button type="button" onClick={() => setShowArchiveModal(true)} className={btn.danger}>
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
                        <SearchableDropdown array={filteredUsers} onClick={setSelectedUser} />
                        {selectedUser && (
                            <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-xs font-mono text-gray-700">
                                {selectedUser.email}
                                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-red-600 font-bold leading-none">&times;</button>
                            </div>
                        )}
                    </div>
                    <button onClick={inviteUser} disabled={!selectedUser} className={`${btn.success} disabled:opacity-40 disabled:cursor-not-allowed`}>
                        Invite
                    </button>
                </div>

                <hr className="flex-1 border-gray-100 my-4" />

                <ul className="divide-y divide-gray-200">
                    {budgetBook?.sharedWith?.length === 0 && (
                        <li className="text-sm font-mono text-gray-400">Not shared with anyone yet.</li>
                    )}
                    {budgetBook?.sharedWith?.map(uid => {
                        const user = users.find(u => u.uid === uid);
                        if (!user) return null;
                        return (
                            <SharedWithRow key={uid} user={user} onClick={handleSharedWithRemoving} />
                        )
                    })}
                </ul>
            </section>

            <AnimatePresence>
                {showArchiveModal && (
                    <ArchiveModal 
                        name={name} 
                        onCancel={() => setShowArchiveModal(false)} 
                        onConfirm={handleArchive} 
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showRemoveModal && (
                    <RemoveInvitedModal 
                        name={removingUser?.name || ""} 
                        onCancel={() => setShowRemoveModal(false)} 
                        onConfirm={handleRemoveInvited} 
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
