import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// To actually be able to display anything with three.js, we need three things: scene, camera and renderer, so that we can render the scene with camera.
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1500 ); // fov, aspect raio, near clipping pane, far clipping pane
const renderer = new THREE.WebGLRenderer();
const loader = new GLTFLoader(); // loads 3d elements

// postition camera
camera.position.set(90,90,90); // or camera.position.z = 5;
camera.lookAt(0,0,0);

// add lights
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const bottomLight = new THREE.DirectionalLight(0xffffff, 1);
bottomLight.position.set(-500, -500, -500);
bottomLight.castShadow = true;
scene.add(bottomLight);


const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

document.body.appendChild( renderer.domElement );

// load 3d model
loader.load('./public/coffee_shop/scene.gltf', 
function(gltf){
	const box = new THREE.Box3().setFromObject( gltf.scene );
	const center = box.getCenter( new THREE.Vector3() );
	
	gltf.scene.position.x += ( gltf.scene.position.x - center.x );
	gltf.scene.position.y += ( gltf.scene.position.y - center.y );
	gltf.scene.position.z += ( gltf.scene.position.z - center.z );
	scene.add(gltf.scene);
}, 
undefined, 
function(error){
	console.error(error);
}
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

renderer.setSize( window.innerWidth, window.innerHeight );

// animation
function animate( time ) {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}


// resize window listener
window.addEventListener('resize', function(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

// check if webGl is available
if ( WebGL.isWebGLAvailable() ) {
	// Initiate function or other initializations here
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}