import { trimStr } from '@/api/utils'
import { Conditional } from '@/types'

export class Parser {
  private parent: ParentNode
  private defaultError: string

  constructor(parent: ParentNode) {
    this.parent = parent
    this.defaultError = 'Element is not available.'
  }

  public setParent(parent: ParentNode) {
    this.parent = parent
  }

  public setDefaultError(error: string) {
    this.defaultError = error
  }

  public select<B extends boolean>(
    selector: string,
    required: B = false as B,
  ): Conditional<B, Element> {
    const element = this.parent.querySelector(selector)
    if (!element && required) {
      throw new Error(this.defaultError)
    }
    return element as Element
  }

  public contains(className: string) {
    if (this.parent instanceof Element) {
      return this.parent.classList.contains(className)
    }
    return false
  }

  public hasChild(selector: string) {
    return this.parent.querySelector(selector) !== null
  }

  public switchToChild<B extends boolean>(selector: string, required: B = false as B) {
    const newParent = this.select<B>(selector, required)
    if (newParent) {
      this.setParent(newParent)
    }
    return newParent
  }

  public all(selector: string) {
    return Array.from(this.parent.querySelectorAll(selector))
  }

  public attr(name: string) {
    if (!(this.parent instanceof Element)) {
      return null
    }
    const value = this.parent.getAttribute(name)
    return value ? trimStr(value) : value
  }

  public attrInt(name: string) {
    const value = this.attr(name)
    if (value) {
      const int = parseInt(value)
      if (!isNaN(int)) {
        return int
      }
    }
    return null
  }

  public attrEnum<T extends string>(name: string, values: T[]) {
    const value = this.attr(name)
    if (value && values.includes(value as T)) {
      return value as T
    }
    return null
  }

  public text() {
    const text = this.parent.textContent
    return text ? trimStr(text) : null
  }

  public isNextSibling(className: string) {
    if (!(this.parent instanceof Element)) return false
    const next = this.parent.nextElementSibling
    return next && next.classList.contains(className)
  }

  public isPrevSibling(className: string) {
    if (!(this.parent instanceof Element)) return false
    const prev = this.parent.previousElementSibling
    return prev && prev.classList.contains(className)
  }
}
