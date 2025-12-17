FROM node:24.12-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
# Using --legacy-peer-deps to resolve peer dependency conflicts
RUN npm ci --legacy-peer-deps

# Copy source code and config files
COPY tsconfig.json ./
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:24.12-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
# Using --legacy-peer-deps to resolve peer dependency conflicts
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose port if needed (adjust based on your app)
# EXPOSE 3000

# Run the application
CMD ["npm", "start"]

