/// <reference types="vitest/globals" />

import '@testing-library/jest-dom'
import qe from '../src/index.js'

beforeEach(() => {
  document.body.innerHTML = `<div class="container">
  <div id="foo" class="selector" data-value="1"><strong>Foo</strong></div>
  <div id="bar" class="selector" data-value="2"><em>Bar</em></div>
  <div id="baz" class="selector" data-value="3"><em>Baz</em></div>
</div>
`
})

describe('Selection', () => {
  it('should select elements by CSS selector', () => {
    const $ = qe('.selector')
    expect($.elements.length).toBe(3)
    expect($.elements[0]).toBeInstanceOf(HTMLElement)
    expect($.elements[0]).toHaveAttribute('id', 'foo')
    expect($.elements[1]).toHaveAttribute('id', 'bar')
    expect($.elements[2]).toHaveAttribute('id', 'baz')
  })

  it('should handle HTMLElement as selector', () => {
    const fooElement = document.getElementById('foo')
    const $ = qe(fooElement)
    expect($.elements.length).toBe(1)
    expect($.elements[0]).toBe(fooElement)
  })

  it('should handle NodeList as selector', () => {
    const nodeList = document.querySelectorAll('.selector')
    const $ = qe(nodeList)
    expect($.elements.length).toBe(3)
    expect($.elements[0]).toBe(nodeList[0])
    expect($.elements[1]).toBe(nodeList[1])
    expect($.elements[2]).toBe(nodeList[2])
  })

  it('should handle HTMLCollection as selector', () => {
    const htmlCollection = document.getElementsByClassName('selector')
    const $ = qe(htmlCollection)
    expect($.elements.length).toBe(3)
    expect($.elements[0]).toBe(htmlCollection[0])
    expect($.elements[1]).toBe(htmlCollection[1])
    expect($.elements[2]).toBe(htmlCollection[2])
  })

  it('should select elements within a specific parent', () => {
    const $ = qe('.selector', document.querySelector('#container'))

    expect($.elements.length).toBe(3)
    expect($.elements[0].textContent).toBe('Foo')
    expect($.elements[1].textContent).toBe('Bar')
    expect($.elements[2].textContent).toBe('Baz')
  })

  it('should accept a QeKitInstance as the parent', () => {
    const $container = qe('#container')
    const $ = qe('.selector', $container)

    expect($.elements.length).toBe(3)
    expect($.elements[0].textContent).toBe('Foo')
    expect($.elements[1].textContent).toBe('Bar')
    expect($.elements[2].textContent).toBe('Baz')
  })

  it('should accept a CSS selector string as the parent', () => {
    const $ = qe('.selector', '#container')

    expect($.elements.length).toBe(3)
    expect($.elements[0].textContent).toBe('Foo')
    expect($.elements[1].textContent).toBe('Bar')
    expect($.elements[2].textContent).toBe('Baz')
  })

  it('should handle non-existent elements gracefully', () => {
    const $ = qe('.non-existent')
    expect($.elements.length).toBe(0)

    const clickHandler = vi.fn()
    $.on('click', clickHandler).trigger('click')

    expect(clickHandler).not.toHaveBeenCalled()
  })

  it('should handle null selector gracefully', () => {
    const $ = qe(null)
    expect($.elements.length).toBe(0)

    const clickHandler = vi.fn()
    $.on('click', clickHandler).trigger('click')

    expect(clickHandler).not.toHaveBeenCalled()
  })

  it('should handle non-existent parent gracefully', () => {
    const $ = qe('.selector', '.nonexistent')

    expect($.elements.length).toBe(3)
    expect($.elements[0].textContent).toBe('Foo')
    expect($.elements[1].textContent).toBe('Bar')
    expect($.elements[2].textContent).toBe('Baz')
  })

  it('should handle multiple parents gracefully', () => {
    const $ = qe('strong', qe('.selector'))

    expect($.elements.length).toBe(1)
    expect($.elements[0].textContent).toBe('Foo')
  })

  it('should log a warning when EventTarget is not an HTMLElement', () => {
    const originalWarn = console.warn
    const warnSpy = vi.spyOn(console, 'warn')
    const eventTarget = new EventTarget()

    qe(eventTarget)

    expect(warnSpy).toHaveBeenCalledWith(
      'The provided EventTarget is not an HTMLElement.'
    )

    console.warn = originalWarn
  })
})

