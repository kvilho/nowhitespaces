import { Typography, Paper, Button } from "@mui/material";
import Calendar from "../components/Calendar";
import "../styles/home.css";

interface HomeProps {
  darkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ darkMode }) => {
  // Function to handle location request and open maps
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

  const isButtonVisible = () => {
    const now = new Date();
    const currentHour = now.getUTCHours() + 2;
    return currentHour >= 6 && currentHour < 21;
  };

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Main content wrapper */}
      <div className="home-content">
        {/* Left side: Calendar */}
        <div className="calendar-section">
          <Calendar />
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
    </div>
  );
};

export default Home;
