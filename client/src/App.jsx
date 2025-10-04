import { Suspense, useEffect, useState, useCallback, memo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { setUser, setListFavorites } from "./redux/features/userSlice"
import { setGlobalLoading } from "./redux/features/globalLoadingSlice"
import userApi from "./api/modules/user.api"
import favoriteApi from "./api/modules/favorite.api"
import WelcomeGreeting from "./components/common/WelcomeGreeting"

import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

import PageWrapper from "./components/common/PageWrapper"
import MainLayout from "./components/layout/MainLayout"

import themeConfigs from "./configs/theme.configs"

import routes from "./routes/routes"

import "react-toastify/dist/ReactToastify.css"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./styles/responsive.css"

const App = memo(() => {
  const { themeMode } = useSelector((state) => state.themeMode)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [showGreeting, setShowGreeting] = useState(false)

  const handleGreetingClose = useCallback(() => {
    setShowGreeting(false)
    // Mark greeting as shown for this session
    sessionStorage.setItem('greetingShown', 'true')
  }, [])

  const handleGreetingComplete = useCallback((updatedUser) => {
    dispatch(setUser(updatedUser))
    setShowGreeting(false)
    // Mark greeting as shown for this session
    sessionStorage.setItem('greetingShown', 'true')
  }, [dispatch])

  useEffect(() => {
    const loadInitialData = async () => {
      dispatch(setGlobalLoading(true))

      try {
        // Load user info
        const { response: userResponse, err: userErr } = await userApi.getInfo()
        if (userResponse) {
          dispatch(setUser(userResponse))
          
          // Only show greeting if it hasn't been shown in this session
          const greetingShown = sessionStorage.getItem('greetingShown')
          if (!greetingShown && (userResponse.shouldShowFirstTimeGreeting || userResponse.isFirstLogin)) {
            setShowGreeting(true)
          }
        }
        if (userErr) dispatch(setUser(null))

        // Load favorites
        const { response: favResponse, err: favErr } = await favoriteApi.getList()
        if (favResponse) dispatch(setListFavorites(favResponse))
        if (favErr) console.log(favErr)

      } finally {
        dispatch(setGlobalLoading(false))
      }
    }

    loadInitialData()
  }, [dispatch])

  // Listen for login events to show greeting
  useEffect(() => {
    const handleLoginSuccess = (event) => {
      const userData = event.detail
      if (userData && (userData.shouldShowFirstTimeGreeting || userData.isFirstLogin)) {
        // Clear session storage and show greeting for new login
        sessionStorage.removeItem('greetingShown')
        setShowGreeting(true)
      }
    }

    const handleLogout = () => {
      // Clear session storage on logout
      sessionStorage.removeItem('greetingShown')
    }

    window.addEventListener('loginSuccess', handleLoginSuccess)
    window.addEventListener('userLogout', handleLogout)

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess)
      window.removeEventListener('userLogout', handleLogout)
    }
  }, [])

  return (
    <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}>
      {/* config toastify */}
      <ToastContainer
        position="bottom-left"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme={themeMode}
      />
      {/* mui reset css */}
      <CssBaseline />

      {/* app routes */}
      <BrowserRouter>
        <Suspense>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {
                routes?.map((route, index) => (
                  route.index ? (
                    <Route
                      index
                      key={index}
                      element={route.state ? (
                        <PageWrapper state={route.state}>{route.element}</PageWrapper>
                      ) : route.element}
                    />
                  ) : (
                    <Route
                      path={route.path}
                      key={index}
                      element={route.state ? (
                        <PageWrapper state={route.state}>{route.element}</PageWrapper>
                      ) : route.element}
                    />
                  )
                ))
              }
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      {/* app routes */}

      {/* Welcome Greeting Dialog */}
      {showGreeting && user && (
        <WelcomeGreeting 
          open={showGreeting}
          user={user} 
          onClose={handleGreetingClose}
          onComplete={handleGreetingComplete}
        />
      )}
    </ThemeProvider>
  )
})

App.displayName = 'App'

export default App