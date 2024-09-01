/* eslint-disable @typescript-eslint/no-explicit-any */

type ExcludeGettersSetters<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? K extends `get ${string}` | `set ${string}` | 'webkitMatchesSelector'
      ? never
      : K
    : never
}[keyof T]

interface CustomEventInit<T = any> extends EventInit {
  detail?: T
}

type NativeElementMethods = Pick<Element, ExcludeGettersSetters<Element>>

/**
 * A utility class for manipulating DOM elements.
 *
 * Provides a chainable API for common DOM operations.
 */
class QeKit {
  /**
   * The array of HTMLElement objects.
   */
  elements: HTMLElement[]

  /**
   * Creates a new QeKit instance.
   *
   * @param selectors - The CSS selector string, Element, NodeList, or HTMLCollection to select
   *   elements.
   * @param parent - The parent element or CSS selector string within which to search for the
   *   elements. If not provided, the selector will be applied to the entire
   *   document.
   */
  constructor(
    selectors: string | Element | NodeList | HTMLCollection | null,
    parent: Element | Document | string | QeKitInstance | null = document
  ) {
    if (typeof selectors === 'string') {
      let parentElement: Element | Document | null
      if (typeof parent === 'string') {
        parentElement = document.querySelector(parent)
      } else if (parent instanceof QeKit) {
        parentElement = parent.elements[0] ?? document
      } else {
        parentElement = parent
      }

      if (parentElement === null) {
        parentElement = document
      }

      this.elements = Array.from(parentElement.querySelectorAll(selectors))
    } else if (selectors instanceof Element) {
      this.elements = [selectors as HTMLElement]
    } else if (
      selectors instanceof NodeList ||
      selectors instanceof HTMLCollection
    ) {
      this.elements = Array.from(selectors) as HTMLElement[]
    } else {
      this.elements = []
    }
  }

  /**
   * Adds one or more classes to the selected elements.
   *
   * @param classname - The class name(s) to add, separated by spaces.
   */
  addClass(classname: string) {
    const classes = classname.split(' ')
    this.elements.forEach(element => {
      element.classList.add(...classes)
    })
    return this
  }

  /**
   * Removes one or more classes from the selected elements.
   *
   * @param classname - The class name(s) to remove, separated by spaces.
   */
  removeClass(classname: string) {
    const classes = classname.split(' ')
    this.elements.forEach(element => {
      element.classList.remove(...classes)
    })
    return this
  }

  /**
   * Toggles one or more classes on the selected elements.
   *
   * @param classname - The class name(s) to toggle, separated by spaces.
   * @param force - If provided, forces the class to be added or removed based on the boolean value.
   */
  toggleClass(classname: string, force?: boolean) {
    const classes = classname.split(' ')
    this.elements.forEach(element => {
      classes.forEach(cls => element.classList.toggle(cls, force))
    })
    return this
  }

  /**
   * Checks if all selected elements have the specified class.
   *
   * @param classname - The class name to check.
   * @returns True if all elements have the class, false otherwise.
   */
  hasClass(classname: string) {
    return this.elements.every(element => element.classList.contains(classname))
  }

  /**
   * Gets an element at a specific index from the selected elements.
   *
   * @param index - The index of the element to get.
   * @returns A new QeKit instance containing only the element at the specified index,
   * or an empty QeKit instance if the index is out of bounds.
   */
  eq(index: number): QeKitInstance {
    return new QeKit(this.elements[index]) as QeKitInstance
  }

  /**
   * Adds an event listener to the selected elements.
   *
   * @param type - The event type to listen for.
   * @param listener - The event listener function.
   * @param options - Optional event listener options.
   */
  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): this
  on(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): this
  on(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    this.elements.forEach(element => {
      element.addEventListener(type, listener, options)
    })
    return this
  }

  /**
   * Removes an event listener from the selected elements.
   *
   * @param type - The event type to remove the listener for.
   * @param listener - The event listener function to remove.
   * @param options - Optional event listener options.
   */
  off<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): this
  off(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): this
  off(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    this.elements.forEach(element => {
      element.removeEventListener(type, listener, options)
    })
    return this
  }

  /**
   * Triggers a custom event on the selected elements.
   *
   * @param type - The event type to trigger.
   * @param init - Optional event initialization options.
   */
  trigger<T = any>(type: string | CustomEvent, init?: CustomEventInit<T>) {
    this.elements.forEach(element => {
      let event: Event
      if (typeof type === 'string') {
        event = new CustomEvent(type, init)
      } else {
        event = type
      }
      element.dispatchEvent(event)
    })
    return this
  }
}

/**
 * Checks if a property name corresponds to a method on the Element
 * prototype.
 *
 * @param name - The property name to check
 */
function isMethod(name: string) {
  const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, name)

  return (
    typeof descriptor?.value === 'function' &&
    !['constructor', 'webkitMatchesSelector'].includes(name)
  )
}

/**
 * An array of names of native Element methods.
 */
const elementMethodNames = Object.getOwnPropertyNames(Element.prototype).filter(
  isMethod
) as Array<keyof NativeElementMethods>

// Allows using native Element methods directly on QeKit instances
elementMethodNames.forEach(method => {
  ;(QeKit as any).prototype[method] = function (...args: any[]) {
    const results = Array.from(this.elements).map(element =>
      (element as any)[method](...args)
    )

    if (method.startsWith('set') || method === 'removeAttribute') {
      return this
    }

    return results.length > 1 ? results : results[0]
  }
})

const arrayMethods = [
  'map',
  'filter',
  'forEach',
  'reduce',
  'some',
  'every',
  'find',
  'findIndex'
] as const

// Allows using array methods directly on QeKit instances
arrayMethods.forEach(method => {
  ;(QeKit as any).prototype[method] = function (
    this: QeKit,
    ...args: Parameters<Array<HTMLElement>[typeof method]>
  ) {
    return (this.elements as any)[method](...args)
  }
})

type ArrayMethodNames = (typeof arrayMethods)[number]

type ArrayMethods = {
  [K in ArrayMethodNames]: Array<HTMLElement>[K]
}

/**
 * A QeKit instance, which extends QeKit with native Element methods and
 * array methods.
 */
export type QeKitInstance = QeKit & NativeElementMethods & ArrayMethods

/**
 * Selects DOM elements using a CSS selector and returns a QeKit instance.
 *
 * @param selectors - The CSS selector string, Element, NodeList, or HTMLCollection to select
 *   elements.
 * @param parent - The parent element or CSS selector string within which to search for the
 *   elements. If not provided, the selector will be applied to the entire
 *   document.
 */
export default function qe(
  selectors: string | Element | NodeList | HTMLCollection | null,
  parent: Element | Document | string | QeKitInstance | null = document
) {
  return new QeKit(selectors, parent) as QeKitInstance
}
