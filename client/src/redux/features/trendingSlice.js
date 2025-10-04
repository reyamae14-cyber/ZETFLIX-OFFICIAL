import { createSlice } from "@reduxjs/toolkit"

export const trendingSlice = createSlice({
  name: "Trending",
  initialState: {
    trending: "day"
  },
  reducers: {
    setTimeWidth: (state, action) => {
      state.trending = action.payload
    }
  }
})

export const {
  setTimeWidth
} = trendingSlice.actions

export default trendingSlice.reducer