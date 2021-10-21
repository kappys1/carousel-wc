/* eslint-disable @typescript-eslint/no-floating-promises */
// import { CarouselComponent } from './carousel.component'
import './carousel.component'
import CarouselCore from './carousel.core'

export class Carousel {
  isReady = false
  carouselCore: CarouselCore
  element: any
  constructor (elm?: Element) {
    this.element = elm
    this.carouselCore = this.element.carouselCore
  }

  slideNext = () => this.element.slideNext()
  slidePrev = () => this.element.slidePrev()
  slideTo = (index: number) => this.element.slideTo(index)
  lockSlides = (val: boolean) => this.element.lockSlides(val)
  autoPlayStart = () => this.element.autoPlayStart()
  autoPlayStop = () => this.element.autoPlayStop()
  toggleMode = () => this.element.toggleMode()
  toreInitggleMode = () => this.element.reInit()
  getConfig = () => this.element.getConfig()
}
