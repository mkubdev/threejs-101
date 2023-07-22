import * as THREE from 'three'
import Experience from './Experience.js'
import Gradient from './Gradient.js'
import Wood from './Wood.js'
import Marble from './Marble.js'
import Bronze from './Bronze.js'
import TrioShadow from './TrioShadow.js'
import Watermelon from './Watermelon.js'

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
        switch (pathname) {
          case '/':
            this.setBronze();
            break;
          case '/shadow':
            this.setTrioShadow();
            break;
          case '/watermelon':
            this.setWatermelon();
            break;
          default:
            this.setBronze();
        }
      }
    })
  }

  setBronze () {
    this.bronze = new Bronze()
  }

  // WIP
  setGradient () {
    this.gradient = new Gradient()
  }

  setTrioShadow () {
    this.trioShadow = new TrioShadow()
  }

  setWatermelon () {
    this.watermelon = new Watermelon()
  }

  setNavigation () {
    this.switchExperience();
  }

  resize () { }

  update () {

    if (this.trioShadow)
      this.trioShadow.update()
    if (this.watermelon) {
      this.watermelon.update()
    }

  }

  destroy () {

  }
}
