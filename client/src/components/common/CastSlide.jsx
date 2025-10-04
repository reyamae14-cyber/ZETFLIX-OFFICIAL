import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"

import { Box, Typography } from "@mui/material"

import themeConfigs, { themeModes } from "../../configs/theme.configs"
import tmdbConfigs from "../../api/configs/tmdb.configs"
import uiConfigs from "../../configs/ui.configs"

import { routesGen } from "../../routes/routes"

const CastSlide = ({ casts }) => {
  const { themeMode } = useSelector((state) => state.themeMode)

  return (
    <Box sx={{
      "& .swiper-slide": {
        width: { xs: "50%", md: "25%", lg: "20.5%" },
        color: "primary.contrastText"
      }
    }}>
      <Swiper
        spaceBetween={10}
        slidesPerView={"auto"}
        grabCursor={true}
        style={{ width: "100%", height: "max-content" }}
      >
        {
          casts?.map((cast, index) => (
            <SwiperSlide key={index}>
              <Link to={routesGen.person(cast.id)}>
                <Box sx={{
                  pt: "120%",
                  color: "text.primary",
                  ...uiConfigs.style.backgroundImage(tmdbConfigs.posterPath(cast.profile_path))
                }}>
                  <Box sx={{
                    position: "absolute",
                    width: "100%",
                    height: "max-content",
                    bottom: 0,
                    p: "10px",
                    backgroundColor: (themeMode === themeModes.dark) ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"
                  }}>
                    <Typography sx={{ ...uiConfigs.style.typoLines(1, "left") }}>
                      {cast.name}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </Box>
  )
}

export default CastSlide