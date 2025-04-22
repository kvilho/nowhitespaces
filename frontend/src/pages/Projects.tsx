import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  CircularProgress, 
  Alert,
  Chip,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProjectActions from '../components/ProjectActions';
import projectService, { Project } from '../services/projectService';
import authService from '../services/authService';
import '../styles/projects.css';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const userId = authService.getUserId();
    setCurrentUserId(userId);

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
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: '#1976d2',
          fontWeight: 500,
          mb: 3
        }}
      >
        Projects
      </Typography>
      
      {/* Project Actions Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3,
          borderRadius: 2,
          mb: 3,
          backgroundColor: '#fff'
        }}
      >
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          sx={{ 
            color: '#1976d2',
            mb: 2
          }}
        >
          Project Actions
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <ProjectActions />
        </Box>
      </Paper>

      {/* My Projects Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3,
          borderRadius: 2,
          backgroundColor: '#fff'
        }}
      >
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          sx={{ 
            color: '#1976d2',
            mb: 2
          }}
        >
          My Projects
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : projects.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
            No projects yet. Create a new project or join an existing one to get started.
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {projects.map((project, index) => (
              <React.Fragment key={project.projectId}>
                <ListItem 
                  alignItems="flex-start" 
                  button 
                  onClick={() => navigate(`/projects/${project.projectId}`)}
                  sx={{
                    py: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography 
                          variant="subtitle1" 
                          component="span" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#1976d2'
                          }}
                        >
                          {project.projectName}
                        </Typography>
                        {currentUserId && project.createdBy.id.toString() === currentUserId && (
                          <Chip 
                            label="Owner" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ 
                              height: 20,
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Stack spacing={1}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            mb: 0.5
                          }}
                        >
                          {project.projectDescription || 'No description provided'}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block'
                          }}
                        >
                          Created by: {project.createdBy.username}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                {index < projects.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Projects;
