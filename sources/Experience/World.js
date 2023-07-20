import * as THREE from 'three'
import Experience from './Experience.js'
import Gradient from './Gradient.js'
import Base from './Base.js'
import Wood from './Wood.js'

export default class World {
    constructor(_options) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('groupEnd', (_group) => {
            if (_group.name === 'base') {
                // this.setGradient()
                // this.setBase()
                this.setWood()
            }
        })
    }

    setGradient() {
        this.gradient = new Gradient();
    }

    setBase() {
        this.base = new Base();
    }

    setWood() {
        this.wood = new Wood();
    }

    setNavigation() {
        // todo: this.navigation = new Navigation()
    }

    resize() {
    }

    update() {
    }

    destroy() {
    }
}