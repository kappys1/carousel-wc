
import { Directive } from 'lit/directive.js'

const ZERO = 0.000000000001
const DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
  NONE: 'none'
}

export class SwiperDirective extends Directive {
  isDown = false
  initialPosX: number = ZERO
  initialPosY: number = ZERO
  lastPosX: number = ZERO
  lastPosY: number = ZERO
  swipeDistanceX: number = ZERO
  swipeDistanceY: number = ZERO
  firstSwipeDate = Date.now()
  direction = DIRECTION.NONE

  // @Output() onSwipeRight: EventEmitter<any> = new EventEmitter<any>()
  // @Output() onSwipeLeft: EventEmitter<any> = new EventEmitter<any>()
  // @Output() onSwipeUp: EventEmitter<any> = new EventEmitter<any>()
  // @Output() onSwipeDown: EventEmitter<any> = new EventEmitter<any>()
  // @Output() onSwipe: EventEmitter<any> = new EventEmitter<any>()
  // @Output() onSwipeStart: EventEmitter<any> = new EventEmitter<any>()
  // @Output() onSwipeEnd: EventEmitter<any> = new EventEmitter<any>()
  // @Output() swipeLeft: EventEmitter<any> = new EventEmitter<any>()
  // @Output() swipeRight: EventEmitter<any> = new EventEmitter<any>()

  private readonly element
  constructor (partInfo: any) {
    super(partInfo)
    this.element = partInfo.parentNode
    this.element.addEventListener('touchstart', (e: Event) => this.onTouchStart(e))
    this.element.addEventListener('touchend', (e: Event) => this.onTouchEnd(e))
    this.element.addEventListener('touchmove', (e: Event) => this.onTouchMove(e))
    this.element.addEventListener('mousedown', (e: Event) => this.onMouseDown(e))
    this.element.addEventListener('mouseup', (e: Event) => this.onMouseUp(e))
    this.element.addEventListener('mousemove', (e: Event) => this.onMouseMove(e))
    console.log(this, partInfo)
  }

  getResultFromEvent (event: any) {
    let swipeFrameDistanceX = event.clientX - this.initialPosX - this.lastPosX
    swipeFrameDistanceX = swipeFrameDistanceX < 30 ? swipeFrameDistanceX : 30
    this.swipeDistanceX += swipeFrameDistanceX

    let swipeFrameDistanceY = event.clientY - this.initialPosY - this.lastPosY
    swipeFrameDistanceY = swipeFrameDistanceY < 30 ? swipeFrameDistanceY : 30
    this.swipeDistanceY += swipeFrameDistanceY

    this.lastPosX = event.clientX - this.initialPosX
    this.lastPosY = event.clientY - this.initialPosY

    const res = {
      velocityX: swipeFrameDistanceX,
      velocityY: swipeFrameDistanceY,
      isFinal: false,
      direction: this.direction,
      event: event
    }
    return res
  }

  swipeStart (event: any) {
    this.firstSwipeDate = Date.now()
    this.isDown = true
    this.initialPosX = event.clientX
    this.initialPosY = event.clientY
    this.swipeDistanceX = ZERO
    this.swipeDistanceY = ZERO
    // this.onSwipeStart.emit()
  }

  swipeEnd (event: any) {
    this.initialPosX = this.lastPosX = ZERO
    this.initialPosY = this.lastPosY = ZERO
    this.isDown = false
    const res = {
      velocityX: 0,
      velocityY: 0,
      isFinal: !this.isDown
    }
    console.log(res, event)
    // this.onSwipeEnd.emit(res)
    this.swipeDistanceX = ZERO
    this.swipeDistanceY = ZERO
  }

  swipeMove (event: any) {
    const res = this.getResultFromEvent(event)
    if (res.velocityX > 0) {
      this.direction = DIRECTION.LEFT
      // this.onSwipeLeft.emit(res)
    } else if (res.velocityX < 0) {
      this.direction = DIRECTION.RIGHT
      // this.onSwipeRight.emit(res)
    } else if (res.velocityY > 0) {
      this.direction = DIRECTION.DOWN
      // this.onSwipeDown.emit(res)
    } else if (res.velocityY < 0) {
      this.direction = DIRECTION.UP
      // this.onSwipeUp.emit(res)
    }
    // this.onSwipe.emit(res)
  }

  // @HostListener('touchstart', ['$event'])
  onTouchStart (event: any) {
    const touch = event.touches[0] || event.changedTouches[0]
    this.swipeStart(touch)
    console.log(touch)
  }

  // @HostListener('mousedown', ['$event'])
  onMouseDown (event: any) {
    this.swipeStart(event)
  }

  // @HostListener('document:mouseup', ['$event'])
  onMouseUp (event: any) {
    this.swipeEnd(event)
  }

  // @HostListener('touchend', ['$event'])
  onTouchEnd (event: any) {
    const touch = event.touches[0] || event.changedTouches[0]
    this.swipeEnd(touch)
  }

  // @HostListener('mousemove', ['$event'])
  onMouseMove (event: any) {
    if (this.isDown) {
      this.swipeMove(event)
    }
  }

  // @HostListener('touchmove', ['$event'])
  onTouchMove (event: any) {
    const touch = event.touches[0] || event.changedTouches[0]
    this.swipeMove(touch)
  }

  render () {
    return ''
  }
}
