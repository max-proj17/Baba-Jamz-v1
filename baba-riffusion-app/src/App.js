import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import WaveSurfer from 'wavesurfer.js';

function App() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [waveSurfer, setWaveSurfer] = useState(null);
  const waveformRef = useRef(null);
  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  useEffect(() => {
    if (audioUrl && !waveSurfer && waveformRef.current) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        loop: true,
      });
  
      ws.load(audioUrl);
  
      ws.on('ready', () => {
        ws.setVolume(0);
        let currentVolume = 0;
        //handle fade in by adjusting currentVolume value
        const fadeInInterval = setInterval(() => {
          currentVolume += 0.01; 
          if (currentVolume >= 1) {
            clearInterval(fadeInInterval);
            ws.setVolume(1);
          } else {
            ws.setVolume(currentVolume);
          }
        }, 200); //interval at which volume changes. smaller value -> faster changes 
      });
  
      ws.on('finish', () => {
        let currentVolume = 1;
        const fadeOutInterval = setInterval(() => {
          currentVolume -= 0.002; 
          if (currentVolume <= 0) {
            clearInterval(fadeOutInterval);
            ws.setVolume(0);
            ws.play(); 
          } else {
            ws.setVolume(currentVolume);
          }
        }, 200); 
      });
  
      setWaveSurfer(ws);
    }
  }, [audioUrl, waveSurfer, waveformRef]);


  const handleGenerateMusic = async () => {
    try {
      const response = await axios.post('http://localhost:3001/generate-music', { prompt });
      setAudioUrl(response.data.audio);
    } catch (error) {
      console.error('There was an error generating the music:', error);
    }
  };

  return (
    <div className="App">
      <div id="waveform" ref={waveformRef}></div>
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