import { gsap } from 'gsap'
import * as THREE from 'three'
import Experience from './Experience.js'
import { ceilPowerOfTwo } from 'three/src/math/MathUtils.js'


export default class TrioShadow {
  constructor() {
    console.log('TrioShadow')
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setPlane()
    this.setGroup();
    this.setLoadingManager()
    this.setMaterial()
    this.setLights()
    this.setMesh()
    this.setFog()

    if (this.experience.debug) {
      this.setGUI()
    }
  }

  setFog () {
    this.scene.fog = new THREE.Fog(0x000000, 1, 100)
  }

  setPlane () {
    this.plane = new THREE.PlaneGeometry(10, 10, 2, 2);
  }

  /**
   * setGroup function:
   * Creates THREE.Mesh objects using THREE.SphereGeometry and a material, and adds them to a group.
   * Note: Always add Mesh objects, not Geometry objects, to a group.
   */
  setGroup () {
    this.group = new THREE.Group()

    const limegreen = new THREE.MeshStandardMaterial({ color: 0x32CD32, metalness: 0.9, roughness: 0.4 });
    const purple = new THREE.MeshStandardMaterial({ color: 0xab68ff, metalness: 0.9, roughness: 0.4 });
    const cyan = new THREE.MeshStandardMaterial({ color: 0x66ccff, metalness: 0.9, roughness: 0.4 });

    const ball1 = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), limegreen);
    ball1.position.x = 0
    ball1.castShadow = true
    this.group.add(ball1)

    const ball2 = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), purple);
    ball2.position.x = -3
    this.group.add(ball2)

    const ball3 = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), cyan);
    ball3.position.x = 3
    this.group.add(ball3)

    ball1.castShadow = true;
    ball1.receiveShadow = true;
    ball2.castShadow = true;
    ball2.receiveShadow = true;
    ball3.castShadow = true;
    ball3.receiveShadow = true;

    this.scene.add(this.group)
  }

  setMaterial () {
    this.material = new THREE.MeshStandardMaterial({
      map: this.texture.bronzeColor,        // Base color texture
      bumpMap: this.texture.bronzeBump16Bit,    // Bump texture
      displacementMap: this.texture.bronzeDisplacement,
      metalnessMap: this.texture.bronzeMetalness,
      normalMap: this.texture.bronzeNormal,
      roughnessMap: this.texture.bronzeRoughness,
      metalness: 0.8,
    })

    this.planMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.4 });
  }

  /**
   * setMesh function:
   * Iterates over the group's children, which are Mesh objects.
   * Creates new Mesh objects and replaces the original ones in the group.
   * Note: This doesn't automatically add the new meshes to the scene.
   */
  setMesh () {

    // Bronze mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)

    // ?? this.group mesh is set directly into setGroup()

    // Plane mesh
    this.planMesh = new THREE.Mesh(this.plane, this.planMaterial)
    this.planMesh.position.set(0, -1.2, 0)
    this.planMesh.rotation.set(-Math.PI / 2, 0, 0)
    this.planMesh.receiveShadow = true
    this.scene.add(this.planMesh)
  }

  // ==== SCENE SETUP ====//

  /**
   * Set the lights
   */
  setLights () {
    this.lights = {};

    // Ambient light
    this.lights.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.lights.ambientLight);

    // Directional light
    this.lights.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.lights.directionalLight.position.set(2, 2, -1);
    this.scene.add(this.lights.directionalLight);

    this.lights.directionalLight.castShadow = true;
  }

  /**
   * Set the GUI
   * cf tweakpane doc
   */
  setGUI () {

    const PARAMS = {

      // Lights
      ambientLightIntensity: this.lights.ambientLight.intensity,
      directionalLightIntensity: this.lights.directionalLight.intensity,
      x: this.lights.directionalLight.position.x,
      y: this.lights.directionalLight.position.y,
      z: this.lights.directionalLight.position.z,

      // Shadow
      directionalLightCastShadow: true,

      // Scene
      spin: () => {
        gsap.to(this.group.rotation, {
          duration: 1,
          y: this.group.rotation.y + Math.PI * 2
        })
      },
      autorotate: false,
    }

    // === LIGHTS FOLDER ===
    const lightsFolder = this.experience.debug.addFolder({
      title: 'Lights',
      expanded: true,
      // collapsed: true
    })

    lightsFolder.addInput(PARAMS, 'ambientLightIntensity', {
      min: 0,
      max: 1,
      step: 0.001
    }).on('change', _event => {
      this.lights.ambientLight.intensity = _event.value
    })

    lightsFolder.addInput(PARAMS, 'directionalLightIntensity', {
      min: 0,
      max: 1,
      step: 0.001
    }).on('change', _event => {
      this.lights.directionalLight.intensity = _event.value
    })

    lightsFolder.addInput(PARAMS,
      'x', {
      min: -5,
      max: 5,
      step: 0.001
    }).on('change', _event => {
      this.lights.directionalLight.position.x = _event.value
    })

    lightsFolder.addInput(PARAMS,
      'y', {
      min: -5,
      max: 5,
      step: 0.001
    }).on('change', _event => {
      this.lights.directionalLight.position.y = _event.value
    })

    lightsFolder.addInput(PARAMS,
      'z', {
      min: -5,
      max: 5,
      step: 0.001
    }).on('change', _event => {
      this.lights.directionalLight.position.z = _event.value
    })

    // === SHADOW FOLDER === 
    const shadowFolder = this.experience.debug.addFolder({
      title: 'Shadow',
      expanded: true,
    })

    shadowFolder.addInput(PARAMS, 'directionalLightCastShadow', {
      label: 'directionalLight castShadow'
    }).on('change', _event => {
      this.lights.directionalLight.castShadow = _event.value
    })


    // === SCENE FOLDER === 
    const sceneFolder = this.experience.debug.addFolder({
      title: 'Scene',
      expanded: true,
    });

    // Autorotate
    sceneFolder.addInput(PARAMS, 'autorotate', {
      label: 'autorotate'
    }).on('change', _event => {
      if (_event.value) {
        gsap.to(this.group.rotation, {
          duration: 8,
          y: this.group.rotation.y + Math.PI * 2,
          repeat: -1,
          ease: 'none'
        })
      } else {
        gsap.killTweensOf(this.group.rotation)
      }
    });

    // Button spin action
    this.experience.debug
      .addButton({ title: 'Spin 💣' })
      .on('click', PARAMS.spin)
  }

  /**
   * Set the loading manager for the textures
   * @returns {Promise<void>}
   */
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
   * Update the material
   *
   */
  update () {
  }
}
