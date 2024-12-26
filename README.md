# youtube-clone
video processing service

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



# Start it up locally
- `npm run start`

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
