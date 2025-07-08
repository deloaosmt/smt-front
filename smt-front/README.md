# SMT Frontend

This directory contains the Docker configuration for building and running the SMT frontend application.

## Building the Docker Image

```bash
docker build -t smt-frontend -f infra/Dockerfile .
```

To specify a custom backend URL during build time:

```bash
docker build -t smt-frontend -f infra/Dockerfile --build-arg BACKEND_URL=https://api.example.com .
```

## Running the Docker Container

To run the container with the default backend URL (specified during build):

```bash
docker run -p 80:80 smt-frontend
```

To override the backend URL at runtime:

```bash
docker run -p 80:80 -e BACKEND_URL=https://api.example.com smt-frontend
```
