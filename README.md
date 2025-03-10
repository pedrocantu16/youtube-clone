# youtube-clone
video processing service.

# Pre-requisites for development
- Install Node.js and NPM
- Install Docker
- Install Express, TypeScript, and the TypeScript Node development server as dependencies:
  - `npm install express`
  - `npm install --save-dev typescript ts-node`
  - `npm install --save-dev @types/node @types/express`
- Install ffmpeg nodejs wrapper and types
  - `npm install fluent-ffmpeg`
  - `npm install --save-dev @types/fluent-ffmpeg`
  - Since fluent-ffmpeg is a wrapper around the ffmpeg command line tool, you will need to install ffmpeg on your machine. You can download it from [here](https://ffmpeg.org/download.html) or use 
   - for mac/linux use homebrew `brew install ffmpeg`
   - for ubuntu run `sudo apt-get update && sudo apt-get install -y ffmpeg`
- Install Thunder Client in VSCode or you can use Postman or `curl` for local testing
- Developmento of this project was done using Google cloud. So deployment of the service assumes gcloud is available. `=)`

## Pre-requisites for Google Cloud
- Install cloud storage client library `npm install @google-cloud/storage`
- Create a Firebase Project. Take note of the `project id`
- Install `gcloud` and `gsutil` CLI tools
- Enable Google Artifact Registry `gcloud services enable artifactregistry.googleapis.com`
- Create an artifact registry repository
```
gcloud artifacts repositories create video-processing-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for video processing service"
```
- Create Pub/Sub topic `gcloud pubsub topics create <TOPIC_NAME>`
- Create Pub/Sub subscription
```
gcloud pubsub subscriptions create SUBSCRIPTION_NAME \
  --topic=TOPIC_NAME \
  --push-endpoint=SERVICE_URL \
  --ack-deadline=600
```
- Create Google Cloud Storage buckets. We need 2 buckets
 1. Raw videos bucket
  - `gsutil mb -l us-central1 --pap=enforced gs://<BUCKET_NAME>`
  - Configure bucket to send file upload notifications to Pub/Sub topic `gsutil notification create -t <topic-name> -f json -e OBJECT_FINALIZE gs://<BUCKET_NAME>`
 2. Processed videos bucket
  - `gsutil mb -l us-central1 gs://<BUCKET_NAME>`

## Prerequisites for the web client (already in repo)
- Create directory for web client
```
mkdir yt-web-client
cd yt-web-client
```
- Create a new Next.js app
`npx create-next-app@latest .`

# Local testing
 - This requires to have a video in the video-processing-service folder
 - Start server locally `npm run start`
 - The request URL `POST http://localhost:3000/process-video`
 - The request body: 
 ```
 {
  "inputFilePath": "./<file-name>",
  "outputFilePath": "./<file-name>"
 }
```

# Deploy the service

- `docker build -t us-central1-docker.pkg.dev/<APP_ID>/video-processing-repo/video-processing-service . --platform linux/amd64`
- In you are using mac, add `--platform linux/amd64`
- Push the docker image to Google Artifact Registry: `docker push us-central1-docker.pkg.dev/<APP_ID>/video-processing-repo/video-processing-service`

- Redeploy the container to Cloud Run via CLI:
```
gcloud run deploy video-processing-service --image us-central1-docker.pkg.dev/<APP_ID>/video-processing-repo/video-processing-service \
  --region=us-central1 \
  --platform managed \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1 \
  --ingress=internal
```

# Deploy the firebase functions
- `yt-api-service/functions` package
- [optional] run `npm install`
- run `firebase deploy --only functions`

# Deploy Web App

- Build image `docker build -t us-central1-docker.pkg.dev/<APP_ID>/yt-web-client-repo/yt-web-client . --platform linux/amd64`
- If you are using mac, add `--platform linux/amd64`
- Push the Docker image to Google Artifact Registry `docker push us-central1-docker.pkg.dev/<APP_ID>/yt-web-client-repo/yt-web-client`
- Deploy Docker image to Cloud Run

```
gcloud run deploy yt-web-client --image us-central1-docker.pkg.dev/<APP_ID>/yt-web-client-repo/yt-web-client \
  --region=us-central1 \
  --platform managed \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1
```

- Test the web client. Visit the URL provided by Cloud Run to test the web client.
- You will most likely not be able to sign in. This is because we haven't configured the OAuth consent screen yet.
- Copy the URL and navigate to Firebase Auth in the console. Go to the Settings tab and scroll down to Authorized domains. Add the URL to the list of authorized domains.
