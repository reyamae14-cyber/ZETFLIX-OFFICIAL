import React, { useState } from "react"
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Card, 
  CardContent,
  Grid,
  Button
} from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import tmdbConfigs from "../../api/configs/tmdb.configs"

const TVSeasonSelector = ({ 
  seasons, 
  onEpisodeSelect, 
  onEpisodePlay,
  currentSeason = 1, 
  currentEpisode = 1, 
  compact = false,
  showEpisodeList = false 
}) => {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason)
  const [selectedEpisode, setSelectedEpisode] = useState(currentEpisode)

  const handleSeasonChange = (event) => {
    const seasonNum = event.target.value
    setSelectedSeason(seasonNum)
    setSelectedEpisode(1) // Reset to first episode when season changes
    if (onEpisodeSelect) {
      onEpisodeSelect(seasonNum, 1)
    }
  }

  const handleEpisodeChange = (event) => {
    const episodeNum = event.target.value
    setSelectedEpisode(episodeNum)
    if (onEpisodeSelect) {
      onEpisodeSelect(selectedSeason, episodeNum)
    }
  }

  const handleEpisodeClick = (seasonNum, episodeNum) => {
    setSelectedSeason(seasonNum)
    setSelectedEpisode(episodeNum)
    if (onEpisodeSelect) {
      onEpisodeSelect(seasonNum, episodeNum)
    }
  }

  const handleEpisodePlay = (seasonNum, episodeNum, event) => {
    event.stopPropagation()
    setSelectedSeason(seasonNum)
    setSelectedEpisode(episodeNum)
    if (onEpisodePlay) {
      onEpisodePlay(seasonNum, episodeNum)
    }
  }

  const currentSeasonData = seasons?.find((_, index) => index + 1 === selectedSeason)
  const currentEpisodeData = currentSeasonData?.episodes?.find((_, index) => index + 1 === selectedEpisode)

  return (
    <Box sx={{ mt: compact ? 0 : 3 }}>
      {/* Dropdown Selectors */}
      <Box sx={{ display: "flex", gap: 2, mb: compact ? 2 : 3, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: compact ? 150 : 200 }}>
          <InputLabel sx={{ color: compact ? "white" : "inherit" }}>Season</InputLabel>
          <Select
            value={selectedSeason}
            label="Season"
            onChange={handleSeasonChange}
            sx={{
              color: compact ? "white" : "inherit",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: compact ? "rgba(255,255,255,0.5)" : "inherit"
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: compact ? "white" : "inherit"
              },
              "& .MuiSvgIcon-root": {
                color: compact ? "white" : "inherit"
              }
            }}
          >
            {seasons?.map((season, index) => (
              <MenuItem key={index} value={index + 1}>
                {season.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: compact ? 150 : 200 }}>
          <InputLabel sx={{ color: compact ? "white" : "inherit" }}>Episode</InputLabel>
          <Select
            value={selectedEpisode}
            label="Episode"
            onChange={handleEpisodeChange}
            disabled={!currentSeasonData?.episodes}
            sx={{
              color: compact ? "white" : "inherit",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: compact ? "rgba(255,255,255,0.5)" : "inherit"
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: compact ? "white" : "inherit"
              },
              "& .MuiSvgIcon-root": {
                color: compact ? "white" : "inherit"
              }
            }}
          >
            {currentSeasonData?.episodes?.map((episode, index) => (
              <MenuItem key={index} value={index + 1}>
                Episode {index + 1}: {episode.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Current Episode Info - Compact version for modal */}
      {compact && currentEpisodeData && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
            S{selectedSeason}E{selectedEpisode}: {currentEpisodeData.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
            {currentEpisodeData.air_date}
          </Typography>
        </Box>
      )}

      {/* Full Episode Info - Regular version */}
      {!compact && currentEpisodeData && (
        <Card sx={{ mb: 3, backgroundColor: "background.paper" }}>
          <CardContent>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              {currentEpisodeData.still_path && (
                <Box
                  component="img"
                  src={tmdbConfigs.backdropPath(currentEpisodeData.still_path)}
                  alt={currentEpisodeData.name}
                  sx={{
                    width: 200,
                    height: 112,
                    objectFit: "cover",
                    borderRadius: 1,
                    flexShrink: 0
                  }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  S{selectedSeason}E{selectedEpisode}: {currentEpisodeData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Air Date: {currentEpisodeData.air_date}
                </Typography>
                <Typography variant="body2">
                  {currentEpisodeData.overview}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Episodes Grid - Show when showEpisodeList is true or in non-compact mode */}
      {(showEpisodeList || !compact) && currentSeasonData?.episodes && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentSeasonData?.name} Episodes
          </Typography>
          <Box 
            sx={{ 
              maxHeight: showEpisodeList ? 400 : "none",
              overflowY: showEpisodeList ? "auto" : "visible",
              pr: showEpisodeList ? 1 : 0,
              "&::-webkit-scrollbar": {
                width: "8px"
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "4px"
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.5)"
                }
              }
            }}
          >
            <Grid container spacing={2}>
              {currentSeasonData.episodes.map((episode, index) => (
                <Grid item xs={12} sm={6} md={showEpisodeList ? 6 : 4} key={index}>
                  <Card 
                    sx={{ 
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: selectedEpisode === index + 1 ? 2 : 0,
                      borderColor: "primary.main",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 4
                      }
                    }}
                    onClick={() => handleEpisodeClick(selectedSeason, index + 1)}
                  >
                    <Box sx={{ position: "relative" }}>
                      {episode.still_path ? (
                        <Box
                          component="img"
                          src={tmdbConfigs.backdropPath(episode.still_path)}
                          alt={episode.name}
                          sx={{
                            width: "100%",
                            height: showEpisodeList ? 120 : 140,
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: showEpisodeList ? 120 : 140,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No Image
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0,0,0,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.2s",
                          "&:hover": { opacity: 1 }
                        }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<PlayArrowIcon />}
                          size="small"
                          onClick={(e) => handleEpisodePlay(selectedSeason, index + 1, e)}
                          sx={{
                            backgroundColor: "primary.main",
                            "&:hover": {
                              backgroundColor: "primary.dark"
                            }
                          }}
                        >
                          Play
                        </Button>
                      </Box>
                    </Box>
                    <CardContent sx={{ p: showEpisodeList ? 1.5 : 2 }}>
                      <Typography variant="subtitle2" noWrap>
                        {index + 1}. {episode.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {episode.air_date}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: showEpisodeList ? 2 : 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: showEpisodeList ? "0.8rem" : "0.875rem"
                        }}
                      >
                        {episode.overview}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  )
}

export default TVSeasonSelector