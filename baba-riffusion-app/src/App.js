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
      const response = await axios.post('http://localhost:3001/generate-music', { prompt });
      // Update state with the received audio and spectrogram URIs
      setMusic({
        audioUrl: response.data.audio,
        spectrogramUrl: response.data.spectrogram
      });
    } catch (error) {
      console.error('There was an error generating the music:', error);
    }
  };

  return (
    <div className="App">
    <header className="App-header">
      <h1>Generate Music with Riffusion</h1>
      <input
        className="input-text"
        type="text"
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Enter a prompt for music generation"
      />
      <button
        className="button"
        onClick={handleGenerateMusic}
      >
        Generate Music
      </button>
      {music && (
        <div>
          <audio controls src={music.audioUrl}>
            Your browser does not support the audio element.
          </audio>
          <img src={music.spectrogramUrl} alt="Spectrogram" />
        </div>
      )}
    </header>
  </div>
  );
}

export default App;
