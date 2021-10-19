import { ICarouselCoreConfig } from '../carousel.interface'

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
  mode: 'horizontal',
  autoPlay: false,
  delayAutoPlay: 3000
}
