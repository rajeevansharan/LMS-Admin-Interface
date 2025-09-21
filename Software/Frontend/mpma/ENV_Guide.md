For the frontend to work correctly, you need to set up environment variables. Below are the steps and the required variables.

## Environment Variables Setup

Copy the followwing in to your `.env.development` file. If you are deploying to production, use `.env.production` instead.

# API URL

NEXT_PUBLIC_API_URL=http://localhost:8080

# Set to 'true' to disable authentication (DEVELOPMENT ONLY)

NEXT_PUBLIC_AUTH_DISABLED=false

# JWT Secret

JWT_SECRET_KEY=Super-Long-fixed-development-secret-key-here-remember-to-comment-it-in-production
