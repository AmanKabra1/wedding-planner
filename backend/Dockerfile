FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies including devDependencies (needed for nest build)
RUN npm install

# Copy source code
COPY . .

# Build the NestJS app
RUN npm run build

# Remove dev dependencies after build to keep image small
RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/main"]