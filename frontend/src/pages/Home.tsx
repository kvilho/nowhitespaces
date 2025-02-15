import React from "react";
import { Typography } from "@mui/material";
import Calendar from "../components/Calendar";
import "../styles/main.css"; 

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Left side: Calendar */}
      <div className="calendar-section">
        <Calendar />
      </div>

      {/* Right side: Placeholder for future components */}
      <div className="content-section">
        <Typography variant="h5" className="content-title">
          Additional Content
        </Typography>
        <p className="content-text">Other features here?!</p>
      </div>
    </div>
  );
};

export default Home;
