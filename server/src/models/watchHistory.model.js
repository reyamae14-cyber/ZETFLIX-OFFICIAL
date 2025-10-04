import mongoose from "mongoose"
import modelOptions from "./model.options.js"

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mediaId: {
    type: String,
    required: true
  },
  mediaTitle: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ["movie", "tv"],
    required: true
  },
  mediaPoster: String,
  mediaRate: Number,
  seasonNumber: Number, // For TV shows
  episodeNumber: Number, // For TV shows
  watchedAt: {
    type: Date,
    default: Date.now
  },
  watchDuration: {
    type: Number, // in minutes (cumulative)
    default: 0
  },
  lastWatchSession: {
    type: Number, // in minutes (last session only)
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  deviceInfo: {
    userAgent: String,
    deviceType: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Unknown"],
      default: "Unknown"
    },
    browser: String,
    os: String
  }
}, modelOptions)

// Index for efficient queries
watchHistorySchema.index({ user: 1, watchedAt: -1 })
watchHistorySchema.index({ user: 1, mediaId: 1, mediaType: 1 })

const watchHistoryModel = mongoose.model("WatchHistory", watchHistorySchema)

export default watchHistoryModel