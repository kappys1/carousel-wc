import { LitElement, html } from 'lit'
import { directive } from 'lit/directive.js'
import { customElement } from 'lit/decorators.js'
import { carouselStyle } from './carousel.style'
import { DomChangeDirective } from './directives/dom-change.directive'
import Carousel from './model/Carousel'
import { SwiperDirective } from './directives/swiper.directive'

@customElement('carousel-component')
export default class CarouselComponent extends LitElement {
  static styles = carouselStyle

  public carousel: Carousel = new Carousel()
  private radius: number = 0
  private rotationFn: string = ''
  private itemsCarouselRendered = 0

  /* @Input() */ public morePairSlides = 1
  /* @Input() */ public threshold = 5
  /* @Input() */ public angle = 45
  /* @Input() */ public ratioScale = 1
  /* @Input() */ public margin = 20
  /* @Input() */ public perspective = 2000
  /* @Input() */ public endInSlide = true
  /* @Input() */ public timeToSlide = 300
  /* @Input() */ public lockSlides = false
  /* @Input() */ public initialSlide = 0
  /* @Input() */ public loop = false
  /* @Input() */ public mode = 'horizontal'

  // autoPlay
  /* @Input() */ public autoPlay = false
  /* @Input() */ public delayAutoPlay = 3000
  private autoPlayTimeout: any

  carouselElm!: any
  containerElm!: any
  itemsCarouselElm: any

  domChangeDirective = directive(DomChangeDirective)
  swiperDirective = directive(SwiperDirective)

  constructor () {
    super()
    this.carousel = new Carousel()
  }

  render () {
    return html`
      <div class="container">
        <div class="carousel" swiper (domChange)="onDomChange($event)">
        ${this.domChangeDirective(this.onDomChange)}
        ${this.swiperDirective()}
          <slot></slot>
        </div>
      </div>
    `
  }

  firstUpdated () {
    this.carouselElm = this.renderRoot.querySelector('.carousel')
    this.containerElm = this.renderRoot.querySelector('.container')
    const slot = this.carouselElm.querySelector('slot')
    this.itemsCarouselElm = slot.assignedNodes({ flatten: true }).filter((node: any) => node.nodeType === Node.ELEMENT_NODE)
    this.itemsCarouselRendered = this.itemsCarouselElm.length
    this.initEventsPan()
    this.configPlugin()
  }

  onDomChange ($event: any) {
    if ($event.addedNodes.length > 0) {
      if (this.itemsCarouselRendered === 0) {
        this.reInit()
      } else {
        this.updateFn()
        this.updateCssShowSlides()
      }
      this.itemsCarouselRendered = this.itemsCarouselElm.length.length
    }
  }

  // update () {
  // console.log(this)
  // this.onInit.emit(this.carousel)
  // this.itemsCarouselRendered = this.carouselElm.getElementsByClassName('item-carousel').length
  // }

  ngOnChanges (changes: any) {
    Object.keys(changes).map(val => {
      if (changes[val].currentValue !== changes[val].previousValue && !changes[val].isFirstChange()) {
        this.updateFn()
        // this.onChangeProperties.emit(changes)
      }
      return ''
    })
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
    this.autoPlay = true
    this.autoPlaySlide()
  }

  public autoPlayStop () {
    clearInterval(this.autoPlayTimeout)
    this.carousel.autoPlayIsRunning = false
  }

  public toggleMode () {
    this.mode = this.mode === 'vertical' ? 'horizontal' : 'vertical'
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
    this.carousel.lockSlides = this.lockSlides
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
    // this.swiper.onSwipe.subscribe((distance: number) => {
    //   this.rotate(distance)
    // })
    // this.swiper.onSwipeEnd.subscribe((distance: number) => {
    //   this.rotate(distance)
    // })
  }

  // private rotate (e: any) {
  //   if (!this.carousel.lockSlides) {
  //     const velocity = this.carousel.isHorizontal ? e.velocityX / this.threshold : -e.velocityY / this.threshold
  //     this.setNewDeg(this.carousel.currdeg + velocity * window.devicePixelRatio)
  //     this.moveCarrousel(this.carousel.currdeg)
  //     if (e.isFinal && this.endInSlide) {
  //       this.moveSlideTo(this.carousel.activeIndex)
  //     }
  //   }
  // }

  private autoPlaySlide () {
    if (this.autoPlay) {
      this.autoPlayTimeout = setTimeout(() => {
        this.carousel.autoPlayIsRunning = true
        this.slideNext()
        this.autoPlaySlide()
      }, this.delayAutoPlay)
    }
  }

