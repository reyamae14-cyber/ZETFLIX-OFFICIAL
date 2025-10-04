import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  useTheme,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TimeIcon from '@mui/icons-material/AccessTime';
import userApi from '../../api/modules/user.api';

const LogoutGreeting = ({ open, onClose, user, onConfirmLogout }) => {
  const theme = useTheme();
  const [userStats, setUserStats] = useState(null);

  // Fetch user statistics when dialog opens
  useEffect(() => {
    if (open && user) {
      fetchUserStats();
    }
  }, [open, user]);

  const fetchUserStats = async () => {
    try {
      const { response } = await userApi.getDashboard();
      if (response) {
        setUserStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const formatWatchTime = (minutes) => {
    if (!minutes) return '0 minutes';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) return `${remainingMinutes} minutes`;
    if (remainingMinutes === 0) return `${hours} hours`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getFarewellMessage = () => {
    if (!userStats) {
      const defaultMessages = [
        "Thanks for watching with us today! See you soon on ZETFLIX.",
        "Hope you enjoyed your time here. Come back anytime!",
        "Until next time! Your watchlist will be waiting for you.",
        "Thanks for being part of the ZETFLIX community. Take care!",
        "See you later! Don't forget to check out what's new next time."
      ];
      return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
    }

    const personalizedMessages = [
      `You've watched ${userStats.moviesWatched || 0} movies and ${userStats.tvShowsWatched || 0} TV shows with us! Thanks for being awesome.`,
      `With ${formatWatchTime(userStats.totalWatchTime || 0)} of watch time, you're a true ZETFLIX fan! See you soon.`,
      `${userStats.favoritesCount || 0} favorites and counting! Thanks for making ZETFLIX your entertainment home.`,
      `You've spent ${formatWatchTime(userStats.totalWatchTime || 0)} enjoying great content. Until next time!`,
      `From ${userStats.moviesWatched || 0} movies to ${userStats.tvShowsWatched || 0} TV shows - thanks for the amazing journey!`
    ];
    
    return personalizedMessages[Math.floor(Math.random() * personalizedMessages.length)];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.divider}`,
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Goodbye, {user?.displayName || 'User'}!
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {getFarewellMessage()}
          </Typography>

          {userStats && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  mb: 2
                }}
              >
                Your ZETFLIX Journey
              </Typography>
              
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
                <Chip
                  icon={<MovieIcon />}
                  label={`${userStats.moviesWatched || 0} Movies`}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main
                  }}
                />
                <Chip
                  icon={<TvIcon />}
                  label={`${userStats.tvShowsWatched || 0} TV Shows`}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    color: theme.palette.secondary.main,
                    borderColor: theme.palette.secondary.main
                  }}
                />
                <Chip
                  icon={<FavoriteIcon />}
                  label={`${userStats.favoritesCount || 0} Favorites`}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.main
                  }}
                />
                <Chip
                  icon={<TimeIcon />}
                  label={formatWatchTime(userStats.totalWatchTime || 0)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    color: theme.palette.info.main,
                    borderColor: theme.palette.info.main
                  }}
                />
              </Stack>
            </>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onConfirmLogout}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutGreeting;