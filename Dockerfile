# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the prebuilt JavaScript files into the container
COPY build ./build

# Set environment variables if needed
# ENV ENV_VAR1=value1 \
#     ENV_VAR2=value2
ENV DB_HOST="host.docker.internal" \
    DB_PORT="15432" \
    DB_USER="postgres" \
    DB_PASSWORD="postgres" \
    DB_NAME="word-counter" \
    S3_ENDPOINT="http://host.docker.internal:9000" \
    S3_ACCESS_KEY="minioadmin" \
    S3_SECRET_KEY="minioadmin" \
    S3_UPLOAD_BUCKET="word-counter-raw-files" \
    S3_DOWNLOAD_BUCKET="word-counter-result" \
    AMQ_URL="amqp://host.docker.internal:5672" \
    AMQ_QUEUE="to_process" \
    PROCESS_PORT="16666"

# Update /etc/hosts and start the application
CMD node build/src/index.js
