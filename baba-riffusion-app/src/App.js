import React, { useState } from 'react';
import './App.css';
// Import Axios if you're going to make the API call directly from here
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [music, setMusic] = useState(null);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerateMusic = async () => {
    try {
      
      const response = await axios.post('/generate-music', { prompt });
      // Assuming the API returns the music file's URL or data
      setMusic(response.data);
    } catch (error) {
      console.error('There was an error generating the music:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Generate Music with Riffusion</h1>
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter a prompt for music generation"
        />
        <button onClick={handleGenerateMusic}>Generate Music</button>
        {music && (
          <div>
            {/* Handle music display here. If it's a URL to an audio file: */}
            <audio controls src={music.audioUrl}>
              Your browser does not support the audio element.
            </audio>
            {/* If it's binary data, you might need to handle it differently */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
