FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend code
COPY backend/ ./

# Expose port
EXPOSE $PORT

# Start the server
CMD ["npm", "start"]
