
import { ICarouselCoreConfig } from './carousel.interface'
import { carouselStyle } from './carousel.style'
import { checkDefaultProps } from './carousel.utils'
import { EVENTS } from './directives/swiper.directive'
import { EventEmitter } from './EventEmitter'
import Carousel from './model/Carousel'

export default class CarouselCore {
  static styles = carouselStyle

  public carousel: Carousel = new Carousel()

  private config: ICarouselCoreConfig = {
    initialSlide: 0,
    morePairSlides: 1,
    threshold: 5,
    angle: 45,
    margin: 20,
    perspective: 2000,
    endInSlide: true,
    timeToSlide: 300,
    lockSlides: false,
    loop: false,
    mode: 'horizontal',
    autoPlay: false,
    delayAutoPlay: 3000
  }

  private radius: number = 0
  private rotationFn: string = ''
  public itemsCarouselRendered = 0
  private autoPlayTimeout: any

  carouselElm!: any
  containerElm!: any
  itemsCarouselElm: any
  eventBus: any

  constructor (carouselElm: any, containerElm: any, itemsCarouselElm: any, config?: any) {
    this.carouselElm = carouselElm
    this.containerElm = containerElm
    this.itemsCarouselElm = itemsCarouselElm
    this.itemsCarouselRendered = this.itemsCarouselElm.length
    this.eventBus = new EventEmitter(this.carouselElm)
    this.setConfig(config)
    this.initEventsPan()
    this.configPlugin()
  }

  public setConfig (config: ICarouselCoreConfig) {
    this.config = Object.assign(this.config, {
      mode: config.mode && config.mode === 'vertical' ? 'vertical' : 'horizontal',
      initialSlide: checkDefaultProps<number>(config.initialSlide, 0),
      morePairSlides: checkDefaultProps<number>(config.morePairSlides, 1),
      threshold: checkDefaultProps<number>(config.threshold, 1, 5),
      angle: checkDefaultProps<number>(config.angle, 1, 45),
      margin: checkDefaultProps<number>(config.margin, 0, 20),
      perspective: checkDefaultProps<number>(config.perspective, 1, 2000),
      endInSlide: checkDefaultProps<boolean>(config.endInSlide, true),
      timeToSlide: checkDefaultProps<number>(config.timeToSlide, 1, 300),
      lockSlides: checkDefaultProps<boolean>(config.lockSlides, false),
      loop: checkDefaultProps<boolean>(config.loop, false),
      autoPlay: checkDefaultProps<boolean>(config.autoPlay, false),
      delayAutoPlay: checkDefaultProps<number>(config.delayAutoPlay, 1, 3000)
    })
    console.log(this.config)
  }

  public updateWithConfig (config: ICarouselCoreConfig) {
    this.setConfig(config)
    this.updateFn()
  }

  public lockCarousel (val: boolean) {
    this.carousel.lockSlides = val
  }

  public slideNext () {
    if (this.checkLimitsCarrousel(this.carousel.activeIndex + 1)) {
      this.moveSlideTo(this.carousel.activeIndex + 1)
      setTimeout(() => this.detectCurrentSlide())
    }
  }

