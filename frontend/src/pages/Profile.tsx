import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Alert, TextField, Button, Box } from '@mui/material';
import userService, { UserProfile, HourSummaryDTO } from '../services/userService';
import HourSummary from '../components/HourSummary';
import '../styles/profile.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hourSummary, setHourSummary] = useState<HourSummaryDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    password: ''
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const [profileData, summaryData] = await Promise.all([
          userService.getUserProfile(),
          userService.getUserHourSummary()
        ]);
        setProfile(profileData);
        setFormData({
          firstname: profileData.firstname || '',
          lastname: profileData.lastname || '',
          phone: profileData.phone || '',
          password: ''
        });
        setHourSummary(summaryData);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setIsSaving(true);

    try {
      const updatedProfile = {
        ...profile,
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        password: formData.password || undefined
      };

      const result = await userService.updateUserProfile(updatedProfile);
      setProfile(result);
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" className="profile-error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div className="profile-container">
      <Paper className="profile-header" elevation={2}>
        <Typography variant="h4" className="profile-title">
          User Profile
        </Typography>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <Box className="form-grid">
              <TextField
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="New Password (optional)"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                helperText="Leave blank to keep current password"
              />
            </Box>
            
            {saveError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {saveError}
              </Alert>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    firstname: profile?.firstname || '',
                    lastname: profile?.lastname || '',
                    phone: profile?.phone || '',
                    password: ''
                  });
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        ) : (
          <>
            <div className="profile-info">
              <div className="info-item">
                <Typography className="info-label">Username</Typography>
                <Typography className="info-value">{profile?.username}</Typography>
              </div>
              <div className="info-item">
                <Typography className="info-label">Full Name</Typography>
                <Typography className="info-value">
                  {profile?.firstname} {profile?.lastname}
                </Typography>
              </div>
              <div className="info-item">
                <Typography className="info-label">Email</Typography>
                <Typography className="info-value">{profile?.email}</Typography>
              </div>
              <div className="info-item">
                <Typography className="info-label">Phone</Typography>
                <Typography className="info-value">{profile?.phone}</Typography>
              </div>
              <div className="info-item">
                <Typography className="info-label">Role</Typography>
                <Typography className="info-value">{profile?.role?.roleName}</Typography>
              </div>
            </div>
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </>
        )}
      </Paper>

      <HourSummary 
        summary={hourSummary}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Profile;
