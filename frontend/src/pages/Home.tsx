import React from "react";
import { Container, Typography } from "@mui/material";
import Calendar from "../components/Calendar";
import "../styles/main.css"; 


const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Typography variant="h3" className="home-title">
        Welcome to the Home Page
      </Typography>
      <div className="calendar-wrapper">
        <Calendar />
      </div>
    </div>
  );
};

export default Home;