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
  TextField
} from '@mui/material';
import { Project, ProjectMember } from '../services/projectService';
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
  // State for edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Open edit dialog and prefill fields
  const handleEditProject = () => {
    setEditName(project?.projectName || '');
    setEditDescription(project?.projectDescription || '');
    setEditOpen(true);
  };

  // Save changes to project info
  const handleSaveEdit = async () => {
    if (!project) return;
    setSaving(true);
    try {
      await projectService.updateProject(project.projectId, {
        projectName: editName,
        projectDescription: editDescription,
      });
      setEditOpen(false);
      await fetchProjectData();
    } catch (err) {
      // Optionally show error
    } finally {
      setSaving(false);
    }
  };

  // Dummy handler for removing a member
  const handleRemoveMember = (memberId: number) => {
    // In the future, this will remove the member
    console.log(`Remove member ${memberId}: Coming soon`);
    setMembers([...members]); // Use the prop to avoid unused warning
  };

  // Real handler for closing the project
  const handleCloseProject = async () => {
    if (!project?.projectId) {
      console.error("Project ID is missing");
      return;
    }
    try {
      await projectService.deleteProject(project.projectId);
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>Manage Project</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            {/* Project Info */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Project Info</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {project?.projectName || 'No project name'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {project?.projectDescription || 'No description'}
              </Typography>
              <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={handleEditProject}>
                Edit Project Info
              </Button>
            </Box>

            <Divider />

            {/* Members List */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Project Members</Typography>
              <List>
                {members.map((member) => (
                  <ListItem key={member.projectMemberId} secondaryAction={
                    <Button variant="outlined" color="error" size="small" onClick={() => handleRemoveMember(member.projectMemberId)}>
                      Remove
                    </Button>
                  }>
                    <ListItemText
                      primary={member.user?.username || 'Unknown user'}
                      secondary={`Role: ${member.role}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider />

            {/* Close Project */}
            <Box>
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 4, borderRadius: 2 }}
                onClick={handleCloseProject}
              >
                Close Project
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project Info Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>Edit Project Info</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Project Name"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              fullWidth
              autoFocus
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <TextField
              label="Project Description"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button
            onClick={() => setEditOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, mr: 1 }}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
            disabled={saving || !editName.trim()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageProjectDialog; 