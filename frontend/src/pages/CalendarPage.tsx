import React from "react";
import Calendar from "../components/Calendar";
import "../styles/home.css";

interface CalendarPageProps {
  darkMode: boolean;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ darkMode }) => {
  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="home-content">
        <div className="dashboard-grid">
          <div className="calendar-wrapper">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 