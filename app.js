import * as THREE from './lib/three.module.js';
import { GLTFLoader } from './lib/GLTFLoader.js';
import { OrbitControls } from './lib/OrbitControls.js';

export class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xd0d0d0);  // Light gray background
        this.scene.fog = new THREE.Fog(0xffffff, 10, 50);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.animations = [];
        this.currentAnimation = null;

        this.init();
        this.setupEventListeners();
        // Load camera position after controls are initialized
        this.loadCameraPosition();
        this.animate();
    }

    loadCameraPosition() {
        try {
            const savedCamera = JSON.parse(localStorage.getItem('camera') || '{}');
            if (this.controls && savedCamera.position) {
                this.camera.position.set(
                    savedCamera.position.x ?? 0,
                    savedCamera.position.y ?? 2,
                    savedCamera.position.z ?? 5
                );
            }
            if (this.controls && savedCamera.target) {
                this.controls.target.set(
                    savedCamera.target.x ?? 0,
                    savedCamera.target.y ?? 1,
                    savedCamera.target.z ?? 0
                );
                this.controls.update();
            }
        } catch (error) {
            console.warn('Failed to load camera position:', error);
        }
    }

    saveCameraPosition() {
        if (!this.controls) return;
        
        const cameraData = {
            position: {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            },
            target: {
                x: this.controls.target.x,
                y: this.controls.target.y,
                z: this.controls.target.z
            }
        };
        localStorage.setItem('camera', JSON.stringify(cameraData));
    }

    init() {
        // Grid setup
        const size = 10;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper(size, divisions);
        gridHelper.material.color.setHex(0x888888);
        gridHelper.material.opacity = 0.5;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Brighter ambient light
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Add a second directional light from opposite direction
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Camera position
        this.camera.position.set(0, 2, 5);
        
        // OrbitControls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1, 0);
        this.controls.update();

        // Load model
        const loader = new GLTFLoader();
        loader.load(
            './models/Soldier.glb',
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);

                // Setup animations
                this.animations = gltf.animations;
                this.mixer = new THREE.AnimationMixer(this.model);
                
                // Create animation buttons
                const panel = document.getElementById('animationPanel');
                this.animations.forEach(animation => {
                    const button = document.createElement('button');
                    button.className = 'anim-button';
                    button.textContent = animation.name;
                    button.onclick = () => {
                        // Remove active class from all buttons
                        panel.querySelectorAll('.anim-button').forEach(btn => 
                            btn.classList.remove('active'));
                        // Add active class to clicked button
                        button.classList.add('active');
                        // Play the animation
                        this.playAnimation(animation.name);
                    };
                    panel.appendChild(button);
                });

                // Play first animation by default
                if (this.animations.length > 0) {
                    this.playAnimation(this.animations[0].name);
                    panel.querySelector('.anim-button')?.classList.add('active');
                }
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the model:', error);
            }
        );
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            // Update camera aspect ratio
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            // Update renderer size
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Save camera position on every control change
        this.controls.addEventListener('change', () => {
            this.saveCameraPosition();
        });
    }

    playAnimation(name) {
        if (this.mixer) {
            // Stop current animation
            if (this.currentAnimation) {
                this.currentAnimation.stop();
            }

            // Find and play new animation
            const animation = this.animations.find(anim => 
                anim.name.toLowerCase().includes(name.toLowerCase())
            );

            if (animation) {
                this.currentAnimation = this.mixer.clipAction(animation);
                this.currentAnimation.play();
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update animation mixer
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }
}