const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Endpoint to handle music generation
app.post('/generate-music', async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const response = await axios.post('API_ENDPOINT_HERE', { prompt: prompt });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
