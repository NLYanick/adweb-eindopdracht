"use client";

import { Transaction } from "../lib/schemas";

export default function TransactionRow({ transaction }: { transaction: Transaction }) {
    return (
        <div
            key={transaction.uid}
            style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "12px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {/* LEFT SIDE (like name + description) */}
            <div>
                {/* <div>{t.categoryName}</div> */}
                <p>{transaction.date}</p>
                <p>{transaction.description}</p>
            </div>

            {/* RIGHT SIDE (amount + action button) */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                    style={{
                        color: transaction.amount > 0 ? "green" : "red",
                        fontWeight: "bold",
                    }}
                >
                    {transaction.amount > 0 ? "+" : "-"}€{Math.abs(transaction.amount)}
                </div>

                <button style={{ background: "green", color: "white", padding: "4px 10px" }}>
                    Edit
                </button>
            </div>
        </div>
    )
}