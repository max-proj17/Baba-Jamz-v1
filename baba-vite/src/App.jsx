import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import './App.css';
import axios from 'axios';
import SceneInit from './lib/SceneInit';

function App() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [albumCoverUrl, setAlbumCoverUrl] = useState(null);
  
  const threeCanvasRef = useRef(null); // Reference for the Three.js canvas
  const mixerRef = useRef(null); // Reference for the THREE.AnimationMixer
  
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

  useEffect(() => {
    let sceneInit;
    const clock = new THREE.Clock(); // Clock for keeping track of delta time

    // Ensure that the ref is linked to the canvas element before initializing the scene
    if (threeCanvasRef.current) {
      // Create an instance of SceneInit with the current canvas
      sceneInit = new SceneInit(threeCanvasRef.current);
      sceneInit.initialize();
      // Update camera position
      sceneInit.camera.position.set(0, 0.5, 5); // Example position
      // // Adding ambient light for better visibility
      // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      // sceneInit.scene.add(ambientLight);
      // Load the FBX file
      const fbxLoader = new FBXLoader();
      fbxLoader.load('./resources/Arms_Hip_Hop_Dance.fbx', (fbx) => {
        if (fbx.animations && fbx.animations.length > 0) {
          // Create a mixer and add it to the mixerRef
          mixerRef.current = new THREE.AnimationMixer(fbx);
  
          fbx.animations.forEach((animation) => {
            const action = mixerRef.current.clipAction(animation);
            action.play();
          });
          // Animation loop for updating mixer
      function animate() {
        requestAnimationFrame(animate);
        if (mixerRef.current) {
          const delta = clock.getDelta();
          mixerRef.current.update(delta);
        }
        sceneInit.render(); // Render the scene
      }
      animate(); // Start the animation loop
          // Slowing down the animation
          mixerRef.current.timeScale = 0.9;
          fbx.position.set(0, 0, 4); // Set the position to center
          fbx.scale.set(0.01, 0.01, 0.01); // Adjust the scale if needed
          sceneInit.scene.add(fbx);


      } else {
          console.error('No animations found in the FBX model.');
      }
  });
  
      // Start the animation loop
      sceneInit.animate();
  
      // Cleanup function to dispose of the scene when the component unmounts
      return () => {
        if (sceneInit) {
          sceneInit.dispose();
        }
      };
    }
  }, []); // Empty dependency array to run only once on mount
  
  // useEffect hook to log changes to albumCoverUrl
  useEffect(() => {
    if (albumCoverUrl) {
      console.log('Updated album cover URL:', albumCoverUrl);
    }
  }, [albumCoverUrl]); // Only re-run the effect if albumCoverUrl changes

  return (
    <div className="App">
      
      <div className="content-container">
        
        <div className="three-container">
          <canvas ref={threeCanvasRef}></canvas>
        </div>
        
        <div className="music-generation-container">
          <h1>Baba Jamz</h1>
          <div className="prompt-container">
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
    </div>
  );
  
}

export default App;
