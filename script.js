document.addEventListener('DOMContentLoaded', function() {

    // ==================================================
    // THREE.JS SETUP
    // ==================================================

    if (typeof THREE === 'undefined') {
        console.error('Three.js tidak termuat.');
        return;
    }

    // Setup dasar: Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
        alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0, 0, 25); // Mundurkan kamera sedikit untuk melihat efeknya

    // ==================================================
    // MEMBUAT EFEK GELOMBANG (LIQUID WAVE)
    // ==================================================

    // 1. Buat bentuk bidang datar dengan banyak segmen
    const planeGeometry = new THREE.PlaneGeometry(200, 200, 70, 70);

    // 2. Buat material wireframe agar gelombangnya terlihat jelas
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x8B5CF6, // Warna ungu dari tema Anda
        wireframe: true
    });

    // 3. Buat Mesh (objek 3D) dari Plane
    const wavePlane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(wavePlane);

    // Miringkan sedikit agar terlihat lebih menarik
    wavePlane.rotation.x = -0.4;

    // Simpan posisi asli untuk referensi
    const originalPositions = planeGeometry.attributes.position.clone();
    const count = planeGeometry.attributes.position.count;
    
    // Mouse tracking untuk interaksi
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        // Normalisasi posisi mouse dari -1 sampai 1
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // ==================================================
    // LOOP ANIMASI
    // ==================================================
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Animasikan setiap titik pada bidang datar
        for (let i = 0; i < count; i++) {
            const x = originalPositions.getX(i);
            const y = originalPositions.getY(i);

            // Fungsi sinus untuk membuat gelombang
            const waveX = Math.sin(x * 0.1 + elapsedTime * 0.5) * 1.5;
            const waveY = Math.sin(y * 0.1 + elapsedTime * 0.5) * 1.5;

            // Update posisi Z (kedalaman) untuk menciptakan gelombang
            planeGeometry.attributes.position.setZ(i, waveX + waveY);
        }

        // Memberitahu Three.js bahwa posisi vertex telah diubah
        planeGeometry.attributes.position.needsUpdate = true;

        // Efek paralaks kamera berdasarkan mouse
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // ==================================================
    // KODE LAMA (RESIZE & SCROLL OBSERVER)
    // ==================================================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
});