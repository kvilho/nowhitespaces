import React, { useState, useEffect } from "react";
import { Typography, Button, Grid, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import authService from "../services/authService";
import config from "../config";
import { Entry } from "../types/Entry";

interface HomeProps {
  darkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ darkMode }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [todayEntries, setTodayEntries] = useState<Entry[]>([]);
  const [monthlySummary, setMonthlySummary] = useState({
    approved: 0,
    pending: 0,
    declined: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = authService.getUserId();
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user profile
        const userResponse = await fetch(`${config.apiUrl}/api/users/${userId}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });
        const userData = await userResponse.json();
        setUserName(userData.firstName || "User");

        // Fetch today's entries
        const today = new Date();
        const entriesResponse = await fetch(
          `${config.apiUrl}/api/entries?userId=${userId}&date=${today.toISOString().split('T')[0]}`,
          {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${authService.getToken()}`
            }
          }
        );
        const entriesData = await entriesResponse.json();
        setTodayEntries(entriesData);

        // Fetch monthly summary
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const summaryResponse = await fetch(
          `${config.apiUrl}/api/entries/summary?userId=${userId}&month=${currentMonth}&year=${currentYear}`,
          {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${authService.getToken()}`
            }
          }
        );
        const summaryData = await summaryResponse.json();
        setMonthlySummary(summaryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isButtonVisible = () => {
    const now = new Date();
    const currentHour = now.getUTCHours() + 2;
    return currentHour >= 6 && currentHour < 21;
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps/search/alko/${latitude},${longitude}`;
        window.open(mapsUrl, "_blank");
      });
    } else {
      alert("Location services are not available on this device.");
    }
  };

  return (
    <>
      <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
        <div className="home-content">
          <Typography variant="h4" className="welcome-message">
            Welcome back, {userName}!
          </Typography>

          {/* Quick Access Buttons */}
          <Grid item xs={12}>
            <Paper elevation={3} className="dashboard-card">
              <Typography variant="h6" className="card-title">
                Quick Access
              </Typography>
              <Box className="quick-access-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/calendar')}
                  className="quick-access-button"
                >
                  Add New Entry
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/projects')}
                  className="quick-access-button"
                >
                  View Projects
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/profile')}
                  className="quick-access-button"
                >
                  Edit Profile
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Motivational Message */}
          <Typography variant="body1" className="motivational-message">
            You're doing great! Keep up the good work! 💪
          </Typography>
        </div>
      </div>

      {isButtonVisible() && (
        <Button
          variant="contained"
          color="primary"
          style={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleLocationRequest}
        >
          Free time?
        </Button>
      )}
    </>
  );
};

export default Home;
