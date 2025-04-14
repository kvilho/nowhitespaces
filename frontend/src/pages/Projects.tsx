import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText, Divider, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProjectActions from '../components/ProjectActions';
import projectService, { Project } from '../services/projectService';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const userProjects = await projectService.getMyProjects();
        setProjects(userProjects);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load your projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        color: '#1976d2',
        fontWeight: 500,
        mb: 3
      }}>
        Projects
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Project Actions Card */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3,
            borderRadius: 2,
            flex: { xs: '1 1 auto', md: 1 },
            backgroundColor: '#fff',
            minHeight: '200px'
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
            Project Actions
          </Typography>
          <Box role="region" aria-label="Project actions">
            <ProjectActions />
          </Box>
        </Paper>

        {/* My Projects Card */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3,
            borderRadius: 2,
            flex: { xs: '1 1 auto', md: 1 },
            backgroundColor: '#fff',
            minHeight: '200px'
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
            My Projects
          </Typography>
          
          <Box role="region" aria-label="My projects list">
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress aria-label="Loading projects" />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            ) : projects.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No projects yet
              </Typography>
            ) : (
              <List>
                {projects.map((project, index) => (
                  <React.Fragment key={project.projectId}>
                    <ListItem 
                      alignItems="flex-start" 
                      button 
                      onClick={() => navigate(`/projects/${project.projectId}`)}
                    >
                      <ListItemText
                        primary={project.projectName}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              Code: {project.projectCode}
                            </Typography>
                            <br />
                            {project.projectDescription && (
                              <Typography component="span" variant="body2" color="text.secondary">
                                {project.projectDescription}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < projects.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Projects;
