"use client";

import { useAuth } from "@/app/context/AuthContext";
import { getBudgetBook } from "@/app/services/budgetbook-service";
import Link from "next/link";
import { useParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";
import { watchTransactions, watchTransactionsByMonth } from "@/app/services/transaction-service";
import { Transaction } from "@/app/lib/schemas";
import AddTransaction from "@/app/components/AddTransaction";
import TransactionRow from "@/app/components/TransactionRow";
import EditTransaction from "@/app/components/EditTransaction";
import TransactionsPanel from "@/app/components/TransactionsPanel";
import TransactionPanel from "@/app/components/TransactionsPanel";

export default function BudgetBookDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { user } = useAuth();

    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    const [debouncedMonth, setDebouncedMonth] = useState(month);
    const [debouncedYear, setDebouncedYear] = useState(year);

    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const [tab, setTab] = useState<"transactions" | "categories">("transactions");

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
        }
        fetchData();
    }, [id, user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedMonth(month);
            setDebouncedYear(year);
        }, 200);
        return () => clearTimeout(timer);
    }, [month, year]);

    useEffect(() => {
        const unsubscribe = watchTransactionsByMonth(id, debouncedYear, debouncedMonth, (t) => {
            setTransactions(t);
        });
        return () => unsubscribe();
    }, [id, debouncedYear, debouncedMonth]);

    const prevMonth = async () => {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };

    const nextMonth = async () => {
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    const monthLabel = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
    });


    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="m-9">

            <div className="flex justify-between">
                <div className="mb-4">
                    <h1 className="font-bold text-3xl">{name}</h1>
                    <p>{description}</p>
                </div>
                <Link
                    href={`/budgetbook/${id}/edit`}
                    className="h-fit px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400 align-middle"
                >
                    Edit
                </Link>
            </div>
            <div className="flex items-center gap-4 mb-2 justify-center">
                <button onClick={prevMonth} className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400">&lt;</button>
                <span className="font-medium w-40 text-center">{monthLabel}</span>
                <button onClick={nextMonth} className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400">&gt;</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">

                {/* Balance */}
                <div className="bg-gray-200 rounded-xl p-4 text-center font-semibold">
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="text-lg">€{total}</p>
                </div>

                {/* Income */}
                <div className="bg-green-100 rounded-xl p-4 text-center font-semibold">
                    <p className="text-sm text-green-700">Income</p>
                    <p className="text-lg text-green-900">€{income}</p>
                </div>

                {/* Expenses */}
                <div className="bg-red-100 rounded-xl p-4 text-center font-semibold">
                    <p className="text-sm text-red-700">Expenses</p>
                    <p className="text-lg text-red-900">€{expenses}</p>
                </div>
            </div>

            <hr />

            <div className="flex border-b mb-4">
                <button
                    onClick={() => setTab("transactions")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "transactions"
                        ? "border-blue-500 text-black"
                        : "border-transparent text-gray-500 hover:text-black"
                        }`}
                >
                    Transactions
                </button>
                <button
                    onClick={() => setTab("categories")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "categories"
                        ? "border-blue-500 text-black"
                        : "border-transparent text-gray-500 hover:text-black"
                        }`}
                >
                    Categories
                </button>
            </div>

            {tab === "transactions" && <TransactionPanel budgetbookId={id} month={month} year={year} />}
            {/* {tab === "categories" && <CategoryPanel budgetbookId={id} month={month} year={year} />} */}
        </div>
    )
}
