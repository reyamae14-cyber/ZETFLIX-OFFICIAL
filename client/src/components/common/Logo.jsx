import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { themeModes } from '../../configs/theme.configs';

const Logo = ({ variant = 'default' }) => {
  const { themeMode } = useSelector((state) => state.themeMode);
  const isDarkMode = themeMode === themeModes.dark;
  
  // Define responsive sizing based on variant and screen size
  const getSizeStyles = () => {
    switch (variant) {
      case 'sidebar':
        return {
          height: { xs: '4.5rem', sm: '5rem', md: '5.5rem', lg: '6rem' },
          width: 'auto',
          maxWidth: { xs: '180px', sm: '200px', md: '220px', lg: '240px' },
          marginLeft: '3px'
        };
      case 'mobile':
        return {
          height: { xs: '4rem', sm: '4.5rem' },
          width: 'auto',
          maxWidth: { xs: '160px', sm: '180px' },
          marginLeft: '3px'
        };
      case 'footer':
        return {
          height: { xs: '3rem', sm: '3.5rem', md: '4rem' },
          width: 'auto',
          maxWidth: { xs: '120px', sm: '140px', md: '160px' },
          marginLeft: '0'
        };
      case 'tv':
        return {
          height: { xs: '6rem', sm: '7rem', md: '8rem', lg: '9rem' },
          width: 'auto',
          maxWidth: { xs: '260px', sm: '310px', md: '360px', lg: '410px' },
          marginLeft: '3px'
        };
      default:
        return {
          height: { xs: '4.5rem', sm: '5rem', md: '6rem', lg: '7rem' },
          width: 'auto',
          maxWidth: { xs: '180px', sm: '210px', md: '260px', lg: '310px' },
          marginLeft: '3px'
        };
    }
  };
  
  return (
    <Box
      component="img"
      src={isDarkMode ? "/zetflix-white.svg" : "/zetflix-black.svg"}
      alt="ZetFlix Logo"
      sx={{
        ...getSizeStyles(),
        objectFit: 'contain',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        // Ensure proper centering
        display: 'block',
        margin: '0 auto'
      }}
    />
  );
};

export default Logo;