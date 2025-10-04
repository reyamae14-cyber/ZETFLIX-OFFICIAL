import { Swiper } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

import { Box } from "@mui/material"

const NavigationSwiper = ({ children }) => {
  return (
    <Box sx={{
      "& .swiper-slide": {
        width: "100%",
        opacity: "0.6",
        pb: "3rem"
      },
      "& .swiper-slide-active": { opacity: 1 },
      "& .swiper-pagination-bullet": {
        backgroundColor: "text.primary"
      },
      "& .swiper-button-next, & .swiper-button-prev": {
        color: "text.primary",
        "&::after": {
          fontSize: { xs: "1rem", md: "2rem" }
        }
      },
      "& .swiper": {
        px: { xs: "1rem", md: "4rem" }
      }
    }}>
      <Swiper
        spaceBetween={10}
        grabCursor={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Navigation, Pagination]}
        style={{ width: "100%", height: "max-content" }}
        speed={1000}
        effect="slide"
        allowTouchMove={true}
        touchRatio={1}
        touchAngle={45}
        simulateTouch={true}
        watchSlidesProgress={true}
  
        resistance={true}
        resistanceRatio={0.85}
      >
        {children}
      </Swiper>
    </Box>
  )
}

export default NavigationSwiper