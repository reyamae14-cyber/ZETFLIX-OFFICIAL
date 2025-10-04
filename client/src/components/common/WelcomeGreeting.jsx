import React, { useState, useEffect, useCallback } from 'react'
import { 
  Typography, 
  Box,
  Avatar,
  Card,
  CardContent,
  IconButton
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../../redux/features/userSlice'
import userApi from '../../api/modules/user.api'
import CloseIcon from '@mui/icons-material/Close'

const WelcomeGreeting = ({ open, onClose }) => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClose = useCallback(async () => {
    setVisible(false)
    // Wait for fade animation to complete before calling onClose
    setTimeout(async () => {
      try {
        // Mark first login as complete
        await userApi.markFirstLoginComplete()
        
        // Update user state
        dispatch(setUser({ ...user, isFirstLogin: false }))
        
        onClose()
      } catch (error) {
        console.error("Error marking first login complete:", error)
        onClose()
      }
    }, 300)
  }, [dispatch, user, onClose])

  // Auto-close after 5 seconds with fade effect
  useEffect(() => {
    if (open) {
      setVisible(true)
      const timer = setTimeout(() => {
        handleClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [open, handleClose])

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const isFirstTimeUser = () => {
    // Use server-provided logic for 24-hour window
    return user?.shouldShowFirstTimeGreeting || (user?.isFirstLogin && user?.hoursSinceCreation <= 24)
  }

  const getReturningUserGreeting = () => {
    const timeGreeting = getTimeBasedGreeting()
    const userName = user?.displayName || 'User'
    
    const greetingTemplates = [
      `${timeGreeting}, ${userName}. Welcome back! Enjoy watching on ZETFLIX.`,
      `Welcome back, ${userName}. It's great to see you again. Your watchlist is ready.`,
      `Hello again, ${userName}. We've missed you. Settle in and enjoy what's new on ZETFLIX.`
    ]
    
    // Use a deterministic random selection based on current hour to ensure consistency during the session
    const randomIndex = currentTime.getHours() % greetingTemplates.length
    return greetingTemplates[randomIndex]
  }

  const getMainGreeting = () => {
    if (isFirstTimeUser()) {
      return {
        title: `Welcome to ZETFLIX!`,
        subtitle: `${getTimeBasedGreeting()}, ${user?.displayName || 'User'}!`,
        message: "Thank you for joining our community! Get ready to discover amazing movies and TV shows.",
        isFirstTime: true
      }
    } else {
      return {
        title: getTimeBasedGreeting(),
        subtitle: getReturningUserGreeting(),
        message: "Ready to continue your entertainment journey?",
        isFirstTime: false
      }
    }
  }



  if (!open) return null

  const greeting = getMainGreeting()

  return (
    <AnimatePresence>
      {visible && (
        <Box
          sx={{
            position: 'fixed',
            top: { xs: '80px', sm: '90px', md: '100px' },
            right: { xs: '16px', sm: '24px', md: '32px' },
            zIndex: 1300,
            maxWidth: { xs: '280px', sm: '320px', md: '360px' },
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 100, scale: visible ? 1 : 0.8 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
                border: '2px solid #dc2626',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'visible',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(220, 38, 38, 0.1) 100%)',
                  borderRadius: 'inherit',
                  zIndex: -1,
                }
              }}
            >
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: '#ffffff',
                  backgroundColor: 'rgba(220, 38, 38, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(220, 38, 38, 0.4)',
                  },
                  width: 28,
                  height: 28,
                }}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              <CardContent sx={{ p: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      bgcolor: '#dc2626',
                      border: '2px solid #ffffff',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}
                    src={user?.profileImage}
                  >
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                        mb: 0.5
                      }}
                    >
                      {greeting.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#dc2626',
                        fontWeight: 500,
                        fontSize: '0.85rem'
                      }}
                    >
                      Welcome to ZETFLIX
                    </Typography>
                  </Box>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#ffffff',
                    mb: 1.5,
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    fontWeight: 400
                  }}
                >
                  {greeting.subtitle}
                </Typography>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.8rem',
                    lineHeight: 1.3,
                    fontStyle: 'italic'
                  }}
                >
                  {greeting.message}
                </Typography>

                {greeting.isFirstTime && (
                  <Box 
                    sx={{ 
                      mt: 2, 
                      p: 1.5, 
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      borderRadius: 2,
                      border: '1px solid rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        lineHeight: 1.3,
                        textAlign: 'center'
                      }}
                    >
                      🎬 Discover amazing content<br />
                      ⭐ Build your watchlist<br />
                      📱 Enjoy anywhere
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  )
}

export default WelcomeGreeting