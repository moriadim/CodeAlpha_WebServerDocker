# ----------- Build Stage -----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy app source and build it
COPY . .
RUN npm run build

# ----------- Production Stage -----------
FROM node:18-alpine AS runner

WORKDIR /app

# Only copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port and run
EXPOSE 3000
CMD ["npm", "start"]
