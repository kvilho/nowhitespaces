import React from "react";
import { Container, Typography } from "@mui/material";
import Calendar from "../components/Calendar";


const Home: React.FC = () => {
  return (
    <Container>
      <Typography variant="h3" mt={5}>
        Welcome to the Home Page
      </Typography>
      <Calendar/>
    </Container>
  );
};

export default Home;