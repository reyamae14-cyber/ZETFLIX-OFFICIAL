import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { ListItemButton, ListItemIcon, ListItemText, Menu, Typography, Stack } from "@mui/material"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"

import TextAvatar from "./TextAvatar"
import LogoutGreeting from "./LogoutGreeting"

import menuConfigs from "../../configs/menu.configs"

import { setUser } from "../../redux/features/userSlice"

const UserMenu = () => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const [userProfile, setUserProfile] = useState(user)

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const updatedUser = event.detail.user
      console.log('UserMenu: Profile update received', updatedUser)
      setUserProfile(updatedUser)
      dispatch(setUser(updatedUser))
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [dispatch])

  // Update local state when user changes
  useEffect(() => {
    setUserProfile(user)
  }, [user])

  const [anchorEl, setAnchorEl] = useState(null)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const toggleMenu = (e) => setAnchorEl(e.currentTarget)

  const handleLogoutClick = () => {
    setAnchorEl(null)
    setLogoutDialogOpen(true)
  }

  const handleConfirmLogout = () => {
    // Dispatch logout event for greeting management
    window.dispatchEvent(new CustomEvent('userLogout'))
    
    dispatch(setUser(null))
    setLogoutDialogOpen(false)
  }

  const capitalize = (name) => {
    return name[0].toUpperCase() + name.slice(1)
  }

  return (
    <>
      {
        userProfile && (
          <>
            <Typography
              variant="body2"
              sx={{ 
                cursor: "pointer", 
                userSelect: "none",
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }
              }}
              onClick={toggleMenu}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <TextAvatar 
                  key={`avatar-${userProfile.profileImage || 'default'}-${userProfile.displayName}`}
                  text={userProfile.displayName} 
                  src={userProfile.profileImage}
                />
                {capitalize(userProfile.displayName)}
              </Stack>
            </Typography>
            <Menu
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 4.5, // Increased margin top to move menu further down
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }
              }}
            >
              {
                menuConfigs.user.map((item, index) => (
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    key={index}
                    onClick={() => setAnchorEl(null)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText disableTypography primary={
                      <Typography textTransform="uppercase">{item.display}</Typography>
                    } />
                  </ListItemButton>
                ))
              }
              <ListItemButton
                sx={{ borderRadius: "10px" }}
                onClick={handleLogoutClick}
              >
                <ListItemIcon><LogoutOutlinedIcon /></ListItemIcon>
                <ListItemText disableTypography primary={
                  <Typography textTransform="uppercase">sign out</Typography>
                } />
              </ListItemButton>
            </Menu>
          </>
        )
      }
      
      <LogoutGreeting
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        user={user}
        onConfirmLogout={handleConfirmLogout}
      />
    </>
  )
}

export default UserMenu