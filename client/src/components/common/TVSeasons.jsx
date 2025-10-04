import React, { useEffect, useState } from "react"

import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Box, Divider, List, ListItem, Stack, Tab, Typography } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"

import tmdbConfigs from "../../api/configs/tmdb.configs"

const TVSeasons = ({ seasons }) => {
  const [value, setValue] = useState("0")
  const [isExpanded, setIsExpanded] = useState(true)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <TabContext value={value}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          width="100%" direction="row"
          sx={{
            borderBottom: 1,
            borderColor: "divider"
          }}
        >
          <TabList
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="TV seasons tabs"
            sx={{ flexGrow: 1 }}
          >
            {
              seasons?.map((season, index) => (
                <Tab
                  key={index}
                  label={season.name}
                  value={index.toString()}
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                />
              ))
            }
          </TabList>
          {
            isExpanded
              ? (
                <ExpandLessIcon onClick={() => setIsExpanded(false)} sx={{ fontSize: 35 }} />
              )
              : (
                <ExpandMoreIcon onClick={() => setIsExpanded(true)} sx={{ fontSize: 35 }} />
              )
          }
        </Stack>
        {
          isExpanded && seasons?.map((season, index1) => (
            <TabPanel
              key={index1}
              value={index1.toString()}
              sx={{
                flex: 1,
                overflow: "auto",
                p: 0,
                "& > div": { height: "100%", overflow: "auto" }
              }}
            >
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {
                  season?.episodes?.map((episode, index2) => (
                    <Box key={index2} sx={{ "&:last-child": { disply: "none" } }}>
                      <ListItem alignItems="flex-start">
                        <Stack spacing={2} direction="row" alignItems="center" sx={{ width: "100%" }}>
                          <img style={{ width: "10%", borderRadius: "5px" }} src={tmdbConfigs.backdropPath(episode.still_path)} alt="" />
                          <Typography sx={{ minWidth: "3%", textAlign: "center" }} variant="body1">
                            {index1 + 1}.{index2 + 1}
                          </Typography>
                          <Divider orientation="vertical" variant="middle" flexItem />
                          <Stack direction="column" sx={{ ml: "2.5% !important" }}>
                            <Typography variant="body1">{episode.name}</Typography>
                            <Typography
                              sx={{
                                display: { xs: "none", sm: "-webkit-box" },
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                mb: 1
                              }}
                              variant="body2"
                            >
                              {episode.overview}
                            </Typography>
                            <Typography variant="caption">{episode.air_date}</Typography>
                          </Stack>
                        </Stack>
                      </ListItem>
                      {index2 + 1 === season?.episodes?.length ? null : <Divider variant="middle" component="li" />}
                    </Box>
                  ))
                }
              </List>
            </TabPanel>
          ))
        }
      </TabContext>
    </Box>
  )
}

export default TVSeasons