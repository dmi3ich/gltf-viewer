import * as THREE from './lib/three.module.js';
import { GLTFLoader } from './lib/GLTFLoader.js';
import { OrbitControls } from './lib/OrbitControls.js';

export class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Grid helper - increase divisions for smaller cells
        const size = 10;          // Total size of the grid
        const divisions = 50;     // Number of divisions (increase this for smaller cells)
        const gridHelper = new THREE.GridHelper(size, divisions);
        this.scene.add(gridHelper);

        // Axes helper
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Orbit Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(5, 10, -7.5);
        this.scene.add(light);

        // Camera Position
        this.camera.position.set(1, 3, -3);

        // Load 3D Model
        const loader = new GLTFLoader();
        loader.load(
            './models/Soldier.glb',
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);

                this.mixer = new THREE.AnimationMixer(this.model);
                if (gltf.animations.length > 0) {
                    const action = this.mixer.clipAction(gltf.animations[0]);
                    action.play();
                }
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error occurred while loading the model:', error);
            }
        );
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();

        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }
}