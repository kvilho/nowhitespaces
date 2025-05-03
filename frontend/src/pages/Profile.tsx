import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  TextField, 
  Button, 
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import userService, { UserProfile } from '../services/userService';
import config from '../config';
import '../styles/profile.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [editDetailsForm, setEditDetailsForm] = useState({
    firstname: '',
    lastname: '',
    phone: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const profileData = await userService.getUserProfile();
        setProfile(profileData);
        setEditDetailsForm({
          firstname: profileData.firstname || '',
          lastname: profileData.lastname || '',
          phone: profileData.phone || '',
        });
      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${config.apiUrl}/api/users/profile/picture`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const pictureResponse = await fetch(`${config.apiUrl}/api/users/profile/picture`, {
          credentials: 'include'
        });
        if (pictureResponse.ok) {
          const blob = await pictureResponse.blob();
          setProfile((prev) => prev ? { ...prev, profilePicture: URL.createObjectURL(blob) } : null);
        }
        setSnackbar({ open: true, message: 'Profile picture updated successfully!', severity: 'success' });
      } else {
        throw new Error('Failed to upload profile picture');
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error uploading profile picture.', severity: 'error' });
    }
  };

  const handleEditDetails = async () => {
    try {
      if (!profile) return;
      await userService.updateUserProfile({ ...profile, ...editDetailsForm } as UserProfile);
      setProfile((prev) => prev ? { ...prev, ...editDetailsForm } : null);
      setIsEditDetailsOpen(false);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error updating profile.', severity: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteUserAccount();
      window.location.href = '/';
    } catch (err) {
      setSnackbar({ open: true, message: 'Error deleting account.', severity: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' });
      return;
    }
    try {
      await userService.changeUserPassword(passwordForm.currentPassword, passwordForm.newPassword);
      setIsChangePasswordOpen(false);
      setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error changing password.', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center', maxWidth: 500, mx: 'auto' }}>
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Avatar
            src={profile?.profilePicture || ''}
            sx={{ width: 120, height: 120, mx: 'auto', border: '2px solid', borderColor: 'primary.main' }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 'calc(50% - 60px)',
              backgroundColor: 'primary.main',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <PhotoCameraIcon sx={{ color: 'white' }} />
          </IconButton>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfilePictureUpload}
          />
        </Box>
        <Typography variant="h5" gutterBottom>
          {profile?.firstname} {profile?.lastname}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {profile?.role?.roleName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {profile?.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile?.phone}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => setIsEditDetailsOpen(true)}>Edit Details</Button>
          <Button variant="outlined" onClick={() => setIsChangePasswordOpen(true)}>Change Password</Button>
          <Button variant="outlined" color="error" onClick={() => setIsDeleteAccountOpen(true)}>Delete Account</Button>
        </Box>
      </Paper>

      {/* Edit Details Dialog */}
      <Dialog open={isEditDetailsOpen} onClose={() => setIsEditDetailsOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Edit Details</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            label="First Name"
            fullWidth
            value={editDetailsForm.firstname}
            onChange={(e) => setEditDetailsForm({ ...editDetailsForm, firstname: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={editDetailsForm.lastname}
            onChange={(e) => setEditDetailsForm({ ...editDetailsForm, lastname: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone"
            fullWidth
            value={editDetailsForm.phone}
            onChange={(e) => setEditDetailsForm({ ...editDetailsForm, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={() => setIsEditDetailsOpen(false)}>Cancel</Button>
          <Button onClick={handleEditDetails} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwordForm.confirmNewPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={() => setIsChangePasswordOpen(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteAccountOpen} onClose={() => setIsDeleteAccountOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={() => setIsDeleteAccountOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
