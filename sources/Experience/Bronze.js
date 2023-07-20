import { gsap } from 'gsap'
import * as THREE from 'three'
import Experience from './Experience.js'


export default class Bronze {
  constructor() {
    console.log('Bronze')
    this.experience = new Experience()
    this.scene = this.experience.scene


    this.setGeometry()
    this.setGeometry()
    this.setLoadingManager()
    this.setMaterial()
    this.setLights()
    this.setMesh()
    this.setGUI()
    this.setFog()
  }

  setFog () {
    this.scene.fog = new THREE.Fog(0x000000, 1, 100)
  }

  setGeometry () {
    // this.geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
    // this.geometry = new THREE.BoxGeometry(1,1,1, 4, 4, 4)
    this.geometry = new THREE.SphereGeometry(1, 64, 64)
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
    this.texture.bronzeColor = textureLoader.load(
      '/assets/textures/bronze/baseColor.png'
    )
    this.texture.bronzeBump = textureLoader.load(
      '/assets/textures/bronze/bump.png'
    )
    this.texture.bronzeBump16Bit = textureLoader.load(
      '/assets/textures/bronze/bump16bit.png'
    )

    this.texture.bronzeDisplacement = textureLoader.load(
      '/assets/textures/bronze/displacement.png'
    )
    this.texture.bronzeDisplacement16Bit = textureLoader.load(
      '/assets/textures/bronze/displacement16bit.png'
    )
    this.texture.bronzeMetalness = textureLoader.load(
      '/assets/textures/bronze/metalness.png'
    )
    this.texture.bronzeNormal = textureLoader.load(
      '/assets/textures/bronze/normal.png'
    )
    this.texture.bronzeRoughness = textureLoader.load(
      '/assets/textures/bronze/roughness.png'
    )

    // this.texture.bronzeColor.wrapS = THREE.RepeatWrapping
    // this.texture.bronzeColor.wrapT = THREE.RepeatWrapping

    // this.texture.woodColor.repeat.set(2, 2)
  }

  /**
   * Set the lights
   * Surement une erreur de le faire ici, peux-etre mieux sur Experience?
   */
  setLights () {
    this.lights = {}
    const keyLightColor = 0xffffed
    const fillLightColor = 0xffffed
    const rimLightColor = 0xffffed

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
      map: this.texture.bronzeColor,        // Base color texture
      bumpMap: this.texture.bronzeBump16Bit,    // Bump texture
      bumpMap16Bit: this.texture.bronzeBump16Bit,    // Bump texture
      // displacementMap: this.texture.bronzeDisplacement,
      metalnessMap: this.texture.bronzeMetalness,
      normalMap: this.texture.bronzeNormal,
      roughnessMap: this.texture.bronzeRoughness,
      metalness: 0.8,
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
