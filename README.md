# GLTF Model Viewer

A lightweight web-based 3D model viewer built with Three.js. View GLTF/GLB models with animations and camera controls.

## Features

- Load and display GLTF/GLB models
- Interactive animation list panel
- Play model animations with one click
- Orbit controls for camera manipulation
- Persistent camera position
- Reference grid for better orientation
- Responsive design
- No build tools required

## Project Structure

```
gltf-viewer/
├── index.html          # Main entry point
├── app.js             # Three.js application logic
├── package.json       # Project configuration and dependencies
├── lib/               # Three.js modules
│   ├── three.module.js
│   ├── GLTFLoader.js
│   └── OrbitControls.js
├── utils/             # Utility modules
│   └── BufferGeometryUtils.js
└── models/            # 3D model files
    └── Soldier.glb
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Download Three.js modules:
   ```powershell
   npm run download-deps
   ```
4. Start the development server:
   ```powershell
   npm start
   ```
5. Open `http://localhost:3000` in your browser

## Usage

- Orbit: Left mouse button
- Pan: Right mouse button
- Zoom: Mouse wheel
- Use WASD to move camera around
- Camera positions are automatically saved between sessions

## Available Animations

To play an animation:
```javascript
app.playAnimation('idle');  // Replace 'idle' with animation name
```

## Live Demo

Visit [https://dmi3ich.github.io/gltf-viewer/](https://dmi3ich.github.io/gltf-viewer/) to see the viewer in action.

## Dependencies

- Three.js
- GLTFLoader
- OrbitControls
- BufferGeometryUtils
- RGBELoader.js

## Todos

- Add antialiasing
- Add plane for casting shadows
- UI improvements: models list, HDR controls
- Add post-processing effects (e.g. tone mapping, bloom, depth of field)

