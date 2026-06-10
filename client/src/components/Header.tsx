import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 64px',
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #c2c7cc',
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#476274', fontWeight: 600, fontSize: '18px' }}>
        StudentAnalysis
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/students" style={{ textDecoration: 'none', color: '#42474c', fontSize: '14px', fontWeight: 600 }}>
          학생 목록
        </Link>
        <Link
          to="/students/new"
          style={{
            textDecoration: 'none',
            backgroundColor: '#b3cfe5',
            color: '#1a1c1c',
            fontSize: '14px',
            fontWeight: 600,
            padding: '8px 24px',
            borderRadius: '4px',
          }}
        >
          학생 등록
        </Link>
      </nav>
    </header>
  )
}
