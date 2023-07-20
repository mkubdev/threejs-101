import { gsap } from 'gsap'
import * as THREE from 'three'
import Experience from './Experience.js'

export default class Marble {
  constructor() {
    console.log('Marble')
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setGeometry()
    this.setGeometry()
    this.setLoadingManager()
    this.setMaterial()
    this.setLights()
    this.setMesh()
    this.setGUI()
  }

  setGeometry () {
    // this.geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
    // this.geometry = new THREE.BoxGeometry(1,1,1, 4, 4, 4)
    this.geometry = new THREE.SphereGeometry(1, 32, 32)
    console.log('UV =>', this.geometry.attributes.uv)
  }

  setGroup () {
    console.log('setGroup', this)
  }


  setLoadingManager () {
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
    this.texture.marbleColor = textureLoader.load(
      '/assets/textures/marble/baseColor.png'
    )
    this.texture.marbleMask = textureLoader.load(
      '/assets/textures/marble/mask.png'
    )
    this.texture.marbleMetalness = textureLoader.load(
      '/assets/textures/marble/metalness.png'
    )
    this.texture.marbleNormal = textureLoader.load(
      '/assets/textures/marble/normal.png'
    )
    this.texture.marbleRoughness = textureLoader.load(
      '/assets/textures/marble/roughness.png'
    )

    // this.texture.marbleColor.wrapS = THREE.RepeatWrapping
    // this.texture.marbleColor.wrapT = THREE.RepeatWrapping

    // this.texture.woodColor.repeat.set(2, 2)
  }

  /**
   * Set the lights
   * Surement une erreur de le faire ici, peux-etre mieux sur Experience?
   */
  setLights () {
    this.lights = {}
    const keyLightColor = 0xffffff
    const fillLightColor = 0xffffff
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

  setMaterial () {
    // this.material = new THREE.MeshBasicMaterial({ wireframe: true, color: this.colors.value, map: this.texture });
    // this.material = new THREE.MeshBasicMaterial({ map: this.texture.waffleColor });
    this.material = new THREE.MeshStandardMaterial({
      map: this.texture.marbleColor,        // Base color texture
      alphaMap: this.texture.marbleMask,    // Opacity/mask texture
      metalnessMap: this.texture.marbleMetalness,
      normalMap: this.texture.marbleNormal,
      roughnessMap: this.texture.marbleRoughness
    })
  }

  setMesh () {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  setGUI () {
    const PARAMS = {
      wireframe: false,
      spin: () => {
        gsap.to(this.mesh.rotation, {
          duration: 1,
          y: this.mesh.rotation.y + Math.PI * 2
        })
      },
      autorotate: false
    }

    this.experience.debug
      .addInput(PARAMS, 'wireframe')
      .on('change', _event => {
        this.material.wireframe = _event.value
      })

    this.experience.debug
      .addInput(PARAMS, 'autorotate')
      .on('change', _event => {
        if (_event.value) {
          gsap.to(this.mesh.rotation, {
            duration: 8,
            y: this.mesh.rotation.y + Math.PI * 2,
            repeat: -1,
            ease: 'none'
          })
        } else {
          gsap.killTweensOf(this.mesh.rotation)
        }
      })

    this.experience.debug
      .addButton({ title: 'Spin' })
      .on('click', PARAMS.spin)
  }

  update () {
    this.material.uniforms.uTime.value = this.time
  }
}
