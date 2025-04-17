import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import userService, { UserProfile, HourSummaryDTO } from '../services/userService';
import HourSummary from '../components/HourSummary';
import '../styles/profile.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hourSummary, setHourSummary] = useState<HourSummaryDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const [profileData, summaryData] = await Promise.all([
          userService.getUserProfile(),
          userService.getUserHourSummary()
        ]);
        setProfile(profileData);
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
