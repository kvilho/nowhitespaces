import React from "react";
import { Typography, Paper } from "@mui/material";
import Calendar from "../components/Calendar";
import "../styles/home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Main content wrapper */}
      <div className="home-content">
        {/* Left side: Calendar */}
        <div className="calendar-section">
          <Calendar />
        </div>

        {/* Right side: Additional content */}
        <div className="content-section">
          <Paper elevation={3} className="content-paper">
            <Typography variant="h5" className="content-title">
              Additional Content
            </Typography>
            <div className="content-body">
              <Typography variant="body1">
                Welcome to HourBook! Track your working hours efficiently.
              </Typography>
              
              {/* Placeholder for future features */}
              <div className="features-grid">
                <Paper elevation={2} className="feature-card">
                  <Typography variant="h6">Statistics</Typography>
                  <Typography variant="body2">View your working hour statistics</Typography>
                </Paper>
                
                <Paper elevation={2} className="feature-card">
                  <Typography variant="h6">Reports</Typography>
                  <Typography variant="body2">Generate detailed work reports</Typography>
                </Paper>
                
                <Paper elevation={2} className="feature-card">
                  <Typography variant="h6">Settings</Typography>
                  <Typography variant="body2">Customize your preferences</Typography>
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Home;
