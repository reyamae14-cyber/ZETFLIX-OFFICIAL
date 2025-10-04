import { Paper, Stack, Box, Typography, Divider, IconButton } from "@mui/material"
import EmailIcon from '@mui/icons-material/Email'
import FacebookIcon from '@mui/icons-material/Facebook'

import Logo from "./Logo"

const Footer = () => {
  return (
    <Paper square={true} sx={{ backgroundImage: "unset", padding: "2rem" }}>
      {/* Logo positioned in specified area - smaller size */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        mb: 3,
        mt: 1
      }}>
        <Box sx={{ 
          maxWidth: { xs: "120px", sm: "140px", md: "160px" },
          width: "auto"
        }}>
          <Logo variant="footer" />
        </Box>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Legal Section - Center */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontWeight: "bold", 
            mb: 2,
            fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            letterSpacing: "0.5px",
            fontSize: "0.95rem"
          }}
        >
          LEGAL
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            maxWidth: "600px",
            margin: "0 auto",
            fontFamily: "'Inter', 'Roboto', sans-serif",
            lineHeight: 1.6,
            fontSize: "0.875rem"
          }}
        >
          This platform serves as a content aggregator and does not host any media files directly. All content is streamed through trusted third-party services while maintaining the highest standards of user privacy and security.
        </Typography>
      </Box>
      
      {/* Contact Section - Center */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontWeight: "bold",
            mb: 2,
            fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            letterSpacing: "0.5px",
            fontSize: "0.95rem"
          }}
        >
          CONTACT US
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          <IconButton
            onClick={() => window.open('mailto:zeticuz.samxerz@gmail.com', '_blank')}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <EmailIcon />
          </IconButton>
          <IconButton
            onClick={() => window.open('https://www.facebook.com/people/Zetflix/61578123735793/', '_blank')}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: '#1877F2',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <FacebookIcon />
          </IconButton>
        </Stack>
      </Box>
      
      {/* Copyright - Bottom Center */}
      <Box sx={{ textAlign: "center", pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontFamily: "'Inter', 'Roboto', sans-serif",
            fontWeight: "500",
            fontSize: "0.875rem",
            letterSpacing: "0.3px"
          }}
        >
          © 2025 ZETICUZ. All rights reserved.
        </Typography>
      </Box>
    </Paper>
  )
}

export default Footer