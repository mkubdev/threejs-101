import { gsap } from 'gsap'
import * as THREE from 'three'
import Experience from './Experience.js'


/**
 * This experience focus on how to load a .gltf model and animate it.
 * I'm using a sketchfab model: https://sketchfab.com/3d-models/jiggly-watermelon-jello-c15e41a62b46487fa6dcc67af7f7acee
 */
export default class Watermelon {
  constructor() {
    console.log('Watermelon')
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.clock = new THREE.Clock();

    this.setPlane()
    this.setModel();
    this.setMaterial()
    this.setLights()
    this.setMesh()
    this.setFog()
    this.setAnimations()

    if (this.experience.debug) {
      this.setGUI()
    }
  }

  /**
   * Jiggly Watermelon Jello model
   */
  setModel () {
    this.model = {}

    this.model.mesh = this.experience.resources.items['watermelon'].scene;
    // console.log("Mesh Watermelon =>", this.model.mesh)

    // traverse = traverse the hierarchy of the model
    this.model.mesh.traverse((node) => {
      if (node.isMesh) {

        node.material.castShadow = true;
        node.material.receiveShadow = true;

        // Check if the material of the mesh is a MeshStandardMaterial (or another material type that has the 'transparent' property)
        if (node.material instanceof THREE.MeshStandardMaterial) {
          console.log("node.material =>", node.material)
          if (node.material.name == "Pink") {
            node.material.transparent = true;
            node.material.opacity = 1;
            node.material.roughness = 0.5;
          }
          if (node.material.name == "Jelly") {
            node.material.transparent = true;
            node.material.opacity = .7;

            // Increase metalness and decrease roughness for more shiny appearance
            node.material.metalness = 0.6;
            node.material.roughness = 0.1;
          }
          node.material.depthWrite = true;
        }
      }
    });

    this.scene.add(this.model.mesh)
  }

  setFog () {
    this.scene.fog = new THREE.Fog(0x000000, 1, 100)
  }

  setPlane () {
    this.plane = new THREE.PlaneGeometry(100, 100);
  }

  setMaterial () {
    this.planMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.3 });
  }

  setMesh () {
    // studio plan mesh
    this.planMesh = new THREE.Mesh(this.plane, this.planMaterial);
    this.planMesh.position.set(0, -1, -5);
    this.planMesh.rotation.x = -Math.PI / 2;
    this.planMesh.receiveShadow = true;
    this.scene.add(this.planMesh);
  }

  // ==== SCENE SETUP ====//

  /**
   * Set the lights
   */
  setLights () {
    this.lights = {};

    // Spot light for the showcase effect
    this.lights.spotLight = new THREE.SpotLight(0xef456f, 10, 0, Math.PI / 2);
    // position the light below the model
    this.lights.spotLight.position.set(0, -5, 0);
    // point the light upward
    this.lights.spotLight.target.position.set(0, 0, 0);
    this.lights.spotLight.castShadow = true
    this.scene.add(this.lights.spotLight)
    this.scene.add(this.lights.spotLight.target)


    // Ambient light
    this.lights.ambientLight = new THREE.AmbientLight(0xef456f, 0.7);
    this.scene.add(this.lights.ambientLight);

    // SQUARE AREA LIGHT
    this.lights.areaLight = new THREE.RectAreaLight(0xffffff, 1, 5, 5);
    this.lights.areaLight.position.set(0, 4, 0);
    this.lights.areaLight.rotation.x = -Math.PI / 2;
    this.scene.add(this.lights.areaLight);

    // Directional light
    this.lights.directionalLight = new THREE.DirectionalLight(0xe24068, 0.9);
    this.lights.directionalLight.position.set(2, 2, -1);
    this.scene.add(this.lights.directionalLight);

    this.lights.directionalLight2 = new THREE.DirectionalLight(0xef456f, 0.9);
    this.lights.directionalLight2.position.set(-2, 5, 2, -1);
    this.scene.add(this.lights.directionalLight2);

    this.lights.directionalLight.castShadow = true;
    this.lights.directionalLight2.castShadow = true;
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
      aeraLightIntensity: this.lights.areaLight.intensity,

      // Colors
      planeColor: '0xffffff',
      // Animation
      stopAnimation: () => {
        if (this.animations.mixer) {
          for (const action of this.animations.mixer._actions) {
            action.stop();
          }
        }
      },
      startAnimation: () => {
        if (this.animations.mixer) {
          for (const action of this.animations.mixer._actions) {
            action.play();
          }
        }
      }
    }

    // == COLORS ==
    const colorsFolder = this.experience.debug.addFolder({
      title: 'Colors',
      expanded: true,
    })

    colorsFolder.addInput(PARAMS, 'planeColor').on('change', _event => {
      this.planMaterial.color.set(_event.value)
    })


    // === LIGHTS FOLDER ===
    const lightsFolder = this.experience.debug.addFolder({
      title: 'Lights',
      expanded: true,
    })

    lightsFolder.addInput(PARAMS, 'aeraLightIntensity', {
      min: 0,
      max: 5,
      step: 0.001
    }).on('change', _event => {
      this.lights.areaLight.intensity = _event.value
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

    // Button spin action
    this.experience.debug
      .addButton({ title: 'Start animation' })
      .on('click', PARAMS.startAnimation)
    this.experience.debug
      .addButton({ title: 'Stop animation' })
      .on('click', PARAMS.stopAnimation)
  }

  setAnimations () {
    this.animations = {};

    this.animations.mixer = new THREE.AnimationMixer(this.experience.resources.items['watermelon'].scene);

    // Load each animation clip in the GLTF file...
    for (const clip of this.experience.resources.items['watermelon'].animations) {
      const action = this.animations.mixer.clipAction(clip);
      action.play();
    }
  }


  /**
   * Update the material
   *
   */
  update () {

    // deltaTime is the time that has passed since the last frame
    // Using performance.now() provides time in milliseconds
    const deltaTime = this.clock.getDelta();

    // Call the animations loaded from the gltf
    if (this.animations.mixer) {
      this.animations.mixer.update(deltaTime);
    }
  }
}