describe('Event Handling', () => {
  it('should add event listeners to elements', () => {
    const $ = qe('.selector')
    const clickHandler = vi.fn()

    $.on('click', clickHandler)
    $.elements[0].dispatchEvent(new Event('click'))

    expect(clickHandler).toHaveBeenCalled()
  })

  it('should remove event listeners from elements', () => {
    const $ = qe('.selector')
    const clickHandler = vi.fn()

    $.on('click', clickHandler)
    $.off('click', clickHandler)
    $.elements[0].dispatchEvent(new Event('click'))

    expect(clickHandler).not.toHaveBeenCalled()
  })

  it('should trigger events on elements', () => {
    const $ = qe('.selector')
    const clickHandler = vi.fn()

    $.on('click', clickHandler)
    $.trigger('click')

    expect(clickHandler).toHaveBeenCalledTimes(3)
  })

  it('should trigger custom events with data using CustomEvent object', () => {
    const $ = qe('.selector')
    const eventData = { message: 'Hello from custom event!', value: 123 }
    const customEvent = new CustomEvent('customEvent', { detail: eventData })
    const handler = vi.fn()

    $.on('customEvent', handler)
    $.trigger(customEvent)

    expect(handler).toHaveBeenCalledTimes(3)
    expect(handler.mock.calls[0][0].detail).toEqual(eventData)
    expect(handler.mock.calls[1][0].detail).toEqual(eventData)
    expect(handler.mock.calls[2][0].detail).toEqual(eventData)
  })

  it('should trigger custom events with data using event name and init object', () => {
    const $ = qe('.selector')
    const eventData = { message: 'Hello from custom event!', value: 123 }
    const handler = vi.fn()

    $.on('customEvent', handler)
    $.trigger('customEvent', { detail: eventData })

    expect(handler).toHaveBeenCalledTimes(3)
    expect(handler.mock.calls[0][0].detail).toEqual(eventData)
    expect(handler.mock.calls[1][0].detail).toEqual(eventData)
    expect(handler.mock.calls[2][0].detail).toEqual(eventData)
  })
})

describe('Class Manipulation', () => {
  it('addClass should add a class to each selected element', () => {
    const $ = qe('.selector')
    $.addClass('qux')

    $.elements.forEach(element => {
      expect(element.classList.contains('qux')).toBe(true)
    })
  })

  it('removeClass should remove a class from each selected element', () => {
    const $ = qe('.selector')
    $.addClass('qux')
    $.removeClass('qux')

    $.elements.forEach(element => {
      expect(element.classList.contains('qux')).toBe(false)
    })
  })

  it('toggleClass should toggle a class on each selected element', () => {
    const $ = qe('.selector')
    $.toggleClass('qux')

    $.elements.forEach(element => {
      expect(element.classList.contains('qux')).toBe(true)
    })

    $.toggleClass('qux')

    $.elements.forEach(element => {
      expect(element.classList.contains('qux')).toBe(false)
    })
  })

  it('addClass should handle multiple classes', () => {
    const $ = qe('.selector')
    $.addClass('qux quux')

    $.elements.forEach(element => {
      expect(element.classList.contains('qux')).toBe(true)
      expect(element.classList.contains('quux')).toBe(true)
    })
  })

  it('removeClass should handle multiple classes', () => {
    const $ = qe('.selector')
    $.addClass('qux quux')
    $.removeClass('qux quux')

    $.elements.forEach(element => {
      expect(element.classList.contains('qux')).toBe(false)
      expect(element.classList.contains('quux')).toBe(false)
    })
  })

  it('toggleClass should handle multiple classes', () => {
    const $ = qe('.selector')
    $.toggleClass('qux quux')

    $.elements.forEach(element => {
      expect(element.classList.contains('qux')).toBe(true)
      expect(element.classList.contains('quux')).toBe(true)
    })

    $.toggleClass('qux quux')

    $.elements.forEach(element => {
      expect(element.classList.contains('qux')).toBe(false)
      expect(element.classList.contains('quux')).toBe(false)
    })
  })

  it('hasClass should return true if all elements have the class', () => {
    const $ = qe('.selector')
    $.addClass('qux')
    expect($.hasClass('qux')).toBe(true)
  })

  it('hasClass should return false if any element does not have the class', () => {
    const $ = qe('.selector')
    $.addClass('qux')
    $.elements[0].classList.remove('qux')

    expect($.hasClass('qux')).toBe(false)
  })

  it('hasClass should return false if no elements have the class', () => {
    const $ = qe('.selector')
    expect($.hasClass('no-exist')).toBe(false)
  })
})

describe('eq Method', () => {
  it('should return a new QeKit instance with the element at the specified index', () => {
    const $ = qe('.selector')
    const $eq = $.eq(1)

    expect($eq).toBeInstanceOf($.constructor)
    expect($eq.elements.length).toBe(1)
    expect($eq.elements[0]).toHaveAttribute('id', 'bar')
  })

  it('should return an empty QeKit instance if the index is out of bounds', () => {
    const $ = qe('.selector')
    const $eq = $.eq(3)

    expect($eq).toBeInstanceOf($.constructor)
    expect($eq.elements.length).toBe(0)
  })

  it('should allow chaining with other methods', () => {
    const $ = qe('.selector')
    const $eq = $.eq(1).addClass('active')

    expect($eq.elements.length).toBe(1)
    expect($eq.elements[0]).toHaveClass('active')
    expect($eq.elements[0]).toHaveAttribute('id', 'bar')
  })
})

