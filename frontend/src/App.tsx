// Testing GitHub Actions CI workflow
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployerDashboard from './components/EmployerDashboard';
import CalendarPage from './pages/CalendarPage';
import Summary from './pages/Summary';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: "#1976d2" },
      secondary: { main: "#ff4081" },
    },
  });

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar darkMode={darkMode} onDarkModeChange={handleDarkModeChange} />
        <div className={`main-content ${darkMode ? 'dark-mode' : ''}`}>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/calendar" element={<CalendarPage darkMode={darkMode} />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
