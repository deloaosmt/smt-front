import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/joy';
import Navigation from '../components/Navigation';
import ProjectCard from '../components/ProjectCard';
import Pagination from '../components/Pagination';
import { mockProjects } from '../data/mockProjects';

const ITEMS_PER_PAGE = 8;

const ProjectsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(mockProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = mockProjects.slice(startIndex, endIndex);

  const handleProjectClick = (projectId: string) => {
    console.log('Project clicked:', projectId);
    // You can add navigation to project details here
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.body' }}>
      <Navigation />
      
      {/* Main content with left margin to account for sidebar */}
      <Box sx={{ ml: '280px', p: 4 }}>
        <Container maxWidth="xl" sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography level="h2" sx={{ fontWeight: 'bold' }}>
                Проекты
              </Typography>
              <Button
                variant="solid"
                color="primary"
                size="lg"
              >
                Создать проект
              </Button>
            </Box>
          </Box>

          {/* Projects Grid */}
          <Grid container spacing={3}>
            {currentProjects.map((project) => (
              <Grid xs={12} md={6} key={project.id}>
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project.id)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Empty state (if no projects) */}
          {mockProjects.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <Typography level="h4" sx={{ mb: 2 }}>
                Нет проектов
              </Typography>
              <Typography level="body-md" sx={{ mb: 3 }}>
                Создайте свой первый проект для начала
              </Typography>
              <Button variant="solid" color="primary" size="lg">
                Создать проект
              </Button>
            </Box>
          )}

          {/* Pagination */}
          {mockProjects.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={mockProjects.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default ProjectsPage; 