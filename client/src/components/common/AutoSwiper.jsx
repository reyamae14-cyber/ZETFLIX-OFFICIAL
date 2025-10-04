import { Swiper } from "swiper/react"
import { Autoplay } from "swiper/modules"

import { Box } from "@mui/material"

const AutoSwiper = ({ children }) => {
  return (
    <Box sx={{
      "& .swiper-slide": {
        width: {
          xs: "50%",
          sm: "35%",
          md: "25%",
          lg: "20.5%"
        }
      }
    }}>
      <Swiper
        spaceBetween={5}
        slidesPerView="auto"
        grabCursor={true}
        style={{ width: "100%", height: "max-content" }}
        modules={[Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        speed={1200}
        effect="slide"
        loop={true}
        centeredSlides={false}
        allowTouchMove={true}
        touchRatio={1}
        touchAngle={45}
        simulateTouch={true}
        watchSlidesProgress={true}
  
      >
        {children}
      </Swiper>
    </Box>
  )
}

export default AutoSwiper