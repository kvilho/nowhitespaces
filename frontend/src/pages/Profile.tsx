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
  Grid,
  Stack
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import userService, { UserProfile, HourSummaryDTO } from '../services/userService';
import HourSummary from '../components/HourSummary';
import config from '../config';
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
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        
        // Fetch profile picture
        try {
          const response = await fetch(`${config.apiUrl}/api/users/profile/picture`, {
            credentials: 'include'
          });
          if (response.ok) {
            const blob = await response.blob();
            setProfilePicture(URL.createObjectURL(blob));
          }
        } catch (err) {
          console.error('Error fetching profile picture:', err);
        }
        
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
      if (!profile) return;

      const updatedProfile: UserProfile = {
        ...profile,
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        password: formData.password || undefined
      };

      const result = await userService.updateUserProfile(updatedProfile);
      setProfile(result);
      setFormData(prev => ({ ...prev, password: '' }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
        // Refresh profile picture
        const pictureResponse = await fetch(`${config.apiUrl}/api/users/profile/picture`, {
          credentials: 'include'
        });
        if (pictureResponse.ok) {
          const blob = await pictureResponse.blob();
          setProfilePicture(URL.createObjectURL(blob));
        }
      } else {
        throw new Error('Failed to upload profile picture');
      }
    } catch (err) {
      console.error('Error uploading profile picture:', err);
    }
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header Section */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                {profilePicture ? (
                  <Avatar
                    src={profilePicture}
                    sx={{ width: 120, height: 120 }}
                  />
                ) : (
                  <Avatar sx={{ width: 120, height: 120 }}>
                    <AccountCircleIcon sx={{ width: 80, height: 80 }} />
                  </Avatar>
                )}
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
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
              <Box>
                <Typography variant="h4" gutterBottom>
                  {profile?.firstname} {profile?.lastname}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {profile?.role?.roleName}
                </Typography>
              </Box>
            </Box>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Password (optional)"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      fullWidth
                      helperText="Leave blank to keep current password"
                    />
                  </Grid>
                </Grid>
                
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
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Username</Typography>
                  <Typography variant="body1">{profile?.username}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{profile?.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{profile?.phone}</Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                  sx={{ alignSelf: 'flex-start', mt: 2 }}
                >
                  Edit Profile
                </Button>
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Work Summary Section */}
        <Grid item xs={12}>
          <HourSummary 
            summary={hourSummary}
            isLoading={isLoading}
            error={error}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
