import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-content mx-auto px-16 py-10">
        <Outlet />
      </main>
    </div>
  )
}
