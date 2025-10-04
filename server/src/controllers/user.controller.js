import jsonwebtoken from "jsonwebtoken"
import multer from "multer"
import mongoose from "mongoose"

import responseHandler from "../handlers/response.handler.js"
import detectDeviceInfo from "../utils/deviceDetection.js"
import tmdbApi from "../tmdb/tmdb.api.js"

import userModel from "../models/user.model.js"
import favoriteModel from "../models/favorite.model.js"
import reviewModel from "../models/review.model.js"
import watchHistoryModel from "../models/watchHistory.model.js"

const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body

    const checkUser = await userModel.findOne({ username })

    if (checkUser) return responseHandler.badrequest(res, "username already used")

    const user = new userModel()

    user.displayName = displayName
    user.username = username
    user.email = `${username}@movieapp.local`
    user.setPassword(password)

    await user.save()

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    )

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    })
  } catch (error) {
    console.log("Signup error:", error)
    responseHandler.error(res)
  }
}

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username }).select("username password salt id displayName profileImage lastLoginDate isFirstLogin totalWatchTime createdAt");

    if (!user) return responseHandler.badrequest(res, "User not exist");

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    // Check if account was created within 24 hours for first-time login greeting
    const now = new Date();
    const accountCreated = new Date(user.createdAt);
    const hoursSinceCreation = (now - accountCreated) / (1000 * 60 * 60);
    
    // Determine if this should show first-time greeting
    const shouldShowFirstTimeGreeting = user.isFirstLogin && hoursSinceCreation <= 24;

    // Update last login date
    user.lastLoginDate = now;
    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
      shouldShowFirstTimeGreeting,
      hoursSinceCreation: Math.round(hoursSinceCreation * 10) / 10 // Round to 1 decimal place
    });
  } catch (error) {
    console.error('Signin error:', error);
    responseHandler.error(res);
  }
}

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body

    const user = await userModel.findById(req.user.id).select("password id salt")

    if (!user) return responseHandler.unauthorize(res)

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password")

    user.setPassword(newPassword)

    await user.save()

    responseHandler.ok(res)
  } catch {
    responseHandler.error(res)
  }
}

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id)

    if (!user) return responseHandler.notfound(res)

    responseHandler.ok(res, user)
  } catch {
    responseHandler.error(res)
  }
}

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const updateProfile = async (req, res) => {
  try {
    const { displayName, profileImage, profileImagePath } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (profileImagePath !== undefined) updateData.profileImagePath = profileImagePath;

    const user = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password -salt');

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch (error) {
    responseHandler.error(res);
  }
};

// Calculate analytics data for dashboard charts
const calculateAnalytics = async (userId) => {
  try {
    // Calculate weekly watch time for the last 7 weeks
    const weeklyWatchTime = await watchHistoryModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          watchedAt: {
            $gte: new Date(Date.now() - 7 * 7 * 24 * 60 * 60 * 1000) // Last 7 weeks
          }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$watchedAt' },
            year: { $year: '$watchedAt' }
          },
          totalTime: { $sum: '$watchDuration' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
      { $limit: 7 }
    ]);

    // Calculate genre distribution from favorites
    const genreDistribution = await favoriteModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$mediaType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate device usage from actual watch history
    const deviceUsageData = await watchHistoryModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$deviceInfo.deviceType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate percentages and format device usage
    const totalDeviceEntries = deviceUsageData.reduce((sum, item) => sum + item.count, 0);
    const deviceUsage = deviceUsageData.map(item => ({
      device: item._id || 'Unknown',
      percentage: totalDeviceEntries > 0 ? Math.round((item.count / totalDeviceEntries) * 100) : 0,
      count: item.count
    }));

    // If no device data exists, provide default structure
    if (deviceUsage.length === 0) {
      deviceUsage.push(
        { device: 'Desktop', percentage: 0, count: 0 },
        { device: 'Mobile', percentage: 0, count: 0 },
        { device: 'Tablet', percentage: 0, count: 0 }
      );
    }

    // Calculate daily activity for the last 30 days
    const dailyActivity = await watchHistoryModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          watchedAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$watchedAt' },
            month: { $month: '$watchedAt' },
            year: { $year: '$watchedAt' }
          },
          totalTime: { $sum: '$watchDuration' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $limit: 30 }
    ]);

    return {
      weeklyWatchTime: weeklyWatchTime.map(item => ({
        week: `Week ${item._id.week}`,
        time: Math.round(item.totalTime / 60), // Convert to hours
        count: item.count
      })),
      genreDistribution: genreDistribution.map(item => ({
        type: item._id === 'tv' ? 'TV Shows' : 'Movies',
        count: item.count
      })),
      deviceUsage,
      dailyActivity: dailyActivity.map(item => ({
        date: `${item._id.month}/${item._id.day}`,
        time: Math.round(item.totalTime / 60), // Convert to hours
        count: item.count
      }))
    };
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return {
      weeklyWatchTime: [],
      genreDistribution: [],
      deviceUsage: [],
      dailyActivity: []
    };
  }
};

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Dashboard request for user:', userId);
    
    // Get user with stats
    const user = await userModel.findById(userId).select('-password -salt');
    if (!user) return responseHandler.notfound(res);

    // Get watch history
    const recentWatchHistory = await watchHistoryModel.find({ user: userId })
      .sort({ watchedAt: -1 })
      .limit(10);

    // Get favorites - both recent and all
    console.log('Fetching favorites for user:', userId);
    const recentFavorites = await favoriteModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    const allFavorites = await favoriteModel.find({ user: userId })
      .sort({ createdAt: -1 });
    
    console.log('Recent favorites found:', recentFavorites.length);
    console.log('All favorites found:', allFavorites.length);
    console.log('Sample favorite:', recentFavorites[0] || 'none');

    // Get reviews - both recent and all
    const recentReviews = await reviewModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    const allReviews = await reviewModel.find({ user: userId })
      .sort({ createdAt: -1 });

    // Calculate ongoing series data with real TMDB episode counts
    const ongoingSeriesRaw = await watchHistoryModel.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId), 
          mediaType: 'tv' 
        } 
      },
      {
        $group: {
          _id: '$mediaId',
          mediaTitle: { $first: '$mediaTitle' },
          mediaPoster: { $first: '$mediaPoster' },
          watchedEpisodes: { $sum: 1 },
          totalWatchTime: { $sum: '$watchDuration' },
          lastWatched: { $max: '$watchedAt' },
          seasons: { $addToSet: '$seasonNumber' },
          episodes: { 
            $push: {
              season: '$seasonNumber',
              episode: '$episodeNumber',
              watchDuration: '$watchDuration',
              isCompleted: '$isCompleted'
            }
          }
        }
      },
      { $sort: { lastWatched: -1 } },
      { $limit: 10 }
    ]);

    // Enhance with real TMDB data for accurate completion percentages
    const ongoingSeries = await Promise.all(
      ongoingSeriesRaw.map(async (series) => {
        try {
          // Fetch TV show details from TMDB
          const tvDetails = await tmdbApi.mediaDetail({ 
            mediaType: 'tv', 
            mediaId: series._id 
          });
          
          // Calculate total episodes across all seasons (excluding specials)
          const totalEpisodes = tvDetails.seasons
            ?.filter(season => season.name !== "Specials")
            ?.reduce((total, season) => total + (season.episode_count || 0), 0) || 0;
          
          const completionPercentage = totalEpisodes > 0 
            ? Math.round((series.watchedEpisodes / totalEpisodes) * 100)
            : 0;

          return {
            ...series,
            totalEpisodes,
            seasonsCount: series.seasons.length,
            completionPercentage: Math.min(completionPercentage, 100),
            totalSeasons: tvDetails.number_of_seasons || 0,
            status: tvDetails.status || 'Unknown'
          };
        } catch (error) {
          console.error(`Error fetching TMDB data for series ${series._id}:`, error);
          // Fallback to estimated calculation
          return {
            ...series,
            totalEpisodes: series.watchedEpisodes * 2, // Conservative estimate
            seasonsCount: series.seasons.length,
            completionPercentage: Math.min(Math.round((series.watchedEpisodes / (series.watchedEpisodes * 2)) * 100), 100),
            totalSeasons: series.seasons.length,
            status: 'Unknown'
          };
        }
      })
    );

    // Enhanced stats calculation with better performance and more details
    const [
      uniqueMoviesWatched,
      tvEpisodesWatched,
      uniqueTvShowsWatched,
      favoritesCount,
      reviewsCount,
      totalWatchTimeResult,
      completedMovies,
      completedTvEpisodes
    ] = await Promise.all([
      // Unique movies watched (with 10+ min watch time)
      watchHistoryModel.distinct('mediaId', { 
        user: userId, 
        mediaType: 'movie',
        watchDuration: { $gte: 10 }
      }),
      
      // Unique TV episodes watched (with 10+ min watch time)
      (async () => {
        const result = await watchHistoryModel.aggregate([
          { 
            $match: { 
              user: userId, 
              mediaType: 'tv',
              watchDuration: { $gte: 10 }
            } 
          },
          {
            $group: {
              _id: {
                mediaId: '$mediaId',
                seasonNumber: '$seasonNumber',
                episodeNumber: '$episodeNumber'
              }
            }
          },
          { $count: 'uniqueEpisodes' }
        ]);
        return result[0]?.uniqueEpisodes || 0;
      })(),
      
      // Unique TV shows watched (distinct by mediaId, with 10+ min watch time)
      watchHistoryModel.distinct('mediaId', { 
        user: userId, 
        mediaType: 'tv',
        watchDuration: { $gte: 10 }
      }),
      
      // Favorites count
      favoriteModel.countDocuments({ user: userId }),
      
      // Reviews count
      reviewModel.countDocuments({ user: userId }),
      
      // Total watch time calculation
      watchHistoryModel.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, totalTime: { $sum: '$watchDuration' } } }
      ]),
      
      // Completed movies (watched for more than 90 minutes)
      watchHistoryModel.countDocuments({ 
        user: userId, 
        mediaType: 'movie',
        watchDuration: { $gte: 90 }
      }),
      
      // Completed TV episodes (watched for more than 30 minutes)
      watchHistoryModel.countDocuments({ 
        user: userId, 
        mediaType: 'tv',
        watchDuration: { $gte: 30 }
      })
    ]);
    
    const moviesWatched = uniqueMoviesWatched.length;
    const tvShowsWatched = uniqueTvShowsWatched.length;
    const tvEpisodesCount = tvEpisodesWatched;
    const totalWatchTime = totalWatchTimeResult[0]?.totalTime || 0;

    // Get current month for monthly stats
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Initialize monthly stats if not exists or if it's a new month
    if (!user.monthlyStats || user.monthlyStats.currentMonth !== currentMonth) {
      user.monthlyStats = {
        currentMonth,
        moviesWatched: 0,
        tvSeriesWatched: 0,
        totalWatchTime: 0
      };
      await user.save();
    }

    const stats = {
      moviesWatched,
      tvShowsWatched,
      tvEpisodesWatched: tvEpisodesCount,
      favoritesCount,
      reviewsWritten: reviewsCount,
      totalWatchTime,
      completedMovies,
      completedTvEpisodes,
      monthlyStats: user.monthlyStats,
      completionRate: {
        movies: user.monthlyStats.moviesWatched + user.monthlyStats.tvSeriesWatched > 0 ? 
          Math.round((user.monthlyStats.moviesWatched / (user.monthlyStats.moviesWatched + user.monthlyStats.tvSeriesWatched)) * 100) : 0,
        tvSeries: user.monthlyStats.moviesWatched + user.monthlyStats.tvSeriesWatched > 0 ? 
          Math.round((user.monthlyStats.tvSeriesWatched / (user.monthlyStats.moviesWatched + user.monthlyStats.tvSeriesWatched)) * 100) : 0
      }
    };

    user.stats = stats;

    // Calculate analytics data for charts
    const analytics = await calculateAnalytics(userId);

    const responseData = {
      user,
      recentWatchHistory,
      recentFavorites,
      recentReviews,
      allFavorites,
      allReviews,
      ongoingSeries,
      ongoingTvSeries: user.ongoingTvSeries || [],
      stats,
      analytics
    };
    
    console.log('Dashboard response data:', {
      recentFavoritesCount: responseData.recentFavorites.length,
      allFavoritesCount: responseData.allFavorites.length,
      statsCount: responseData.stats.favoritesCount
    });

    responseHandler.ok(res, responseData);
  } catch (error) {
    console.error('Dashboard error:', error);
    responseHandler.error(res);
  }
};

const addToWatchHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      mediaId, 
      mediaType, 
      mediaTitle, 
      mediaPoster, 
      seasonNumber, 
      episodeNumber, 
      watchDuration 
    } = req.body;

    // Check if watch duration meets 10-minute requirement for counting
    const meetsMinimumWatchTime = watchDuration >= 10;

    // For unique viewing counter: Check if this exact item was ever watched before
    // For movies: check mediaId and mediaType only
    // For TV shows: check mediaId, mediaType, seasonNumber, and episodeNumber
    let existingWatch;
    
    if (mediaType === 'movie') {
      // For movies, check if this movie was ever watched before
      existingWatch = await watchHistoryModel.findOne({
        user: userId,
        mediaId,
        mediaType: 'movie'
      });
    } else if (mediaType === 'tv') {
      // For TV shows, check if this specific episode was ever watched before
      existingWatch = await watchHistoryModel.findOne({
        user: userId,
        mediaId,
        mediaType: 'tv',
        seasonNumber: seasonNumber || null,
        episodeNumber: episodeNumber || null
      });
    }

    let isFirstTimeWatch = !existingWatch;
    
    // Enhanced completion detection logic
    const isCompleted = (mediaType === 'movie' && watchDuration >= 90) || 
                       (mediaType === 'tv' && watchDuration >= 30);
    
    // Calculate cumulative watch time for better tracking
    let cumulativeWatchTime = watchDuration || 0;
    if (existingWatch && existingWatch.watchDuration) {
      cumulativeWatchTime = Math.max(watchDuration || 0, existingWatch.watchDuration);
    }

    // Always update the watch history with latest watch time
    if (existingWatch) {
      // Update existing entry with enhanced data including device info
      const userAgent = req.headers['user-agent'];
      const deviceInfo = detectDeviceInfo(userAgent);
      
      const updateData = {
        watchedAt: new Date(),
        watchDuration: cumulativeWatchTime,
        mediaPoster: mediaPoster || existingWatch.mediaPoster,
        mediaTitle: mediaTitle || existingWatch.mediaTitle,
        isCompleted: isCompleted || existingWatch.isCompleted,
        lastWatchSession: watchDuration || 0 // Track individual session duration
      };

      // Only update device info if it doesn't exist or if it's different
      if (!existingWatch.deviceInfo || !existingWatch.deviceInfo.userAgent) {
        updateData.deviceInfo = {
          userAgent,
          deviceType: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os
        };
      }

      await watchHistoryModel.findByIdAndUpdate(existingWatch._id, updateData);
    } else {
      // Create new entry for first-time watch
      const userAgent = req.headers['user-agent'];
      const deviceInfo = detectDeviceInfo(userAgent);
      
      const watchHistoryItem = new watchHistoryModel({
        user: userId,
        mediaId,
        mediaType,
        mediaTitle,
        mediaPoster,
        seasonNumber,
        episodeNumber,
        watchDuration: watchDuration || 0,
        isCompleted,
        lastWatchSession: watchDuration || 0,
        deviceInfo: {
          userAgent,
          deviceType: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os
        }
      });

      await watchHistoryItem.save();
    }

    // Update user's total watch time regardless of whether it's first time or repeat
    if (watchDuration) {
      await userModel.findByIdAndUpdate(userId, {
        $inc: { totalWatchTime: watchDuration }
      });
    }

    // Update monthly statistics only if meets 10-minute requirement
    if (meetsMinimumWatchTime && isFirstTimeWatch) {
      const user = await userModel.findById(userId);
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      // Reset monthly stats if it's a new month
      if (!user.monthlyStats || user.monthlyStats.currentMonth !== currentMonth) {
        await userModel.findByIdAndUpdate(userId, {
          'monthlyStats.currentMonth': currentMonth,
          'monthlyStats.moviesWatched': 0,
          'monthlyStats.tvSeriesWatched': 0,
          'monthlyStats.totalWatchTime': 0
        });
      }

      // Update monthly statistics based on media type
      const updateFields = {
        $inc: { 'monthlyStats.totalWatchTime': watchDuration }
      };

      if (mediaType === 'movie') {
        updateFields.$inc['monthlyStats.moviesWatched'] = 1;
      } else if (mediaType === 'tv') {
        // For TV series, only count unique series (not episodes)
        const existingSeriesWatch = await watchHistoryModel.findOne({
          user: userId,
          mediaId,
          mediaType: 'tv'
        });
        
        if (!existingSeriesWatch) {
          updateFields.$inc['monthlyStats.tvSeriesWatched'] = 1;
        }
      }

      await userModel.findByIdAndUpdate(userId, updateFields);

      // Update ongoing TV series tracking
      if (mediaType === 'tv' && seasonNumber && episodeNumber) {
        await updateOngoingTvSeries(userId, {
          mediaId,
          title: mediaTitle,
          posterUrl: mediaPoster,
          currentSeason: seasonNumber,
          episodeNumber,
          watchDuration
        });
      }
    }

    responseHandler.created(res, { 
      message: 'Added to watch history',
      isFirstTimeWatch,
      mediaType,
      mediaTitle,
      meetsMinimumWatchTime
    });
  } catch (error) {
    console.error('Watch history error:', error);
    responseHandler.error(res);
  }
};

