import './css/style.css';
import './css/dark.css';
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg') as HTMLCanvasElement,
})
renderer.setPixelRatio(window.devicePixelRatio)
camera.position.setZ(30)


const geometry = new THREE.TorusGeometry(20, 4.5, 15, 100)
const material = new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: true })
const torus = new THREE.Mesh(geometry, material);
torus.rotation.x = 2.2
torus.rotation.y = 0.5

torus.position.x = -2
torus.position.y = 3
torus.position.z = 3

scene.add(torus)
scene.background = new THREE.Color("rgb(32,32,32)")

function animate() {
  requestAnimationFrame(animate)
  torus.rotation.x = 2.5 - Math.cos(performance.now() / 4000) / 4
  torus.rotation.z += 0.0004
  updateTorusColor()
  renderer.render(scene, camera)
}


window.addEventListener('resize', resizeRenderer);
function resizeRenderer() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}


enum State {
  TowardsLight,
  TowardsDark
}

var s = State.TowardsDark;
var interpolation = 0;

var style = getComputedStyle(document.body)
var light = style.getPropertyValue('--light') 
var dark = style.getPropertyValue('--dark')

var lastFrameTime = performance.now()
var transitionTime = +style.getPropertyValue('--transition-time').replace('s', '') * 1000
let transitionSpeed = 1 / transitionTime

function updateTorusColor() {
  let currFrameTime = performance.now()
  let timeSinceLastFrame = currFrameTime - lastFrameTime
  interpolation = Math.min(1, Math.max(0, interpolation + timeSinceLastFrame * (s == State.TowardsLight ? transitionSpeed : -transitionSpeed)))
  torus.material.color = new THREE.Color(dark).lerp(new THREE.Color(light), interpolation)
  lastFrameTime = currFrameTime
}

const listElements = document.querySelectorAll('a');
listElements.forEach(element => {
  element.addEventListener('mouseenter', () => s = State.TowardsLight);
  element.addEventListener('mouseleave', () => s = State.TowardsDark);
});

resizeRenderer();
animate()