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

Docker with GitHub
Create a repository inside the github as the first step.
Later provide the command, git init => It will initialize the git inside the project and creates the folder known as .github\workflows
Create 2 files namely, docker-publish.yml and main.yml inside the .github\workflows


1. Push Your Docker Image to Docker Hub via GitHub Actions
This is useful if you want CI/CD – every time you push to GitHub, Docker builds your image and pushes it to Docker Hub (or GitHub Container Registry).
Steps:
1.	Create a Dockerfile in your project.
2.	Login to Docker Hub and create a repository (e.g., username/myapp).
3.	Add secrets to GitHub repo:
o	Go to Repo → Settings → Secrets → Actions → New repository secret
o	Add:
	DOCKER_USERNAME = your Docker Hub username
	DOCKER_PASSWORD = your Docker Hub password or access token
4.	Create GitHub Actions workflow:
Inside your repo, create .github/workflows/docker.yml:
5.	name: Build and Push Docker Image
6.	
7.	on:
8.	  push:
9.	    branches: [ "main" ]
10.	
11.	jobs:
12.	  build:
13.	    runs-on: ubuntu-latest
14.	
15.	    steps:
16.	      - name: Checkout code
17.	        uses: actions/checkout@v4
18.	
19.	      - name: Login to Docker Hub
20.	        uses: docker/login-action@v3
21.	        with:
22.	          username: ${{ secrets.DOCKER_USERNAME }}
23.	          password: ${{ secrets.DOCKER_PASSWORD }}
24.	
25.	      - name: Build Docker Image
26.	        run: docker build -t username/myapp:latest .
27.	
28.	      - name: Push Docker Image
29.	        run: docker push username/myapp:latest
30.	Push code to GitHub → main branch.
GitHub Actions will build the Docker image and push it to Docker Hub.
________________________________________
🔹 2. Deploy Your App With Docker Using GitHub Repository
If you just want to clone your repo and run it with Docker:
1.	On your server/PC:
2.	git clone https://github.com/username/myapp.git
3.	cd myapp
4.	docker build -t myapp .
5.	docker run -p 3000:3000 myapp
6.	Done – it runs from GitHub source.
________________________________________
👉 Question for you:
Do you want (A) CI/CD with GitHub Actions + Docker Hub (recommended for deployment)
or (B) just run Docker locally from your GitHub repo?
You said:
D:\OneDrive - neuralnetdatascience.com\1. NeuralNet\3. React Apps\rccslive>git commit -m "first commit" Author identity unknown *** Please tell me who you are. Run git config --global user.email "you@example.com" git config --global user.name "Your Name" to set your account's default identity. Omit --global to set the identity only in this repository. fatal: unable to auto-detect email address (got 'Manigandan A@ManigandanNNDS010.(none)')
ChatGPT said:
This error happens because Git doesn’t know your name and email, which are required to tag commits with an author identity.
You just need to configure them once (globally) or only for this repo.
________________________________________
✅ Fix (Global Configuration)
Run these commands in Git Bash or your terminal:
git config --global user.name "Manigandan"
git config --global user.email "your_email@example.com"
👉 Replace your_email@example.com with the same email you used in your GitHub account (important, otherwise commits won’t link to your GitHub profile).
________________________________________
✅ Fix (Only for This Repository)
If you want to set it only for the current repo:
git config user.name "Manigandan"
git config user.email "your_email@example.com"
________________________________________
✅ Verify Configuration
Check if it worked:
git config --list
You should see:
user.name=Manigandan
user.email=your_email@example.com
________________________________________
⚡ After this, try committing again:
git commit -m "first commit"


git branch -M main
git push -u origin main


MIT License

