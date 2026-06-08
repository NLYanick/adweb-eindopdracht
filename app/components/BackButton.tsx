import Link from "next/link";
import { btn } from "../lib/button";

export default function BackButton({ href, label = "Go Back" }: { href: string; label: string }) {
  return (
    <Link href={href} className={`${btn.secondary} mb-6 inline-flex items-center gap-1`}>
      &larr; {label}
    </Link>
  )
}