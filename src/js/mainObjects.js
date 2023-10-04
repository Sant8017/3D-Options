// Creation elements
var scene = null,
    camera = null,
    renderer = null,
    controls = null;

const size = 20,
    divisions = 20;

// Variables para el contador
var countdown = 60; // El valor inicial del contador
var countdownInterval; // Almacenará el intervalo del contador

function updateCountdown() {
    document.getElementById("countdown").textContent = "Tiempo: " + countdown;
}

function startCountdown() {
    countdownInterval = setInterval(function () {
        countdown--;
        updateCountdown();

        if (countdown === 0) {
            document.getElementById("winPage").style.display = "block";
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function startScene() {
    // Scene, Camera, Renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x332244);
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('modelsLoad') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 20);
    controls.update();

    const lightAmbient = new THREE.AmbientLight(0x303030);
    scene.add(lightAmbient);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1); 
    scene.add(directionalLight);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 10, 10);
    scene.add(light);

    animate();

    loadModel_objMtl("../src/models/obj_mtl/escenario/","escenario.obj","escenario.mtl");
    loadModel_objMtl("../src/models/obj_mtl/personaje/","personaje.obj","personaje.mtl");
    loadGltf('../src/models/gltf/pato/', 'Duck.gltf');
    
    startCountdown(); // Inicia el contador
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function loadModel_objMtl(path, nameObj, nameMtl) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(path);
    mtlLoader.setPath(path);
    mtlLoader.load(nameMtl, function (materials) {
        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setPath(path);
        objLoader.setMaterials(materials);
        objLoader.load(nameObj, function (object) {
            scene.add(object);
            object.scale.set(2,2,2);
        });
    });
} 

function loadGltf(path, nameGltfGet) {
    var nameGltf = path + nameGltfGet;

    const loader = new THREE.GLTFLoader();

    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath(path);
    loader.setDRACOLoader(dracoLoader);

    loader.load(
        nameGltf,
        function (gltf) {
            scene.add(gltf.scene);

            gltf.animations;
            gltf.scene;
            gltf.scenes;
            gltf.cameras;
            gltf.asset;

            gltf.scene.position.set(0, 0, 2);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );
}

function createCollectibles() {
    const texture = new THREE.TextureLoader().load('../src/images/paperGift.jpg');
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(1, 1, -3);
    scene.add(cube);
}
