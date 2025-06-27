import React from 'react';
import { Box, Container, Typography } from '@mui/joy';
import Navigation from '../components/Navigation';

const SettingsPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.body' }}>
      <Navigation />
      
      <Box sx={{ ml: '280px', p: 4 }}>
        <Container maxWidth="xl" sx={{ p: 0 }}>
          <Typography level="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Settings
          </Typography>
          <Typography level="body-lg" sx={{ color: 'text.secondary' }}>
            Settings content will be implemented here.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default SettingsPage; 