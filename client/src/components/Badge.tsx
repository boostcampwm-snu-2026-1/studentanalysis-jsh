interface BadgeProps {
  children: React.ReactNode
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
      {children}
    </span>
  )
}