  public slidePrev () {
    if (this.checkLimitsCarrousel(this.carousel.activeIndex - 1)) {
      this.moveSlideTo(this.carousel.activeIndex - 1)
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
    this.config.autoPlay = true
    this.autoPlaySlide()
  }

  public autoPlayStop () {
    clearInterval(this.autoPlayTimeout)
    this.carousel.autoPlayIsRunning = false
  }

  public toggleMode () {
    this.config.mode = this.config.mode === 'vertical' ? 'horizontal' : 'vertical'
    this.updateFn()
  }

  public reInit () {
    this.carousel = new Carousel()
    this.configPlugin()
  }

  public updateFn () {
    this.setPerspectiveContainer()
    this.checkRotation()
    this.carousel.items = [...this.itemsCarouselElm]
    this.carousel.totalItems = this.carousel.items.length
    this.getmaxSizes()
    this.carousel.lockSlides = this.config.lockSlides
    this.setDegreesOnSlides()
    this.setTransformCarrousel(-this.carousel.degreesSlides[this.carousel.activeIndex])
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
    if (!this.carousel.lockSlides) {
      const velocity = this.carousel.isHorizontal ? e.velocityX / this.config.threshold : -e.velocityY / this.config.threshold
      this.setNewDeg(this.carousel.currdeg + velocity * window.devicePixelRatio)
      this.moveCarrousel(this.carousel.currdeg)
      if (e.isFinal && this.config.endInSlide) {
        this.moveSlideTo(this.carousel.activeIndex)
      }
    }
  }

  private autoPlaySlide () {
    if (this.config.autoPlay) {
      this.autoPlayTimeout = setTimeout(() => {
        this.carousel.autoPlayIsRunning = true
        this.slideNext()
        this.autoPlaySlide()
      }, this.config.delayAutoPlay)
    }
  }

  private initSlidesOn () {
    if (this.config.initialSlide >= 0 && this.config.initialSlide < this.carousel.items.length) {
      this.carousel.activeIndex = parseInt(this.config.initialSlide.toString())
    } else if (this.config.initialSlide >= this.carousel.items.length) {
      this.carousel.activeIndex = this.carousel.items.length - 1
      this.config.initialSlide = this.carousel.activeIndex
    } else {
      this.carousel.activeIndex = 0
      this.config.initialSlide = this.carousel.activeIndex
    }

    const newDeg = this.carousel.activeIndex * this.config.angle
    this.setNewDeg(-newDeg)
    this.setTransformCarrousel(-newDeg)
  }

  private setNewDeg (newDeg: number) {
    this.carousel.currdeg = newDeg
    if (this.carousel.currdeg > 0) {
      this.carousel.currdeg = 0
    }
    if (this.carousel.currdeg < -this.carousel.maxDegree) {
      this.carousel.currdeg = -this.carousel.maxDegree
    }
  }

  private checkRotation () {
    this.carousel.isHorizontal = this.config.mode !== 'vertical'
    this.rotationFn = this.carousel.isHorizontal
      ? 'rotateY'
      : 'rotateX'
  }

  private checkLimitsCarrousel (index: number) {
    return this.carousel.activeIndex !== index && index >= 0 && index < this.carousel.totalItems
  }

  private moveSlideTo (index: number) {
    this.setNewDeg(-this.carousel.degreesSlides[index])
    this.moveCarrousel(this.carousel.currdeg, this.config.timeToSlide)
  }

  private moveCarrousel (deg: number, timeTransform: number = 0) {
    const transition = `transform ${timeTransform}ms`
    this.carouselElm.style.transition = transition
    this.carouselElm.style.webkitTransition = transition
    this.setTransformCarrousel(deg)
    this.detectCurrentSlide()
  }

  private setTransformCarrousel (deg: number) {
    const transform = `translateZ(${-this.radius}px) ${this.rotationFn}(${deg}deg)`
    this.carouselElm.style.transform = transform
    this.carouselElm.style.webkitTransform = transform
    this.sendSlideIsCentered()
  }

  private sendSlideIsCentered () {
    if (this.carousel.currdeg === -this.carousel.degreesSlides[this.carousel.activeIndex]) {
      // this.onSlideCentered.emit(this.carousel)
    }
  }

  private setPerspectiveContainer () {
    this.containerElm.style.perspective = this.config.perspective
    this.containerElm.style.webkitPerspective = this.config.perspective
    this.containerElm.style.MozPerspective = this.config.perspective
  }

  private getmaxSizes () {
    this.carousel.items.map((val: any) => {
      const width = val.offsetWidth
      const height = val.offsetHeight
      this.carousel.maxWidthSize = 0
      this.carousel.maxHeightSize = 0
      if (width > this.carousel.maxWidthSize) {
        this.carousel.maxWidthSize = width
        this.carousel.totalWidth = this.carousel.items.length * this.carousel.maxWidthSize
      }
      if (height > this.carousel.maxHeightSize) {
        this.carousel.maxHeightSize = height
        this.carousel.totalWidth = this.carousel.items.length * this.carousel.maxHeightSize
      }
    })
    this.setContainerWithMaxSize()
  }

  private setContainerWithMaxSize () {
    this.containerElm.style.width = `${this.carousel.maxWidthSize}px`
    this.containerElm.style.height = `${this.carousel.maxHeightSize}px`
  }

  private setDegreesOnSlides () {
    let auxDegree: number = 0
    const panelSize = this.carousel.isHorizontal ? this.carousel.maxWidthSize : this.carousel.maxHeightSize
    this.radius = (Math.round((panelSize / 2) /
      Math.tan(Math.PI / (360 / this.config.angle))) + this.config.margin)
    this.carousel.degreesSlides = []
    this.carousel.items.map((val: any) => {
      const transform = `${this.rotationFn}(${auxDegree}deg) translateZ(${this.radius}px)`
      val.style.transform = transform
      val.style.webkitTransform = transform
      this.carousel.degreesSlides.push(auxDegree)
      this.carousel.maxDegree = auxDegree
      auxDegree += this.config.angle
    })
  }

  private detectCurrentSlide () {
    let aux = 99e9
    let index = 0
    this.carousel.degreesSlides.forEach((val: any, i: number) => {
      const res = Math.abs(val - Math.abs(this.carousel.currdeg))
      if (res < aux) {
        aux = res
        index = i
      }
    })
    if (this.carousel.activeIndex !== index) {
      this.carousel.lastIndex = this.carousel.activeIndex
      this.carousel.activeIndex = index
      this.updateCssShowSlides()
    }
  }

  public updateCssShowSlides () {
    const currentIndex = this.carousel.activeIndex
    const actual: any = this.carousel.items[currentIndex]
    this.removeClassShowSlides('actual')
    this.removeClassShowSlides('prev')
    this.removeClassShowSlides('next')
    if (actual) {
      actual.classList.add('actual')
    }
    for (let x = 0; x < this.config.morePairSlides; x++) {
      const prev = this.carousel.items[currentIndex - (x + 1)]
      const next = this.carousel.items[currentIndex + (x + 1)]
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
