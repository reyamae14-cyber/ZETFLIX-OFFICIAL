import { useEffect, useState, useMemo } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

import { LoadingButton } from "@mui/lab"
import { Box, Stack, Typography } from "@mui/material"

import mediaApi from "../api/modules/media.api"

import CategoryToggle from "../components/common/CategoryToggle"
import HeroSlide from "../components/common/HeroSlide"
import MediaGrid from "../components/common/MediaGrid"

import tmdbConfigs from "../api/configs/tmdb.configs"
import uiConfigs from "../configs/ui.configs"

import usePrevious from "../hooks/usePrevious"

import { setAppState } from "../redux/features/appStateSlice"
import { setGlobalLoading } from "../redux/features/globalLoadingSlice"

const MediaList = () => {
  const dispatch = useDispatch()

  const { mediaType } = useParams()

  const [currCategory, setCurrCategory] = useState(0)
  const [currPage, setCurrPage] = useState(1)
  const [medias, setMedias] = useState([])
  const [mediaLoading, setMediaLoading] = useState(false)

  const prevMediaType = usePrevious(mediaType)

  const movieCategories = useMemo(() => ["popular", "top_rated", "now_playing", "upcoming"], [])
  const tvCategories = useMemo(() => ["popular", "top_rated", "on_the_air", "airing_today"], [])

  useEffect(() => {
    dispatch(setAppState(mediaType))
    window.scrollTo(0, 0)
  }, [mediaType, currCategory, dispatch])

  useEffect(() => {
    const getMedias = async () => {
      if (currPage === 1) dispatch(setGlobalLoading(true))
      setMediaLoading(true)

      const { response, err } = await mediaApi.getList({
        mediaType,
        mediaCategory: mediaType === tmdbConfigs.mediaType.movie ? movieCategories[currCategory] : tvCategories[currCategory],
        page: currPage
      })

      setMediaLoading(false)
      dispatch(setGlobalLoading(false))

      if (err) toast.error(err.message)
      if (response) {
        if (currPage !== 1) setMedias(m => [...m, ...(response.results || [])])
        else setMedias([...(response.results || [])])
      }
    }

    if (mediaType !== prevMediaType) {
      setCurrCategory(0)
      setCurrPage(1)
    }

    getMedias()
  }, [
    mediaType,
    currCategory,
    prevMediaType,
    currPage,
    movieCategories,
    tvCategories,
    dispatch
  ])

  const onCategoryChange = (categoryIndex) => {
    if (currCategory === categoryIndex) return
    setMedias([])
    setCurrPage(1)
    setCurrCategory(categoryIndex)
  }

  const onLoadMore = () => setCurrPage(currPage + 1)

  return (
    <>
      <HeroSlide mediaType={mediaType} mediaCategory={mediaType === tmdbConfigs.mediaType.movie ? movieCategories[currCategory] : tvCategories[currCategory]} />
      <Box sx={{ ...uiConfigs.style.mainContent, mb: 2 }}>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 4
          }}
        >
          <Typography fontWeight="700" variant="h5">
            {mediaType === tmdbConfigs.mediaType.movie ? "Movies" : "TV Series"}
          </Typography>
          <CategoryToggle mediaType={mediaType} currCategory={currCategory} onCategoryChange={onCategoryChange} />
        </Stack>
        <MediaGrid medias={medias} mediaType={mediaType} />
        <LoadingButton
          sx={{ mt: { xs: 2, lg: 3 } }}
          fullWidth
          color="primary"
          loading={mediaLoading}
          onClick={onLoadMore}
        >
          load more
        </LoadingButton>
      </Box>
    </>
  )
}

export default MediaList