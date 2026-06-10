interface ButtonProps {
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({ variant = 'primary', onClick, disabled, children, type = 'button' }: ButtonProps) {
  const base = 'px-8 py-4 rounded text-sm font-semibold transition-opacity'
  const variants = {
    primary: 'bg-primary-container text-on-primary-container',
    secondary: 'border border-primary text-primary bg-transparent',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'}`}
    >
      {children}
    </button>
  )
}
