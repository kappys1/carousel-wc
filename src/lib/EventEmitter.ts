
export interface EventOptions {
  /** should event bubble through the DOM */
  bubbles?: boolean
  /** event is cancelable */
  cancelable?: boolean
  /** can event bubble between the shadow DOM and the light DOM boundary */
  composed?: boolean
}

export class EventEmitter<T> {
//   eventsListeners = new Map()
  constructor (private readonly target: HTMLElement) {}

  emit (eventName: string, value: T, options?: EventOptions) {
    this.target.dispatchEvent(
      new CustomEvent<T>(eventName, { detail: value, ...options })
    )
  }

  on (eventName: string, fn: any) {
    this.target.addEventListener(eventName, fn)
  }

  off (eventName: string, fn: any) {
    this.target.removeEventListener(eventName, fn)
  }
}
