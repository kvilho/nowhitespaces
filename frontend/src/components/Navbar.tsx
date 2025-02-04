import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, width: "100%", zIndex: 1100}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          HourBook
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          Profile
        </Button>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

