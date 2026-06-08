export default function TransactionsMonthNav({ monthLabel, prevMonth, nextMonth }: { monthLabel: string; prevMonth: () => void; nextMonth: () => void }) {
  return (
    <div className="flex items-center gap-3 justify-center mb-4">
      <button onClick={prevMonth}
        className="bg-gray-100 border border-gray-200 rounded-md px-3 py-1.5 font-mono text-sm hover:bg-gray-50 transition-colors">
          ‹
      </button>
      <span className="font-mono text-sm text-gray-700 w-36 text-center">{monthLabel}</span>
      <button onClick={nextMonth}
        className="bg-gray-100 border border-gray-200 rounded-md px-3 py-1.5 font-mono text-sm hover:bg-gray-50 transition-colors">
          ›
      </button>
    </div>
  )
}