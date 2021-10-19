
import { ICarouselCoreConfig } from './carousel.interface'
import { carouselStyle } from './carousel.style'
import { EVENTS } from './directives/swiper.directive'
import { EventEmitter } from './EventEmitter'
import CarouselConfig from './model/carouselConfig'

export default class CarouselCore {
  static styles = carouselStyle

  private carouselConfig: CarouselConfig = new CarouselConfig()

  // private radius: number = 0
  // private rotationFn: string = ''
  // public itemsCarouselRendered = 0
  private autoPlayTimeout: any

  carouselElm!: any
  containerElm!: any
  itemsCarouselElm: any
  eventBus: any

  constructor (carouselElm: any, containerElm: any, itemsCarouselElm: any, config?: any) {
    this.carouselElm = carouselElm
    this.containerElm = containerElm
    this.itemsCarouselElm = itemsCarouselElm
    // this.itemsCarouselRendered = this.itemsCarouselElm.length
    this.eventBus = new EventEmitter(this.carouselElm)
    this.carouselConfig = new CarouselConfig(config)
    this.carouselConfig.itemsCarouselRendered = this.itemsCarouselElm.length
    console.log(this.carouselConfig)
    this.initEventsPan()
    this.configPlugin()
  }

  public updateWithConfig (config: ICarouselCoreConfig) {
    this.carouselConfig.setConfig(config)
    this.updateFn()
  }

  public lockCarousel (val: boolean) {
    this.carouselConfig.lockSlides = val
  }

  public slideNext () {
    if (this.checkLimitsCarrousel(this.carouselConfig.activeIndex + 1)) {
      this.moveSlideTo(this.carouselConfig.activeIndex + 1)
      setTimeout(() => this.detectCurrentSlide())
    }
  }

  public slidePrev () {
    if (this.checkLimitsCarrousel(this.carouselConfig.activeIndex - 1)) {
      this.moveSlideTo(this.carouselConfig.activeIndex - 1)
      setTimeout(() => this.detectCurrentSlide())
    }
  }

  public slideTo (index: number) {
    if (this.checkLimitsCarrousel(index)) {
      this.moveSlideTo(index)
      setTimeout(() => this.detectCurrentSlide())
    }
  }

  public autoPlayStart () {
    this.carouselConfig.config.autoPlay = true
    this.autoPlaySlide()
  }

  public autoPlayStop () {
    clearInterval(this.autoPlayTimeout)
    this.carouselConfig.autoPlayIsRunning = false
  }

  public toggleMode () {
    this.carouselConfig.config.mode = this.carouselConfig.config.mode === 'vertical' ? 'horizontal' : 'vertical'
    this.updateFn()
  }

  public reInit () {
    this.carouselConfig = new CarouselConfig()
    this.configPlugin()
  }

  public updateFn () {
    this.setPerspectiveContainer()
    this.checkRotation()
    this.carouselConfig.items = [...this.itemsCarouselElm]
    this.carouselConfig.totalItems = this.carouselConfig.items.length
    this.getmaxSizes()
    this.carouselConfig.lockSlides = this.carouselConfig.config.lockSlides
    this.setDegreesOnSlides()
    this.setTransformCarrousel(-this.carouselConfig.degreesSlides[this.carouselConfig.activeIndex])
  }

  public getConfig () {
    return this.carouselConfig
  }

  private configPlugin () {
    this.updateFn()
    // this.manageEvents()
    this.initSlidesOn()
    this.updateCssShowSlides()
    this.autoPlaySlide()
  }

  private initEventsPan () {
    this.eventBus.on(EVENTS.SWIPE, (e: any) => this.rotate(e.detail))
    this.eventBus.on(EVENTS.SWIPE_END, (e: any) => this.rotate(e.detail))
  }

  public removeEventsPan () {
    this.eventBus.off(EVENTS.SWIPE, this.rotate)
    this.eventBus.off(EVENTS.SWIPE_END, this.rotate)
  }

  private rotate (e: any) {
    if (!this.carouselConfig.lockSlides) {
      const velocity = this.carouselConfig.isHorizontal ? e.velocityX / this.carouselConfig.config.threshold : -e.velocityY / this.carouselConfig.config.threshold
      this.setNewDeg(this.carouselConfig.currdeg + velocity * window.devicePixelRatio)
      this.moveCarrousel(this.carouselConfig.currdeg)
      if (e.isFinal && this.carouselConfig.config.endInSlide) {
        this.moveSlideTo(this.carouselConfig.activeIndex)
      }
    }
  }

  private autoPlaySlide () {
    if (this.carouselConfig.config.autoPlay) {
      this.autoPlayTimeout = setTimeout(() => {
        this.carouselConfig.autoPlayIsRunning = true
        this.slideNext()
        this.autoPlaySlide()
      }, this.carouselConfig.config.delayAutoPlay)
    }
  }

  private initSlidesOn () {
    if (this.carouselConfig.config.initialSlide >= 0 && this.carouselConfig.config.initialSlide < this.carouselConfig.items.length) {
      this.carouselConfig.activeIndex = parseInt(this.carouselConfig.config.initialSlide.toString())
    } else if (this.carouselConfig.config.initialSlide >= this.carouselConfig.items.length) {
      this.carouselConfig.activeIndex = this.carouselConfig.items.length - 1
      this.carouselConfig.config.initialSlide = this.carouselConfig.activeIndex
    } else {
      this.carouselConfig.activeIndex = 0
      this.carouselConfig.config.initialSlide = this.carouselConfig.activeIndex
    }

    const newDeg = this.carouselConfig.activeIndex * this.carouselConfig.config.angle
    this.setNewDeg(-newDeg)
    this.setTransformCarrousel(-newDeg)
  }

