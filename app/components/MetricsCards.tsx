export default function MetricsCards({ total, income, expenses}: { total: number, income: number, expenses: number }) {

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-gray-100 rounded-xl p-4 text-center">
        <p className="font-mono text-[11px] text-gray-500 tracking-wider">Balance</p>
        <p className="text-xl font-medium text-gray-900 mt-1">{fmt(total)}</p>
      </div>
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <p className="font-mono text-[11px] text-green-700 tracking-wider">Income</p>
        <p className="text-xl font-medium text-green-800 mt-1">{fmt(income)}</p>
      </div>
      <div className="bg-red-50 rounded-xl p-4 text-center">
        <p className="font-mono text-[11px] text-red-700 tracking-wider">Expenses</p>
        <p className="text-xl font-medium text-red-800 mt-1">{fmt(expenses)}</p>
      </div>
    </div>
  )
}