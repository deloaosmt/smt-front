import { Routes, Route, Navigate } from 'react-router'
import { Suspense } from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import { Provider } from 'jotai'
import AuthProvider from './auth/AuthProvider'
import { PrivateRoute } from './auth/PrivateRoute'
import PageLoader from './components/PageLoader'
import './App.css'
import { NotificationProvider, NotificationSystem } from './notifications'
import {
  getPublicRoutes,
  getProtectedRoutes,
  DEFAULT_PUBLIC_REDIRECT,
  DEFAULT_PROTECTED_REDIRECT
} from './config/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();
const publicRoutes = getPublicRoutes();
const protectedRoutes = getProtectedRoutes();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <CssVarsProvider>
          <NotificationProvider>
            <AuthProvider>
              <NotificationSystem />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  {publicRoutes.map(({ path, element: Element }) => (
                    <Route key={path} path={path} element={<Element />} />
                  ))}

                  {/* Protected routes */}
                  <Route element={<PrivateRoute />}>
                    {protectedRoutes.map(({ path, element: Element }) => (
                      <Route key={path} path={path} element={<Element />} />
                    ))}
                    {/* Redirect / to /projects */}
                    <Route path="/" element={<Navigate to={DEFAULT_PROTECTED_REDIRECT} replace />} />
                  </Route>

                  {/* Redirect to login if no route matches */}
                  <Route path="*" element={<Navigate to={DEFAULT_PUBLIC_REDIRECT} replace />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </NotificationProvider>
        </CssVarsProvider>
      </Provider>
    </QueryClientProvider>
  )
}

export default App
