import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Badge,
  Chip,
  Stack,
  Button,
  Collapse,
  Alert
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  NewReleases as NewReleasesIcon
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import userApi from '../../api/modules/user.api'

const EpisodeNotifications = ({ ongoingTvSeries, onRefresh }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [checking, setChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState(null)

  const seriesWithNewEpisodes = ongoingTvSeries?.filter(series => series.hasNewEpisode) || []
  const hasNewEpisodes = seriesWithNewEpisodes.length > 0

  const handleCheckNewEpisodes = async () => {
    setChecking(true)
    try {
      const { response, err } = await userApi.checkNewEpisodes()
      
      if (err) {
        toast.error('Failed to check for new episodes')
        return
      }

      if (response) {
        setLastChecked(new Date())
        if (response.hasUpdates) {
          onRefresh?.()
          if (response.newEpisodeCount > 0) {
            toast.success(`Found ${response.newEpisodeCount} new episode${response.newEpisodeCount > 1 ? 's' : ''}!`)
          } else {
            toast.info('No new episodes available')
          }
        } else {
          toast.info('No new episodes available')
        }
      }
    } catch (error) {
      console.error('Error checking episodes:', error)
      toast.error('Failed to check for new episodes')
    } finally {
      setChecking(false)
    }
  }

  const handleMarkAsSeen = async (mediaId) => {
    try {
      const { response, err } = await userApi.markEpisodeNotificationSeen({ mediaId })
      
      if (err) {
        toast.error('Failed to mark notification as seen')
        return
      }

      if (response) {
        onRefresh?.()
        toast.success('Notification marked as seen')
      }
    } catch (error) {
      console.error('Error marking notification:', error)
      toast.error('Failed to mark notification as seen')
    }
  }

  // Auto-check for new episodes every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (ongoingTvSeries?.length > 0) {
        handleCheckNewEpisodes()
      }
    }, 30 * 60 * 1000) // 30 minutes

    return () => clearInterval(interval)
  }, [ongoingTvSeries])

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <IconButton
          onClick={() => setShowNotifications(!showNotifications)}
          color={hasNewEpisodes ? "error" : "default"}
        >
          <Badge badgeContent={seriesWithNewEpisodes.length} color="error">
            {hasNewEpisodes ? <NotificationsActiveIcon /> : <NotificationsIcon />}
          </Badge>
        </IconButton>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={handleCheckNewEpisodes}
          disabled={checking}
          sx={{ minWidth: 'auto' }}
        >
          {checking ? 'Checking...' : 'Check Episodes'}
        </Button>

        {lastChecked && (
          <Typography variant="caption" color="text.secondary">
            Last checked: {lastChecked.toLocaleTimeString()}
          </Typography>
        )}
      </Stack>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Collapse in={showNotifications}>
              <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NewReleasesIcon color="primary" />
                      Episode Notifications
                    </Typography>
                    <IconButton size="small" onClick={() => setShowNotifications(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Stack>

                  {seriesWithNewEpisodes.length === 0 ? (
                    <Alert severity="info">
                      No new episodes available for your ongoing series.
                    </Alert>
                  ) : (
                    <Stack spacing={2}>
                      {seriesWithNewEpisodes.map((series) => (
                        <motion.div
                          key={series.mediaId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert 
                            severity="success" 
                            action={
                              <Button
                                size="small"
                                onClick={() => handleMarkAsSeen(series.mediaId)}
                              >
                                Mark as Seen
                              </Button>
                            }
                          >
                            <Stack spacing={1}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {series.title}
                              </Typography>
                              <Typography variant="body2">
                                New episodes are available! You last watched Episode {series.lastWatchedEpisode.number} of Season {series.currentSeason}.
                              </Typography>
                              <Box>
                                <Chip
                                  label="New Episode Available"
                                  color="success"
                                  size="small"
                                  icon={<NewReleasesIcon />}
                                />
                              </Box>
                            </Stack>
                          </Alert>
                        </motion.div>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Collapse>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default EpisodeNotifications