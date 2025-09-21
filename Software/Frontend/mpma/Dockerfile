# Stage 1: The Build Stage - Install dependencies and build the production assets
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
# This leverages layer caching, same as the backend
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js production application
RUN npm run build


# Stage 2: The Final/Production Stage - Run the optimized server
FROM node:18-alpine
WORKDIR /app

# Copy the necessary files from the build stage for a production environment
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts

# Install ONLY the production dependencies (e.g., 'next', 'react')
# This makes the final image much smaller than copying the whole node_modules folder
RUN npm install --production

# Expose the port the Next.js app runs on
EXPOSE 3000

# The command to start the Next.js production server
CMD ["npm", "start"]