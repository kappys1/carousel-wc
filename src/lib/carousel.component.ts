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

  @property({ type: String, reflect: true }) public mode: string | undefined
  @property({ type: Number, reflect: true }) public morePairSlides: number | undefined
  @property({ type: Number, reflect: true }) public threshold: number | undefined
  @property({ type: Number, reflect: true }) public angle: number | undefined
  @property({ type: Number, reflect: true }) public ratioScale: number | undefined
  @property({ type: Number, reflect: true }) public margin: number | undefined
  @property({ type: Number, reflect: true }) public perspective: number | undefined
  @property({ type: Boolean, reflect: true }) public endInSlide: boolean | undefined
  @property({ type: Number, reflect: true }) public timeToSlide: number | undefined
  @property({ type: Boolean, reflect: true }) public lockSlides: boolean | undefined
  @property({ type: Number, reflect: true }) public initialSlide: number | undefined
  @property({ type: Boolean, reflect: true }) public loop: boolean | undefined

  // autoPlay
  @property({ type: Boolean, reflect: true }) public autoPlay: boolean | undefined
  @property({ type: Number, reflect: true }) public delayAutoPlay: number | undefined

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
    this.carouselCore = new CarouselCore(root)
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

  updated (changedProperties: any) {
    if (this.carouselCore) {
      const resConfig: Partial<ICarouselCoreConfig> | any = {}
      for (const keys of changedProperties.keys()) {
        const key: any = keys
        // @ts-expect-error
        resConfig[key] = this[key]
      }
      this.carouselCore.updateWithConfig(resConfig)
    }
  }
  //
  // END: -- lit lifecicle methods
  //

  //
  // Start: -- Public interface methods
  //
  slideNext = () => this.carouselCore?.slideNext()
  slidePrev = () => this.carouselCore?.slidePrev()
  slideTo = (index: number) => this.carouselCore?.slideTo(index)
  lock = (val: boolean) => {
    this.carouselCore?.lockCarousel(val)
    this.lockSlides = this.carouselCore?.getConfig().lockSlides
  }

  autoPlayStart = () => {
    this.autoPlay = true
    this.carouselCore?.autoPlayStart()
  }

  autoPlayStop = () => {
    this.carouselCore?.autoPlayStop()
    this.autoPlay = false
  }

  toggleMode = () => {
    this.carouselCore?.toggleMode()
    this.mode = this.carouselCore?.getConfig().config.mode
  }

  reInit = () => this.carouselCore?.reInit()
  getConfig = () => this.carouselCore?.getConfig()
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