describe('siblings Method', () => {
  it('should return all siblings of the selected elements', () => {
    const $item = qe('.selector').eq(1)
    const $siblings = $item.siblings()

    expect($siblings.elements.length).toBe(2)
    expect($siblings.elements[0]).toHaveTextContent('Foo')
    expect($siblings.elements[1]).toHaveTextContent('Baz')
  })

  it('should filter siblings based on a selector', () => {
    const $item = qe('.selector').eq(1)
    const $siblings = $item.siblings('div')

    expect($siblings.elements.length).toBe(2)
    expect($siblings.elements[0]).toHaveTextContent('Foo')
    expect($siblings.elements[1]).toHaveTextContent('Baz')
  })

  it('should return an empty QeKit instance if no siblings are found', () => {
    const $other = qe('.other')
    const $siblings = $other.siblings()

    expect($siblings.elements.length).toBe(0)
  })

  it('should return an empty QeKit instance if the element has no parent', () => {
    const $item = qe('.selector').eq(1)
    const element = $item.elements[0]
    element.remove()
    const $siblings = $item.siblings()

    expect($siblings.elements.length).toBe(0)
  })

  it('should allow chaining with other methods', () => {
    const $item = qe('.selector').eq(1)
    const $siblings = $item.siblings().addClass('highlighted')

    expect($siblings.elements.length).toBe(2)
    expect($siblings.elements[0]).toHaveClass('highlighted')
    expect($siblings.elements[1]).toHaveClass('highlighted')
  })
})

describe('Native Element Methods', () => {
  it('should dynamically call native methods on elements', () => {
    const $ = qe('.selector')
    $.setAttribute('data-test', 'value')

    expect($.elements[0]).toHaveAttribute('data-test', 'value')
    expect($.elements[1]).toHaveAttribute('data-test', 'value')
    expect($.elements[2]).toHaveAttribute('data-test', 'value')

    const html = qe('.container').querySelector('#foo')?.innerHTML
    expect(html).toBe($.elements[0].innerHTML)
  })

  it('should get and set attributes using getAttribute and setAttribute', () => {
    const elements = qe('.selector')
    elements.setAttribute('data-test', 'value')

    elements.elements.forEach(element => {
      expect(element.getAttribute('data-test')).toBe('value')
    })

    const attrValues = elements.getAttribute('data-test')
    expect(attrValues).toEqual(['value', 'value', 'value'])
  })

  it('should remove attributes using removeAttribute', () => {
    const elements = qe('.selector')
    elements.setAttribute('data-test', 'value')
    elements.removeAttribute('data-test')

    elements.elements.forEach(element => {
      expect(element.hasAttribute('data-test')).toBe(false)
    })
  })
})

describe('Array Methods', () => {
  it('should allow chaining map method', () => {
    const doubledValues = qe('.selector').map(
      element => parseInt(element.getAttribute('data-value')!, 10) * 2
    )

    expect(doubledValues).toEqual([2, 4, 6])
  })

  it('should allow chaining filter method', () => {
    const filteredElements = qe('.selector').filter(
      element => parseInt(element.getAttribute('data-value')!, 10) > 1
    )

    expect(filteredElements.length).toBe(2)
    expect(filteredElements[0]).toHaveAttribute('id', 'bar')
    expect(filteredElements[1]).toHaveAttribute('id', 'baz')
  })

  it('should allow chaining forEach method', () => {
    const textContents: string[] = []
    qe('.selector').forEach(element =>
      textContents.push(element.textContent || '')
    )

    expect(textContents).toEqual(['Foo', 'Bar', 'Baz'])
  })

  it('should allow chaining reduce method', () => {
    const sumOfValues = qe('.selector').reduce(
      (acc, element) => acc + parseInt(element.getAttribute('data-value')!, 10),
      0
    )

    expect(sumOfValues).toBe(6)
  })

  it('should allow chaining some method', () => {
    const hasValueGreaterThan2 = qe('.selector').some(
      element => parseInt(element.getAttribute('data-value')!, 10) > 2
    )

    expect(hasValueGreaterThan2).toBe(true)
  })

  it('should allow chaining every method', () => {
    const allValuesGreaterThan0 = qe('.selector').every(
      element => parseInt(element.getAttribute('data-value')!, 10) > 0
    )

    expect(allValuesGreaterThan0).toBe(true)
  })

  it('should allow chaining find method', () => {
    const elementWithValue2 = qe('.selector').find(
      element => parseInt(element.getAttribute('data-value')!, 10) === 2
    )

    expect(elementWithValue2).toHaveAttribute('id', 'bar')
  })

  it('should allow chaining findIndex method', () => {
    const index = qe('.selector').findIndex(
      element => parseInt(element.getAttribute('data-value')!, 10) === 3
    )

    expect(index).toBe(2)
  })

  it('should allow chaining multiple array methods', () => {
    const result = qe('.selector')
      .filter(element => parseInt(element.getAttribute('data-value')!, 10) > 1)
      .map(element => element.textContent)
      .reduce((acc, text) => `${acc}${text}`, '')

    expect(result).toBe('BarBaz')
  })
})
