import {gsap} from 'gsap'
import * as THREE from 'three'
import Experience from './Experience.js'

export default class Base {
    constructor() {
        console.log('Base')
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setGeometry()
        this.setGeometry()
        this.setColors()
        this.setLoadingManager()
        this.setMaterial()
        this.setLights()
        // this.setTexture()
        this.setMesh()
        this.setGUI()
    }

    setGeometry() {
        // this.geometry = new THREE.SphereGeometry(1, 16, 16)
        this.geometry = new THREE.BoxGeometry(6, 6, 6, 4, 4, 4)
        // this.geometry = new THREE.TorusGeometry(1, 0.35, 32, 100)
        console.log('UV =>', this.geometry.attributes.uv)
    }

    setGroup() {
        console.log('setGroup', this)
    }

    setColors() {
        this.colors = {}
        this.colors.value = 'limegreen'
    }

    setTexture() {
        this.texture = {}
        const textureLoader = new THREE.TextureLoader()
    }

    setLoadingManager() {
        const loadingManager = new THREE.LoadingManager()
        loadingManager.onStart = () => {
            console.log('loading started')
        }
        loadingManager.onLoad = () => {
            console.log('loading finished')
        }
        loadingManager.onProgress = () => {
            console.log('loading progressing')
        }
        loadingManager.onError = () => {
            console.log('loading error')
        }

        this.texture = {}
        const textureLoader = new THREE.TextureLoader(loadingManager)
        this.texture.doorColor = textureLoader.load(
            '/assets/textures/door/color.jpg'
        )
        this.texture.doorAlpha = textureLoader.load(
            '/assets/textures/door/alpha.jpg'
        )
        this.texture.doorHeight = textureLoader.load(
            '/assets/textures/door/height.png'
        )
        this.texture.doorNormal = textureLoader.load(
            '/assets/textures/door/normal.jpg'
        )
        this.texture.doorAmbientOcclusion = textureLoader.load(
            '/assets/textures/door/ambientOcclusion.jpg'
        )
        this.texture.doorMetalness = textureLoader.load(
            '/assets/textures/door/metalness.jpg'
        )
        this.texture.doorRoughness = textureLoader.load(
            '/assets/textures/door/roughness.jpg'
        )

        /**
         * To repeat the texture (if too small):
         */
        // this.texture.doorColor.wrapS = THREE.RepeatWrapping
        // this.texture.doorColor.wrapT = THREE.RepeatWrapping

        /**
         * To rotate the texture
         * rq: always use baseColor layer
         */
        // this.texture.doorColor.rotation = Math.PI * 0.25
        // this.texture.doorColor.center.x = 0.5
        // this.texture.doorColor.center.y = 0.5
    }

    /**
     * Set the lights
     * Surement une erreur de le faire ici, peux-etre mieux sur Experience?
     */
    setLights() {
        this.lights = {}
        const keyLightColor = 0xffffff
        const fillLightColor = 0xff0000
        const rimLightColor = 0xffffff

        // Create the key light
        const keyLight = new THREE.DirectionalLight(keyLightColor, 1.0)
        keyLight.position.set(-1, 2, 4)
        this.scene.add(keyLight)

        // Create the fill light
        const fillLight = new THREE.DirectionalLight(fillLightColor, 0.5)
        fillLight.position.set(1, -1, 2)
        this.scene.add(fillLight)

        // Create the rim light
        const rimLight = new THREE.DirectionalLight(rimLightColor, 0.5)
        rimLight.position.set(0, 1, -2)
        this.scene.add(rimLight)
    }

    setMaterial() {
        // this.material = new THREE.MeshBasicMaterial({ wireframe: true, color: this.colors.value, map: this.texture });

        this.material = new THREE.MeshStandardMaterial({
            map: this.texture.doorColor,
            alphaMap: this.texture.doorAlpha,
            normalMap: this.texture.doorNormal,
            aoMap: this.texture.doorAmbientOcclusion,
            aoMapIntensity: 1.0,
            metalnessMap: this.texture.doorMetalness,
            roughnessMap: this.texture.doorRoughness
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    setGUI() {
        const PARAMS = {
            wireframe: false,
            // color: '#32CD32',
            segment: 16,
            spin: () => {
                console.log('spin', this)
                gsap.to(this.mesh.rotation, {
                    duration: 1,
                    y: this.mesh.rotation.y + Math.PI * 2
                })
            }
        }

        // this.experience.debug.addInput(PARAMS, 'color',
        // 	{
        // 		view: 'color',
        // 		// picker: 'inline',
        // 		// expanded: true
        // 	}).on('change', (_event) => {
        // 		this.material.color.set(_event.value)
        // 	})

        this.experience.debug
            .addInput(PARAMS, 'wireframe')
            .on('change', _event => {
                this.material.wireframe = _event.value
            })

        this.experience.debug
            .addInput(PARAMS, 'segment', {min: 2, max: 64, step: 2})
            .on('change', _event => {
                PARAMS.segment = _event.value

                // Dispose of the old geometry
                this.mesh.geometry.dispose()

                // Create a new geometry with the updated segment count
                this.mesh.geometry = new THREE.BoxGeometry(
                    2,
                    2,
                    2,
                    PARAMS.segment,
                    PARAMS.segment,
                    PARAMS.segment
                )
            })

        this.experience.debug
            .addButton({title: 'Spin'})
            .on('click', PARAMS.spin)
    }

    update() {
        this.material.uniforms.uTime.value = this.time
    }
}
