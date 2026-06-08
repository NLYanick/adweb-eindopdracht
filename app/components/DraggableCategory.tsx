import { Category } from "../lib/schemas";

export default function DraggableCategory({ category }: { category: Category }) {
  return (
    <div 
      className="bg-purple-200 border border-purple-300 rounded-md p-4 cursor-move max-w-54"
      draggable
      onDragStart={(e) => e.dataTransfer.setData("category", category.uid)}
    >
      <p className="font-semibold text-gray-700">{category.name}</p>
    </div>
  );
}