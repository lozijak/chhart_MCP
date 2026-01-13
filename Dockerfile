FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including devDependencies for tsc)
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Prune dev dependencies to keep image small
RUN npm prune --production

# Expose port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Run SSE server
CMD ["node", "dist/server-sse.js"]
