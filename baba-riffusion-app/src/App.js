import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [albumCoverUrl, setAlbumCoverUrl] = useState(null);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerateMusic = async () => {
    try {
      const response = await axios.post('http://localhost:3001/generate-music', { prompt });
      const fullAudioUrl = `http://localhost:3001${response.data.audio}`;
      setAudioUrl(fullAudioUrl);

    // Generate album cover prompt
    const albumCoverPromptResponse = await axios.post('http://localhost:3001/generate-album-cover-prompt', { prompt });
        const albumCoverPrompt = albumCoverPromptResponse.data.albumCoverPrompt;

      // Now, generate the album cover image
    const albumCoverResponse = await axios.post('http://localhost:3001/generate-album-cover', { albumCoverPrompt });
    setAlbumCoverUrl(albumCoverResponse.data.albumCoverUrl);


    } catch (error) {
      console.error('There was an error generating the music:', error);
    }

  };

  // useEffect hook to log changes to albumCoverUrl
  useEffect(() => {
    if (albumCoverUrl) {
      console.log('Updated album cover URL:', albumCoverUrl);
    }
  }, [albumCoverUrl]); // Only re-run the effect if albumCoverUrl changes

  return (
<div className="App">
  <header className="App-header">
    <div className="content-container">
      <div className="prompt-container">
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
      </div>
      <div className="media-container">
        {albumCoverUrl && (
          <div>
            <img src={albumCoverUrl} alt="Generated Album Cover" className="album-cover" />
          </div>
        )}
        {audioUrl && (
          <audio controls loop src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  </header>
</div>

  );
}

export default App;


