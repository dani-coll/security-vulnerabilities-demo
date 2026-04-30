FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY vulnerable-frontend/package*.json ./
RUN npm install
COPY vulnerable-frontend/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY vulnerable-server/package*.json ./
RUN npm install
COPY vulnerable-server/ .
COPY --from=frontend-builder /app/dist ./public
EXPOSE 3003
CMD ["node", "server.js"]
