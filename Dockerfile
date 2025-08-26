# 1. Build React client
FROM node:18-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm rebuild esbuild && npm run build

# 2. Setup Node server
FROM node:18-alpine AS server
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci
COPY server ./server
COPY --from=build-client /app/client/dist ./server/public
WORKDIR /app/server
EXPOSE 5000
CMD ["npm", "start"]
