// ========================================
// SILVER SAINTS - Three.js 3D Scene
// Interactive Gothic Cross
// ========================================

class SilverSaintsScene {
    constructor() {
        this.container = document.getElementById('threeContainer');
        this.canvas = document.getElementById('threeCanvas');

        if (!this.container || !this.canvas) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cross = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.isDragging = false;
        this.previousMouseX = 0;
        this.previousMouseY = 0;

        this.init();
        this.createCross();
        this.createParticles();
        this.createLights();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0a0a, 5, 15);

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.z = 5;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }

    createCross() {
        // Create a group for the cross
        this.cross = new THREE.Group();

        // Material - Chrome/Silver look
        const material = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 1.5
        });

        // Create cross geometry using boxes
        // Vertical bar
        const verticalGeometry = new THREE.BoxGeometry(0.3, 2.5, 0.15);
        const vertical = new THREE.Mesh(verticalGeometry, material);
        vertical.position.y = -0.2;

        // Horizontal bar
        const horizontalGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.15);
        const horizontal = new THREE.Mesh(horizontalGeometry, material);
        horizontal.position.y = 0.5;

        // Add decorative elements - fleur-de-lis inspired ends
        const endGeometry = new THREE.SphereGeometry(0.12, 16, 16);

        const endTop = new THREE.Mesh(endGeometry, material);
        endTop.position.set(0, 1.05, 0);
        endTop.scale.set(1, 1.2, 0.8);

        const endBottom = new THREE.Mesh(endGeometry, material);
        endBottom.position.set(0, -1.45, 0);
        endBottom.scale.set(1, 1.2, 0.8);

        const endLeft = new THREE.Mesh(endGeometry, material);
        endLeft.position.set(-0.87, 0.5, 0);
        endLeft.scale.set(1.2, 1, 0.8);

        const endRight = new THREE.Mesh(endGeometry, material);
        endRight.position.set(0.87, 0.5, 0);
        endRight.scale.set(1.2, 1, 0.8);

        // Add center jewel
        const jewelGeometry = new THREE.OctahedronGeometry(0.15, 0);
        const jewelMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 1,
            roughness: 0
        });
        const jewel = new THREE.Mesh(jewelGeometry, jewelMaterial);
        jewel.position.set(0, 0.5, 0.1);
        jewel.rotation.z = Math.PI / 4;

        // Add to cross group
        this.cross.add(vertical);
        this.cross.add(horizontal);
        this.cross.add(endTop);
        this.cross.add(endBottom);
        this.cross.add(endLeft);
        this.cross.add(endRight);
        this.cross.add(jewel);

        // Add chain links
        this.addChain();

        this.scene.add(this.cross);
    }

    addChain() {
        const chainMaterial = new THREE.MeshStandardMaterial({
            color: 0xa0a0a0,
            metalness: 0.8,
            roughness: 0.2
        });

        // Create chain links on both sides going up
        for (let side = -1; side <= 1; side += 2) {
            for (let i = 0; i < 8; i++) {
                const linkGeometry = new THREE.TorusGeometry(0.05, 0.015, 8, 16);
                const link = new THREE.Mesh(linkGeometry, chainMaterial);

                // Position links going diagonally up
                link.position.set(
                    side * (0.5 + i * 0.12),
                    1.2 + i * 0.1,
                    0
                );

                // Alternate rotation for chain effect
                if (i % 2 === 0) {
                    link.rotation.y = Math.PI / 2;
                }

                this.cross.add(link);
            }
        }
    }

    createParticles() {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xc0c0c0,
            size: 0.02,
            transparent: true,
            opacity: 0.5
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        // Main spotlight
        const spotlight = new THREE.SpotLight(0xffffff, 1);
        spotlight.position.set(5, 5, 5);
        spotlight.castShadow = true;
        this.scene.add(spotlight);

        // Fill light
        const fillLight = new THREE.PointLight(0xc0c0c0, 0.5);
        fillLight.position.set(-5, 0, 3);
        this.scene.add(fillLight);

        // Back light for rim effect
        const backLight = new THREE.PointLight(0xffffff, 0.3);
        backLight.position.set(0, 0, -5);
        this.scene.add(backLight);
    }

    addEventListeners() {
        // Mouse move for subtle rotation
        this.container.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.previousMouseX;
                const deltaY = e.clientY - this.previousMouseY;

                this.targetRotationY += deltaX * 0.01;
                this.targetRotationX += deltaY * 0.01;

                this.previousMouseX = e.clientX;
                this.previousMouseY = e.clientY;
            } else {
                // Subtle follow effect
                const rect = this.container.getBoundingClientRect();
                this.mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.3;
                this.mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.3;
            }
        });

        // Mouse down/up for dragging
        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.previousMouseX = e.clientX;
            this.previousMouseY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Touch events
        this.container.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.previousMouseX = e.touches[0].clientX;
            this.previousMouseY = e.touches[0].clientY;
        });

        this.container.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                const deltaX = e.touches[0].clientX - this.previousMouseX;
                const deltaY = e.touches[0].clientY - this.previousMouseY;

                this.targetRotationY += deltaX * 0.01;
                this.targetRotationX += deltaY * 0.01;

                this.previousMouseX = e.touches[0].clientX;
                this.previousMouseY = e.touches[0].clientY;
            }
            e.preventDefault();
        });

        this.container.addEventListener('touchend', () => {
            this.isDragging = false;
        });

        // Scroll zoom
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.position.z += e.deltaY * 0.005;
            this.camera.position.z = Math.max(3, Math.min(8, this.camera.position.z));
        });

        // Resize
        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.cross) {
            // Auto rotation when not dragging
            if (!this.isDragging) {
                this.cross.rotation.y += 0.002;

                // Subtle float effect
                this.cross.position.y = Math.sin(Date.now() * 0.001) * 0.05;

                // Mouse follow
                this.cross.rotation.x += (this.mouseY - this.cross.rotation.x * 0.5) * 0.02;
            } else {
                // Smooth drag rotation
                this.cross.rotation.x += (this.targetRotationX - this.cross.rotation.x) * 0.1;
                this.cross.rotation.y += (this.targetRotationY - this.cross.rotation.y) * 0.1;
            }

            // Jewel rotation
            if (this.cross.children[6]) {
                this.cross.children[6].rotation.y += 0.02;
            }
        }

        // Particle animation
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.0005;
            this.particleSystem.rotation.x += 0.0002;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for loader to complete
    setTimeout(() => {
        new SilverSaintsScene();
    }, 100);
});