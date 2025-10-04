import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

// Import models
import userModel from './src/models/user.model.js';
import './src/models/favorite.model.js';
import './src/models/watchHistory.model.js';
import './src/models/review.model.js';

// Load environment variables
dotenv.config();

const addSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected');

    // Get the first user
    const user = await userModel.findOne();
    if (!user) {
      console.log('No users found');
      return;
    }

    const userId = user._id;
    console.log('Adding sample data for user:', userId);

    // Get models
    const Favorite = mongoose.model('Favorite');
    const WatchHistory = mongoose.model('WatchHistory');
    const Review = mongoose.model('Review');

    // Add sample favorites
    const sampleFavorites = [
      {
        user: userId,
        mediaType: 'movie',
        mediaId: '550',
        mediaTitle: 'Fight Club',
        mediaPoster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        mediaRate: 8.8
      },
      {
        user: userId,
        mediaType: 'movie',
        mediaId: '238',
        mediaTitle: 'The Godfather',
        mediaPoster: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        mediaRate: 9.2
      },
      {
        user: userId,
        mediaType: 'tv',
        mediaId: '1399',
        mediaTitle: 'Game of Thrones',
        mediaPoster: '/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
        mediaRate: 9.3
      }
    ];

    // Add sample watch history
    const sampleWatchHistory = [
      {
        user: userId,
        mediaId: '550',
        mediaType: 'movie',
        mediaTitle: 'Fight Club',
        mediaPoster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        watchDuration: 139,
        watchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        user: userId,
        mediaId: '1399',
        mediaType: 'tv',
        mediaTitle: 'Game of Thrones',
        mediaPoster: '/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
        seasonNumber: 1,
        episodeNumber: 1,
        watchDuration: 62,
        watchedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        user: userId,
        mediaId: '238',
        mediaType: 'movie',
        mediaTitle: 'The Godfather',
        mediaPoster: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        watchDuration: 175,
        watchedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      }
    ];

    // Add sample reviews
    const sampleReviews = [
      {
        user: userId,
        mediaType: 'movie',
        mediaId: '550',
        mediaTitle: 'Fight Club',
        mediaPoster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        content: 'An incredible movie with amazing plot twists!',
        mediaRate: 9
      },
      {
        user: userId,
        mediaType: 'movie',
        mediaId: '238',
        mediaTitle: 'The Godfather',
        mediaPoster: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        content: 'A masterpiece of cinema. Absolutely brilliant!',
        mediaRate: 10
      }
    ];

    // Clear existing data for this user
    await Favorite.deleteMany({ user: userId });
    await WatchHistory.deleteMany({ user: userId });
    await Review.deleteMany({ user: userId });

    // Insert sample data
    await Favorite.insertMany(sampleFavorites);
    await WatchHistory.insertMany(sampleWatchHistory);
    await Review.insertMany(sampleReviews);

    // Update user's total watch time
    const totalWatchTime = sampleWatchHistory.reduce((total, item) => total + (item.watchDuration || 0), 0);
    await userModel.findByIdAndUpdate(userId, {
      totalWatchTime: totalWatchTime
    });

    const result = {
      success: true,
      message: 'Sample data added successfully',
      userId: userId,
      data: {
        favorites: sampleFavorites.length,
        watchHistory: sampleWatchHistory.length,
        reviews: sampleReviews.length,
        totalWatchTime: totalWatchTime
      }
    };

    console.log('Sample data added successfully');
    fs.writeFileSync('sample-data-result.json', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error adding sample data:', error);
    fs.writeFileSync('sample-data-error.json', JSON.stringify({
      error: error.message,
      stack: error.stack
    }, null, 2));
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

addSampleData();