import { useEffect, useState, memo, useMemo } from "react"
import { SwiperSlide } from "swiper/react"
import { toast } from "react-toastify"

import mediaApi from "../../api/modules/media.api"
import apiCache from "../../utils/apiCache"

import AutoSwiper from "./AutoSwiper"
import MediaItem from "./MediaItem"
import LoadingSpinner from "./LoadingSpinner"

const MediaSlide = memo(({ mediaType, mediaCategory }) => {
  const [medias, setMedias] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getMedias = async () => {
      const cacheKey = apiCache.generateKey('media-list', {
        mediaType,
        mediaCategory,
        page: 1
      })

      // Check cache first
      const cachedData = apiCache.get(cacheKey)
      if (cachedData) {
        setMedias(cachedData)
        return
      }

      setLoading(true)
      const { response, err } = await mediaApi.getList({
        mediaType,
        mediaCategory,
        page: 1
      })

      if (response) {
        const results = response.results || []
        setMedias(results)
        // Cache the results
        apiCache.set(cacheKey, results)
      }
      if (err) toast.error(err.message)
      setLoading(false)
    }

    getMedias()
  }, [mediaType, mediaCategory])

  const memoizedSlides = useMemo(() => {
    return medias?.map((media, index) => (
      <SwiperSlide key={`${media.id}-${index}`}>
        <MediaItem media={media} mediaType={mediaType} />
      </SwiperSlide>
    ))
  }, [medias, mediaType])

  if (loading) {
    return <LoadingSpinner message="Loading media..." />
  }

  return (
    <AutoSwiper>
      {memoizedSlides}
    </AutoSwiper>
  )
})

export default MediaSlide