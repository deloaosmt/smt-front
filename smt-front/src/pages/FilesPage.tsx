import React from 'react';
import { Box, Container, Typography } from '@mui/joy';
import Navigation from '../components/Navigation';

const FilesPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.body' }}>
      <Navigation />
      
      <Box sx={{ ml: '280px', p: 4 }}>
        <Container maxWidth="xl" sx={{ p: 0 }}>
          <Typography level="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Dashboard
          </Typography>
          <Typography level="body-lg" sx={{ color: 'text.secondary' }}>
            Dashboard content will be implemented here.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default FilesPage; 