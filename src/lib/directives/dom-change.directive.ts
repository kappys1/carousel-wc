
import { Directive } from 'lit/directive.js'

export class DomChangeDirective extends Directive {
  private changes: MutationObserver | null = null
  private readonly element
  constructor (partInfo: any) {
    super(partInfo)
    this.element = partInfo.parentNode
  }

  // ngOnDestroy (): void {
  //   this.changes.disconnect()
  // }

  render (fn: any) {
    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => fn(mutation))
    })

    this.changes.observe(this.element, {
      attributes: true,
      childList: true,
      characterData: true
    })
    return ''
  }
}
