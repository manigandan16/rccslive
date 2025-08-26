# RCCSLive

**RCCSLive** is a Dockerized MERN stack application deployed via GitHub Container Registry and manageable through Portainer. This repository contains the source code, Docker configuration, and instructions for building and deploying the application.

## Features

* React frontend
* Node.js backend (Express)
* MongoDB database
* Dockerized for easy deployment
* Deployable through GitHub Container Registry (GHCR)
* Compatible with Portainer for container management

## Prerequisites

* Docker installed
* GitHub account with Personal Access Token (PAT) with `write:packages` and `repo` scopes
* Portainer (optional, for container management)

## Usage

### Clone Repository

```bash
git clone https://github.com/manigandan16/rccslive.git
cd rccslive
```

### Build Docker Image

```bash
docker build -t rccslive:latest .
```

### Tag and Push to GHCR

```bash
docker tag rccslive:latest ghcr.io/manigandan16/rccslive:latest
echo <YOUR_PAT> | docker login ghcr.io -u <GITHUB_USERNAME> --password-stdin
docker push ghcr.io/manigandan16/rccslive:latest
```

### Pull Image in Portainer

1. Open Portainer → Images → Pull Image
2. Registry: `ghcr.io`
3. Image: `manigandan16/rccslive:latest`
4. Authentication required: ✅ (username: GitHub username, password: PAT)
5. Pull and deploy the container

## Troubleshooting

* **Permission Denied:** Ensure your PAT has correct scopes (`write:packages`, `repo`).
* **Repository not found:** Make sure the repository exists on GitHub.
* **Portainer pull errors:** Use registry authentication with username and PAT.

## License

MIT License
