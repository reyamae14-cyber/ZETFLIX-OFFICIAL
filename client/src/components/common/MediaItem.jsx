import { useEffect, useState, memo, useMemo } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { Box, Button, Stack, Typography } from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"

import FavoriteIcon from "@mui/icons-material/Favorite"
import CircularRate from "./CircularRate"
import LazyImage from "./LazyImage"

import tmdbConfigs from "../../api/configs/tmdb.configs"
import uiConfigs from "../../configs/ui.configs"

import { routesGen } from "../../routes/routes"

import favoriteUtils from "../../utils/favorite.utils"

const MediaItem = memo(({ media, mediaType }) => {
  const { listFavorites } = useSelector((state) => state.user)

  // Memoize computed values to prevent unnecessary recalculations
  const { title, posterPath, releaseDate, rate } = useMemo(() => {
    const computedTitle = media.title || media.name || media.mediaTitle
    const computedPosterPath = tmdbConfigs.posterPath(
      media.poster_path || media.backdrop_path || media.mediaPoster || media.profile_path
    )
    
    let computedReleaseDate = null
    if (mediaType === tmdbConfigs.mediaType.movie) {
      computedReleaseDate = media.release_date && media.release_date.split("-")[0]
    } else {
      computedReleaseDate = media.first_air_date && media.first_air_date.split("-")[0]
    }
    
    const computedRate = media.vote_average || media.mediaRate
    
    return {
      title: computedTitle,
      posterPath: computedPosterPath,
      releaseDate: computedReleaseDate,
      rate: computedRate
    }
  }, [media, mediaType])

  // Memoize favorite check to prevent unnecessary recalculations
  const isFavorite = useMemo(() => {
    return favoriteUtils.check({ listFavorites, mediaId: media.id })
  }, [listFavorites, media.id])

  return (
    <Link to={mediaType !== "people" ? routesGen.mediaDetail(mediaType, media.mediaId || media.id) : routesGen.person(media.id)}>
      <Box sx={{
        pt: "160%",
        position: "relative",
        overflow: "hidden",
        "&:hover .media-info": { opacity: 1, bottom: 0 },
        "&:hover .media-back-drop, &:hover .media-play-btn": { opacity: 1 },
        color: "primary.contrastText",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)"
        }
      }}>
        <LazyImage
          src={posterPath}
          alt={title}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
        {/* movie or tv item */}
        {
          mediaType !== "people" && (
            <>
              {
                isFavorite && (
                  <FavoriteIcon
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      fontSize: "2rem",
                      zIndex: 2
                    }}
                  />
                )
              }
              <Box className="media-back-drop" sx={{
                opacity: { xs: 1, md: 0 },
                transition: "all 0.3s ease",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
              }} />
              <Button
                className="media-play-btn"
                variant="contained"
                startIcon={<PlayArrowIcon />}
                sx={{
                  display: { xs: "none", md: "flex" },
                  opacity: 0,
                  transition: "all 0.3s ease",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  "& .MuiButton-startIcon": { mr: "-4px" }
                }}
              />
              <Box
                className="media-info"
                sx={{
                  transition: "all 0.3s ease",
                  opacity: { xs: 1, md: 0 },
                  position: "absolute",
                  bottom: { xs: 0, md: "-20px" },
                  width: "100%",
                  height: "max-content",
                  boxSizing: "border-box",
                  p: { xs: "10px", md: "2rem 1rem" }
                }}
              >
                <Stack spacing={{ xs: 1, md: 2 }}>
                  {rate && <CircularRate value={rate} />}

                  <Typography>{releaseDate}</Typography>

                  <Typography
                    variant="body1"
                    fontWeight="700"
                    sx={{
                      fontSize: "1rem",
                      ...uiConfigs.style.typoLines(1, "left")
                    }}
                  >
                    {title}
                  </Typography>
                </Stack>
              </Box>
            </>
          )
        }
        {/* movie or tv item */}

        {/* people */}
        {
          mediaType === "people" && (
            <Box sx={{
              position: "absolute",
              width: "100%",
              height: "max-content",
              bottom: 0,
              p: "10px",
              backgroundColor: "rgba(0,0,0,0.6)"
            }}>
              <Typography sx={{ ...uiConfigs.style.typoLines(1, "left") }}>
                {media.name}
              </Typography>
            </Box>
          )
        }
        {/* people */}
      </Box>
    </Link>
  )
})

MediaItem.displayName = 'MediaItem'

export default MediaItem