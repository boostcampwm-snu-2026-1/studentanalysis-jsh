import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 64px' }}>
        <Outlet />
      </main>
    </div>
  )
}
