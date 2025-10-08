# ---- Single-stage build & run ----
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first for efficient caching
COPY package.json package-lock.json ./

# Install exact dependencies from package-lock.json
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Vite app (outputs to dist/)
RUN npm run build

# Expose the Vite preview port
EXPOSE 3001

# Run the production preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3001"]