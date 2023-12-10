
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Replicate = require('replicate');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const onFinished = require('on-finished');
const FormData = require('form-data');
const OpenAI = require('openai');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve files from the temp directory statically
app.use('/temp', express.static(path.join(__dirname, 'temp')));

// serve static files from 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));


// This directory will need to exist and will be used to store the audio files temporarily
const TEMP_DIR = path.join(__dirname, '/temp');

//openAI configs
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

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

//openAI call to generate prompt
app.post('/generate-album-cover-prompt', async (req, res) => {
  const { prompt } = req.body;

  try {
    const gptResponse = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Generate an album cover description based on this music theme: '${prompt}'`,
      max_tokens: 100
    });

    // Updated response handling
    // The v4 SDK uses 'choices' directly in the response object
    const albumCoverPrompt = gptResponse.choices[0].text.trim();
    res.json({ albumCoverPrompt });
  } catch (error) {
    console.error('Error with OpenAI GPT:', error.message);
    res.status(500).send('Error generating album cover prompt');
  }
});


//call to ClipDrop to generate album cover
//this is only commented out because i dont want to use too many of my credits during testing XD
app.post('/generate-album-cover', async (req, res) => {
  const { albumCoverPrompt } = req.body;

  try {
    const form = new FormData();
    form.append('prompt', albumCoverPrompt);

    const clipDropResponse = await axios.post('https://clipdrop-api.co/text-to-image/v1', form, {
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY,
        ...form.getHeaders()
      },
      responseType: 'arraybuffer' // Ensure you get the response as binary data
    });

    // Save the binary data to a file
    const imageBuffer = Buffer.from(clipDropResponse.data);
    const imageName = `album-cover-${Date.now()}.png`;
    const imagePath = path.join(__dirname, 'public', imageName); // Make sure you have a 'public' directory
    fs.writeFileSync(imagePath, imageBuffer);

    // Generate a URL to access the image
    const albumCoverUrl = `http://localhost:${PORT}/public/${imageName}`;

    console.log('Album Cover URL:', albumCoverUrl);
    res.json({ albumCoverUrl });
  } catch (error) {
    console.error('Error generating album cover image with ClipDrop:', error.message);
    res.status(500).send('Error generating album cover image');
  }
});


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

