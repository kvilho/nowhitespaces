import React from 'react';
import { Typography, Grid, CircularProgress, Box } from '@mui/material';
import { HourSummaryDTO, StatusSummaryDTO } from '../services/userService';
import '../styles/hourSummary.css';

interface HourSummaryProps {
  summary: HourSummaryDTO | null;
  isLoading: boolean;
  error: string | null;
}

const StatusCard: React.FC<{ title: string; data: StatusSummaryDTO; status: string }> = ({ title, data, status }) => (
  <div className={`summary-card ${status}`}>
    <span>
      <div className="summary-content">
        <Typography variant="h6" className="card-title">
          {title}
        </Typography>
        <Typography variant="h4" className="total-hours">
          {data.totalHours.toFixed(1)}h
        </Typography>
        <Box className="breakdown-section">
          <Typography variant="subtitle1" className="breakdown-title">
            Monthly Breakdown
          </Typography>
          <div className="monthly-breakdown">
            {Object.entries(data.monthlyBreakdown).map(([month, hours]) => (
              <div key={month} className="month-item">
                <Typography variant="body2" className="month-label">
                  {month}
                </Typography>
                <Typography variant="body1" className="month-hours">
                  {hours.toFixed(1)}h
                </Typography>
              </div>
            ))}
          </div>
        </Box>
        <Box className="breakdown-section">
          <Typography variant="subtitle1" className="breakdown-title">
            Per Project
          </Typography>
          <div className="project-breakdown">
            {data.perProject.map((project) => (
              <div key={project.projectId} className="project-item">
                <Typography variant="body2" className="project-name">
                  {project.projectName}
                </Typography>
                <Typography variant="body1" className="project-hours">
                  {project.hours.toFixed(1)}h
                </Typography>
              </div>
            ))}
          </div>
        </Box>
      </div>
    </span>
  </div>
);

const HourSummary: React.FC<HourSummaryProps> = ({ summary, isLoading, error }) => {
  if (isLoading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="error-paper">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="hour-summary">
      <Typography variant="h5" className="summary-title">
        Work Hours Summary
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatusCard title="Approved Hours" data={summary.approved} status="approved" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusCard title="Pending Hours" data={summary.pending} status="pending" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusCard title="Declined Hours" data={summary.declined} status="declined" />
        </Grid>
      </Grid>
    </div>
  );
};

export default HourSummary; 