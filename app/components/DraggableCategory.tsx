import { Category } from "../lib/schemas";

export default function DraggableCategory({ category }: { category: Category }) {
  return (
    <div
        draggable
        onDragStart={(e) => e.dataTransfer.setData("category", category.uid)}
        className="cursor-grab active:cursor-grabbing bg-white border border-gray-200 rounded-xl px-4 py-3 transition-all hover:border-gray-300 hover:-translate-y-0.5"
    >
        <div className="flex items-center justify-between gap-4">
            <p className="font-medium text-gray-900">{category.name}</p>
        </div>
    </div>
  );
}