import { Box, CircularProgress, Typography } from '@mui/joy';

const PageLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress size="lg" />
      <Typography level="body-md" color="neutral">
        Загрузка...
      </Typography>
    </Box>
  );
};

export default PageLoader; 