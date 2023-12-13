import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class SceneInit {
  constructor(canvasElement) {
    this.scene = new THREE.Scene();
    this.canvas = canvasElement;
    this.camera = undefined;
    this.renderer = undefined;
    this.stats = undefined;
    this.animationFrameId = null;
  }

  initialize() {
    // Camera setup
    const aspectRatio = 1;
    this.camera = new THREE.PerspectiveCamera(
      75, // Field of view
      aspectRatio, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    this.camera.position.z = 5;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setClearColor(new THREE.Color('#121212')); // Set background color
    
    // Set the size of the renderer to create a square view
    const size = Math.min(window.innerWidth, window.innerHeight);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(this.ambientLight);

    // Directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    // Resize Listener
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // Stats (optional)
    this.stats = new Stats();
    // Append stats.dom to a UI element of your choice for display
    // For example, to append to body: document.body.appendChild(this.stats.dom);
  }

  animate() {
    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
    this.render();
    if (this.stats) this.stats.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    // Dispose of scene resources
    // ... disposal code ...
  }
  
  // Add cleanMaterial function here, outside of the dispose function
  cleanMaterial(material) {
    // ... material disposal code ...
  }
}
