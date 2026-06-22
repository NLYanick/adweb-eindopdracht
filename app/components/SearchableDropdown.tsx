import { useEffect, useRef, useState } from "react";

export default function SearchableDropdown({ array, onClick }: { array: any[]; onClick: (item: any) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<any[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length < 1) setOpen(false);
    else setOpen(true);

    const filtered = array.filter(item => item.email.toLowerCase().includes(searchTerm.toLowerCase()));
    setFiltered(filtered);
  }, [searchTerm]);

  
  const onButtonClick = (item: any) => {
    onClick(item);
    setSearchTerm("");
    setOpen(false);
  }

  const onBlur = (e: React.FocusEvent) => {
    const nextFocused = e.relatedTarget as Node | null;

    if (nextFocused && containerRef.current?.contains(nextFocused))
      return;

    setTimeout(() => setOpen(false), 150); // Delay to allow click event to register before closing dropdown
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") 
      setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          id="search"
          type="text"
          placeholder="Search by email..."
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-black/5"
          value={searchTerm}
          onFocus={() => searchTerm.length > 0 && setOpen(true)}
          onBlur={onBlur}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
          {filtered.map(item => (
            <li key={item.uid}>
              <button
                className="px-3 py-2.5 text-sm font-mono text-gray-700 hover:bg-gray-50 cursor-pointer w-full text-left"
                onMouseDown={() => onButtonClick(item)}
                onKeyDown={onKeyDown}
              >
                {item.email}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}