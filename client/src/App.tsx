import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/NavBar'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import ProjectsPage from './pages/ProjectsPage'
import AuthPage from './pages/AuthPage'
import NotFoundPage from './pages/NotFoundPage'
import { Toaster } from 'react-hot-toast'

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="auth" element={<AuthPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App