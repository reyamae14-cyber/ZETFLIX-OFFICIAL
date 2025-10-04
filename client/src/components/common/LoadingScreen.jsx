import React from 'react';
import { Box, CircularProgress, keyframes } from '@mui/material';

// Logo 3D animation for Netflix-like effect
const logo3D = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0deg) scale(1);
    filter: drop-shadow(0 0 10px #E50914);
    opacity: 0.8;
  }
  50% {
    transform: perspective(1000px) rotateY(15deg) scale(1.2);
    filter: drop-shadow(0 0 20px #E50914);
    opacity: 1;
  }
  100% {
    transform: perspective(1000px) rotateY(0deg) scale(1);
    filter: drop-shadow(0 0 10px #E50914);
    opacity: 0.8;
  }
`;

// Loading spinner rotation
const spinnerRotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingScreen = ({ message = "Loading..." }) => {
  // Force white logo for black background
  const logoSrc = '/zetflix-white.svg';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Logo with 3D pulse animation */}
      <Box
        component="img"
        src={logoSrc}
        alt="ZetFlix"
        sx={{
          width: { xs: 200, sm: 300, md: 400 },
          height: 'auto',
          mb: 4,
          animation: `${logo3D} 2s ease-in-out infinite`,
        }}
      />
      
      {/* Custom loading spinner */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress
          size={60}
          thickness={3}
          sx={{
            color: '#E50914',
            animation: `${spinnerRotate} 1s linear infinite`,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        
        {/* Inner loading dots */}
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            gap: 0.5,
          }}
        >
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: '#E50914',
                animation: `${logo3D} 1.5s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Loading text */}
      <Box
        sx={{
          mt: 3,
          color: '#ffffff',
          fontSize: '0.9rem',
          fontWeight: 500,
          letterSpacing: '0.5px',
          opacity: 0.8
        }}
      >
        {message}
      </Box>
    </Box>
  );
};

export default LoadingScreen;