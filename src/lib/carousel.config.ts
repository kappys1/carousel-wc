/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/**
 * :tmtfactory) © 2017
 * Alex Marcos <alejandro.marcos@tmtfactory.com>
 * @ignore
 */

import { ICarouselCoreConfig } from './carousel.interface'
import { checkDefaultProps } from './carousel.utils'
import { CAROUSEL_MODE, defaultCarouselConfig } from './carousel.constants'

export default class CarouselConfig {
  currdeg: number = 0
  totalItems: number = 0
  maxWidthSize: number = 0
  maxHeightSize: number = 0
  maxDegree: number = 0
  totalWidth: number = 0
  isHorizontal: boolean = false
  items: any = []
  degreesSlides: any = []
  activeIndex: number = 0
  lastIndex: number = -1
  lockSlides: boolean = false
  autoPlayIsRunning: boolean = false
  //
  radius: number = 0
  rotationFn: string = ''
  itemsCarouselRendered = 0
  config: ICarouselCoreConfig = defaultCarouselConfig

  constructor (config?: ICarouselCoreConfig) {
    if (config) {
      this.setConfig(config)
    }
  }

  public setConfig (config: Partial<ICarouselCoreConfig>) {
    console.log(config)
    this.config = Object.assign(this.config, {
      mode: config.mode && config.mode === CAROUSEL_MODE.VERTICAL ? CAROUSEL_MODE.VERTICAL : CAROUSEL_MODE.HORIZONTAL,
      initialSlide: checkDefaultProps<number>(config.initialSlide || this.config.initialSlide, 0),
      morePairSlides: checkDefaultProps<number>(config.morePairSlides || this.config.morePairSlides, 1),
      threshold: checkDefaultProps<number>(config.threshold || this.config.threshold, 1, 5),
      angle: checkDefaultProps<number>(config.angle || this.config.angle, 1, 45),
      margin: checkDefaultProps<number>(config.margin || this.config.margin, 0, 20),
      perspective: checkDefaultProps<number>(config.perspective || this.config.perspective, 1, 2000),
      endInSlide: checkDefaultProps<boolean>(config.endInSlide || this.config.endInSlide, true),
      timeToSlide: checkDefaultProps<number>(config.timeToSlide || this.config.timeToSlide, 1, 300),
      lockSlides: checkDefaultProps<boolean>(config.lockSlides || this.config.lockSlides, false),
      loop: checkDefaultProps<boolean>(config.loop || this.config.loop, false),
      autoPlay: checkDefaultProps<boolean>(config.autoPlay || this.config.autoPlay, false),
      delayAutoPlay: checkDefaultProps<number>(config.delayAutoPlay || this.config.initialSlide, 1, 3000)
    })
    console.log(this.config)
  }
}
