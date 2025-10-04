import responseHandler from "../handlers/response.handler.js"

import tokenMiddlerware from "../middlewares/token.middleware.js"

import userModel from "../models/user.model.js"
import favoriteModel from "../models/favorite.model.js"
import reviewModel from "../models/review.model.js"

import tmdbApi from "../tmdb/tmdb.api.js"

const getTrendingList = async (req, res) => {
  try {
    const { mediaType, timeWindow } = req.params

    const response = await tmdbApi.trendingMediaList({ mediaType, timeWindow })

    return responseHandler.ok(res, response)
  } catch {
    responseHandler.error(res)
  }
}

const getList = async (req, res) => {
  try {
    const { page } = req.query
    const { mediaType, mediaCategory } = req.params

    const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page })

    return responseHandler.ok(res, response)
  } catch {
    responseHandler.error(res)
  }
}

const search = async (req, res) => {
  try {
    const { mediaType } = req.params
    const { query, page } = req.query

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType
    })

    responseHandler.ok(res, response)
  } catch {
    responseHandler.error(res)
  }
}

const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params

    const params = { mediaType, mediaId }

    const media = await tmdbApi.mediaDetail(params)

    media.credits = await tmdbApi.mediaCredits(params)

    const videos = await tmdbApi.mediaVideos(params)

    media.videos = videos

    const recommend = await tmdbApi.mediaRecommend(params)

    media.recommend = recommend && recommend.results ? recommend.results : []

    media.images = await tmdbApi.mediaImages(params)

    const tokenDecoded = tokenMiddlerware.tokenDecode(req)

    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.data)

      if (user) {
        const isFavorite = await favoriteModel.findOne({ user: user.id, mediaId })
        media.isFavorite = isFavorite !== null
      }
    }

    media.reviews = await reviewModel.find({ mediaId }).populate("user").sort("-createdAt")

    if (mediaType == "tv") {
      const seasons = await Promise.all(
        media.seasons
          .filter(season => season.name !== "Specials")
          .map(async (season) => {
            const info = await tmdbApi.tvSeasons({ mediaId, season: season.season_number })
            return {
              name: season.name,
              episodes: info.episodes
            }
          })
      )

      media.seasons = seasons
    }

    responseHandler.ok(res, media)
  } catch (e) {
    responseHandler.error(res)
  }
}

export default { getTrendingList, getList, search, getDetail }