import * as THREE from 'three'
import Experience from './Experience.js'
import Gradient from './Gradient.js'
import Base from './Base.js'
import Wood from './Wood.js'
import Marble from './Marble.js'
import Bronze from './Bronze.js'

export default class World {
  constructor(_options) {
    this.experience = new Experience()
    this.config = this.experience.config
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.on('groupEnd', _group => {
      if (_group.name === 'base') {
        // this.setGradient()
        // this.setBase()
        // this.setWood()
        // this.setMarble()
        this.setBronze()
      }
    })
  }

  setGradient () {
    this.gradient = new Gradient()
  }

  setBase () {
    this.base = new Base()
  }

  setWood () {
    this.wood = new Wood()
  }

  setMarble () {
    this.marble = new Marble()
  }

  setBronze () {
    this.bronze = new Bronze()
  }

  setNavigation () {
    // todo: this.navigation = new Navigation()
  }

  resize () { }

  update () { }

  destroy () { }
}
