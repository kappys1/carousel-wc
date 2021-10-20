import { LitElement, html } from 'lit'
import { directive } from 'lit/directive.js'
import { customElement, property } from 'lit/decorators.js'
import { carouselStyle } from './carousel.style'
import { DomChangeDirective } from './directives/dom-change.directive'
import { SwiperDirective } from './directives/swiper.directive'
import CarouselCore from './carousel.core'
import { ICarouselCoreConfig } from './carousel.interface'

@customElement('carousel-component')
export class CarouselComponent extends LitElement {
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

  rootElement
  public carouselCore: CarouselCore | undefined
  domChangeDirective = directive(DomChangeDirective)
  swiperDirective = directive(SwiperDirective)

  //
  // start: -- lit lifecicle methods
  //

  constructor (rootElement?: any) {
    super()
    this.rootElement = rootElement
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
    const root = this.rootElement ? this.rootElement.renderRoot : this.renderRoot
    const config = this.getParamsProperties()
    this.carouselCore = new CarouselCore(root, config)
    // todo event init
  }

  onDomChange ($event: any) {
    if (this && this.carouselCore && $event.addedNodes.length > 0) {
      const carouselConfig = this.carouselCore.getConfig()
      if (carouselConfig.itemsCarouselRendered === 0) {
        this.carouselCore.reInit()
      } else {
        this.carouselCore.updateFn()
        this.carouselCore.updateCssShowSlides()
      }
      carouselConfig.itemsCarouselRendered = this.carouselCore?.itemsCarouselElm.length.length
    }
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.carouselCore?.removeEventsPan()
  }

  updated () {
    this.updateCarouselCore()
  }
  //
  // END: -- lit lifecicle methods
  //

  //
  // Start: -- Public interface methods
  //
  private getParamsProperties (): ICarouselCoreConfig {
    return {
      mode: this.mode,
      morePairSlides: this.morePairSlides,
      threshold: this.threshold,
      angle: this.angle,
      margin: this.margin,
      perspective: this.perspective,
      endInSlide: this.endInSlide,
      timeToSlide: this.timeToSlide,
      lockSlides: this.lockSlides,
      initialSlide: this.initialSlide,
      loop: this.loop,
      autoPlay: this.autoPlay,
      delayAutoPlay: this.delayAutoPlay
    }
  }

  private updateCarouselCore () {
    if (this.carouselCore) {
      const config: ICarouselCoreConfig = this.getParamsProperties()
      this.carouselCore.updateWithConfig(config)
    }
  }

  //
  // END: -- Public interface methods
  //

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
