import React, { useState, useEffect, useCallback, memo } from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  LinearProgress,
  useTheme
} from '@mui/material'
import AnalyticsCharts from '../components/common/AnalyticsCharts'
import EpisodeNotifications from '../components/common/EpisodeNotifications'
import WatchHistoryModal from '../components/common/WatchHistoryModal'
import ProfilePhotoUpload from '../components/common/ProfilePhotoUpload'
import {
  Edit as EditIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../redux/features/userSlice'
import userApi from '../api/modules/user.api'
import tmdbConfigs from '../api/configs/tmdb.configs'
import { toast } from 'react-toastify'
import { deleteImageFromSupabase } from '../utils/supabase'

const ProfileDashboard = memo(() => {
  const theme = useTheme()
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [updating, setUpdating] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [watchHistoryModalOpen, setWatchHistoryModalOpen] = useState(false)
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false)
const [localProfileImage, setLocalProfileImage] = useState(() => localStorage.getItem('localProfileImage') || '')

  useEffect(() => {
    fetchDashboardData()
    
    // Listen for dashboard refresh events from other components
    const handleDashboardRefresh = (event) => {
      
      fetchDashboardData()
    }
    
    window.addEventListener('dashboardRefresh', handleDashboardRefresh)
    
    return () => {
      window.removeEventListener('dashboardRefresh', handleDashboardRefresh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync state when user data changes or edit dialog opens
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '')
    }
  }, [user, editProfileOpen])

  





  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const { response } = await userApi.getDashboard()
      if (response) {
        
        setDashboardData(response)
      }
    } catch (error) {
      
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true)
      const { response, err } = await userApi.updateProfile({
        displayName
      });
      
      if (err) {
        
        toast.error(err.message || 'Failed to update profile');
        return;
      }
      
      if (response) {
        dispatch(setUser(response));
        
        await fetchDashboardData();
        
        setEditProfileOpen(false);
        toast.success('Profile updated successfully!');
        
        window.dispatchEvent(new CustomEvent('profileUpdated', { 
          detail: { user: response } 
        }));
      } else {
        toast.error('No response received from server');
      }
    } catch (error) {
      
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // Immediate profile image update function
  const handleImmediateImageUpdate = async (imageUrl, imagePath = '') => {
    if (imageUrl && !isValidImageUrl(imageUrl)) {
      toast.error('Please provide a valid image URL')
      return
    }

    setImageUploading(true);
    try {
      // Delete old image from Supabase if it exists and we're uploading a new one
      if (user?.profileImagePath && imagePath && user.profileImagePath !== imagePath) {
        try {
          await deleteImageFromSupabase(user.profileImagePath);
          console.log('Old image deleted successfully');
        } catch (deleteError) {
          console.warn('Failed to delete old image:', deleteError);
          // Don't fail the upload if deletion fails
        }
      }

      // Update both local storage and server
      setLocalProfileImage(imageUrl || '');
      localStorage.setItem('localProfileImage', imageUrl || '');
      
      // Also update on server for persistence across devices
      const {response, err} = await userApi.updateProfile({
        displayName: displayName,
        profileImage: imageUrl || '',
        profileImagePath: imagePath || ''
      });
      
      if (response) {
        dispatch(setUser(response));
        toast.success('Profile image updated and synced!');
      } else {
        toast.warning('Image saved locally but sync failed: ' + (err?.message || 'Unknown error'));
      }
    } catch (error) {
      toast.warning('Image saved locally but sync failed');
      
    } finally {
      setImageUploading(false);
    }
  };



  const handleClearWatchHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire watch history? This action cannot be undone.')) {
      try {
        await userApi.clearWatchHistory()
        toast.success('Watch history cleared successfully!')
        fetchDashboardData()
      } catch (error) {
        
        toast.error('Failed to clear watch history')
      }
    }
  }

  const formatWatchTime = (minutes) => {
    if (!minutes) return '0 minutes'
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours === 0) return `${remainingMinutes} minutes`
    if (remainingMinutes === 0) return `${hours} hours`
    return `${hours}h ${remainingMinutes}m`
  }

  const getMediaPosterUrl = (posterPath) => {
    if (!posterPath) return '/no-poster.png'
    return tmdbConfigs.posterPath(posterPath)
  }

  const isValidImageUrl = (url) => {
    if (!url) return true // Empty is valid
    try {
      const urlObj = new URL(url)
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      const hasValidExtension = validExtensions.some(ext => 
        urlObj.pathname.toLowerCase().includes(ext)
      )
      const isValidProtocol = ['http:', 'https:'].includes(urlObj.protocol)
      const isValidDomain = url.includes('imgur') || url.includes('cloudinary') || url.includes('gravatar') || url.includes('supabase')
      return isValidProtocol && (hasValidExtension || isValidDomain)
    } catch {
      return false
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    )
  }

  const stats = dashboardData?.stats || {}

  return (
    <Container maxWidth="lg" sx={{ py: 4, pt: 12 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Dashboard Header */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>
        </Box>

        {/* Enhanced Profile Header with Gradient Background */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            mb: { xs: 3, sm: 4 }, 
            borderRadius: { xs: 3, sm: 4, md: 5 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.error.main})`
            }
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
            <Grid item>
              <Box 
                sx={{ 
                  position: 'relative', 
                  display: 'inline-block',
                  cursor: 'pointer'
                }}
                onClick={() => setPhotoUploadOpen(true)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar
                    key={localProfileImage || 'default'}
                    src={localProfileImage}
                    sx={{
                      width: { xs: 80, sm: 100, md: 120 },
                      height: { xs: 80, sm: 100, md: 120 },
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                      bgcolor: theme.palette.primary.main,
                      border: `4px solid ${theme.palette.background.paper}`,
                      boxShadow: `0 8px 32px ${theme.palette.primary.main}40, 0 0 0 2px ${theme.palette.primary.main}30`,
                      opacity: imageUploading ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                      background: localProfileImage 
                        ? 'transparent' 
                        : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        boxShadow: `0 12px 40px ${theme.palette.primary.main}60, 0 0 0 3px ${theme.palette.primary.main}50`,
                        transform: 'translateY(-2px)',
                      },
                      '& .MuiAvatar-img': {
                        objectFit: 'cover',
                        filter: 'brightness(1.05) contrast(1.1)',
                      }
                    }}
                    imgProps={{
                      onError: (e) => {
                        
                        e.target.style.display = 'none'
                      },
                      onLoad: () => {
                        
                      }
                    }}
                  >
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </motion.div>
                
                {/* Upload Progress Indicator */}
                {imageUploading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2
                    }}
                  >
                    <CircularProgress size={40} />
                  </Box>
                )}
                
                {/* Enhanced Camera Icon Overlay */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 2,
                      right: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      color: 'white',
                      width: { xs: 32, sm: 36, md: 40 },
                      height: { xs: 32, sm: 36, md: 40 },
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `3px solid ${theme.palette.background.paper}`,
                      boxShadow: `0 4px 16px ${theme.palette.primary.main}60, 0 0 0 1px ${theme.palette.primary.main}20`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
                        boxShadow: `0 6px 20px ${theme.palette.primary.main}80, 0 0 0 2px ${theme.palette.primary.main}40`,
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer'
                    }}
                  >
                    <PhotoCameraIcon sx={{ 
                      fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                    }} />
                  </Box>
                </motion.div>
              </Box>
              

            </Grid>
            <Grid item xs>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  mb: { xs: 0.5, sm: 0.75 }
                }}
              >
                {user?.displayName || 'User'}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                  mb: { xs: 0.25, sm: 0.5 }
                }}
              >
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' }
                }}
              >
                Last login: {user?.lastLoginDate ? new Date(user.lastLoginDate).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
          
          {/* Edit Profile Button - Moved to bottom */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon sx={{ fontSize: '0.8rem' }} />}
              onClick={() => setEditProfileOpen(true)}
              sx={{ 
                borderRadius: 1,
                fontSize: '0.65rem',
                px: 1,
                py: 0.25,
                minWidth: 'auto'
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>

        {/* Enhanced Stats Cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={6} md={3}>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }} 
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card sx={{ 
                borderRadius: { xs: 3, sm: 4 }, 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                border: `1px solid ${theme.palette.primary.main}30`,
                boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
                '&:hover': {
                  boxShadow: `0 16px 48px ${theme.palette.primary.main}30`,
                },
                transition: 'all 0.3s ease-in-out'
              }}>
                <CardContent sx={{ 
                  textAlign: 'center',
                  p: { xs: 2, sm: 2.5, md: 3 }
                }}>
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      borderRadius: '50%',
                      width: { xs: 48, sm: 56, md: 64 },
                      height: { xs: 48, sm: 56, md: 64 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: { xs: 1, sm: 1.5 },
                      boxShadow: `0 8px 24px ${theme.palette.primary.main}40`
                    }}
                  >
                    <MovieIcon sx={{ 
                      fontSize: { xs: 24, sm: 28, md: 32 }, 
                      color: 'white'
                    }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {stats.moviesWatched || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 500
                  }}>
                    Movies Watched
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }} 
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card sx={{ 
                borderRadius: { xs: 3, sm: 4 }, 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}15 0%, ${theme.palette.secondary.main}05 100%)`,
                border: `1px solid ${theme.palette.secondary.main}30`,
                boxShadow: `0 8px 32px ${theme.palette.secondary.main}20`,
                '&:hover': {
                  boxShadow: `0 16px 48px ${theme.palette.secondary.main}30`,
                },
                transition: 'all 0.3s ease-in-out'
              }}>
                <CardContent sx={{ 
                  textAlign: 'center',
                  p: { xs: 2, sm: 2.5, md: 3 }
                }}>
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      borderRadius: '50%',
                      width: { xs: 48, sm: 56, md: 64 },
                      height: { xs: 48, sm: 56, md: 64 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: { xs: 1, sm: 1.5 },
                      boxShadow: `0 8px 24px ${theme.palette.secondary.main}40`
                    }}
                  >
                    <TvIcon sx={{ 
                      fontSize: { xs: 24, sm: 28, md: 32 }, 
                      color: 'white'
                    }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {stats.tvShowsWatched || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 500
                  }}>
                    TV Shows Watched
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }} 
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card sx={{ 
                borderRadius: { xs: 3, sm: 4 }, 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.error.main}15 0%, ${theme.palette.error.main}05 100%)`,
                border: `1px solid ${theme.palette.error.main}30`,
                boxShadow: `0 8px 32px ${theme.palette.error.main}20`,
                '&:hover': {
                  boxShadow: `0 16px 48px ${theme.palette.error.main}30`,
                },
                transition: 'all 0.3s ease-in-out'
              }}>
                <CardContent sx={{ 
                  textAlign: 'center',
                  p: { xs: 2, sm: 2.5, md: 3 }
                }}>
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                      borderRadius: '50%',
                      width: { xs: 48, sm: 56, md: 64 },
                      height: { xs: 48, sm: 56, md: 64 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: { xs: 1, sm: 1.5 },
                      boxShadow: `0 8px 24px ${theme.palette.error.main}40`
                    }}
                  >
                    <FavoriteIcon sx={{ 
                      fontSize: { xs: 24, sm: 28, md: 32 }, 
                      color: 'white'
                    }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {stats.favoritesCount || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 500
                  }}>
                    Favorites
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }} 
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card sx={{ 
                borderRadius: { xs: 3, sm: 4 }, 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.warning.main}15 0%, ${theme.palette.warning.main}05 100%)`,
                border: `1px solid ${theme.palette.warning.main}30`,
                boxShadow: `0 8px 32px ${theme.palette.warning.main}20`,
                '&:hover': {
                  boxShadow: `0 16px 48px ${theme.palette.warning.main}30`,
                },
                transition: 'all 0.3s ease-in-out'
              }}>
                <CardContent sx={{ 
                  textAlign: 'center',
                  p: { xs: 2, sm: 2.5, md: 3 }
                }}>
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                      borderRadius: '50%',
                      width: { xs: 48, sm: 56, md: 64 },
                      height: { xs: 48, sm: 56, md: 64 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: { xs: 1, sm: 1.5 },
                      boxShadow: `0 8px 24px ${theme.palette.warning.main}40`
                    }}
                  >
                    <StarIcon sx={{ 
                      fontSize: { xs: 24, sm: 28, md: 32 }, 
                      color: 'white'
                    }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {stats.reviewsWritten || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 500
                  }}>
                    Reviews Written
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Enhanced Viewing Statistics */}
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          {/* Watch Time Card */}
          <Grid item xs={6} sm={6} md={4}>
            <Paper elevation={3} sx={{ 
              p: { xs: 1, sm: 2, md: 3 }, 
              borderRadius: { xs: 1.5, sm: 2, md: 3 }, 
              height: '100%',
              minHeight: { xs: '120px', sm: '140px', md: '160px' }
            }}>
              <Box display="flex" alignItems="center" mb={{ xs: 0.5, sm: 1, md: 1.5 }}>
                <TimeIcon sx={{ 
                  mr: { xs: 0.5, sm: 1 }, 
                  color: theme.palette.info.main,
                  fontSize: { xs: 16, sm: 20, md: 24 }
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                }}>
                  Watch Time
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.info.main,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
              }}>
                {formatWatchTime(stats?.totalWatchTime || user?.totalWatchTime || 0)}
              </Typography>
            </Paper>
          </Grid>

          {/* TV Episodes Count */}
          <Grid item xs={6} sm={6} md={4}>
            <Paper elevation={3} sx={{ 
              p: { xs: 1, sm: 2, md: 3 }, 
              borderRadius: { xs: 1.5, sm: 2, md: 3 }, 
              height: '100%',
              minHeight: { xs: '120px', sm: '140px', md: '160px' }
            }}>
              <Box display="flex" alignItems="center" mb={{ xs: 0.5, sm: 1, md: 1.5 }}>
                <TvIcon sx={{ 
                  mr: { xs: 0.5, sm: 1 }, 
                  color: theme.palette.secondary.main,
                  fontSize: { xs: 16, sm: 20, md: 24 }
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                }}>
                  Episodes
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.secondary.main,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
              }}>
                {stats?.tvEpisodesWatched || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' }
              }}>
                Watched
              </Typography>
            </Paper>
          </Grid>

          {/* Monthly Activity Statistics */}
          <Grid item xs={12} sm={12} md={4}>
            <Paper elevation={3} sx={{ 
              p: { xs: 1, sm: 2, md: 3 }, 
              borderRadius: { xs: 1.5, sm: 2, md: 3 }, 
              height: '100%',
              minHeight: { xs: '140px', sm: '160px', md: '180px' }
            }}>
              <Box display="flex" alignItems="center" mb={{ xs: 0.5, sm: 1, md: 1.5 }}>
                <StarIcon sx={{ 
                  mr: { xs: 0.5, sm: 1 }, 
                  color: theme.palette.success.main,
                  fontSize: { xs: 16, sm: 20, md: 24 }
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                }}>
                  Monthly Stats
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ 
                mb: { xs: 0.5, sm: 1, md: 1.5 },
                fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' }
              }}>
                This Month
              </Typography>
              <Box sx={{ mb: { xs: 0.25, sm: 0.5 } }}>
                <Typography variant="body2" color="text.secondary" sx={{
                  fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' }
                }}>
                  Movies
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.primary.main,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                }}>
                  {stats?.monthlyStats?.moviesWatched || 0}
                </Typography>
              </Box>
              <Box sx={{ mb: { xs: 0.25, sm: 0.5 } }}>
                <Typography variant="body2" color="text.secondary" sx={{
                  fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' }
                }}>
                  TV Series
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.secondary.main,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                }}>
                  {stats?.monthlyStats?.tvSeriesWatched || 0}
                </Typography>
              </Box>
              <Box sx={{ mb: { xs: 0.5, sm: 1 } }}>
                <Typography variant="body2" color="text.secondary" sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  Watch Time
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.info.main,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                }}>
                  {formatWatchTime(stats?.monthlyStats?.totalWatchTime || 0)}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ 
                mt: { xs: 0.5, sm: 1 }, 
                display: 'block',
                fontSize: { xs: '0.625rem', sm: '0.75rem' }
              }}>
                Based on 10+ min watch time requirement
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Analytics Dashboard */}
        {dashboardData?.analytics && (
          <AnalyticsCharts analytics={dashboardData.analytics} />
        )}

        {/* Episode Notifications */}
        {dashboardData?.ongoingTvSeries && dashboardData.ongoingTvSeries.length > 0 && (
          <EpisodeNotifications 
            ongoingTvSeries={dashboardData.ongoingTvSeries}
            onRefresh={fetchDashboardData}
          />
        )}



        {/* Continue Watching Section */}
        {dashboardData?.recentWatchHistory?.filter(item => 
          item.watchDuration > 0 && 
          item.watchDuration < (item.mediaType === 'movie' ? 120 : 45) && 
          !item.isCompleted
        ).length > 0 && (
          <Paper elevation={3} sx={{ 
            p: { xs: 2, sm: 2.5, md: 3 }, 
            mb: { xs: 3, sm: 4 }, 
            borderRadius: { xs: 2, sm: 2.5, md: 3 } 
          }}>
            <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 1.5, md: 2 }}>
              <TrendingUpIcon sx={{ 
                mr: { xs: 0.5, sm: 1 }, 
                color: theme.palette.secondary.main,
                fontSize: { xs: 16, sm: 20, md: 24 }
              }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
              }}>
                Continue Watching
              </Typography>
            </Box>
            <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
              {dashboardData.recentWatchHistory
                .filter(item => 
                  item.watchDuration > 0 && 
                  item.watchDuration < (item.mediaType === 'movie' ? 120 : 45) && 
                  !item.isCompleted
                )
                .slice(0, 4)
                .map((item, index) => (
                  <Grid item xs={6} sm={6} md={3} key={index}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.02)' }
                      }}
                      onClick={() => {
                        // Navigate to media detail page
                        window.location.href = `/${item.mediaType}/${item.mediaId}`;
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height={{ xs: 120, sm: 150, md: 200 }}
                          image={getMediaPosterUrl(item.mediaPoster)}
                          alt={item.mediaTitle}
                        />
                        {/* Progress overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            p: { xs: 0.5, sm: 1 }
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={Math.min((item.watchDuration / (item.mediaType === 'movie' ? 120 : 45)) * 100, 100)}
                            sx={{
                              height: { xs: 4, sm: 6 },
                              borderRadius: 3,
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                backgroundColor: theme.palette.secondary.main
                              }
                            }}
                          />
                        </Box>
                      </Box>
                      <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
                        <Typography variant="subtitle2" sx={{ 
                          fontWeight: 'bold', 
                          mb: 0.5,
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                        }}>
                          {item.mediaTitle}
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Chip
                            label={item.mediaType.toUpperCase()}
                            size="small"
                            sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{
                            fontSize: { xs: '0.625rem', sm: '0.75rem' }
                          }}>
                            {Math.round(item.watchDuration)} min
                          </Typography>
                        </Box>
                        {item.seasonNumber && item.episodeNumber && (
                          <Typography variant="caption" display="block" sx={{ 
                            mt: 0.5,
                            fontSize: { xs: '0.625rem', sm: '0.75rem' }
                          }}>
                            S{item.seasonNumber}E{item.episodeNumber}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        )}

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Recent Watch History */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              onClick={() => setWatchHistoryModalOpen(true)}
              sx={{ 
                p: { xs: 2, sm: 2.5, md: 3 }, 
                mb: { xs: 3, sm: 4 }, 
                borderRadius: { xs: 2, sm: 2.5, md: 3 }, 
                height: { xs: '280px', sm: '320px', md: '400px' }, 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                }
              }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={{ xs: 1, sm: 1.5, md: 2 }}>
                <Box display="flex" alignItems="center">
                  <HistoryIcon sx={{ 
                    mr: { xs: 0.5, sm: 1 }, 
                    color: theme.palette.primary.main,
                    fontSize: { xs: 16, sm: 20, md: 24 }
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
                  }}>
                    Watch History
                  </Typography>
                </Box>
                {dashboardData?.recentWatchHistory?.length > 0 && (
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearWatchHistory();
                    }}
                    size="small"
                    sx={{ 
                      color: theme.palette.error.main,
                      p: { xs: 0.5, sm: 1 }
                    }}
                  >
                    <ClearIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                  </IconButton>
                )}
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {dashboardData?.recentWatchHistory?.length > 0 ? (
                  <List sx={{ py: 0 }}>
                    {dashboardData.recentWatchHistory.slice(0, 4).map((item, index) => (
                    <ListItem key={index} sx={{ px: 0, py: { xs: 0.5, sm: 1 } }}>
                      <ListItemAvatar>
                        <Avatar
                          src={getMediaPosterUrl(item.mediaPoster)}
                          variant="rounded"
                          sx={{ 
                            width: { xs: 35, sm: 40, md: 45 }, 
                            height: { xs: 52, sm: 60, md: 68 }, 
                            mr: { xs: 0.5, sm: 1 } 
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 'bold', 
                            mb: 0.5,
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                          }} noWrap>
                            {item.mediaTitle}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', gap: { xs: 0.25, sm: 0.5 }, mb: 0.5, flexWrap: 'wrap' }}>
                              <Chip
                                label={item.mediaType.toUpperCase()}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                              />
                              {item.seasonNumber && item.episodeNumber && (
                                <Chip
                                  label={`S${item.seasonNumber}E${item.episodeNumber}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                                />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ 
                              mb: 0.5,
                              fontSize: { xs: '0.625rem', sm: '0.75rem' }
                            }}>
                              {new Date(item.watchedAt).toLocaleDateString()}
                            </Typography>
                            {/* Watch Progress Bar */}
                            {item.watchDuration > 0 && (
                              <Box sx={{ mt: 0.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{
                                    fontSize: { xs: '0.625rem', sm: '0.75rem' }
                                  }}>
                                    Progress
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{
                                    fontSize: { xs: '0.625rem', sm: '0.75rem' }
                                  }}>
                                    {Math.round(item.watchDuration)} min
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min((item.watchDuration / (item.mediaType === 'movie' ? 120 : 45)) * 100, 100)}
                                  sx={{
                                    height: { xs: 2, sm: 3 },
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 2,
                                      backgroundColor: theme.palette.primary.main
                                    }
                                  }}
                                />
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      No watch history yet. Start watching to see your history here!
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>


        </Grid>





        {/* All Reviews Section */}
        {dashboardData?.allReviews?.length > 0 && (
          <Paper elevation={3} sx={{ 
            p: { xs: 2, sm: 2.5, md: 3 }, 
            mb: { xs: 3, sm: 4 }, 
            borderRadius: { xs: 2, sm: 2.5, md: 3 } 
          }}>
            <Box display="flex" alignItems="center" mb={3}>
              <StarIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                All Reviews ({dashboardData.allReviews.length})
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {dashboardData.allReviews.map((review, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent>
                      <Box display="flex" mb={2}>
                        <Avatar
                          src={getMediaPosterUrl(review.mediaPoster)}
                          variant="rounded"
                          sx={{ width: 60, height: 90, mr: 2 }}
                        />
                        <Box flex={1}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} gutterBottom>
                            {review.mediaTitle}
                          </Typography>
                          <Chip
                            label={review.mediaType.toUpperCase()}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" display="block" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {review.content.length > 150 
                          ? `${review.content.substring(0, 150)}...` 
                          : review.content
                        }
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}



        {/* Edit Profile Dialog */}
        <Dialog 
          open={editProfileOpen} 
          onClose={() => setEditProfileOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Display Name"
              fullWidth
              variant="outlined"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Profile Photo
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                   src={localProfileImage}
                  sx={{
                    width: 80,
                    height: 80,
                    border: `2px solid ${theme.palette.divider}`
                  }}
                >
                  {displayName?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => setPhotoUploadOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Upload Photo
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProfile}
              variant="contained"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Watch History Modal */}
        <WatchHistoryModal
          open={watchHistoryModalOpen}
          onClose={() => setWatchHistoryModalOpen(false)}
          watchHistory={dashboardData?.recentWatchHistory || []}
          getMediaPosterUrl={getMediaPosterUrl}
        />

        {/* Profile Photo Upload Modal */}
        <ProfilePhotoUpload
          open={photoUploadOpen}
          onClose={() => setPhotoUploadOpen(false)}
          currentImage={localProfileImage}
          onImageUpdate={handleImmediateImageUpdate}
          user={user}
        />

      </motion.div>
    </Container>
  )
})

ProfileDashboard.displayName = 'ProfileDashboard'

export default ProfileDashboard