import * as THREE from 'three'
import Experience from './Experience.js'
import vertexShader from './shaders/gradient/vertex.glsl'
import fragmentShader from './shaders/gradient/fragment.glsl'

export default class Gradient {
    constructor() {
        console.log('Gradient')
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setGeometry()
        this.setColors()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    }

    setColors() {
        this.colors = {}

        this.colors.start = {}
        this.colors.start.value = '#ff0000'
        this.colors.start.instance = new THREE.Color(this.colors.start.value)

        this.colors.end = {}
        this.colors.end.value = '#ff0000'
        this.colors.end.instance = new THREE.Color(this.colors.end.value)
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {value: 0}
            },
            // wireframe: true,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    update() {
        this.material.uniforms.uTime.value = this.time
    }
}
