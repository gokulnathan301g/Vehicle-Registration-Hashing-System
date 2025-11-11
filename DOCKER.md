# Docker Deployment Guide

## Quick Start with Docker Compose

```bash
# Build and run the container
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the container
docker-compose down
```

## Manual Docker Commands

```bash
# Build the image
docker build -t vehicle-registration-app .

# Run the container
docker run -p 5000:5000 -v $(pwd)/data:/app/data vehicle-registration-app

# Run in background
docker run -d -p 5000:5000 -v $(pwd)/data:/app/data --name vehicle-app vehicle-registration-app
```

## Access the Application

Open your browser and go to: `http://localhost:5000`

## Data Persistence

Data is stored in the `./data` directory and persists between container restarts.