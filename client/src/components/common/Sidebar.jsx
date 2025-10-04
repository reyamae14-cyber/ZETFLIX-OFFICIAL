import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from "@mui/material"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined"

import Logo from "./Logo"

import menuConfigs from "../../configs/menu.configs"
import uiConfigs from "../../configs/ui.configs"
import { themeModes } from "../../configs/theme.configs"

import { setThemeMode } from "../../redux/features/themeModeSlice"

const Sidebar = ({ open, toggleSidebar }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const { appState } = useSelector((state) => state.appState)
  const { themeMode } = useSelector((state) => state.themeMode)

  const sidebarWidth = uiConfigs.size.sidebarWith

  const onSwitchTheme = () => {
    const theme = themeMode === themeModes.dark ? themeModes.light : themeModes.dark
    dispatch(setThemeMode(theme))
  }

  const drawer = (
    <>
      <Toolbar sx={{ 
        py: { xs: "15px", sm: "20px" }, 
        color: "text.primary",
        minHeight: { xs: '56px', sm: '64px' }
      }}>
        <Stack width="100%" direction="row" justifyContent="center" alignItems="center">
          <Logo variant="sidebar" />
        </Stack>
      </Toolbar>
      <List sx={{ px: "30px" }}>
        <Typography variant="h6" mb="20px">MENU</Typography>
        {
          menuConfigs.main.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{
                borderRadius: "10px",
                my: 1,
                backgroundColor: appState.includes(item.state) ? "primary.main" : "unset"
              }}
              component={Link}
              to={item.path}
              onClick={() => toggleSidebar(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText disableTypography primary={<Typography textTransform="uppercase">
                {item.display}
              </Typography>} />
            </ListItemButton>
          ))
        }

        {
          user && (<>
            <Typography variant="h6" mb="20px">PERSONAL</Typography>
            {
              menuConfigs.user.map((item, index) => (
                <ListItemButton
                  key={index}
                  sx={{
                    borderRadius: "10px",
                    my: 1,
                    backgroundColor: appState.includes(item.state) ? "primary.main" : "unset"
                  }}
                  component={Link}
                  to={item.path}
                  onClick={() => toggleSidebar(false)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText disableTypography primary={<Typography textTransform="uppercase">
                    {item.display}
                  </Typography>} />
                </ListItemButton>
              ))
            }
          </>)
        }

        <Typography variant="h6" mb="20px">THEME</Typography>
        <ListItemButton onClick={onSwitchTheme}>
          <ListItemIcon>
            {themeMode === themeModes.dark && <DarkModeOutlinedIcon />}
            {themeMode === themeModes.light && <WbSunnyOutlinedIcon />}
          </ListItemIcon>
          <ListItemText disableTypography primary={
            <Typography textTransform="uppercase">
              {themeMode === themeModes.dark ? "dark mode" : "light mode"}
            </Typography>
          } />
        </ListItemButton>
      </List>
    </>
  )

  return (
    <Drawer
      open={open}
      onClose={() => toggleSidebar(false)}
      sx={{
        "& .MuiDrawer-Paper": {
          boxSizing: "border-box",
          width: { 
            xs: "280px", 
            sm: "300px", 
            md: sidebarWidth 
          },
          maxWidth: { xs: "85vw", sm: "90vw" },
          borderRight: "0px",
          // Improve mobile experience
          borderRadius: { xs: "0 16px 16px 0", sm: "0 20px 20px 0", md: "0" },
          
          // Ensure proper z-index for mobile
          zIndex: { xs: 1300, md: 1200 },
          backgroundColor: '#000000' // Set to black as requested
        },
        "& .MuiBackdrop-root": {
          // Reduce backdrop opacity on mobile for better UX
          backgroundColor: { xs: "rgba(0, 0, 0, 0.3)", md: "rgba(0, 0, 0, 0.5)" }
        }
      }}
      // Use temporary variant for better UX
      variant="temporary"
      // Improve mobile swipe gesture
      disableSwipeToOpen={false}
      swipeAreaWidth={20}
    >
      {drawer}
    </Drawer>
  )
}

export default Sidebar