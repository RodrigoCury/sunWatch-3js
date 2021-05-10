import * as THREE from 'three'
import * as dat from 'dat.gui'
import './styles.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Setup
 */
// Canvas 
const canvas = document.querySelector('canvas.js-canvas')

// Scene
const scene = new THREE.Scene();

// Debug
const gui = new dat.GUI();

// Sizes
const sizes = {
    height: window.innerHeight,
    width: window.innerWidth,
}

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.setClearColor('#eedca5')
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .5, 20)
camera.position.set(1, 3, 3)
camera.up = new THREE.Vector3(0, 1, 0);
camera.lookAt(0, 0, 0)
scene.add(camera)

// Orbit Controls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = false // Can be used to give a sense of weight to the controls

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshStandardMaterial({
        color: '#CBE6BE',
    })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * .5

scene.add(floor)

/**
 * Pilar
 */

const pilar = new THREE.Mesh(
    new THREE.ConeBufferGeometry(.25, 2, 5, 1),
    new THREE.MeshStandardMaterial({
        color: '#853C4A',
        roughness: 0.8,
        wireframe: false
    })
)
pilar.castShadow = true;
pilar.position.set(0, 1, 0)
scene.add(pilar)

/**
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight('#C4F1EE', .25)
scene.add(ambientLight)

// Sunlight
const sunlightColors = {
    lighter: '#eedca5',
    light: '#f0d084',
    standard: '#e3bf79',
    dark: '#e5b365',
    darker: '#f2a94e',
}

const sunlight = new THREE.DirectionalLight(sunlightColors.standard, .75)
sunlight.castShadow = true
sunlight.position.set(0, 3, 1)

const sunlightHelper = new THREE.DirectionalLightHelper(sunlight, .5, sunlight.color)

scene.add(sunlight, sunlightHelper, sunlight.target)

// Debug 
const sunlightFolder = gui.addFolder("Sunlight")
sunlightFolder.add(sunlight.position, 'x').min(-7).max(7).step(.1)
sunlightFolder.add(sunlight.position, 'y').min(-7).max(7).step(.1)
sunlightFolder.add(sunlight.position, 'z').min(-7).max(7).step(.1)
sunlightFolder.add(sunlight, 'intensity').min(0).max(1).step(.001)
sunlightFolder.add(sunlightHelper, 'visible').name("Hide Helper")
sunlightFolder.add(ambientLight, 'intensity').name("Amb intensity").min(0).max(1).step(.001)


/**
 * Axes Helper
 */

const axes = new THREE.AxesHelper()
scene.add(axes)

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Lights
    sunlight.position.x = -Math.sin(elapsedTime) * 5
    sunlight.position.y = (Math.cos(elapsedTime) * 5)
    sunlightHelper.update();

    sunlight.intensity = (sunlight.position.y < 0) ? 0 : .9

    // Update controls
    orbitControls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () => {

    // Updating Sizes
    sizes.height = window.innerHeight
    sizes.width = window.innerWidth
    sizes.aspectRatio = sizes.width / sizes.height

    // Updating Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //  Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})