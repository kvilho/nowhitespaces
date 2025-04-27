import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,  
  CircularProgress, 
  Alert,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent
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
          fontWeight: 700,
          mb: 3
        }}
      >
        Projects
      </Typography>
      
      {/* Project Actions Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Project Actions
        </Typography>
        <Card elevation={2} sx={{ borderRadius: 3, p: 2 }}>
          <CardContent>
            <ProjectActions />
          </CardContent>
        </Card>
      </Paper>

      {/* My Projects Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
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
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.projectId}>
                <Card
                  elevation={2}
                  sx={{ borderRadius: 3, height: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}
                  onClick={() => navigate(`/projects/${project.projectId}`)}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 700, flexGrow: 1 }}>
                          {project.projectName}
                        </Typography>
                        {currentUserId && project.createdBy.id.toString() === currentUserId && (
                          <Chip
                            label="Owner"
                            size="small"
                            color="primary"
                            variant="filled"
                            sx={{ height: 22, fontSize: '0.8rem', fontWeight: 700 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {project.projectDescription || 'No description provided'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created by: {project.createdBy.username}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Projects;
