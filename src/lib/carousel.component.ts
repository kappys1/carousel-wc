import { LitElement, html } from 'lit'
import { directive } from 'lit/directive.js'
import { customElement, property } from 'lit/decorators.js'
import { carouselStyle } from './carousel.style'
import { DomChangeDirective } from './directives/dom-change.directive'
import { SwiperDirective } from './directives/swiper.directive'
import CarouselCore from './carousel.core'
import { ICarouselCoreConfig } from './carousel.interface'

@customElement('carousel-component')
export default class CarouselComponent extends LitElement {
  static styles = carouselStyle

  @property() public mode = 'horizontal'
  @property() public morePairSlides = 1
  @property() public threshold = 5
  @property() public angle = 45
  @property() public ratioScale = 1
  @property() public margin = 20
  @property() public perspective = 2000
  @property() public endInSlide = true
  @property() public timeToSlide = 300
  @property() public lockSlides = false
  @property() public initialSlide = 0
  @property() public loop = false

  // autoPlay
  @property() public autoPlay = false
  @property() public delayAutoPlay = 3000

  private carouselCore: CarouselCore | undefined
  domChangeDirective = directive(DomChangeDirective)
  swiperDirective = directive(SwiperDirective)

  //
  // start: -- lit lifecicle methods
  //

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
    const carouselElm: any = this.renderRoot.querySelector('.carousel')
    const containerElm = this.renderRoot.querySelector('.container')
    const slot = carouselElm.querySelector('slot')
    const itemsCarouselElm = slot.assignedNodes({ flatten: true }).filter((node: any) => node.nodeType === Node.ELEMENT_NODE)
    const config = this.getParamsProperties()
    this.carouselCore = new CarouselCore(carouselElm, containerElm, itemsCarouselElm, config)
    // todo event init
  }

  onDomChange ($event: any) {
    if (this && this.carouselCore && $event.addedNodes.length > 0) {
      if (this.carouselCore.itemsCarouselRendered === 0) {
        this.reInit()
      } else {
        this.carouselCore.updateFn()
        this.carouselCore.updateCssShowSlides()
      }
      this.carouselCore.itemsCarouselRendered = this.carouselCore?.itemsCarouselElm.length.length
    }
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.carouselCore?.removeEventsPan()
  }

  updated () {
    console.log('hola')
    this.updateCarouselCore()
  }
  //
  // END: -- lit lifecicle methods
  //

  //
  // Start: -- Public interface methods
  //
  public getParamsProperties (): ICarouselCoreConfig {
    return {
      mode: this.mode,
      morePairSlides: this.morePairSlides,
      threshold: this.threshold,
      angle: this.angle,
      ratioScale: this.ratioScale,
      margin: this.margin,
      perspective: this.perspective,
      endInSlide: this.endInSlide,
      timeToSlide: this.timeToSlide,
      lockSlides: this.lockSlides,
      initialSlide: this.initialSlide,
      loop: this.loop
    }
  }

  public lockCarousel (val: boolean) {
    this.carouselCore?.lockCarousel(val)
  }

  public slideNext () {
    this.carouselCore?.slideNext()
  }

  public slidePrev () {
    this.carouselCore?.slidePrev()
  }

  public slideTo (index: number) {
    this.carouselCore?.slideTo(index)
  }

  public autoPlayStart () {
    this.carouselCore?.autoPlayStart()
  }

  public autoPlayStop () {
    this.carouselCore?.autoPlayStop()
  }

  public toggleMode () {
    this.carouselCore?.toggleMode()
  }

  public reInit () {
    this.carouselCore?.reInit()
  }

  //
  // END: -- Public interface methods
  //

  private updateCarouselCore () {
    if (this.carouselCore) {
      const config: ICarouselCoreConfig = this.getParamsProperties()
      this.carouselCore.updateWithConfig(config)
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
}
