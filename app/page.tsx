"use client";
import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-24">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Link href="/budgetbook">Dashboard</Link>
    </main>
  );
}
