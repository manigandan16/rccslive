# ---------- Stage 1: Build the React app ----------
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY client/package*.json ./
RUN npm install --legacy-peer-deps && npm rebuild esbuild

# Copy project files and build
COPY client/ ./
RUN npm run build


# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy React build files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional, for React Router support)
# Create this file if you have routes in React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