  private setNewDeg (newDeg: number) {
    this.carouselConfig.currdeg = newDeg
    if (this.carouselConfig.currdeg > 0) {
      this.carouselConfig.currdeg = 0
    }
    if (this.carouselConfig.currdeg < -this.carouselConfig.maxDegree) {
      this.carouselConfig.currdeg = -this.carouselConfig.maxDegree
    }
  }

  private checkRotation () {
    this.carouselConfig.isHorizontal = this.carouselConfig.config.mode !== 'vertical'
    this.carouselConfig.rotationFn = this.carouselConfig.isHorizontal
      ? 'rotateY'
      : 'rotateX'
  }

  private checkLimitsCarrousel (index: number) {
    return this.carouselConfig.activeIndex !== index && index >= 0 && index < this.carouselConfig.totalItems
  }

  private moveSlideTo (index: number) {
    this.setNewDeg(-this.carouselConfig.degreesSlides[index])
    this.moveCarrousel(this.carouselConfig.currdeg, this.carouselConfig.config.timeToSlide)
  }

  private moveCarrousel (deg: number, timeTransform: number = 0) {
    const transition = `transform ${timeTransform}ms`
    this.carouselElm.style.transition = transition
    this.carouselElm.style.webkitTransition = transition
    this.setTransformCarrousel(deg)
    this.detectCurrentSlide()
  }

  private setTransformCarrousel (deg: number) {
    const transform = `translateZ(${-this.carouselConfig.radius}px) ${this.carouselConfig.rotationFn}(${deg}deg)`
    this.carouselElm.style.transform = transform
    this.carouselElm.style.webkitTransform = transform
    this.sendSlideIsCentered()
  }

  private sendSlideIsCentered () {
    if (this.carouselConfig.currdeg === -this.carouselConfig.degreesSlides[this.carouselConfig.activeIndex]) {
      // this.onSlideCentered.emit(this.carouselConfig)
    }
  }

  private setPerspectiveContainer () {
    this.containerElm.style.perspective = this.carouselConfig.config.perspective
    this.containerElm.style.webkitPerspective = this.carouselConfig.config.perspective
    this.containerElm.style.MozPerspective = this.carouselConfig.config.perspective
  }

  private getmaxSizes () {
    this.carouselConfig.items.map((val: any) => {
      const width = val.offsetWidth
      const height = val.offsetHeight
      this.carouselConfig.maxWidthSize = 0
      this.carouselConfig.maxHeightSize = 0
      if (width > this.carouselConfig.maxWidthSize) {
        this.carouselConfig.maxWidthSize = width
        this.carouselConfig.totalWidth = this.carouselConfig.items.length * this.carouselConfig.maxWidthSize
      }
      if (height > this.carouselConfig.maxHeightSize) {
        this.carouselConfig.maxHeightSize = height
        this.carouselConfig.totalWidth = this.carouselConfig.items.length * this.carouselConfig.maxHeightSize
      }
    })
    this.setContainerWithMaxSize()
  }

  private setContainerWithMaxSize () {
    this.containerElm.style.width = `${this.carouselConfig.maxWidthSize}px`
    this.containerElm.style.height = `${this.carouselConfig.maxHeightSize}px`
  }

  private setDegreesOnSlides () {
    let auxDegree: number = 0
    const panelSize = this.carouselConfig.isHorizontal ? this.carouselConfig.maxWidthSize : this.carouselConfig.maxHeightSize
    this.carouselConfig.radius = (Math.round((panelSize / 2) /
      Math.tan(Math.PI / (360 / this.carouselConfig.config.angle))) + this.carouselConfig.config.margin)
    this.carouselConfig.degreesSlides = []
    this.carouselConfig.items.map((val: any) => {
      const transform = `${this.carouselConfig.rotationFn}(${auxDegree}deg) translateZ(${this.carouselConfig.radius}px)`
      val.style.transform = transform
      val.style.webkitTransform = transform
      this.carouselConfig.degreesSlides.push(auxDegree)
      this.carouselConfig.maxDegree = auxDegree
      auxDegree += this.carouselConfig.config.angle
    })
  }

  private detectCurrentSlide () {
    let aux = 99e9
    let index = 0
    this.carouselConfig.degreesSlides.forEach((val: any, i: number) => {
      const res = Math.abs(val - Math.abs(this.carouselConfig.currdeg))
      if (res < aux) {
        aux = res
        index = i
      }
    })
    if (this.carouselConfig.activeIndex !== index) {
      this.carouselConfig.lastIndex = this.carouselConfig.activeIndex
      this.carouselConfig.activeIndex = index
      this.updateCssShowSlides()
    }
  }

  public updateCssShowSlides () {
    const currentIndex = this.carouselConfig.activeIndex
    const actual: any = this.carouselConfig.items[currentIndex]
    this.removeClassShowSlides('actual')
    this.removeClassShowSlides('prev')
    this.removeClassShowSlides('next')
    if (actual) {
      actual.classList.add('actual')
    }
    for (let x = 0; x < this.carouselConfig.config.morePairSlides; x++) {
      const prev = this.carouselConfig.items[currentIndex - (x + 1)]
      const next = this.carouselConfig.items[currentIndex + (x + 1)]
      if (prev) {
        prev.classList.add('prev')
      }
      if (next) {
        next.classList.add('next')
      }
    }
  }

  private removeClassShowSlides (tagClass: string) {
    if (this.carouselElm.getElementsByClassName(tagClass).length > 0) {
      Array.from(this.carouselElm.getElementsByClassName(tagClass)).map((val: any) => {
        val.classList.remove(tagClass)
      })
    }
  }
}
