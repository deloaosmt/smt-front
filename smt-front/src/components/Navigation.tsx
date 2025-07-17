import { Box, Button, Avatar, Typography } from '@mui/joy';
import { useNavigate, useLocation } from 'react-router';
import useAuth from '../auth/AuthHook';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    logout();
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
    { path: revisionRoute, label: 'Изменения' },
    { path: fileRoute, label: 'Файлы' },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.full_name) return 'U';
    return user.full_name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.email) return user.email;
    return 'Пользователь';
  };

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
              key={path}
              variant={isActiveRoute(path) ? 'solid' : 'plain'}
              color={isActiveRoute(path) ? 'primary' : 'neutral'}
              onClick={() => navigate(path)}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                mb: 1,  textAlign: 'left',
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
            {getUserInitials()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography level="body-sm" sx={{ fontWeight: 'medium' }}>
              {getDisplayName()}
            </Typography>
            {user?.email && (
              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                {user.email}
              </Typography>
            )}
          </Box>
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