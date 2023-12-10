
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Replicate = require('replicate');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const onFinished = require('on-finished');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve files from the temp directory statically
app.use('/temp', express.static(path.join(__dirname, 'temp')));

// This directory will need to exist and will be used to store the audio files temporarily
const TEMP_DIR = path.join(__dirname, '/temp');

// Check if the TEMP_DIR exists, if not create it
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
  console.log("Directory Created!");
}else{
  console.log("Directory Exists!");
}

// Initialize the Replicate client with your API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Function to apply fade-in and fade-out effects
function addFadeEffects(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFilters(
        'afade=t=in:st=0:d=1', // Fade-in starting at 0 seconds and lasting 1 second
        'afade=t=out:st=4:d=1.5' // Fade-out starting at 4 seconds and lasting 1 second
      )
      .on('end', () => {
        console.log('Processing finished!');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error processing audio:', err);
        reject(err);
      })
      .save(outputPath);
  });
}

// Endpoint to handle music generation
app.post('/generate-music', async (req, res) => {
  const { prompt } = req.body;

  try {
    // Run the model using the Replicate client
    const output = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt // Use the prompt from the request body
        }
      }
    );

    // Download the audio file
    const audioResponse = await axios.get(output.audio, { responseType: 'arraybuffer' });
    const inputFilePath = path.join(TEMP_DIR, `${Date.now()}_input.mp3`);
    fs.writeFileSync(inputFilePath, Buffer.from(audioResponse.data));

    // Apply fade effects and return the processed audio file
    const processedFilename = `${Date.now()}_processed.mp3`;
    const processedFilePath = path.join(TEMP_DIR, processedFilename);
    addFadeEffects(inputFilePath, processedFilePath)
      .then(() => {
        // Send the URL to the processed file
        res.json({ audio: `/temp/${processedFilename}` });
      })
      .catch((error) => {
        console.error('Error processing audio:', error);
        res.status(500).send('Error processing audio');
      });

  } catch (error) {
    console.error('Error calling Riffusion API:', error.message);
    res.status(500).send('Error generating music');
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

