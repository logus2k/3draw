import * as THREE from '../library/three.module.min.js';
import { OrbitControls } from '../library/OrbitControls.js';

export class MillimetricScene {
    constructor(container) {
        this.container = container;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f3); // Light theme background

        this.camera = new THREE.PerspectiveCamera(
            25,
            container.clientWidth / container.clientHeight,
            1,
            5000
        );

        // Renderer Setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "low-power" // Prefers integrated GPU to save energy
        });
        
        // Limit pixel ratio to 2. High-DPI (Retina) screens often 
        // try to render 3x or 4x, which destroys GPU performance.
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        // Controls Setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        // DISABLING DAMPING: This ensures that when you stop moving the mouse, 
        // the 'change' event stops firing immediately, dropping GPU usage to 0%.
        this.controls.enableDamping = false; 
        
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1; 
        this.controls.maxDistance = 1000;
        this.controls.maxPolarAngle = Math.PI / 2.0;

        // ---------------------------------------------------------
        // ON-DEMAND RENDERING: No requestAnimationFrame loop.
        // The scene only draws when the camera actually moves.
        // ---------------------------------------------------------
        this.controls.addEventListener('change', () => this.render());

        this.#addLights();
        this.#addMillimetricGrid();
        this.#onResize();

        window.addEventListener('resize', () => this.#onResize());
        
        // Initial Draw
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    #addLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        const dir = new THREE.DirectionalLight(0xffffff, 0.6);
        dir.position.set(10, 20, 10);
        this.scene.add(ambient, dir);
    }

    #addMillimetricGrid() {
        const size = 100;
        
        // Grey for the smallest squares (most frequent grid lines)
        const grid1 = new THREE.GridHelper(size, size, 0xd8d8d8, 0xd8d8d8); // Light grey
        grid1.material.opacity = 0.50;
        grid1.material.transparent = true;

        // Soft blue for medium squares
        const grid5 = new THREE.GridHelper(size, size / 5, 0xb3d1ff, 0xb3d1ff); // Light-medium blue
        grid5.material.opacity = 0.80;
        grid5.material.transparent = true;

        // Soft blue for larger squares
        const grid10 = new THREE.GridHelper(size, size / 10, 0x99c2ff, 0x99c2ff); // More defined soft blue
        grid10.material.opacity = 0.90;
        grid10.material.transparent = true;

        this.gridSize = size;
        this.scene.add(grid1, grid5, grid10);
    }

    #fitGridToView(gridSize) {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        const aspect = w / h;
        const fovRad = THREE.MathUtils.degToRad(this.camera.fov);
        const halfFovTan = Math.tan(fovRad / 2);

        const distanceV = (gridSize / 2) / halfFovTan;
        const distanceH = (gridSize / 2) / (halfFovTan * aspect);
        const requiredDistance = Math.max(distanceV, distanceH); 
        
        const margin = 0.5;
        const distance = requiredDistance * margin;
        
        this.camera.position.set(distance, distance * 0.9, distance);
        this.camera.lookAt(0, 0, 0);
        this.controls.target.set(0, 0, 0);
        
        this.controls.update();
        this.render(); // Redraw after repositioning
    }

    #onResize() {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);

        this.#fitGridToView(this.gridSize);
    }
}
