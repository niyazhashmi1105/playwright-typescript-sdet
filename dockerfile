# Use the official Playwright image matching your version
FROM mcr.microsoft.com/playwright:v1.59.1-noble

# Install Java (required for Allure)
RUN apt-get update && \
    apt-get install -y default-jre && \
    apt-get clean;
    
# Set environment variables
ENV CI=true
# Prevent Playwright from trying to download browsers again during runtime
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Create and set the working directory
WORKDIR /app

# 1. Install dependencies first (better caching)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2. Copy the framework structure
# We copy specific folders to avoid bringing in local garbage (like local node_modules)
COPY pages/ ./pages/
COPY tests/ ./tests/
COPY fixtures/ ./fixtures/
COPY testdata/ ./testdata/
COPY utils/ ./utils/
COPY mock/ ./mock/
COPY public/ ./public/
COPY playwright.config.ts .
COPY tsconfig*.json ./
COPY vite.config.ts .

# 3. Create folders for reports so permissions are set correctly
RUN mkdir -p playwright-report test-results allure-results

# Default command to run tests
# Note: Adjust "test" to your specific yarn script name
CMD ["yarn", "test"]

#Running Docker image container and pull reports
#docker run --rm -it --ipc=host \
#-v $(pwd)/playwright-report:/app/playwright-report \
#  -v $(pwd)/allure-results:/app/allure-results \
#  playwright-docker-image

# Generate Allure Report
#yarn allure && yarn open