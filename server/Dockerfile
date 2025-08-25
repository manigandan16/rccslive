# Use Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy the rest of the backend code
COPY . .

# Expose port (your backend port, e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
