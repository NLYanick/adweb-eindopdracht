import { useEffect, useState } from "react";
import { UserProfile } from "../lib/schemas";

export default function SearchableDropdown({ array, onClick }: { array: UserProfile[]; onClick: (item: UserProfile) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = array.filter(item => item.email.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    if (searchTerm.length < 1) setOpen(false);
    else setOpen(true);
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          id="search"
          type="text"
          placeholder="Search by email..."
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-black/5"
          value={searchTerm}
          onFocus={() => searchTerm.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
          {filtered.map(item => (
            <li
              key={item.uid}
              className="px-3 py-2.5 text-sm font-mono text-gray-700 hover:bg-gray-50 cursor-pointer"
              onMouseDown={() => { onClick(item); setSearchTerm(""); setOpen(false); }}
            >
              {item.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}