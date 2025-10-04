const mediaType = {
  movie: "movie",
  tv: "tv"
}

const movieCategory = {
  popular: "popular",
  top_rated: "top_rated",
  now_playing: "now_playing",
  upcoming: "upcoming"
}

const tvCategory = {
  popular: "popular",
  top_rated: "top_rated",
  on_the_air: "on_the_air",
  airing_today: "airing_today"
}

const backdropPath = (imgEndpoint) => `https://image.tmdb.org/t/p/original${imgEndpoint}`

const posterPath = (imgEndpoint) => `https://image.tmdb.org/t/p/w500${imgEndpoint}`

const youtubePath = (videoId) => `https://www.youtube.com/embed/${videoId}?controls=0`

const tmdbConfigs = {
  mediaType,
  movieCategory,
  tvCategory,
  backdropPath,
  posterPath,
  youtubePath
}

export default tmdbConfigs