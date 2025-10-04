import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"

import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import userApi from "../../api/modules/user.api"
import favoriteApi from "../../api/modules/favorite.api"
import genreApi from "../../api/modules/genre.api"

import AuthModal from "../common/AuthModal"
import Footer from "../common/Footer"
import GlobalLoading from "../common/GlobalLoading"
import Topbar from "../common/Topbar"

import { setgenres } from "../../redux/features/genresSlice"
import { setGlobalLoading } from "../../redux/features/globalLoadingSlice"
import { setListFavorites, setUser } from "../../redux/features/userSlice"

const MainLayout = () => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const location = useLocation();

  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await userApi.getInfo()

      if (response) dispatch(setUser(response))
      if (err) dispatch(setUser(null))
    }

    const getGenres = async () => {
      dispatch(setGlobalLoading(true))
      const { response, err } = await genreApi.getList()

      if (response) dispatch(setgenres(response))
      if (err) {
        toast.error(err.message)
        setGlobalLoading(false)
      }
    }

    authUser()
    getGenres()
  }, [dispatch])

  useEffect(() => {
    const getFavorites = async () => {
      const { response, err } = await favoriteApi.getList()

      if (response) dispatch(setListFavorites(response))
      if (err) toast.error(err.message)
    }

    if (user) getFavorites()
    if (!user) dispatch(setListFavorites([]))
  }, [user, dispatch])

  return (
    <>
      {/* global loading */}
      <GlobalLoading />
      {/* global loading */}

      {/* login modal */}
      <AuthModal />
      {/* login modal */}

      <Box display="flex" minHeight="100vh">
        {/* header */}
        <Topbar />
        {/* header */}

        {/* main */}
        <Box
          component="main"
          flexGrow={1}
          overflow="auto"
          minHeight="100vh"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeInOut",
                exit: { duration: 0.3 }
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
        {/* main */}
      </Box>

      {/* footer */}
      <Footer />
      {/* footer */}
    </>
  )
}

export default MainLayout