/* eslint-disable @typescript-eslint/no-explicit-any */

type ExcludeGettersSetters<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? K extends `get ${string}` | `set ${string}` | 'webkitMatchesSelector'
      ? never
      : K
    : never
}[keyof T]

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
   * @param selectors - The CSS selector string to select elements.
   */
  constructor(selectors: string) {
    this.elements = Array.from(document.querySelectorAll(selectors))
  }

  /**
   * Adds one or more classes to the selected elements.
   *
   * @param classname - The class name(s) to add, separated by spaces.
   * @returns The QeKit instance for chaining.
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
   * @returns The QeKit instance for chaining.
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
   * @returns The QeKit instance for chaining.
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
  hasClass(classname: string): boolean {
    return this.elements.every(element => element.classList.contains(classname))
  }

  /**
   * Adds an event listener to the selected elements.
   *
   * @param type - The event type to listen for.
   * @param listener - The event listener function.
   * @param options - Optional event listener options.
   * @returns The QeKit instance for chaining.
   */
  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    this.elements.forEach(element => {
      element.addEventListener<K>(type, listener, options)
    })
    return this
  }

  /**
   * Removes an event listener from the selected elements.
   *
   * @param type - The event type to remove the listener for.
   * @param listener - The event listener function to remove.
   * @param options - Optional event listener options.
   * @returns The QeKit instance for chaining.
   */
  off<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    this.elements.forEach(element => {
      element.removeEventListener<K>(type, listener, options)
    })
    return this
  }

  /**
   * Triggers a custom event on the selected elements.
   *
   * @param type - The event type to trigger.
   * @param init - Optional event initialization options.
   * @returns The QeKit instance for chaining.
   */
  trigger(type: string, init?: EventInit) {
    this.elements.forEach(element => {
      const event = new Event(type, init)
      element.dispatchEvent(event)
    })
    return this
  }
}

/**
 * Checks if a property name corresponds to a method on the Element
 * prototype.
 *
 * @param name - The property name to check.
 * @returns True if the property is a method, false otherwise.
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

// Allows using native Element methods directly on QeKit instances.
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

/**
 * A QeKit instance, which extends QeKit with native Element methods.
 */
export type QeKitInstance = QeKit & NativeElementMethods

/**
 * Selects DOM elements using a CSS selector and returns a QeKit instance.
 *
 * @param selectors - The CSS selector string to select elements.
 * @returns A QeKit instance representing the selected elements.
 */
export default function qe(selectors: string) {
  return new QeKit(selectors) as QeKitInstance
}
