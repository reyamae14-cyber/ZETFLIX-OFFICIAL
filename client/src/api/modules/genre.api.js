import publicClient from "../client/public.client"

const genreEndpoints = {
  list: '/genres/list',
  mediasList: ({ mediaType, genre, sort_by, page }) => `/genres/${mediaType}?with_genres=${genre}&sort_by=${sort_by}&page=${page}`
}

const genreApi = {
  getList: async () => {
    try {
      const response = await publicClient.get(genreEndpoints.list)

      return { response }
    } catch (err) { return { err } }
  },
  getMediasList: async ({ mediaType, genre, sort_by, page }) => {
    try {
      const response = await publicClient.get(genreEndpoints.mediasList({ mediaType, genre, sort_by, page }))

      return { response }
    } catch (err) { return { err } }
  }
}

export default genreApi