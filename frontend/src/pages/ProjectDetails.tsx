import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  List, 
  ListItem, 
  ListItemText, 
  Button,
  Paper,
  Box,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import projectService, { Project, ProjectMember } from '../services/projectService';
import authService from '../services/authService';
import { Entry } from '../types/Entry';
import '../styles/projectDetails.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const fetchedProject = await projectService.getProjectById(id!);
        setProject(fetchedProject);
        
        const fetchedMembers = await projectService.getProjectMembers(id!);
        setMembers(fetchedMembers);
        
        // Check if current user is the employer (project creator)
        const currentUserId = authService.getUserId();
        setIsEmployer(fetchedProject.createdBy.id.toString() === currentUserId);

        // Fetch project entries
        const fetchedEntries = await projectService.getProjectEntries(id!);
        setEntries(fetchedEntries);
        
        setError(null);
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEntryStatusUpdate = async (entryId: number, newStatus: string) => {
    try {
      await projectService.updateEntryStatus(entryId, newStatus);
      // Refresh entries after update
      const updatedEntries = await projectService.getProjectEntries(id!);
      setEntries(updatedEntries);
    } catch (err) {
      console.error('Failed to update entry status:', err);
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'DECLINED':
        return 'error';
      default:
        return 'default';
    }
  };

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
        Project Code: {project?.projectCode}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Members" />
          <Tab label="Entries" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <List>
          {members.map((member, index) => (
            <ListItem key={member.id || `${member.user.username}-${index}`}>
              <ListItemText
                primary={member.user.username}
                secondary={
                  <>
                    Role: {member.role} | Email: {member.user.email}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {entries.length === 0 ? (
          <Typography>No entries yet</Typography>
        ) : (
          <List>
            {entries.map((entry) => (
              <Paper key={entry.entryId} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">
                    {entry.user.username} - {new Date(entry.entryStart).toLocaleDateString()}
                  </Typography>
                  <Chip 
                    label={entry.status} 
                    color={getStatusChipColor(entry.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" gutterBottom>
                  {entry.entryDescription}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Duration: {new Date(entry.entryStart).toLocaleTimeString()} - {new Date(entry.entryEnd).toLocaleTimeString()}
                </Typography>
                {isEmployer && entry.status === 'PENDING' && (
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="success" 
                      size="small" 
                      onClick={() => handleEntryStatusUpdate(entry.entryId, 'APPROVED')}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      size="small"
                      onClick={() => handleEntryStatusUpdate(entry.entryId, 'DECLINED')}
                    >
                      Decline
                    </Button>
                  </Box>
                )}
              </Paper>
            ))}
          </List>
        )}
      </TabPanel>
    </Container>
  );
};

export default ProjectDetails;
