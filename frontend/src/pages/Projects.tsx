import React from 'react';
import { Container, Typography } from '@mui/material';
import ProjectActions from '../components/ProjectActions';

const Projects: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Projects
      </Typography>
      <ProjectActions />
      {/* Project list will be added here later */}
    </Container>
  );
};

export default Projects;
