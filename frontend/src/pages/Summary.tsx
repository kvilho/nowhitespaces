import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress,
  Box,
  Card,
  CardContent,
  Stack,
  Divider,
  useTheme,
  Button
} from '@mui/material';
import VisualInsights from '../components/VisualInsights';
import entryService, { Entry } from '../services/entryService';
import '../styles/summary.css';

const Summary: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCount, setShowCount] = useState(10);
  const theme = useTheme();

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setIsLoading(true);
        const entriesData = await entryService.getLatestEntries(1000);
        setEntries(entriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching summary data:', err);
        setError('Failed to load summary data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummaryData();
  }, []);

  // Helper to calculate hours for an entry
  const getEntryHours = (entry: Entry) => {
    if (!entry.entryStart || !entry.entryEnd) return 0;
    const start = new Date(entry.entryStart);
    const end = new Date(entry.entryEnd);
    const hours = (end.getTime() - start.getTime()) / 3600000;
    return isNaN(hours) ? 0 : hours;
  };

  // Stats
  const totalEntries = entries.length;
  const totalHours = entries.reduce((sum, e) => sum + getEntryHours(e), 0);
  const avgHours = totalEntries > 0 ? (totalHours / totalEntries) : 0;
  const activeProjects = new Set(entries.map(e => e.project?.projectId)).size;
  const statusCounts = {
    APPROVED: entries.filter(e => e.status === 'APPROVED').length,
    PENDING: entries.filter(e => e.status === 'PENDING').length,
    DECLINED: entries.filter(e => e.status === 'DECLINED').length,
  };

  const handleShowMore = () => setShowCount(count => count + 10);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Summary
      </Typography>
      {/* Quick Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[{
          label: 'Total Entries',
          value: totalEntries
        }, {
          label: 'Total Hours',
          value: `${totalHours.toFixed(1)}h`
        }, {
          label: 'Avg. Hours/Entry',
          value: `${avgHours.toFixed(1)}h`
        }, {
          label: 'Active Projects',
          value: activeProjects
        }].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card elevation={3} sx={{ borderRadius: 3, minHeight: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: theme.shadows[2] }}>
              <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Work Hours Summary Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Work Hours Summary
        </Typography>
        <Grid container spacing={3}>
          {[{
            label: 'Approved Entries',
            value: statusCounts.APPROVED,
            color: theme.palette.success.main
          }, {
            label: 'Pending Entries',
            value: statusCounts.PENDING,
            color: theme.palette.warning.main
          }, {
            label: 'Declined Entries',
            value: statusCounts.DECLINED,
            color: theme.palette.error.main
          }].map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card elevation={2} sx={{ borderRadius: 3, minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderTop: `4px solid ${stat.color}` }}>
                <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Latest Entries Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Latest Entries
        </Typography>
        <Grid container spacing={2}>
          {entries.slice(0, showCount).map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry.entryId}>
              <Card elevation={1} sx={{ borderRadius: 2, p: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {entry.entryStart ? new Date(entry.entryStart).toLocaleDateString() : 'No date'} &bull; {entry.project?.projectName || 'Unknown Project'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {entry.entryDescription || 'No description'}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Status:
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }} color={
                      entry.status === 'APPROVED' ? theme.palette.success.main :
                      entry.status === 'PENDING' ? theme.palette.warning.main :
                      theme.palette.error.main
                    }>
                      {entry.status}
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      {getEntryHours(entry).toFixed(1)}h
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {entries.length > showCount && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handleShowMore} sx={{ borderRadius: 2, fontWeight: 500 }}>
              Show More
            </Button>
          </Box>
        )}
      </Box>

      {/* Visual Insights Section */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
          Visual Insights
        </Typography>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, maxWidth: 900, mx: 'auto' }}>
          <VisualInsights entries={entries} />
        </Paper>
      </Box>
    </Container>
  );
};

export default Summary; 