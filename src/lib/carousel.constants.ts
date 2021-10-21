import { ICarouselCoreConfig } from './carousel.interface'

export const CAROUSEL_MODE = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
}

export const defaultCarouselConfig: ICarouselCoreConfig = {
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
  mode: CAROUSEL_MODE.HORIZONTAL,
  autoPlay: false,
  delayAutoPlay: 3000
}
