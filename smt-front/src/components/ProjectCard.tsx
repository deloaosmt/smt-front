import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/joy';
import type { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography level="h4" sx={{ fontWeight: 'bold' }}>
            {project.title}
          </Typography>
        </Box>
        
        <Typography level="body-md" sx={{ mb: 2, color: 'text.secondary' }}>
          {project.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
            Updated: {new Date(project.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard; 