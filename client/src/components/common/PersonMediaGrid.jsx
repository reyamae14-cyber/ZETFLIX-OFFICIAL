import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import { Button, Grid } from "@mui/material"

import personApi from "../../api/modules/person.api"

import MediaItem from "./MediaItem"

import tmdbConfigs from "../../api/configs/tmdb.configs"

const PersonMediaGrid = ({ personId }) => {
  const [filteredMedias, setFilteredMedias] = useState([])
  const [medias, setMedias] = useState([])
  const [page, setPage] = useState(1)

  const skip = 8

  useEffect(() => {
    const getMedias = async () => {
      const { response, err } = await personApi.medias({ personId })

      if (response) {
        const mediasSorted = response.cast.sort((a, b) => getReleaseDate(b) - getReleaseDate(a))
        setMedias([...mediasSorted])
        setFilteredMedias([...mediasSorted].splice(0, skip))
      }
      if (err) toast.error(err.message)
    }

    getMedias()
  }, [personId])

  const getReleaseDate = (media) => {
    const date = media.media_type === tmdbConfigs.mediaType.movie ? new Date(media.release_date) : new Date(media.first_air_date)
    return date.getTime()
  }

  const onLoadMore = () => {
    setFilteredMedias([...filteredMedias, ...[...medias].splice(page * skip, skip)])
    setPage(page + 1)
  }

  return (
    <>
      <Grid container spacing={1} sx={{ mx: "-8px!important" }}>
        {
          filteredMedias?.map((media, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <MediaItem media={media} mediaType={media.media_type} />
            </Grid>
          ))
        }
      </Grid>
      {
        filteredMedias.length < medias.length && (
          <Button
            sx={{ mt: { xs: "5% !important", sm: "2% !important" } }}
            fullWidth
            color="primary"
            onClick={onLoadMore}
          >
            load more
          </Button>
        )
      }
    </>
  )

}

export default PersonMediaGrid