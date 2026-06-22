import { btn } from "../lib/button";
import { UserProfile } from "../lib/schemas";

export default function SharedWithRow({ user, onClick }: { user: UserProfile; onClick: (user: UserProfile) => void }) {
  return (
    <li className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="text-sm text-gray-700">
        <strong>{user.name}</strong> ({user.email})
      </span>

      <button className={btn.danger} onClick={() => onClick(user)}>
        Remove
      </button>
    </li>
  );
}