  private initSlidesOn () {
    if (this.initialSlide >= 0 && this.initialSlide < this.carousel.items.length) {
      this.carousel.activeIndex = parseInt(this.initialSlide.toString())
    } else if (this.initialSlide >= this.carousel.items.length) {
      this.carousel.activeIndex = this.carousel.items.length - 1
      this.initialSlide = this.carousel.activeIndex
    } else {
      this.carousel.activeIndex = 0
      this.initialSlide = this.carousel.activeIndex
    }

    const newDeg = this.carousel.activeIndex * this.angle
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
    this.carousel.isHorizontal = this.mode !== 'vertical'
    this.rotationFn = this.carousel.isHorizontal
      ? 'rotateY'
      : 'rotateX'
  }

  private checkLimitsCarrousel (index: number) {
    return this.carousel.activeIndex !== index && index >= 0 && index < this.carousel.totalItems
  }

  private moveSlideTo (index: number) {
    this.setNewDeg(-this.carousel.degreesSlides[index])
    this.moveCarrousel(this.carousel.currdeg, this.timeToSlide)
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
    console.log(this.containerElm)
    this.containerElm.style.perspective = this.perspective
    this.containerElm.style.webkitPerspective = this.perspective
    this.containerElm.style.MozPerspective = this.perspective
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
    let auxDegree = 0
    const panelSize = this.carousel.isHorizontal ? this.carousel.maxWidthSize : this.carousel.maxHeightSize
    this.radius = (Math.round((panelSize / 2) /
      Math.tan(Math.PI / (360 / this.angle))) + this.margin)
    this.carousel.degreesSlides = []
    this.carousel.items.map((val: any) => {
      const transform = `${this.rotationFn}(${auxDegree}deg) translateZ(${this.radius}px)`
      val.style.transform = transform
      val.style.webkitTransform = transform
      this.carousel.degreesSlides.push(auxDegree)
      this.carousel.maxDegree = auxDegree
      auxDegree += this.angle
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

      // this.onSlideChange.emit(this.carousel)
      // if (this.carousel.activeIndex === 0) {
      //   this.onReachBeginning.emit(this.carousel)
      // } else if (this.carousel.activeIndex === this.carousel.totalItems - 1) {
      //   this.onReachEnd.emit(this.carousel)
      // }
    }
  }

  private updateCssShowSlides () {
    const currentIndex = this.carousel.activeIndex
    const actual: any = this.carousel.items[currentIndex]
    this.removeClassShowSlides('actual')
    this.removeClassShowSlides('prev')
    this.removeClassShowSlides('next')
    if (actual) {
      actual.classList.add('actual')
    }
    for (let x = 0; x < this.morePairSlides; x++) {
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

  // private manageEvents () {
  //   const options: any = {
  //     preventDefault: true
  //   }
  //   const vm = this

  //   this.swiper.onSwipe.subscribe((e: number) => {
  //     vm.onSlideMove.emit({ carousel: vm.carousel, event: e })
  //     vm.onTouchMove.emit({ carousel: vm.carousel, event: e })
  //   })
  //   this.swiper.onSwipeStart.subscribe((e: number) => {
  //     vm.onSlideMoveStart.emit({ carousel: vm.carousel, event: e })
  //     vm.onTouchStart.emit({ carousel: vm.carousel, event: e })
  //   })
  //   this.swiper.onSwipeEnd.subscribe((e: number) => {
  //     vm.onSlideMoveEnd.emit({ carousel: vm.carousel, event: e })
  //     vm.onTouchEnd.emit({ carousel: vm.carousel, event: e })
  //   })

  //   this.carouselElm.addEventListener('transitionend', (e: any) => {
  //     const elm = { carousel: vm.carousel, event: e }
  //     if (e.propertyName === 'transform') {
  //       this.onTransitionEnd.emit(elm)
  //       if (vm.carousel.lastIndex > vm.carousel.activeIndex) {
  //         this.onSlideNextTransitionEnd.emit(elm)
  //       } else {
  //         this.onSlidePrevTransitionEnd.emit(elm)
  //       }
  //     }
  //   })

  //   this.carouselElm.addEventListener('transitionstart', (e: any) => {
  //     const elm = { carousel: vm.carousel, event: e }
  //     if (e.propertyName === 'transform') {
  //       this.onTransitionStart.emit(elm)
  //       // if (e.direction === Hammer.DIRECTION_LEFT) {
  //       //   vm.onSlideNextTransitionStart.emit(elm);
  //       // } else if (e.direction === Hammer.DIRECTION_RIGHT) {
  //       //   vm.onSlidePrevTransitionStart.emit(elm);
  //       // }
  //     }
  //   })

  //   window.addEventListener('resize', function () {
  //     this.update()
  //   }.bind(this))
  // }

  // protected createRenderRoot () {
  //   return this
  // }
}
