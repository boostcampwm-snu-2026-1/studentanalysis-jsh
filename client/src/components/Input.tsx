interface InputProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  type?: string
}

export default function Input({ label, value, onChange, placeholder, error, type = 'text' }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-transparent text-on-surface text-sm py-2 outline-none transition-all
          ${error
            ? 'border border-error rounded px-3'
            : 'border-b border-outline focus:border focus:border-primary focus:rounded focus:px-3'
          }`}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}
