/**
 * :tmtfactory) © 2017
 * Alex Marcos <alejandro.marcos@tmtfactory.com>
 * @ignore
 */

export default class Carousel {
  currdeg = 0
  totalItems = 0
  maxWidthSize = 0
  maxHeightSize = 0
  maxDegree = 0
  totalWidth = 0
  isHorizontal = false
  items: any = []
  degreesSlides = []
  activeIndex = 0
  lastIndex = -1
  lockSlides = false
  autoPlayIsRunning = false
}
