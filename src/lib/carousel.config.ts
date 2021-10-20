/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/**
 * :tmtfactory) © 2017
 * Alex Marcos <alejandro.marcos@tmtfactory.com>
 * @ignore
 */

import { ICarouselCoreConfig } from './carousel.interface'
import { checkDefaultProps } from './carousel.utils'
import { defaultCarouselConfig } from './carousel.constants'

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
  }
}
