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
  Card,
  Divider,
  TextField
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import projectService, { Project, ProjectMember } from '../services/projectService';
import authService from '../services/authService';
import { Entry } from '../types/Entry'; // Ensure the shared Entry type is used
import '../styles/projectDetails.css';
import ManageProjectDialog from '../components/ManageProjectDialog';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]); // Use the shared Entry type
  const [isEmployer, setIsEmployer] = useState(false);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [isManageMembersDialogOpen, setIsManageMembersDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<ProjectMember | null>(null);
  const [isManageProjectDialogOpen, setIsManageProjectDialogOpen] = useState(false);
  const [isProjectSummaryOpen, setIsProjectSummaryOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);
  const [memberEntries, setMemberEntries] = useState<Entry[]>([]);
  const [declineComment, setDeclineComment] = useState<string>("");
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState<boolean>(false);

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

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleEntryStatusUpdate = async (entryId: number, newStatus: string, comment?: string) => {
    try {
      await projectService.updateEntryStatus(entryId, newStatus, comment);
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

  const calculateProjectStats = () => {
    const totalHours = entries.reduce((sum, entry) => sum + (new Date(entry.entryEnd).getTime() - new Date(entry.entryStart).getTime()) / 3600000, 0);
    const totalEntries = entries.length;
    const avgDuration = totalEntries > 0 ? totalHours / totalEntries : 0;
    const latestEntryDate = entries.length > 0 ? new Date(Math.max(...entries.map(entry => new Date(entry.entryEnd).getTime()))) : null;

    return { totalHours, totalEntries, avgDuration, latestEntryDate };
  };

  const handleViewEntries = (member: ProjectMember) => {
    const memberEntries = entries.filter(entry => entry.user?.id === member.user.id);
    setSelectedMember(member);
    setMemberEntries(memberEntries);
  };

  const handleOpenDeclineDialog = (entryId: number) => {
    setSelectedEntryId(entryId);
    setDeclineComment('');
    setIsDeclineDialogOpen(true);
  };

  const handleDecline = async () => {
    if (selectedEntryId !== null) {
      try {
        await projectService.updateEntryStatus(selectedEntryId, 'DECLINED', declineComment);
        setIsDeclineDialogOpen(false);
        await fetchProjectData();
      } catch (err) {
        console.error('Failed to decline entry:', err);
      }
    }
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
            {isEmployer && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2, ml: 2, borderRadius: 2 }}
                  onClick={() => setIsManageProjectDialogOpen(true)}
                >
                  Manage Project
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, borderRadius: 2, ml: 2 }}
                  onClick={() => setIsProjectSummaryOpen(true)}
                >
                  View Project Summary
                </Button>
              </>
            )}
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
                      primary={`${member.user?.firstname || 'Unknown'} ${member.user?.lastname || ''}`}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                             {member.role}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.user?.email || 'No email'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.user?.phone || 'No phone'}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Pending Entries */}
        <Grid item xs={12} sm={6} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Pending Entries
            </Typography>
            {entries.filter(entry => entry.status === 'PENDING').length === 0 ? (
              <Typography>No pending entries</Typography>
            ) : (
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <Stack spacing={2}>
                  {entries
                    .filter(entry => entry.status === 'PENDING')
                    .map((entry) => (
                      <Card key={entry.entryId} elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={1}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {(entry.user?.firstname || entry.user?.lastname) 
                              ? `${entry.user?.firstname || ''} ${entry.user?.lastname || ''}`.trim()
                              : 'Unknown user'}
                          </Typography>
                          <Typography variant="body2">
                            {entry.entryDescription || 'No description'}
                          </Typography>
                          {entry.status === 'DECLINED' && entry.declineComment && (
                            <Typography variant="body2" color="error">
                              Decline Reason: {entry.declineComment}
                            </Typography>
                          )}
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
                                onClick={() => handleOpenDeclineDialog(entry.entryId)}
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
            )}
          </Paper>

          {/* Processed Entries */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Processed Entries
            </Typography>
            {entries.filter(entry => entry.status !== 'PENDING').length === 0 ? (
              <Typography>No processed entries</Typography>
            ) : (
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <Stack spacing={2}>
                  {entries
                    .filter(entry => entry.status !== 'PENDING')
                    .map((entry) => (
                      <Card key={entry.entryId} elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {(entry.user?.firstname || entry.user?.lastname) 
                              ? `${entry.user?.firstname || ''} ${entry.user?.lastname || ''}`.trim()
                              : 'Unknown user'}
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
                          {entry.status === 'DECLINED' && entry.declineComment && (
                            <Typography variant="body2" color="error">
                              Decline Reason: {entry.declineComment}
                            </Typography>
                          )}
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
            )}
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

      {/* Manage Project Dialog */}
      <ManageProjectDialog
        open={isManageProjectDialogOpen}
        onClose={() => setIsManageProjectDialogOpen(false)}
        project={project}
        members={members}
        setMembers={setMembers}
        fetchProjectData={fetchProjectData}
      />

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

      {/* Project Summary Dialog */}
      <Dialog
        open={isProjectSummaryOpen}
        onClose={() => setIsProjectSummaryOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', textAlign: 'center' }}>
          Project Summary
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            {entries.length === 0 ? (
              <Typography>No entries yet</Typography>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Total Hours: {calculateProjectStats().totalHours.toFixed(1)}h
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Total Entries: {calculateProjectStats().totalEntries}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Average Duration: {calculateProjectStats().avgDuration.toFixed(1)}h
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Latest Entry: {calculateProjectStats().latestEntryDate?.toLocaleDateString() || 'N/A'}
                </Typography>
              </>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Project Members
          </Typography>
          <List>
            {members.map((member) => (
              <Card
                key={member.projectMemberId}
                elevation={2}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'background.default',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary={`${member.user?.firstname || ''} ${member.user?.lastname || ''}`}
                  secondary={`Total Hours: ${entries
                    .filter((entry) => entry.user?.id === member.user.id)
                    .reduce((sum, entry) => sum + (new Date(entry.entryEnd).getTime() - new Date(entry.entryStart).getTime()) / 3600000, 0)
                    .toFixed(1)}h`}
                />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2 }}
                  onClick={() => handleViewEntries(member)}
                >
                  View Entries
                </Button>
              </Card>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button onClick={() => setIsProjectSummaryOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Member Entries Dialog */}
      <Dialog
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', textAlign: 'center' }}>
          {selectedMember?.user?.firstname} {selectedMember?.user?.lastname}'s Entries
        </DialogTitle>
        <DialogContent>
          {memberEntries.length === 0 ? (
            <Typography>No entries for this member</Typography>
          ) : (
            <List>
              {memberEntries.map((entry) => (
                <ListItem key={entry.entryId} sx={{ mb: 2 }}>
                  <Card elevation={2} sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.paper' }}>
                    <ListItemText
                      primary={entry.entryDescription || 'No description'}
                      secondary={
                        <>
                          Date: {new Date(entry.entryStart).toLocaleDateString()} | Duration: {(
                            (new Date(entry.entryEnd).getTime() - new Date(entry.entryStart).getTime()) /
                            3600000
                          ).toFixed(1)}h
                          {entry.status === 'DECLINED' && entry.declineComment && (
                            <Typography variant="body2" color="error">
                              Decline Reason: {entry.declineComment}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button onClick={() => setSelectedMember(null)} variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={isDeclineDialogOpen} onClose={() => setIsDeclineDialogOpen(false)}>
        <DialogTitle>Decline Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for Declining"
            multiline
            rows={4}
            fullWidth
            value={declineComment}
            onChange={(e) => setDeclineComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeclineDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDecline} color="error">Decline</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetails;
