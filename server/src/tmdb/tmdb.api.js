import axiosClient from "../axios/axios.client.js"

import tmdbEndpoints from "./tmdb.endpoints.js"

const tmdbApi = {
  trendingMediaList: async ({ mediaType, timeWindow }) => await axiosClient.get(
    tmdbEndpoints.trendingMediaList({ mediaType, timeWindow })
  ),
  mediaList: async ({ mediaType, mediaCategory, page }) => await axiosClient.get(
    tmdbEndpoints.mediaList({ mediaType, mediaCategory, page })
  ),
  discoverMediaList: async ({ mediaType, with_genres, sort_by, page }) => await axiosClient.get(
    tmdbEndpoints.discoverMediaList({ mediaType, with_genres, sort_by, page })
  ),
  mediaDetail: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaDetail({ mediaType, mediaId })
  ),
  mediaGenres: async ({ mediaType }) => await axiosClient.get(
    tmdbEndpoints.mediaGenres({ mediaType })
  ),
  mediaCredits: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaCredits({ mediaType, mediaId })
  ),
  mediaVideos: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaVideos({ mediaType, mediaId })
  ),
  mediaImages: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaImages({ mediaType, mediaId })
  ),
  mediaRecommend: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaRecommend({ mediaType, mediaId })
  ),
  tvSeasons: async ({ mediaId, season }) => await axiosClient.get(
    tmdbEndpoints.tvSeasons({ mediaId, season })
  ),
  mediaSearch: async ({ mediaType, query, page }) => await axiosClient.get(
    tmdbEndpoints.mediaSearch({ mediaType, query, page })
  ),
  personDetail: async ({ personId }) => await axiosClient.get(
    tmdbEndpoints.personDetail({ personId })
  ),
  personMedias: async ({ personId }) => await axiosClient.get(
    tmdbEndpoints.personMedias({ personId })
  )
}

export default tmdbApi