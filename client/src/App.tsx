import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/NavBar'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import ProjectsPage from './pages/ProjectsPage'
import AuthPage from './pages/AuthPage'
import NotFoundPage from './pages/NotFoundPage'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" />
    </AuthProvider>
  )
}

export default App