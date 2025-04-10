import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import ProjectActions from '../components/ProjectActions';

const Projects: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        color: '#1976d2',
        fontWeight: 500,
        mb: 3
      }}>
        Projects
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Project Actions Card */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3,
            borderRadius: 2,
            flex: 1,
            backgroundColor: '#fff',
            minHeight: '200px'
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
            Project Actions
          </Typography>
          <ProjectActions />
        </Paper>

        {/* My Projects Card - Placeholder for future implementation */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3,
            borderRadius: 2,
            flex: 1,
            backgroundColor: '#fff',
            minHeight: '200px'
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
            My Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No projects yet
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Projects;
