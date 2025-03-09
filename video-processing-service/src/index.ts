import express from 'express'; // Import Express

import { 
    uploadProcessedVideo,
    downloadRawVideo,
    deleteRawVideo,
    deleteProcessedVideo,
    convertVideo,
    setupDirectories
} from './storage';
import { isVideoNew, setVideo } from "./firestore";

// Create the local directories for videos
setupDirectories();
  
const app: express.Application = express(); // Correct type for app
app.use(express.json());

app.post('/process-video', async (req, res) => {
    
    // Get the bucket and filename from the Cloud Pub/Sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('Invalid message payload received.');
        }
    } catch (error) {
        console.error(error);
        res.status(400).send('Bad Request: missing filename.'); 
        return;
    }
    
    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];

    if (!isVideoNew(videoId)) {
        res.status(400).send('Bad Request: video already processing');
    } else {
        console.log(
            `Set video to processing state.`
        );
        setVideo(videoId, {
            id: videoId,
            uid: videoId.split('-')[0],
            status: 'processing'
        });
    }
    
    // Download the raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    // Process the video into 360p
    try { 
        await convertVideo(inputFileName, outputFileName)
    } catch (err) {
        console.error(err);
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        res.status(500).send('Processing failed');
        return;
    }

    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    res.status(200).send('Processing finished successfully.');
    return;

});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(
        `Video processing service listening at http://localhost:${port}`
    )
});
