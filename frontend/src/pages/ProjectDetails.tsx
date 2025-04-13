import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Button } from '@mui/material';
import projectService, { Project, ProjectMember } from '../services/projectService';
import '../styles/projectDetails.css';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const fetchedProject = await projectService.getProjectById(id!);
        setProject(fetchedProject);
        const fetchedMembers = await projectService.getProjectMembers(id!);
        setMembers(fetchedMembers);
        setError(null);
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={() => window.history.back()} sx={{ mb: 2 }}>
        Back to Projects
      </Button>
      <Typography variant="h4" gutterBottom>
        {project?.projectName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {project?.projectDescription}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Created by: {project?.createdBy.username}
      </Typography>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Project Members
      </Typography>
      <List>
        {members.map((member, index) => (
          <ListItem key={member.id || `${member.user.username}-${index}`}>
            <ListItemText
              primary={member.user.username}
              secondary={`Role: ${member.role} | Email: ${member.user.email}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ProjectDetails;
