# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies (including dev dependencies) for build
RUN npm ci && npm cache clean --force

COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Copy package files (already done in builder, but good for clarity in production stage)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy ALL necessary files from the builder stage,
# ensuring the entire built application is present.
# This includes the .next directory, public, and all source files
# that the Next.js server needs to run.
# A common practice is to copy the entire app directory,
# then remove what's not needed if absolutely necessary,
# but for Next.js, copying the built output and source is key.
COPY --from=builder /app /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]