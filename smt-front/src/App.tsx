import { Routes, Route, Navigate } from 'react-router'
import { CssVarsProvider } from '@mui/joy/styles'
import AuthProvider from './auth/AuthProvider'
import { PrivateRoute } from './auth/PrivateRoute'
import LoginPage from './login/LoginPage'
import RegisterPage from './login/RegisterPage'
import ProjectsPage from './pages/ProjectsPage'
import FilesPage from './pages/FilesPage'
import SubprojectsPage from './pages/SubprojectsPage'
import RevisionsPage from './pages/RevisionsPage'
import './App.css'

function App() {
  return (
    <CssVarsProvider>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId/subprojects" element={<SubprojectsPage />} />
            <Route path="/subprojects" element={<SubprojectsPage />} />
            <Route path="/subprojects/:subprojectId/revisions" element={<RevisionsPage />} />
            <Route path="/revisions" element={<RevisionsPage />} />
            <Route path="/files" element={<FilesPage />} />
            {/* Redirect / to /projects */}
            <Route path="/" element={<Navigate to="/projects" replace />} />
          </Route>

          {/* Redirect to login if no route matches */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </CssVarsProvider>
  )
}

export default App
