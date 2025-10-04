import crypto from "crypto"
import mongoose from "mongoose"

import modelOptions from "./model.options.js"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password not required if Google OAuth user
    },
    select: false
  },
  salt: {
    type: String,
    required: function() {
      return !this.googleId; // Salt not required if Google OAuth user
    },
    select: false
  },
  // Google OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  profileImage: {
    type: String,
    default: ""
  },
  profileImagePath: {
    type: String,
    default: ""
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  totalWatchTime: {
    type: Number,
    default: 0
  },
  monthlyStats: {
    currentMonth: {
      type: String,
      default: () => new Date().toISOString().slice(0, 7) // YYYY-MM format
    },
    moviesWatched: {
      type: Number,
      default: 0
    },
    tvSeriesWatched: {
      type: Number,
      default: 0
    },
    totalWatchTime: {
      type: Number,
      default: 0
    }
  },
  ongoingTvSeries: [{
    mediaId: String,
    title: String,
    posterUrl: String,
    currentSeason: Number,
    totalEpisodes: Number,
    watchedEpisodes: Number,
    lastWatchedEpisode: {
      number: Number,
      imageUrl: String,
      releaseDate: Date,
      watchedDate: Date
    },
    hasNewEpisode: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex")

  this.password = crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex")
}

userSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex")

  return this.password === hash
}

const userModel = mongoose.model("User", userSchema)

export default userModel
