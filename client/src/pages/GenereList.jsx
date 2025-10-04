import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"

import { LoadingButton } from "@mui/lab"
import { Box, Button, ButtonGroup, Stack, Toolbar } from "@mui/material"

import genreApi from "../api/modules/genre.api"

import GenresSelect from "../components/common/GenresSelect"
import MediaGrid from "../components/common/MediaGrid"
import SortMethodSelect from "../components/common/SortMethodSelect"

import uiConfigs from "../configs/ui.configs"
import tmdbConfigs from "../api/configs/tmdb.configs"

import { themeModes } from "../configs/theme.configs"

import usePrevious from "../hooks/usePrevious"

import { setGlobalLoading } from "../redux/features/globalLoadingSlice"

const sortMethods = [
  "original_title.asc",
  "original_title.desc",
  "popularity.asc",
  "popularity.desc",
  "revenue.asc",
  "revenue.desc",
  "primary_release_date.asc",
  "primary_release_date.desc",
  "title.asc",
  "title.desc",
  "vote_count.asc",
  "vote_count.desc",
]

const GenereList = () => {
  const dispatch = useDispatch()

  const { genres } = useSelector((state) => state.genres)

  const [currPage, setCurrPage] = useState(1)
  const [medias, setMedias] = useState([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaType, setMediaType] = useState(tmdbConfigs.mediaType.movie)
  const [selectedGenre, setSelectedGenre] = useState(0)
  const [sortMethod, setSortMethod] = useState(3)

  const prevGenre = usePrevious(selectedGenre)
  const prevMediaType = usePrevious(mediaType)
  const prevSortMethod = usePrevious(sortMethod)

  const onLoadMore = () => setCurrPage(currPage + 1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [mediaType, selectedGenre, sortMethod])

  useEffect(() => {
    if (mediaType !== prevMediaType) {
      setSelectedGenre(0)
      setMedias([])
      setSortMethod(3)
      setCurrPage(1)
    }
  }, [mediaType])

  useEffect(() => {
    if (selectedGenre !== prevGenre) {
      setMedias([])
      setCurrPage(1)
    }
  }, [selectedGenre])

  useEffect(() => {
    if (sortMethod !== prevSortMethod) {
      setMedias([])
      setCurrPage(1)
    }
  }, [sortMethod])

  useEffect(() => {
    const getMedias = async () => {
      if (currPage === 1) dispatch(setGlobalLoading(true))
      setMediaLoading(true)

      const { response, err } = await genreApi.getMediasList({
        mediaType,
        genre: genres[mediaType][selectedGenre]?.id,
        sort_by: sortMethods[sortMethod],
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

    getMedias()
  }, [
    mediaType,
    selectedGenre,
    sortMethod,
    prevMediaType,
    prevGenre,
    prevSortMethod,
    currPage,
    dispatch
  ])

  return (
    <>
      <Toolbar />
      <Box
        sx={{
          p: 2,
          px: { xs: 2, lg: 12 },
          position: "fixed",
          top: { xs: 72, sm: 80 }, // Increased top spacing for better separation from header
          width: "100%",
          zIndex: 100,
          backgroundColor: "#000000"
        }}
      >
        <Stack alignItems="center" justifyContent="space-between" sx={{ flexDirection: { xs: "column", sm: "row" }, width: "100%" }}>
          <ButtonGroup
            sx={{ mb: { xs: 3, sm: 0 }, width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              fullWidth
              size="large"
              variant={mediaType === tmdbConfigs.mediaType.movie ? "contained" : "text"}
              sx={{
                color: mediaType === tmdbConfigs.mediaType.movie ? "primary.contrastText" : "text.primary",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)"
                }
              }}
              onClick={() => setMediaType(tmdbConfigs.mediaType.movie)}
            >
              {tmdbConfigs.mediaType.movie}
            </Button>
            <Button
              fullWidth
              size="large"
              variant={mediaType === tmdbConfigs.mediaType.tv ? "contained" : "text"}
              sx={{
                color: mediaType === tmdbConfigs.mediaType.tv ? "primary.contrastText" : "text.primary",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)"
                }
              }}
              onClick={() => setMediaType(tmdbConfigs.mediaType.tv)}
            >
              {tmdbConfigs.mediaType.tv}
            </Button>
          </ButtonGroup>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2} sx={{ flexGrow: 1, width: { xs: "100%", sm: "auto" } }}>
            <GenresSelect mediaType={mediaType} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
            <SortMethodSelect sortMethod={sortMethod} setSortMethod={setSortMethod} />
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ ...uiConfigs.style.mainContent, mb: 2 }}>
        <Box
          sx={{
            mt: { xs: 36, sm: 28, md: 26 }
          }}
        >
          <MediaGrid medias={medias} mediaType={mediaType} />
          {
            medias.length !== 0 && (
              <LoadingButton
                sx={{ mt: { xs: 2, lg: 3 } }}
                fullWidth
                color="primary"
                loading={mediaLoading}
                onClick={onLoadMore}
              >
                Load more
              </LoadingButton>
            )
          }
        </Box>
      </Box>
    </>
  )
}

export default GenereList
