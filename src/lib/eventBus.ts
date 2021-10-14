/* eslint-disable @typescript-eslint/no-extraneous-class */
import mitt from 'mitt'

export class EventBus {
  private static instance: EventBus

  /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
  private constructor () { }

  /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
  public static getInstance (): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = mitt()
      window.eventBus = EventBus.instance
    }

    return EventBus.instance
  }
}
