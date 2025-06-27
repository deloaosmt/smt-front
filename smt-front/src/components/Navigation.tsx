import React from 'react';
import { Box, Button, Avatar, Typography } from '@mui/joy';
import { useNavigate, useLocation } from 'react-router';
import useAuth from '../auth/AuthHook';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const handleLogout = () => {
    setAuth(false);
    navigate('/login');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const fileRoute = '/files';
  const projectRoute = '/projects';
  const subprojectRoute = '/subprojects';
  const revisionRoute = '/revisions';

  const routes = [
    { path: projectRoute, label: 'Проекты' },
    { path: subprojectRoute, label: 'Подпроекты' },
    { path: revisionRoute, label: 'Ревизии' },
    { path: fileRoute, label: 'Файлы' },
  ];


  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: 'background.surface',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      {/* Header/Brand */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography level="h4" sx={{ fontWeight: 'bold', color: 'primary.500' }}>
          SMT Platform
        </Typography>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, p: 2 }}>
        {routes.map(({path, label}) => {
          return (
            <Button
              variant={isActiveRoute(path) ? 'solid' : 'plain'}
              color={isActiveRoute(path) ? 'primary' : 'neutral'}
              onClick={() => navigate(path)}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                mb: 1,
                textAlign: 'left',
              }}
            >
              {label}
            </Button>
          )
        })}
      </Box>

      {/* User Section */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar size="sm" sx={{ bgcolor: 'primary.500' }}>
            U
          </Avatar>
          <Typography level="body-sm">Пользователь</Typography>
        </Box>
        <Button
          variant="outlined"
          color="neutral"
          size="sm"
          onClick={handleLogout}
          sx={{ width: '100%' }}
        >
          Выйти
        </Button>
      </Box>
    </Box>
  );
};

export default Navigation; 