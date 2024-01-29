# Word Counter API

This project serves as an API layer for a service that counts the frequency of each word in a file. It provides endpoints to interact with the system, enabling users to upload files, submit them for processing, and retrieve processed data.

## Features

1. **Upload File**:
    - Endpoint: `GET /api/request-upload-url`
    - Description: Generates a signed upload URL and a unique File ID for uploading a file to the project's S3 bucket.

2. **Submit File for Processing**:
    - Endpoint: `GET /api/enqueue-file`
    - Parameters: `fileId`
    - Description: Adds the specified File ID to an AMQ queue for processing by a worker. The worker's code is available in the repository [vibhor10097/word-counter-worker](https://github.com/vibhor10097/word-counter-worker).

3. **Check Processing Status and Download Processed Data**:
    - Endpoint: `GET /api/generate-download-url`
    - Parameters: `fileId`
    - Description: Returns a signed download URL for accessing the processed data. Returns a 403 error if processing is not complete.

## Prerequisites

- Node.js (using [NVM](https://github.com/nvm-sh/nvm) is recommended for managing Node versions)
- Docker (for running the project using Docker image)
- RabbitMQ, PostgreSQL, S3 (for running locally using Docker Compose)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vnikhra/word-counter-api.git
   ```

2. Navigate to the project directory:

    ```bash
    cd word-counter-api
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Building the Project

To build the project, run:

```bash
npm run build
```

## Running the Application

After building the project, start the application using:

```bash
node build/src/index.js
```

## Running Tests

Tests can be executed with:

```bash
npm test
```

## Docker Image

A Docker image for this project is available at `vibhor10097/word-counter-api`.

## Docker Compose

For easier setup, a Docker Compose file is provided in the [word-counter-deployment](https://github.com/vnikhra/word-counter-deployment) repository. Follow the instructions there to run the required services.

## Environment Variables

Ensure the following environment variables are set before running the application:

```dotenv
DB_HOST="<Database Host>"
DB_PORT="<Database Port>"
DB_USER="<Database User>"
DB_PASSWORD="<Database Password>"
DB_NAME="<Database Name>"

S3_ENDPOINT="<S3 Endpoint URL>"
S3_ACCESS_KEY="<S3 Access Key>"
S3_SECRET_KEY="<S3 Secret Key>"
S3_UPLOAD_BUCKET="<Upload Bucket Name>"
S3_DOWNLOAD_BUCKET="<Download Bucket Name>"

AMQ_URL="<RabbitMQ URL>"
AMQ_QUEUE="<RabbitMQ Queue Name>"

PROCESS_PORT="<Port for the API process>"
```

Replace the placeholders with appropriate values specific to your environment.

## Related Repositories

- [Word Counter Worker](https://github.com/vibhor10097/word-counter-worker): Worker code for processing files submitted to the API.
- [Word Counter Deployment](https://github.com/vnikhra/word-counter-deployment): Docker Compose setup for running the project locally with required services.
- [Word Counter Client](https://github.com/vnikhra/word-counter-client): Client application for interacting with the Word Counter API. Refer to its README for usage instructions.

For any issues or inquiries, feel free to open an issue in the respective repository or contact the project maintainers.