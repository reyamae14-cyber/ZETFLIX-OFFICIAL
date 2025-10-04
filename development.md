# ZETFLIX Development Guide

This document outlines the development setup and environment variables required for the ZETFLIX project.

## Environment Variables

To run ZETFLIX locally or deploy it, you will need to configure the following environment variables:

### Client (Frontend)

Create a `.env` file in the `client` directory with the following variables:

-   `REACT_APP_TMDB_API_KEY`: Your API key for The Movie Database (TMDB).
-   `REACT_APP_SUPABASE_URL`: The URL of your Supabase project.
-   `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase public anon key.

### Server (Backend)

Create a `.env` file in the `server` directory with the following variables:

-   `MONGO_URI`: Connection string for your MongoDB Atlas database.
-   `TMDB_API_KEY`: Your API key for The Movie Database (TMDB).
-   `SUPABASE_URL`: The URL of your Supabase project.
-   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (secret).
-   `JWT_SECRET`: A secret key for JSON Web Token (JWT) authentication.

## Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd Movies-Website
    ```

2.  **Install dependencies:**

    For the client:
    ```bash
    cd client
    npm install
    ```

    For the server:
    ```bash
    cd ../server
    npm install
    ```

3.  **Configure environment variables:**
    Create the `.env` files as described above in both the `client` and `server` directories.

4.  **Start the development servers:**

    For the client:
    ```bash
    cd client
    npm start
    ```

    For the server:
    ```bash
    cd ../server
    npm start
    ```

    The client application will typically run on `http://localhost:3000` and the server on `http://localhost:5000`.