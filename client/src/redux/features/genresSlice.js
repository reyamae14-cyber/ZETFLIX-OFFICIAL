import { createSlice } from "@reduxjs/toolkit"

export const genresSlice = createSlice({
  name: "Genres",
  initialState: {
    genres: null
  },
  reducers: {
    setgenres: (state, action) => {
      if (state.genres == null) state.genres = action.payload
    }
  }
})

export const {
  setgenres
} = genresSlice.actions

export default genresSlice.reducer