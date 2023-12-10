import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerateMusic = async () => {
    try {
      const response = await axios.post('http://localhost:3001/generate-music', { prompt });
      const fullAudioUrl = `http://localhost:3001${response.data.audio}`;
      setAudioUrl(fullAudioUrl);
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
        <button className="button" onClick={handleGenerateMusic}>
          Generate Music
        </button>
        {audioUrl && (
          <audio controls loop src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        )}
      </header>
    </div>
  );
}

export default App;


