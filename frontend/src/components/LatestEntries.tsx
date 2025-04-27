import React from 'react';
import { 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { Entry } from '../types/Entry';

interface LatestEntriesProps {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  onShowMore?: () => void;
}

const LatestEntries: React.FC<LatestEntriesProps> = ({ 
  entries, 
  isLoading, 
  error,
  onShowMore 
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">No entries found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <List>
        {entries.map((entry, index) => (
          <React.Fragment key={entry.entryId}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">
                    {entry.project.projectName}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(entry.entryStart).toLocaleDateString()} - {((new Date(entry.entryEnd).getTime() - new Date(entry.entryStart).getTime()) / 3600000).toFixed(1)} hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.entryDescription}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {entry.status}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < entries.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      {onShowMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onShowMore}
            sx={{ textTransform: 'none' }}
          >
            Show More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default LatestEntries; 