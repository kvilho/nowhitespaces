import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Entry } from '../services/entryService';

interface VisualInsightsProps {
  entries: Entry[];
}

const VisualInsights: React.FC<VisualInsightsProps> = ({ entries }) => {
  // Helper to calculate hours for each entry
  const getEntryHours = (entry: Entry) => {
    if (!entry.entryStart || !entry.entryEnd) return 0;
    const start = new Date(entry.entryStart);
    const end = new Date(entry.entryEnd);
    const hours = (end.getTime() - start.getTime()) / 3600000;
    return isNaN(hours) ? 0 : hours;
  };

  // Prepare data for the bar chart: hours by project
  const projectHoursMap: { [key: string]: number } = {};
  entries.forEach(entry => {
    const name = entry.project?.projectName || 'Unknown Project';
    projectHoursMap[name] = (projectHoursMap[name] || 0) + getEntryHours(entry);
  });
  const projectChartData = Object.entries(projectHoursMap).map(([name, hours]) => ({
    name,
    hours: Number(hours.toFixed(1))
  }));

  // Prepare data for the bar chart: hours by status
  const statusHoursMap: { [key: string]: number } = {};
  entries.forEach(entry => {
    statusHoursMap[entry.status] = (statusHoursMap[entry.status] || 0) + getEntryHours(entry);
  });
  const statusChartData = [
    { name: 'Approved', hours: statusHoursMap['APPROVED'] || 0 },
    { name: 'Pending', hours: statusHoursMap['PENDING'] || 0 },
    { name: 'Declined', hours: statusHoursMap['DECLINED'] || 0 }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Box sx={{ height: 300 }}>
          <Typography variant="h6" gutterBottom>
            Hours by Project
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={projectChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ height: 300 }}>
          <Typography variant="h6" gutterBottom>
            Hours by Status
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
    </Grid>
  );
};

export default VisualInsights; 