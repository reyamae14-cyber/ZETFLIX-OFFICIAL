import responseHandler from "../handlers/response.handler.js"

import tmdbApi from "../tmdb/tmdb.api.js"

const getGenres = async (req, res) => {
  try {
    const movieGenres = await tmdbApi.mediaGenres({ mediaType: "movie" })
    const tvGenres = await tmdbApi.mediaGenres({ mediaType: "tv" })

    const response = { movie: movieGenres.genres, tv: tvGenres.genres }

    return responseHandler.ok(res, response)
  } catch {
    responseHandler.error(res)
  }
}

const getDiscoverMediaList = async (req, res) => {
  try {
    const { with_genres, sort_by, page } = req.query
    const { mediaType } = req.params

    const response = await tmdbApi.discoverMediaList({ mediaType, with_genres, sort_by, page })

    return responseHandler.ok(res, response)
  } catch {
    responseHandler.error(res)
  }
}

export default { getGenres, getDiscoverMediaList }