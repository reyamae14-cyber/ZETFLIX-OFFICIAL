import { cloneElement, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"

import { AppBar, Box, Button, IconButton, Stack, Toolbar, useScrollTrigger, alpha } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined"

import Logo from "./Logo"
import UserMenu from "./UserMenu"
import Sidebar from "./Sidebar"

import menuConfigs from "../../configs/menu.configs"
import { themeModes } from "../../configs/theme.configs"

import { setAuthModalOpen } from "../../redux/features/authModalSlice"
import { setThemeMode } from "../../redux/features/themeModeSlice"

const ScrollAppBar = ({ children, window, appState }) => {
  const { themeMode } = useSelector((state) => state.themeMode)

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
    target: window ? window() : undefined
  })

  return cloneElement(children, {
    sx: {
      color: trigger ? "text.primary" : themeMode === themeModes.dark ? "primary.contrastText" : "text.primary",
      backgroundColor: trigger 
        ? alpha(themeMode === themeModes.dark ? "#000" : "#fff", 0.95)
        : themeMode === themeModes.dark ? "transparent" : alpha("#fff", 0.95),
      backdropFilter: trigger ? "blur(20px)" : "none",
      borderBottom: trigger ? `1px solid ${alpha("#fff", 0.1)}` : "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }
  })
}

const Topbar = () => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const { appState } = useSelector((state) => state.appState)
  const { themeMode } = useSelector((state) => state.themeMode)

  const [sidebarOpen, setSidebarOpen] = useState(false)


  const onSwithTheme = () => {
    const theme = themeMode === themeModes.dark ? themeModes.light : themeModes.dark
    dispatch(setThemeMode(theme))
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ScrollAppBar appState={appState}>
        <AppBar elevation={0} sx={{ zIndex: 100 }}>
          <Toolbar 
            sx={{ 
              alignItems: "center", 
              justifyContent: "space-between",
              minHeight: { xs: '56px', sm: '64px' },
              px: { xs: 1, sm: 2, md: 3 }
            }}
          >
            {/* Mobile Left Section */}
            <Stack 
              direction="row" 
              spacing={{ xs: 0.5, sm: 1 }} 
              alignItems="center"
              sx={{ 
                display: { xs: "flex", md: "none" },
                justifyContent: "flex-start",
                width: "auto"
              }}
            >
              <IconButton
                color="inherit"
                sx={{ 
                  mr: { xs: 0.5, sm: 1 },
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(themeMode === themeModes.dark ? "#fff" : "#000", 0.08),
                    transform: "scale(1.05)"
                  }
                }}
                onClick={toggleSidebar}
              >
                <MenuIcon />
              </IconButton>

              <Box sx={{ 
                display: "flex", 
                alignItems: "center",
                justifyContent: "flex-start"
              }}>
                <Logo variant="mobile" />
              </Box>
            </Stack>

            {/* Mobile Center Section - Removed theme toggle as it's in sidebar */}

            {/* Desktop Menu */}
            <Box 
              flexGrow={1} 
              alignItems="center" 
              display={{ xs: "none", md: "flex" }}
              sx={{ justifyContent: "flex-start" }}
            >
              <Box sx={{ mr: "80px" }}>
                <Logo />
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                {
                  menuConfigs.main.map((item, index) => (
                    <Button
                      key={index}
                      sx={{
                        color: appState.includes(item.state) ? "primary.main" : "inherit",
                        mr: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: "capitalize",
                        fontWeight: appState.includes(item.state) ? 600 : 500,
                        fontSize: "0.95rem",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          backgroundColor: alpha(themeMode === themeModes.dark ? "#fff" : "#000", 0.08),
                          transform: "translateY(-1px)"
                        },
                        "&:before": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          width: appState.includes(item.state) ? "80%" : "0%",
                          height: "2px",
                          backgroundColor: "primary.main",
                          transform: "translateX(-50%)",
                          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        },
                        "&:hover:before": {
                          width: "80%"
                        }
                      }}
                      component={Link}
                      to={item.path}
                      variant="text"
                    >
                      {item.display}
                    </Button>
                  ))
                }
              </Box>
              <IconButton
                sx={{ 
                  color: "inherit",
                  ml: 1
                }}
                onClick={onSwithTheme}
              >
                {themeMode === themeModes.dark && <DarkModeOutlinedIcon />}
                {themeMode === themeModes.light && <WbSunnyOutlinedIcon />}
              </IconButton>
            </Box>

            {/* User Menu Section */}
            <Stack 
              direction="row" 
              alignItems="center"
              sx={{
                display: { xs: "flex", md: "flex" },
                justifyContent: "flex-end",
                minWidth: { xs: 'auto', md: 'auto' }
              }}
            >
              {!user && (
                <Button
                  variant="contained"
                  onClick={() => dispatch(setAuthModalOpen(true))}
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.5, sm: 1 }
                  }}
                >
                  sign in
                </Button>
              )}
              
              {user && (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  ml: { xs: 0.5, sm: 1 }
                }}>
                  <UserMenu />
                </Box>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
      </ScrollAppBar>
    </>
  )
}

export default Topbar