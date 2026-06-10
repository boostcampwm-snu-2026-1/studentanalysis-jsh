import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import StudentListPage from './pages/StudentListPage'
import StudentNewPage from './pages/StudentNewPage'
import StudentDetailPage from './pages/StudentDetailPage'

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/students" element={<StudentListPage />} />
        <Route path="/students/new" element={<StudentNewPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
      </Route>
    </Routes>
  )
}
