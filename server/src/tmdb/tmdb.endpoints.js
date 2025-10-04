import tmdbConfig from "./tmdb.config.js"

const tmdbEndpoints = {
  trendingMediaList: ({ mediaType, timeWindow }) => tmdbConfig.getUrl(
    `trending/${mediaType}/${timeWindow}`
  ),
  mediaList: ({ mediaType, mediaCategory, page }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaCategory}`, { page }
  ),
  discoverMediaList: ({ mediaType, with_genres, sort_by, page }) => tmdbConfig.getUrl(
    `discover/${mediaType}`, { page, with_genres, sort_by }
  ),
  mediaDetail: ({ mediaType, mediaId }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}`
  ),
  mediaGenres: ({ mediaType }) => tmdbConfig.getUrl(
    `genre/${mediaType}/list`
  ),
  mediaCredits: ({ mediaType, mediaId }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}/credits`
  ),
  mediaVideos: ({ mediaType, mediaId }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}/videos`
  ),
  mediaRecommend: ({ mediaType, mediaId }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}/recommendations`
  ),
  tvSeasons: ({ mediaId, season }) => tmdbConfig.getUrl(
    `tv/${mediaId}/season/${season}`
  ),
  mediaImages: ({ mediaType, mediaId }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}/images`
  ),
  mediaSearch: ({ mediaType, query, page }) => tmdbConfig.getUrl(
    `search/${mediaType}`, { query, page }
  ),
  personDetail: ({ personId }) => tmdbConfig.getUrl(
    `person/${personId}`
  ),
  personMedias: ({ personId }) => tmdbConfig.getUrl(
    `person/${personId}/combined_credits`
  ),
}

export default tmdbEndpoints