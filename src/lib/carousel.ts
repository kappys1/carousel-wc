/* eslint-disable @typescript-eslint/no-floating-promises */
// import { CarouselComponent } from './carousel.component'
import './carousel.component'
import CarouselCore from './carousel.core'

export class Carousel {
  isReady = false
  carouselCore: CarouselCore
  carouselComponent: any
  element: any
  constructor (elm?: Element) {
    this.element = elm
    this.carouselCore = this.element.carouselCore
  }

  slideNext = () => this.carouselCore.slideNext()
  slidePrev = () => this.carouselCore.slidePrev()
  slideTo = (index: number) => this.carouselCore.slideTo(index)
  autoPlayStart = () => this.carouselCore.autoPlayStart()
  autoPlayStop = () => this.carouselCore.autoPlayStop()
  toggleMode = () => this.element.toggleMode('vertical')
  toreInitggleMode = () => this.carouselCore.reInit()
  getConfig = () => this.carouselCore.getConfig()
}
