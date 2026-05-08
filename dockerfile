# Use the official Playwright image (matches your Playwright version)
FROM mcr.microsoft.com/playwright:v1.59.1-noble

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your project
COPY . .

# Default command to run tests
CMD ["yarn", "test"]