import * as THREE from 'three'
import Experience from './Experience.js'
import Gradient from './Gradient.js'
import Wood from './Wood.js'
import Marble from './Marble.js'
import Bronze from './Bronze.js'
import TrioShadow from './TrioShadow.js'

export default class World {
  constructor(_options) {
    this.experience = new Experience()
    this.config = this.experience.config
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // ?? not sure of this implementation..
    this.setNavigation();

    // this.resources.on('groupEnd', _group => {
    //   if (_group.name === 'base') {
    //     this.setBronze()
    //   }
    // })
  }

  switchExperience () {
    const pathname = window.location.pathname

    // Set a new experience based on the pathname
    this.resources.on('groupEnd', _group => {
      if (_group.name === 'base') {
        if (pathname === '/') {
          this.setBronze();
        } else if (pathname === '/shadow') {
          this.setTrioShadow();
        }
      }
    })
  }

  setGradient () {
    this.gradient = new Gradient()
  }

  setTrioShadow () {
    this.trioShadow = new TrioShadow()
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
    this.switchExperience();
  }

  resize () { }

  update () { }

  destroy () {

  }
}
