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

export default function BudgetBookDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { user, loading } = useAuth();

    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

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
        const unsubscribe = watchTransactionsByMonth(id, year, month, (t) => {
            setTransactions(t);
        });
        return () => unsubscribe();
    }, [id, year, month]);

    const prevMonth = () => {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };

    const nextMonth = () => {
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

    const balance = income - expenses;
    return (
        <div className="m-9">

            {/* ✅ Header (same style as your page) */}
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

            {/* ✅ Stats (simple, inline like your UI) */}
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
            <AddTransaction id={id} className="flex my-3 justify-end"/>
            {/* ✅ Transactions list (MATCHES your budgetbook style) */}
            {transactions.toSorted((a, b) => new Date(b.date).getDay() - new Date(a.date).getDay()).map((t) => (
                <TransactionRow transaction={t} />
            ))}
        </div>
    )
}
