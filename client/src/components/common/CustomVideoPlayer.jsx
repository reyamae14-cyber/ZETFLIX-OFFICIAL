import { useEffect, useRef, useState } from "react"
import { Box } from "@mui/material"
import { useSelector } from "react-redux"
import userApi from "../../api/modules/user.api"

const CustomVideoPlayer = ({ 
  mediaType, 
  mediaId, 
  seasonNumber, 
  episodeNumber, 
  fullScreen = false,
  mediaTitle,
  mediaPoster 
}) => {
  const iframeRef = useRef()
  const { user } = useSelector((state) => state.user)
  const [watchStartTime, setWatchStartTime] = useState(null)
  const [totalWatchTime, setTotalWatchTime] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [lastActiveTime, setLastActiveTime] = useState(Date.now())

  useEffect(() => {
    if (iframeRef.current && !fullScreen) {
      const height = iframeRef.current.offsetWidth * 9 / 16 + "px"
      iframeRef.current.setAttribute("height", height)
    }
  }, [mediaType, mediaId, seasonNumber, episodeNumber, fullScreen])

  // Watch time tracking
  useEffect(() => {
    if (!user) return

    // Start tracking when component mounts
    setWatchStartTime(Date.now())
    setLastActiveTime(Date.now())

    // Page visibility change handler
    const handleVisibilityChange = () => {
      const now = Date.now()
      if (document.hidden) {
        // Page became hidden, add time to total
        if (isVisible && lastActiveTime) {
          setTotalWatchTime(prev => prev + (now - lastActiveTime))
        }
        setIsVisible(false)
      } else {
        // Page became visible, reset timer
        setIsVisible(true)
        setLastActiveTime(now)
      }
    }

    // Mouse/keyboard activity handler
    const handleActivity = () => {
      setLastActiveTime(Date.now())
    }

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('mousemove', handleActivity)
    document.addEventListener('keydown', handleActivity)
    document.addEventListener('click', handleActivity)

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('mousemove', handleActivity)
      document.removeEventListener('keydown', handleActivity)
      document.removeEventListener('click', handleActivity)

      // Save watch time when component unmounts
      const now = Date.now()
      let finalWatchTime = totalWatchTime
      if (isVisible && lastActiveTime) {
        finalWatchTime += (now - lastActiveTime)
      }

      if (finalWatchTime > 5000) { // Only save if watched for more than 5 seconds
        saveWatchProgress(finalWatchTime)
      }
    }
  }, [user, mediaType, mediaId, seasonNumber, episodeNumber, mediaTitle, mediaPoster])

  // Save watch progress to backend
  const saveWatchProgress = async (watchTimeMs) => {
    try {
      const watchData = {
        mediaId: mediaId.toString(),
        mediaType,
        mediaTitle: mediaTitle || `${mediaType} ${mediaId}`,
        mediaPoster: mediaPoster || '',
        seasonNumber: mediaType === 'tv' ? seasonNumber : null,
        episodeNumber: mediaType === 'tv' ? episodeNumber : null,
        watchDuration: Math.floor(watchTimeMs / 1000) // Convert to seconds
      }

      await userApi.addToWatchHistory(watchData)
    } catch (error) {
      console.error('Error saving watch progress:', error)
    }
  }

  // Periodic save (every 30 seconds)
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      const now = Date.now()
      let currentWatchTime = totalWatchTime
      if (isVisible && lastActiveTime) {
        currentWatchTime += (now - lastActiveTime)
        setTotalWatchTime(currentWatchTime)
        setLastActiveTime(now)
      }

      if (currentWatchTime > 30000) { // Save every 30 seconds
        saveWatchProgress(currentWatchTime)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [user, totalWatchTime, isVisible, lastActiveTime])

  const getVideoUrl = () => {
    const baseUrl = "https://spectrum-api.vercel.app/"
    
    if (mediaType === "movie") {
      return `${baseUrl}/movie/${mediaId}`
    } else if (mediaType === "tv" && seasonNumber && episodeNumber) {
      return `${baseUrl}/tv/${mediaId}/${seasonNumber}/${episodeNumber}`
    }
    return null
  }

  const videoUrl = getVideoUrl()

  if (!videoUrl) {
    return (
      <Box sx={{ 
        height: "max-content", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "300px",
        backgroundColor: "#000",
        color: "#fff"
      }}>
        <span style={{ textAlign: "center" }}>Video not available for this content</span>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      height: fullScreen ? "100%" : "max-content", 
      width: "100%",
      position: fullScreen ? "absolute" : "relative",
      top: fullScreen ? 0 : "auto",
      left: fullScreen ? 0 : "auto",
      right: fullScreen ? 0 : "auto",
      bottom: fullScreen ? 0 : "auto"
    }}>
      <iframe
        src={videoUrl}
        ref={iframeRef}
        width="100%"
        height="100%"
        title={`${mediaType}-${mediaId}`}
        style={{ 
          border: 0,
          minHeight: fullScreen ? "100%" : "400px",
          height: fullScreen ? "100%" : undefined,
          width: "100%",
          display: "block"
        }}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </Box>
  )
}

export default CustomVideoPlayer
