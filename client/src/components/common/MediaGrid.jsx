import { Grid } from "@mui/material"
import { motion } from "framer-motion"
import MediaItem from "./MediaItem"

const MediaGrid = ({ medias, mediaType }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Grid container spacing={1} sx={{ mx: "-8px!important" }}>
        {medias?.map((media, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <motion.div variants={item}>
              <MediaItem media={media} mediaType={mediaType} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  )
}

export default MediaGrid