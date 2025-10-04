import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  History as HistoryIcon
} from '@mui/icons-material';

const WatchHistoryModal = ({ 
  open, 
  onClose, 
  watchHistory = [], 
  onClearHistory,
  getMediaPosterUrl 
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 2.5, md: 3 },
          maxHeight: '90vh',
          m: { xs: 1, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ 
        p: { xs: 2, sm: 2.5, md: 3 },
        pb: { xs: 1, sm: 1.5, md: 2 }
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Typography sx={{ color: 'error.main', mr: 0.5, fontSize: '1.5rem' }}>•</Typography>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
            }}>
              Watch History
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ 
              color: theme.palette.text.secondary,
              p: { xs: 0.5, sm: 1 }
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        p: { xs: 2, sm: 2.5, md: 3 },
        pt: 0
      }}>
        {watchHistory?.length > 0 ? (
          <List>
            {watchHistory.map((item, index) => (
              <ListItem 
                key={index} 
                divider 
                sx={{ py: 1, cursor: 'pointer' }}
                onClick={() => {
                  window.location.href = `/${item.mediaType}/${item.mediaId}`;
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    variant="rounded" 
                    src={getMediaPosterUrl(item.mediaPoster)} 
                    sx={{ width: { xs: 60, sm: 80 }, height: { xs: 40, sm: 50 }, mr: 1 }} 
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {item.mediaTitle}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {item.mediaType.toUpperCase()} {item.seasonNumber && item.episodeNumber ? `STE${item.episodeNumber}` : ''}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        {new Date(item.watchedAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </>
                  }
                />
                {item.watchDuration > 0 && (
                  <Box sx={{ width: '100%', mt: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="caption" color="text.secondary">Progress</Typography>
                      <Typography variant="caption" color="text.secondary">{Math.round(item.watchDuration)} min</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((item.watchDuration / (item.mediaType === 'movie' ? 120 : 45)) * 100, 100)}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: theme.palette.action.hover,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.error.main
                        }
                      }}
                    />
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '200px',
            textAlign: 'center'
          }}>
            <Box>
              <HistoryIcon sx={{ 
                fontSize: { xs: 48, sm: 64, md: 80 }, 
                color: theme.palette.text.disabled,
                mb: 2
              }} />
              <Typography variant="h6" color="text.secondary" sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                mb: 1
              }}>
                No watch history yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Start watching to see your history here!
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WatchHistoryModal;