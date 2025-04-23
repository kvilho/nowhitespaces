import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import projectService, { Project, ProjectMember } from '../services/projectService';
import authService from '../services/authService';
import { Entry } from '../types/Entry';
import '../styles/projectDetails.css';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isEmployer, setIsEmployer] = useState(false);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [isManageMembersDialogOpen, setIsManageMembersDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<ProjectMember | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const fetchedProject = await projectService.getProjectById(id!);
        setProject(fetchedProject);
        
        const fetchedMembers = await projectService.getProjectMembers(id!);
        setMembers(fetchedMembers);
        
        const currentUserId = authService.getUserId();
        setIsEmployer(fetchedProject.createdBy.id.toString() === currentUserId);

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

  const handleEntryStatusUpdate = async (entryId: number, newStatus: string) => {
    try {
      await projectService.updateEntryStatus(entryId, newStatus);
      const updatedEntries = await projectService.getProjectEntries(id!);
      setEntries(updatedEntries);
    } catch (err) {
      console.error('Failed to update entry status:', err);
    }
  };

  const handleCopyProjectCode = () => {
    if (project) {
      navigator.clipboard.writeText(project.projectCode);
    }
    setIsCodeDialogOpen(false);
  };

  const handleOpenManageMembersDialog = () => {
    setIsManageMembersDialogOpen(true);
  };

  const handleCloseManageMembersDialog = () => {
    setIsManageMembersDialogOpen(false);
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete || !memberToDelete.projectMemberId) {
      console.error('Member to delete is not set or invalid');
      return;
    }

    try {
      await projectService.removeProjectMember(id!, memberToDelete.projectMemberId);
      // Close both dialogs first
      setMemberToDelete(null);
      setIsManageMembersDialogOpen(false);
      
      // Fetch fresh data
      const updatedMembers = await projectService.getProjectMembers(id!);
      setMembers(updatedMembers);
    } catch (err) {
      console.error('Failed to delete member:', err);
      setError('Failed to remove member. Please try again later.');
    }
  };

  const formatDateTime = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleString();
  };

  const calculateDuration = (start: string | Date, end: string | Date) => {
    const startTime = typeof start === 'string' ? new Date(start) : start;
    const endTime = typeof end === 'string' ? new Date(end) : end;
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button variant="outlined" onClick={() => window.history.back()} sx={{ mb: 3 }}>
        BACK TO PROJECTS
      </Button>

      {/* Project Info Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {project?.projectName}
        </Typography>
        <Typography variant="body1" paragraph>
          {project?.projectDescription}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created by: {project?.createdBy.username}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsCodeDialogOpen(true)}
          startIcon={<ContentCopyIcon />}
          sx={{ mt: 2 }}
        >
          Project Code
        </Button>
      </Paper>

      <Grid container spacing={3}>
        {/* Project Members */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Project Members
            </Typography>
            <List>
              {members.map((member) => (
                <ListItem key={member.projectMemberId} disablePadding sx={{ mb: 2 }}>
                  <ListItemText
                    primary={member.user.username}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Role: {member.role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.user.email}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            {isEmployer && (
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleOpenManageMembersDialog} // Open the dialog
              >
                Manage Members
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Entries */}
        <Grid item xs={12} md={8}>
          {/* Pending Entries */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Pending Entries
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List>
                {entries
                  .filter(entry => entry.status === 'PENDING')
                  .map((entry) => (
                    <Paper key={entry.entryId} elevation={1} sx={{ mb: 2, p: 2 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {entry.user.username}
                        </Typography>
                        <Typography variant="body2">
                          {entry.entryDescription}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Time: {formatDateTime(entry.entryStart)} - {formatDateTime(entry.entryEnd)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {calculateDuration(entry.entryStart, entry.entryEnd)}
                        </Typography>
                        {isEmployer && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleEntryStatusUpdate(entry.entryId, 'APPROVED')}
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
                      </Stack>
                    </Paper>
                  ))}
              </List>
            </Box>
          </Paper>

          {/* Processed Entries */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Processed Entries
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List>
                {entries
                  .filter(entry => entry.status !== 'PENDING')
                  .map((entry) => (
                    <Paper key={entry.entryId} elevation={1} sx={{ mb: 2, p: 2 }}>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {entry.user.username}
                          </Typography>
                          <Chip
                            label={entry.status}
                            color={entry.status === 'APPROVED' ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2">
                          {entry.entryDescription}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Time: {formatDateTime(entry.entryStart)} - {formatDateTime(entry.entryEnd)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {calculateDuration(entry.entryStart, entry.entryEnd)}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Project Code Dialog */}
      <Dialog
        open={isCodeDialogOpen}
        onClose={() => setIsCodeDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Project Code</DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 2,
            backgroundColor: 'background.default',
            borderRadius: 1
          }}>
            <Typography variant="h5" component="span" sx={{ mr: 2 }}>
              {project?.projectCode}
            </Typography>
            <IconButton onClick={handleCopyProjectCode} size="small">
              <ContentCopyIcon />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCodeDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Manage Members Dialog */}
      <Dialog
        open={isManageMembersDialogOpen}
        onClose={handleCloseManageMembersDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white',
          fontWeight: 'bold'
        }}>
          Manage Members
        </DialogTitle>
        <DialogContent>
          <List>
            {members.map((member) => (
              <ListItem 
                key={member.projectMemberId} 
                disablePadding 
                sx={{ 
                  mb: 2,
                  p: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemText
                  primary={member.user.username}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Role: {member.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.user.email}
                      </Typography>
                    </>
                  }
                />
                <IconButton
                  color="error"
                  onClick={() => setMemberToDelete(member)}
                  sx={{ ml: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseManageMembersDialog}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white',
          fontWeight: 'bold'
        }}>
          Confirm Member Removal
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to remove <strong>{memberToDelete?.user.username}</strong> from the project?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setMemberToDelete(null)}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteMember}
          >
            Remove Member
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetails;