// Helper function to update ongoing TV series tracking
const updateOngoingTvSeries = async (userId, seriesData) => {
  try {
    const user = await userModel.findById(userId);
    let ongoingTvSeries = user.ongoingTvSeries || [];
    
    const existingSeriesIndex = ongoingTvSeries.findIndex(
      series => series.mediaId === seriesData.mediaId
    );

    if (existingSeriesIndex >= 0) {
      // Update existing series
      const existingSeries = ongoingTvSeries[existingSeriesIndex];
      ongoingTvSeries[existingSeriesIndex] = {
        ...existingSeries,
        currentSeason: seriesData.currentSeason,
        watchedEpisodes: (existingSeries.watchedEpisodes || 0) + 1,
        lastWatchedEpisode: {
          number: seriesData.episodeNumber,
          imageUrl: seriesData.posterUrl,
          releaseDate: new Date(),
          watchedDate: new Date()
        },
        lastUpdated: new Date()
      };
    } else {
      // Add new series
      ongoingTvSeries.push({
        mediaId: seriesData.mediaId,
        title: seriesData.title,
        posterUrl: seriesData.posterUrl,
        currentSeason: seriesData.currentSeason,
        totalEpisodes: 20, // Default estimate, can be updated later
        watchedEpisodes: 1,
        lastWatchedEpisode: {
          number: seriesData.episodeNumber,
          imageUrl: seriesData.posterUrl,
          releaseDate: new Date(),
          watchedDate: new Date()
        },
        hasNewEpisode: false,
        lastUpdated: new Date()
      });
    }

    // Keep only the most recent 10 series
    ongoingTvSeries = ongoingTvSeries
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, 10);

    await userModel.findByIdAndUpdate(userId, {
      ongoingTvSeries
    });
  } catch (error) {
    console.error('Error updating ongoing TV series:', error);
  }
};

const clearWatchHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await watchHistoryModel.deleteMany({ user: userId });
    
    // Reset total watch time
    await userModel.findByIdAndUpdate(userId, {
      totalWatchTime: 0
    });

    responseHandler.ok(res, { message: 'Watch history cleared' });
  } catch (error) {
    responseHandler.error(res);
  }
};

const markFirstLoginComplete = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isFirstLogin: false },
      { new: true }
    ).select('-password -salt');

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch (error) {
    responseHandler.error(res);
  }
};

const checkForNewEpisodes = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await userModel.findById(userId);
    if (!user || !user.ongoingTvSeries || user.ongoingTvSeries.length === 0) {
      return responseHandler.ok(res, { message: "No ongoing TV series found" });
    }

    let hasUpdates = false;
    const updatedSeries = [];

    for (const series of user.ongoingTvSeries) {
      try {
        // Get current season data from TMDB
        const { response: seasonData, err } = await tmdbApi.tvSeasons({
          mediaId: series.mediaId,
          season: series.currentSeason
        });

        if (err || !seasonData) {
          updatedSeries.push(series);
          continue;
        }

        const currentDate = new Date();
        const lastWatchedDate = new Date(series.lastWatchedEpisode.watchedDate);
        
        // Check if there are new episodes released after the last watched episode
        const newEpisodes = seasonData.episodes.filter(episode => {
          const episodeReleaseDate = new Date(episode.air_date);
          return episode.episode_number > series.lastWatchedEpisode.number &&
                 episodeReleaseDate <= currentDate &&
                 episodeReleaseDate > lastWatchedDate;
        });

        const hasNewEpisode = newEpisodes.length > 0;
        
        if (hasNewEpisode !== series.hasNewEpisode) {
          hasUpdates = true;
        }

        updatedSeries.push({
          ...series.toObject(),
          hasNewEpisode,
          lastUpdated: hasNewEpisode ? new Date() : series.lastUpdated
        });

      } catch (error) {
        console.error(`Error checking episodes for series ${series.mediaId}:`, error);
        updatedSeries.push(series);
      }
    }

    if (hasUpdates) {
      await userModel.findByIdAndUpdate(userId, {
        ongoingTvSeries: updatedSeries
      });
    }

    const newEpisodeCount = updatedSeries.filter(series => series.hasNewEpisode).length;
    
    responseHandler.ok(res, {
      message: "Episode check completed",
      newEpisodeCount,
      hasUpdates
    });

  } catch (error) {
    console.error("Error checking for new episodes:", error);
    responseHandler.error(res);
  }
};

const markEpisodeNotificationSeen = async (req, res) => {
  try {
    const { userId } = req.user;
    const { mediaId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return responseHandler.notfound(res);
    }

    const seriesIndex = user.ongoingTvSeries.findIndex(
      series => series.mediaId === mediaId
    );

    if (seriesIndex === -1) {
      return responseHandler.notfound(res, "TV series not found in ongoing list");
    }

    user.ongoingTvSeries[seriesIndex].hasNewEpisode = false;
    await user.save();

    responseHandler.ok(res, { message: "Notification marked as seen" });

  } catch (error) {
    console.error("Error marking notification as seen:", error);
    responseHandler.error(res);
  }
};



export default {
  signup,
  signin,
  getInfo,
  updatePassword,
  updateProfile,
  getDashboardData,
  addToWatchHistory,
  clearWatchHistory,
  markFirstLoginComplete,
  checkForNewEpisodes,
  markEpisodeNotificationSeen
}