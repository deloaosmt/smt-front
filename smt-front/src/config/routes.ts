import { lazy } from 'react';
import type { ComponentType } from 'react';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const FilesPage = lazy(() => import('../pages/files/FilesPage'));
const SubprojectsPage = lazy(() => import('../pages/SubprojectsPage'));
const RevisionsPage = lazy(() => import('../pages/RevisionsPage'));
const FileAnalysisPage = lazy(() => import('../pages/analysis/FileAnalysisPage'));

export interface RouteConfig {
  path: string;
  label: string;
  element: ComponentType;
  isPublic?: boolean;
  isProtected?: boolean;
  showInNavigation?: boolean;
}

export const routes: RouteConfig[] = [
  // Public routes
  {
    path: '/login',
    label: 'Вход',
    element: LoginPage,
    isPublic: true,
    showInNavigation: false,
  },
  {
    path: '/register',
    label: 'Регистрация',
    element: RegisterPage,
    isPublic: true,
    showInNavigation: false,
  },
  
  // Protected routes
  {
    path: '/projects',
    label: 'Проекты',
    element: ProjectsPage,
    isProtected: true,
    showInNavigation: true,
  },
  {
    path: '/projects/:projectId/subprojects',
    label: 'Подпроекты',
    element: SubprojectsPage,
    isProtected: true,
    showInNavigation: false, // This is a dynamic route, don't show in nav
  },
  {
    path: '/subprojects',
    label: 'Подпроекты',
    element: SubprojectsPage,
    isProtected: true,
    showInNavigation: true,
  },
  {
    path: '/subprojects/:subprojectId/revisions',
    label: 'Изменения',
    element: RevisionsPage,
    isProtected: true,
    showInNavigation: false, // This is a dynamic route, don't show in nav
  },
  {
    path: '/revisions',
    label: 'Изменения',
    element: RevisionsPage,
    isProtected: true,
    showInNavigation: true,
  },
  {
    path: '/files',
    label: 'Файлы',
    element: FilesPage,
    isProtected: true,
    showInNavigation: true,
  },
  {
    path: '/analysis',
    label: 'Анализ',
    element: FileAnalysisPage,
    isProtected: true,
    showInNavigation: true,
  },
];

// Helper functions
export const getPublicRoutes = () => routes.filter(route => route.isPublic);
export const getProtectedRoutes = () => routes.filter(route => route.isProtected);
export const getNavigationRoutes = () => routes.filter(route => route.showInNavigation);

// Default redirect paths
export const DEFAULT_PUBLIC_REDIRECT = '/login';
export const DEFAULT_PROTECTED_REDIRECT = '/projects'; 
