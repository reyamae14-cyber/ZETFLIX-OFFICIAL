# ZETFLIX: Your Ultimate Entertainment Hub

This project, ZETFLIX, leverages a powerful technology stack to deliver a comprehensive platform for exploring entertainment content. Utilizing the TMDB API, it provides detailed information about movies, TV series, and personalities. The user interface is meticulously designed with Material-UI (MUI) to ensure a modern, intuitive, and engaging user experience. Whether you're looking for the latest blockbusters, binge-worthy TV shows, or in-depth insights into your favorite actors, ZETFLIX offers a seamless way to discover, explore, and manage your entertainment preferences.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Deployment](#deployment)
- [Build Settings](#build-settings)
- [Screenshots](#screenshots)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Introduction

ZETFLIX is a cutting-edge platform designed to provide an unparalleled experience in discovering and exploring information about movies, TV shows, and personalities. By integrating with the TMDB API and incorporating advanced features, ZETFLIX offers a seamless user experience with a strong focus on detailed content, intuitive navigation, and personalized interactions.

The primary purpose of ZETFLIX is to serve as a centralized hub where users can access rich and detailed information about:

-   **Movies:** Explore comprehensive details such as plot summaries, cast members, ratings, release dates, and recommendations.
-   **TV Shows:** Discover in-depth information about seasons, episodes, cast members, and more.
-   **Persons:** Access detailed biographies and filmographies of actors and other entertainment industry professionals.
-   **Dashboard:** A personalized dashboard providing quick access to user-specific content and recommendations.

## Features

-   **Personalized Dashboard:** A central hub for users to manage their profiles, view watchlists, and get tailored recommendations.
-   **Trending Section:** Dynamically displays trending movies and web series, keeping users updated with popular content.

-   **Media Categories:**
    -   Popular
    -   Top Rated
    -   Now Playing
    -   Upcoming

-   **Detailed Media Pages:** Each media page offers an immersive experience, including:
    -   High-resolution Poster and Backdrops
    -   Comprehensive Overview and Synopsis
    -   Full Cast and Crew Information
    -   Trailers and Related Videos
    -   User Reviews and Critic Ratings
    -   Personalized Recommendations

-   **Detailed Persons Pages:** Each person's page provides:
    -   Extensive Biography
    -   Complete Filmography and Credits

-   **Advanced Filtering:**
    -   Filter content based on a wide range of genres.

-   **Flexible Sorting Options:**
    -   Sort content by criteria such as Vote Count, Popularity, Revenue, and Release Date.

-   **Robust Search Functionality:**
    -   Efficiently search for movies, TV series, and persons across the entire database.

-   **Secure User Authentication:**
    -   Seamless Sign In and Sign Up processes.
    -   Secure Password Reset functionality.

-   **Enhanced User Interaction:**
    -   Create and manage Favorite Lists.
    -   Submit and view User Reviews.

## Technologies

### Technologies and Libraries Used

#### Frontend:
-   **React.js** - A declarative, component-based JavaScript library for building dynamic user interfaces. [Reference](https://reactjs.org/)
-   **HTML/CSS** - Foundational web technologies for structuring content and styling web pages.
-   **Material-UI (MUI)** - A comprehensive React component library that implements Google's Material Design, ensuring a beautiful and responsive UI. [Reference](https://mui.com/)

#### Backend:
-   **Node.js** - A powerful JavaScript runtime environment for building scalable server-side applications. [Reference](https://nodejs.org/)
-   **Express.js** - A fast, unopinionated, minimalist web framework for Node.js, used for building robust APIs and handling HTTP requests. [Reference](https://expressjs.com/)
-   **MongoDB** - A flexible NoSQL document database, ideal for handling large volumes of unstructured data. [Reference](https://www.mongodb.com/)
-   **Supabase** - An open-source Firebase alternative providing a PostgreSQL database, authentication, instant APIs, and real-time subscriptions. [Reference](https://supabase.com/)

#### Other Tools and Libraries:
-   **axios** - A promise-based HTTP client for the browser and Node.js, used for making requests to the TMDB API and our backend server. [GitHub](https://github.com/axios/axios)
-   **jsonwebtoken** - A library for generating and verifying JSON Web Tokens (JWTs), essential for secure user authentication and authorization. [GitHub](https://github.com/auth0/node-jsonwebtoken)
-   **mongoose** - An elegant MongoDB object modeling tool for Node.js, simplifying database interactions. [Reference](https://mongoosejs.com/)
-   **react-router-dom** - DOM bindings for React Router, providing powerful routing capabilities for single-page applications. [GitHub](https://github.com/ReactTraining/react-router)
-   **react-redux** - The official React bindings for Redux, enabling efficient state management across the application. [GitHub](https://github.com/reduxjs/react-redux)
-   **formik** - A popular library for building forms in React, simplifying form state management and validation. [GitHub](https://github.com/formium/formik)
-   **yup** - A JavaScript schema builder for value parsing and validation, often used with Formik. [GitHub](https://github.com/jquense/yup)
-   **The Movie Database (TMDB)** - A community-built movie and TV database, providing the rich content data for ZETFLIX. [Reference](https://www.themoviedb.org/)
-   **Webpack Bundle Analyzer** - A tool for visualizing the size of webpack output files, helping to optimize bundle size and performance. [GitHub](https://github.com/webpack-contrib/webpack-bundle-analyzer)

## Installation

### Prerequisites
Before starting, ensure you have the following installed:
- **Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org/), which includes npm.

### Step 1: Clone the Repository
Clone the project repository from GitHub:

```bash
git clone https://github.com/Nikhil241103/Movies-Website.git
cd Movies-Website
```

### Step 2: Install Dependencies
Client (Frontend)
````bash
cd client
npm install
````

Server (Backend)
```bash
cd ../server
npm install
````

### Step 3: Set Up Environment Variables
- Create a .env file in the server directory according to .env.example file.
- Update the variables in .env as necessary for your local setup. Ensure you add .env to your .gitignore file to keep sensitive information secure.

### Step 4: Run the Development Servers
Client (Frontend)
````bash
cd client
npm start
````
Access the frontend at http://localhost:3000.

Server (Backend)
````bash
cd ../server
npm start
````
The backend runs at http://localhost:5000.

### Step 5: Accessing the Application
Open your web browser and go to http://localhost:3000 to view the frontend application.

## Deployment

This application is optimized for deployment on Vercel. Follow these steps to deploy both the frontend and backend:

### Prerequisites for Deployment
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
- **MongoDB Atlas**: Set up a cloud MongoDB database at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- **TMDB API Key**: Get your API key from [themoviedb.org](https://www.themoviedb.org/settings/api)

### Detailed Setup Instructions

#### Setting up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Verify your email address

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred cloud provider and region
   - Name your cluster (e.g., "moviedb-cluster")
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for Vercel deployment
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with "moviedb" or your preferred database name

#### Setting up TMDB API

1. **Create TMDB Account**
   - Go to [themoviedb.org](https://www.themoviedb.org)
   - Click "Join TMDB" and create an account
   - Verify your email address

2. **Request API Key**
   - Go to your account settings: [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Click "Create" under "Request an API Key"
   - Choose "Developer" option
   - Fill out the application form:
     - Application Name: "MoonFlix Movie Website"
     - Application URL: Your deployed frontend URL
     - Application Summary: Brief description of your movie website
   - Accept the terms and submit

3. **Get Your API Key**
   - Once approved, you'll see your API Key (v3 auth)
   - Copy this key for use in your environment variables

### Backend Deployment (API)

#### Step 1: Prepare Environment Variables
Set up the following environment variables in your Vercel project:

```bash
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/moviedb?retryWrites=true&w=majority
TOKEN_SECRET_KEY=your-super-secret-jwt-key-here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_KEY=your-tmdb-api-key-here
NODE_ENV=production
```

#### Step 2: Deploy Backend
1. **Prepare Your Repository**
   - Push your code to GitHub repository
   - Ensure the `server/vercel.json` file is present

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - **Important**: Set the root directory to `server`
   - Configure environment variables in Vercel dashboard:
     - `MONGODB_URL`: Your MongoDB Atlas connection string
     - `TOKEN_SECRET_KEY`: A secure random string (e.g., use a password generator)
     - `TMDB_BASE_URL`: `https://api.themoviedb.org/3`
     - `TMDB_KEY`: Your TMDB API key
     - `NODE_ENV`: `production`

3. **Deploy and Test**
   - Click "Deploy"
   - Wait for deployment to complete
   - Test your API endpoints at `https://your-backend-name.vercel.app`

The backend will be available at: `https://your-backend-name.vercel.app`

### Frontend Deployment

#### Step 1: Update Environment Variables
Update the `client/.env.production` file with your deployed backend URL:

```bash
REACT_APP_BACKEND_BASE_URL=https://your-backend-name.vercel.app
```

#### Step 2: Deploy Frontend
1. **Update Environment Configuration**
   - Create or update `client/.env.production` file:
     ```bash
     REACT_APP_BACKEND_BASE_URL=https://your-backend-name.vercel.app
     ```
   - Commit and push changes to GitHub

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project" (or use the same repository with different root)
   - Import your GitHub repository
   - **Important**: Set the root directory to `client`
   - Vercel will automatically detect the React app and `vercel.json` configuration
   - No additional environment variables needed (they're built into the React app)

3. **Deploy and Test**
   - Click "Deploy"
   - Wait for deployment to complete
   - Test your application at `https://zetflix.vercel.app`
   - Verify that the frontend can communicate with the backend API

The frontend will be available at: `https://your-frontend-name.vercel.app`

### Alternative: Single Repository Deployment

If you prefer to deploy both frontend and backend from the same repository:

1. **Deploy Backend First** (follow steps above)
2. **Deploy Frontend Second** with the backend URL
3. **Use Different Project Names** in Vercel to avoid conflicts

### Performance Optimizations Included

This deployment includes several performance optimizations:

#### Frontend Optimizations:
- **Service Worker**: Automatic caching for better performance
- **React.memo**: Optimized component re-rendering
- **Code Splitting**: Lazy loading for better bundle size
- **Static Asset Caching**: Long-term caching for images and static files
- **Security Headers**: XSS protection and content security policies

#### Backend Optimizations:
- **CORS Configuration**: Proper cross-origin resource sharing
- **Function Timeout**: Optimized for Vercel's serverless functions
- **Environment-based Configuration**: Production-ready settings

### Deployment Checklist

- [ ] MongoDB Atlas database is set up and accessible
- [ ] TMDB API key is obtained and valid
- [ ] Backend environment variables are configured in Vercel
- [ ] Backend is deployed and accessible
- [ ] Frontend environment variables point to the deployed backend
- [ ] Frontend is deployed and accessible
- [ ] User authentication works in production
- [ ] API endpoints are responding correctly
- [ ] Static assets are loading properly

### Troubleshooting Deployment Issues

#### Common Issues:
1. **CORS Errors**: Ensure the frontend URL is added to CORS configuration
2. **Environment Variables**: Double-check all environment variables are set correctly
3. **Database Connection**: Verify MongoDB Atlas connection string and network access
4. **API Limits**: Check TMDB API usage limits and quotas
5. **Build Errors**: Review build logs in Vercel dashboard for specific errors

#### Monitoring:
- Use Vercel Analytics for performance monitoring
- Monitor API usage through TMDB dashboard
- Check MongoDB Atlas metrics for database performance

## Screenshots

### Desktop

#### Home Page
![Home Page](./screenshots/desktop/homepage.png)

#### Movies Page
![Movies Page](./screenshots/desktop/moviespage.png)

#### Dashboard Page
![Dashboard Page](./screenshots/desktop/dashboardpage.png) <!-- Placeholder for Dashboard Screenshot -->

### Mobile

#### Home Page
![Home Page](./screenshots/mobile/homepage.png)

#### TV Page
![TV Page](./screenshots/mobile/tvpage.png)

#### Sidebar
![Sidebar](./screenshots/mobile/sidebar.png)

## Acknowledgements

- **Video Tutorial**: I would like to acknowledge the YouTube video tutorial by <mcurl name="Tran Anh Tuat" url="https://www.youtube.com/watch?v=j-Sn1b4OlLA"></mcurl> for providing valuable insights during the development of this project.

- **Original GitHub Repository**: This project is an upgrade and enhancement of the original work by <mcurl name="Tran Anh Tuat" url="https://github.com/trananhtuat/fullstack-mern-movie-2022"></mcurl>. His repository served as a foundational resource and inspiration throughout the development process. We extend our sincere gratitude for his excellent work.

## Build Settings

This project is configured for efficient development and optimized production builds.

### Client (Frontend) Build

The client-side application, built with React, uses `react-scripts` for standard build processes. For production, the build command generates a highly optimized, minified bundle.

-   **Development Build:**
    ```bash
    cd client
    npm start
    ```
    Runs the app in development mode.

-   **Production Build:**
    ```bash
    cd client
    npm run build
    ```
    Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

-   **Bundle Analysis (for optimization):**
    ```bash
    cd client
    npm run bundle-analyzer
    ```
    Generates a webpack bundle analysis report to visualize the size of webpack output files and identify areas for optimization.

### Server (Backend) Build

The server-side application, built with Node.js and Express.js, typically does not require a separate 'build' step in the same way a frontend application does. It runs directly using Node.js.

-   **Development Server:**
    ```bash
    cd server
    npm start
    ```
    Starts the backend server in development mode.

-   **Production Server:**
    The production server is started directly using Node.js. Vercel handles the execution of the `start` script defined in `server/package.json`.

    ```json
    // server/package.json excerpt
    {
      "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
      }
    }
    ```
    The `index.js` file is the entry point for the server application.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

