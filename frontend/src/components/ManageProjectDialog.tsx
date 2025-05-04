import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Stack,
  TextField,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Project, ProjectMember, ProjectRole } from '../services/projectService';
import projectService from '../services/projectService';
import { useNavigate } from 'react-router-dom';

interface ManageProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  members: ProjectMember[];
  setMembers: React.Dispatch<React.SetStateAction<ProjectMember[]>>;
  fetchProjectData: () => Promise<void>;
}

const ManageProjectDialog: React.FC<ManageProjectDialogProps> = ({
  open,
  onClose,
  project,
  members,
  setMembers,
  fetchProjectData,
}) => {
  const navigate = useNavigate();
  const [memberToDelete, setMemberToDelete] = useState<ProjectMember | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const handleDeleteMember = async () => {
    if (!project || !memberToDelete) return;

    try {
      await projectService.removeProjectMember(project.projectId.toString(), memberToDelete.projectMemberId);
      await fetchProjectData();
      setSnackbar({ open: true, message: 'Member removed successfully', severity: 'success' });
    } catch (error) {
      console.error('Error removing member:', error);
      setSnackbar({ open: true, message: 'Failed to remove member', severity: 'error' });
    } finally {
      setMemberToDelete(null);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;

    setIsDeletingProject(true);
    try {
      await projectService.deleteProject(project.projectId);
      setSnackbar({ open: true, message: 'Project deleted successfully', severity: 'success' });
      navigate('/projects'); // Navigate back to the project list
    } catch (error) {
      console.error('Error deleting project:', error);
      setSnackbar({ open: true, message: 'Failed to delete project', severity: 'error' });
    } finally {
      setIsDeletingProject(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getRoleColor = (role: ProjectRole) => {
    switch (role) {
      case ProjectRole.OWNER:
        return 'primary';
      case ProjectRole.EMPLOYEE:
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip label={member.role} color={getRoleColor(member.role)} size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {member.user?.email || 'No email'}
                        </Typography>
                      </>
                    }
                  />
                  {member.role !== ProjectRole.OWNER && (
                    <Button
                      color="error"
                      onClick={() => setMemberToDelete(member)}
                      sx={{ ml: 2 }}
                    >
                      Remove
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          {project?.createdBy.id === members.find((m) => m.role === ProjectRole.OWNER)?.user.id && (
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeletingProject}
              sx={{ borderRadius: 2 }}
            >
              {isDeletingProject ? <CircularProgress size={24} /> : 'Close Project'}
            </Button>
          )}
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!memberToDelete} onClose={() => setMemberToDelete(null)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {memberToDelete?.user?.username} from the project?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberToDelete(null)}>Cancel</Button>
          <Button onClick={handleDeleteMember} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Close Project Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Project Closure</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to close this project? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProject} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ManageProjectDialog;