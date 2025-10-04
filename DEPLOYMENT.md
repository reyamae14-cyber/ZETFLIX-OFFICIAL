# Deployment Guide for Movies Website

This guide will help you deploy both the frontend and backend of the Movies Website to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be pushed to GitHub
3. **MongoDB Atlas**: Set up a MongoDB cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas)
4. **TMDB API Key**: Get your API key from [themoviedb.org](https://www.themoviedb.org/settings/api)

## Backend Deployment (Server)

### 1. Environment Variables
In your Vercel dashboard, set these environment variables for the backend:

```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/moviedb?retryWrites=true&w=majority
TOKEN_SECRET_KEY=your-super-secret-jwt-key-here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_KEY=your-tmdb-api-key-here
NODE_ENV=production
```

### 2. Deploy Backend
1. Connect your GitHub repository to Vercel
2. Set the **Root Directory** to `server`
3. Vercel will automatically detect the `vercel.json` configuration
4. Deploy and note your backend URL (e.g., `https://your-backend.vercel.app`)

### 3. Backend Features
- ✅ CORS configured for multiple origins
- ✅ Health check endpoint at `/health`
- ✅ Global error handling
- ✅ 404 route handling
- ✅ Proxy trust for Vercel

## Frontend Deployment (Client)

### 1. Update Environment Variables
Update `client/.env.production` with your backend URL:

```
REACT_APP_BACKEND_BASE_URL=https://your-backend.vercel.app
```

### 2. Deploy Frontend
1. Create a new Vercel project for the frontend
2. Set the **Root Directory** to `client`
3. Vercel will automatically detect it's a React app
4. Deploy and note your frontend URL

### 3. Update CORS (Important!)
After deploying the frontend, update the backend's CORS configuration:

1. Go to your backend code in `server/index.js`
2. Add your frontend URL to the CORS origins:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app', // Add your frontend URL here
    'https://backend-nine-zeta-67.vercel.app',
    'https://zetiflex.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}))
```

3. Redeploy the backend

## Testing Your Deployment

### Backend Health Check
Visit: `https://your-backend.vercel.app/health`

You should see:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-XX..."
}
```

### API Endpoints
Test these endpoints:
- `GET /api/v2/movies` - Get movies
- `GET /api/v2/person` - Get persons
- `POST /api/v2/user/signin` - User authentication

### Frontend Testing
1. Visit your frontend URL
2. Check browser console for any CORS errors
3. Test user registration/login
4. Test movie browsing and search

## Common Issues & Solutions

### CORS Errors
- Ensure your frontend URL is added to the backend CORS configuration
- Redeploy backend after updating CORS

### Environment Variables
- Double-check all environment variables are set in Vercel dashboard
- Ensure MongoDB connection string is correct
- Verify TMDB API key is valid

### Build Errors
- Check Node.js version compatibility
- Ensure all dependencies are listed in package.json
- Check for any hardcoded localhost URLs

## File Structure After Deployment

```
Movies-Website/
├── client/                 # Frontend (Deploy to Vercel)
│   ├── .env.production    # Backend URL configuration
│   ├── package.json
│   └── src/
├── server/                 # Backend (Deploy to Vercel)
│   ├── .env.example       # Environment variables template
│   ├── vercel.json        # Vercel configuration
│   ├── index.js           # Main server file
│   └── src/
└── DEPLOYMENT.md          # This file
```

## Quick Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] TMDB API key obtained
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend health check working
- [ ] Frontend .env.production updated
- [ ] Frontend deployed to Vercel
- [ ] CORS updated with frontend URL
- [ ] Backend redeployed with new CORS
- [ ] Full application tested

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check browser console for errors