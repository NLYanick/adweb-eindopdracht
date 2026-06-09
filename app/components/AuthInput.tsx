type Props = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}

export default function AuthInput({ id, label, type = "text", value, onChange, placeholder, required = false, maxLength, }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block font-mono text-[11px] tracking-wider text-gray-500 mb-1.5">{label}</label>
      <input id={id} type={type} placeholder={placeholder} required={required} maxLength={maxLength}
        className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-black/5"
        value={value} onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}