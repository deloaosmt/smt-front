import { Routes, Route, Navigate } from 'react-router'
import { CssVarsProvider } from '@mui/joy/styles'
import AuthProvider from './auth/AuthProvider'
import { PrivateRoute } from './auth/PrivateRoute'
import LoginPage from './login/LoginPage'
import RegisterPage from './login/RegisterPage'
import ProjectsPage from './pages/ProjectsPage'
import SettingsPage from './pages/SettingsPage'
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
            <Route path="/files" element={<SettingsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
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
