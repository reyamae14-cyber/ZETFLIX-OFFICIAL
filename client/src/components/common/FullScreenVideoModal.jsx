import React from "react"
import { Box, IconButton, Modal, useTheme } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CustomVideoPlayer from "./CustomVideoPlayer"

const FullScreenVideoModal = ({ 
  open, 
  onClose, 
  mediaType, 
  mediaId, 
  seasonNumber, 
  episodeNumber,
  mediaTitle,
  mediaPoster
}) => {
  const theme = useTheme()

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none'
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: { xs: 8, md: 16 },
            right: { xs: 8, md: 16 },
            zIndex: 10002,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              transform: 'scale(1.1)'
            },
            width: { xs: 40, md: 48 },
            height: { xs: 40, md: 48 },
            transition: 'all 0.2s ease'
          }}
        >
          <CloseIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
        </IconButton>

        {/* Video Player Container */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <CustomVideoPlayer 
            mediaType={mediaType}
            mediaId={mediaId}
            seasonNumber={mediaType === "tv" ? seasonNumber : null}
            episodeNumber={mediaType === "tv" ? episodeNumber : null}
            mediaTitle={mediaTitle}
            mediaPoster={mediaPoster}
            fullScreen={true}
          />
        </Box>


      </Box>
    </Modal>
  )
}

export default FullScreenVideoModal