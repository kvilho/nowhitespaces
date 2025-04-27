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
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Card
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import projectService, { Project, ProjectMember } from '../services/projectService';
import authService from '../services/authService';
import { Entry } from '../services/entryService';
import '../styles/projectDetails.css';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
      <Button variant="outlined" onClick={() => window.history.back()} sx={{ mb: 3, borderRadius: 2 }}>
        BACK TO PROJECTS
      </Button>

      <Grid container spacing={3}>
        {/* Project Info */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {project?.projectName}
            </Typography>
            <Typography variant="body1" paragraph>
              {project?.projectDescription}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Created by: {project?.createdBy.username}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => setIsCodeDialogOpen(true)}
              startIcon={<ContentCopyIcon />}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Project Code
            </Button>
          </Paper>
        </Grid>

        {/* Project Members */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Project Members
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
              <List>
                {members.map((member) => (
                  <ListItem key={member.projectMemberId} disablePadding sx={{ mb: 2 }}>
                    <ListItemText
                      primary={member.user?.username || 'Unknown user'}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Role: {member.role}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.user?.email || 'No email'}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            {isEmployer && (
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={handleOpenManageMembersDialog}
              >
                Manage Members
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Pending Entries */}
        <Grid item xs={12} sm={6} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Pending Entries
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Stack spacing={2}>
                {entries
                  .filter(entry => entry.status === 'PENDING')
                  .map((entry) => (
                    <Card key={entry.entryId} elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Unknown user
                        </Typography>
                        <Typography variant="body2">
                          {entry.entryDescription || 'No description'}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="subtitle2" color="text.secondary">
                            Time: {formatDateTime(entry.entryStart)}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            Duration: {calculateDuration(entry.entryStart, entry.entryEnd)}
                          </Typography>
                        </Stack>
                        {isEmployer && (
                          <Stack direction="row" spacing={1} mt={1}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ borderRadius: 2, minWidth: 90 }}
                              onClick={() => handleEntryStatusUpdate(entry.entryId, 'APPROVED')}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{ borderRadius: 2, minWidth: 90 }}
                              onClick={() => handleEntryStatusUpdate(entry.entryId, 'DECLINED')}
                            >
                              Decline
                            </Button>
                          </Stack>
                        )}
                      </Stack>
                    </Card>
                  ))}
              </Stack>
            </Box>
          </Paper>

          {/* Processed Entries */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Processed Entries
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Stack spacing={2}>
                {entries
                  .filter(entry => entry.status !== 'PENDING')
                  .map((entry) => (
                    <Card key={entry.entryId} elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Unknown user
                          </Typography>
                          <Chip
                            label={entry.status}
                            color={entry.status === 'APPROVED' ? 'success' : 'error'}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
                        <Typography variant="body2">
                          {entry.entryDescription || 'No description'}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="subtitle2" color="text.secondary">
                            Time: {formatDateTime(entry.entryStart)}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            Duration: {calculateDuration(entry.entryStart, entry.entryEnd)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Card>
                  ))}
              </Stack>
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
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>Project Code</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, backgroundColor: 'background.default', borderRadius: 2 }}>
            <Typography variant="h5" component="span" sx={{ mr: 2 }}>
              {project?.projectCode}
            </Typography>
            <IconButton onClick={handleCopyProjectCode} size="small">
              <ContentCopyIcon />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setIsCodeDialogOpen(false)} sx={{ borderRadius: 2 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Manage Members Dialog */}
      <Dialog
        open={isManageMembersDialogOpen}
        onClose={handleCloseManageMembersDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 700, textAlign: 'center' }}>
          Manage Members
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <List>
              {members.map((member) => (
                <ListItem 
                  key={member.projectMemberId} 
                  disablePadding 
                  sx={{ mb: 2, p: 2, borderRadius: 2, '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <ListItemText
                    primary={member.user?.username || 'Unknown user'}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Role: {member.role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.user?.email || 'No email'}
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button 
            onClick={handleCloseManageMembersDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
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
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 700, textAlign: 'center' }}>
          Confirm Member Removal
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
            Are you sure you want to remove <strong>{memberToDelete?.user?.username || 'Unknown user'}</strong> from the project?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button 
            onClick={() => setMemberToDelete(null)}
            variant="outlined"
            sx={{ mr: 1, borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteMember}
            sx={{ borderRadius: 2 }}
          >
            Remove Member
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetails;
