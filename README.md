# GLTF Model Viewer

A simple web-based 3D model viewer built with Three.js. This template allows you to load and view GLTF/GLB models with animations in your browser.

## Features

- Load and display GLTF/GLB models
- Play model animations
- Orbit controls for camera manipulation
- Reference grid and axis helpers
- Responsive design
- No build tools required

## Usage

1. Clone the repository
2. Place your GLTF/GLB models in the `models` folder
3. Update the model path in `app.js`:
```javascript
loader.load('./models/YourModel.glb', ...);
```
4. Serve the files using a local web server

## Structure

- `index.html` - Main entry point
- `app.js` - Three.js application logic
- `lib/` - Three.js and required modules
- `models/` - 3D model files

## Dependencies

- Three.js
- GLTFLoader
- OrbitControls

## Live Demo

Visit [https://dmi3ich.github.io/gltf-viewer/](https://dmi3ich.github.io/gltf-viewer/) to see the viewer in action.