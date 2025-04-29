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
  Chip
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

  const handleDeleteMember = async () => {
    if (!project || !memberToDelete) return;

    try {
      await projectService.removeProjectMember(project.projectId.toString(), memberToDelete.projectMemberId);
      await fetchProjectData();
      setMemberToDelete(null);
    } catch (error) {
      console.error('Error removing member:', error);
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
      <Dialog
        open={open}
        onClose={onClose}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={member.role}
                            color={getRoleColor(member.role)}
                            size="small"
                          />
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
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button
            onClick={onClose}
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
      >
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {memberToDelete?.user?.username} from the project?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberToDelete(null)}>Cancel</Button>
          <Button onClick={handleDeleteMember} color="error">Remove</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageProjectDialog; 