import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerateMusic = async () => {
    try {
      const response = await axios.post('http://localhost:3001/generate-music', { prompt });
      // Update state with the received audio URI
      setAudioUrl(response.data.audio);
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
        {audioUrl && (
          <div>
            <audio controls loop src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
