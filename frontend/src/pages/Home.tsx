import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Container,
  Card,
  CardContent,
  Chip 
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "../styles/home.css";
import entryService from '../services/entryService';
import { Entry } from '../types/Entry';

const motivationalMessages = [
  "Keep pushing forward! Every step counts. 💪",
  "You're making progress, one day at a time! 🌟",
  "Stay focused and keep moving forward! 🚀",
  "Your dedication is inspiring! Keep it up! ✨",
  "Every day is a new opportunity to shine! 🌈"
];

const Home: React.FC = () => {
  const [allEntries, setAllEntries] = useState<Entry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [motivationalMessage] = useState<string>(
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  );

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await entryService.getMyEntries();
        setAllEntries(entries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'DECLINED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatTime = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredEntries = allEntries.filter(entry => {
    const entryDate = typeof entry.entryStart === 'string' ? new Date(entry.entryStart) : entry.entryStart;
    return (
      entryDate.getFullYear() === selectedDate.getFullYear() &&
      entryDate.getMonth() === selectedDate.getMonth() &&
      entryDate.getDate() === selectedDate.getDate()
    );
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Message */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Welcome back!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {motivationalMessage}
            </Typography>
          </Paper>
        </Grid>

        {/* Date Picker */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue: Date | null) => newValue && setSelectedDate(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        {/* Today's Entries */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {selectedDate.toDateString() === new Date().toDateString() 
                ? "Today's Entries" 
                : `Entries for ${selectedDate.toLocaleDateString()}`}
            </Typography>
            {filteredEntries.length === 0 ? (
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ textAlign: 'center', py: 4 }}
              >
                No entries for this date.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {filteredEntries.map((entry) => (
                  <Grid item xs={12} key={entry.entryId}>
                    <Card elevation={1} sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs>
                            <Typography variant="body1" gutterBottom>
                              {entry.entryDescription || 'No description'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {entry.project?.projectName || 'No project'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {formatTime(entry.entryStart)} - {formatTime(entry.entryEnd)}
                            </Typography>
                            {entry.status === 'DECLINED' && entry.declineComment && (
                              <>
                              <Typography variant="caption" color="error">
                                Decline Reason: {entry.declineComment}
                              </Typography>
                            </>
                            )}
                          </Grid>
                          <Grid item>
                            <Chip
                              label={entry.status}
                              color={getStatusColor(entry.status)}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Fixed "Free time?" button */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          width: 120,
          height: 50,
          minWidth: 20,
          boxShadow: 3
        }}
        onClick={handleLocationRequest}
      >
        Free time?
      </Button>
    </Container>
  );
};

export default Home;
