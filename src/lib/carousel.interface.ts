export interface ICarouselCoreConfig {
  initialSlide: number
  morePairSlides: number
  threshold: number
  angle: number
  margin: number
  perspective: number
  endInSlide: boolean
  timeToSlide: number
  lockSlides: boolean
  loop: boolean
  mode: string
  autoPlay: boolean
  delayAutoPlay: number
}

export interface ICarousel extends Element {
  lockCarousel: (val: boolean) => void
  slideNext: () => any
  slidePrev: () => any
  slideTo: (val: number) => any
  autoPlayStart: () => any
  autoPlayStop: () => any
  toggleMode: () => any
  reInit: () => any
}
