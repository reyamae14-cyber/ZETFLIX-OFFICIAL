import { memo } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingSpinner = memo(({ message = 'Loading...', size = 40, color = 'primary' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2
      }}
    >
      <CircularProgress size={size} color={color} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner