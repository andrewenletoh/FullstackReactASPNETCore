import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import DotGridBackground from './components/background/Background'
import Navbar from './components/navbar/NavBar'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import TasksPage from './pages/TasksPage'
import ProjectsPage from './pages/ProjectsPage'
import NotFoundPage from './pages/NotFoundPage'


const App: React.FC = () => {
  return (
    <AuthProvider>
      <DotGridBackground theme="light" />
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