import { SwiperSlide } from "swiper/react"

import { Box } from "@mui/material"

import AutoSwiper from "./AutoSwiper"

import tmdbConfigs from "../../api/configs/tmdb.configs"

const PosterSlide = ({ posters }) => {
  return (
    <AutoSwiper>
      {
        [...(posters || [])].splice(0, 10)?.map((item, index) => (
          <SwiperSlide key={index}>
            <Box sx={{
              pt: "160%",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundImage: `url(${tmdbConfigs.posterPath(item.file_path)})`
            }} />
          </SwiperSlide>
        ))
      }
    </AutoSwiper>
  )
}

export default PosterSlide