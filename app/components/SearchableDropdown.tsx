import { useEffect, useState } from "react";

export default function SearchableDropdown({ array, onClick }: { array: any[]; onClick: (item: any) => void }) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (searchTerm.length < 1) {
            setOpen(false);
            return;
        };

        setOpen(true);
    }, [searchTerm]);
    
    return (
        <div className="flex flex-col">
            <input 
                id="search"
                placeholder="Search email..." 
                className="border-2 p-2 border-gray-400 rounded flex-1 min-w-96"
                value={searchTerm}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {open && (
                <ul className="absolute bg-white border rounded mt-12 w-96 max-h-48 overflow-y-auto">
                    {array.filter(item => item.email.includes(searchTerm)).map(item => (
                        <li 
                            key={item.uid} 
                            className="p-2 hover:bg-gray-200 cursor-pointer" 
                            onMouseDown={() => onClick(item)}
                        >
                            {item.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}