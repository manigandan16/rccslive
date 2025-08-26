# Stage 1: Build React app
FROM node:18 AS build

WORKDIR /app

COPY client/package*.json ./

RUN npm install --legacy-peer-deps && npm rebuild esbuild

COPY client/ ./

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
