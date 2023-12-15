# Baba Jamz v1

Welcome to Baba Jamz v1, an innovative music generation and visualization project created by Maximelio Finch and Sirena Backham. This project combines the power of AI and web technologies to create a unique musical experience.

## Overview

Baba Jamz v1 is a web-based application that allows users to generate music based on AI models alongside an AI generated dancing 3D model of Baba (made with Luma AI) in a dynamic environment! The project is divided into two main parts: the server-side for API processing and the client-side for Three.js, music, and song cover vizualization.

## Software Stack

### Server-Side
- **Node.js**: The backend is built on Node.js, providing a robust environment for server-side scripting.
- **Express**: This minimal and flexible Node.js web application framework is used to build the server.
- **OpenAI & Replicate**: These AI platforms are integrated for generating music and related content.
- **FFmpeg**: A complete, cross-platform solution to record, convert and stream audio and video.
- **Other Dependencies**: `body-parser`, `cors`, `dotenv`, `axios`, and more for handling various server functionalities.

### Client-Side
- **React**: A JavaScript library for building user interfaces.
- **Three.js**: A cross-browser JavaScript library and API used to create and display animated 3D computer graphics in a web browser.
- **Vite**: A build tool that aims to provide a faster and leaner development experience for modern web projects.
- **Other Libraries**: `wavesurfer.js` for audio waveform visualization, `eslint` for code linting, and more.

### Unique Tools/APIs
- **OpenAI's GPT-3**: Used for generating creative content based on user inputs.
- **Replicate API**: Facilitates the AI-based music generation process.
- **ClipDrop API**: Integrated for generating album covers based on AI-generated prompts.

## Features
- **Music Generation**: Users can input prompts to generate music using Riffusions AI models.
- **Dynamic Visualization**: The generated music is visualized in a 3D environment using Three.js.
- **Album Cover Generation**: Your input prompts, piplined through a ChatGPT prompt tweaker, are used to create unique album covers.

## Installation and Setup

To set up Baba Jamz v1 on your local machine, follow these steps:

1. **Clone the Repository**
```
git clone https://github.com/max-proj17/Baba-Jamz-v1.git
cd Baba-Jamz-v1
```

2. **Server Setup**
- Navigate to the server directory:
  ```
  cd Server
  ```
- Install the necessary packages:
  ```
  npm install
  ```
- Set up the environment variables by creating a `.env` file in the server directory and populating it with the necessary API keys and configurations.
  ```
  REPLICATE_API_TOKEN="************"
  OPENAI_API_KEY=**************
  CLIPDROP_API_KEY=********
  ```
3. **Client Setup**
- Navigate to the client directory:
  ```
  cd ../baba-vite
  ```
- Install the necessary packages:
  ```
  npm install
  ```

4. **Running the Application**
- Start the server:
  ```
  cd ../Server
  npm start
  ```
- In a new terminal, start the client:
  ```
  cd baba-vite
  npm run dev
  ```

## Usage

1. **Generating Music**
- Access the web interface at `http://localhost:3000`.
- Enter a prompt in the provided input field to generate music.

2. **Visualizing Music**
- Once the music is generated, it will be automatically visualized in the 3D environment on the web interface.

3. **Generating Album Covers**
- These will be generated based on your music prompt. (Your Music Prompt) -> (ChatGPT Album Cover Image Prompt Maker) -> (ClipDrop)

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgements
Special thanks to all the contributors and the open-source community for the tools and libraries used in this project.
