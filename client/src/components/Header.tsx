import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-16 h-16 bg-surface-container-lowest border-b border-outline-variant">
      <Link to="/" className="text-primary font-semibold text-lg no-underline">
        StudentAnalysis
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/students" className="text-on-surface-variant text-sm font-semibold no-underline hover:text-on-surface">
          학생 목록
        </Link>
        <Link to="/students/new" className="bg-primary-container text-on-primary-container text-sm font-semibold px-6 py-2 rounded no-underline hover:opacity-90">
          학생 등록
        </Link>
      </nav>
    </header>
  )
}
