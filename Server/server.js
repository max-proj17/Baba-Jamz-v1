require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// const axios = require('axios');
const cors = require('cors');
const Replicate = require("replicate"); // Import the Replicate client


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize the Replicate client with your API token
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

console.log(process.env.REPLICATE_API_TOKEN);
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
            // Add any other parameters you want to specify, such as denoising, num_inference_steps, etc.
          }
        }
      );
  
      // Send back the response to the client
      res.json({
        audio: output.audio, // Make sure to access the properties correctly based on the API's response
        spectrogram: output.spectrogram
      });
    } catch (error) {
      console.error('Error calling Riffusion API:', error.message);
      res.status(500).send('Error generating music');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
