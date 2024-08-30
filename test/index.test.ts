/// <reference types="vitest/globals" />

import '@testing-library/jest-dom'
import qe from '../src/index.js'

beforeEach(() => {
  document.body.innerHTML = `<div class="container">
  <div id="foo" class="selector"><strong>Foo</strong></div>
  <div id="bar" class="selector"><em>Bar</em></div>
</div>
`
})

it('should select elements by CSS selector', () => {
  const $ = qe('.selector')
  expect($.elements.length).toBe(2)
  expect($.elements[0]).toBeInstanceOf(HTMLElement)
  expect($.elements[0]).toHaveAttribute('id', 'foo')
  expect($.elements[1]).toHaveAttribute('id', 'bar')
})

it('should add event listeners to elements', () => {
  const $ = qe('.selector')
  const clickHandler = vi.fn()

  $.on('click', clickHandler)
  $.elements[0].dispatchEvent(new Event('click'))

  expect(clickHandler).toHaveBeenCalled()
})

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

  expect(clickHandler).toHaveBeenCalledTimes(2)
})

it('should allow method chaining', () => {
  const $ = qe('.selector')
  const clickHandler = vi.fn()

  $.on('click', clickHandler).off('click', clickHandler).trigger('click')

  expect(clickHandler).not.toHaveBeenCalled()
})

it('should handle non-existent elements gracefully', () => {
  const $ = qe('.non-existent')
  expect($.elements.length).toBe(0)

  const clickHandler = vi.fn()
  $.on('click', clickHandler).trigger('click')

  expect(clickHandler).not.toHaveBeenCalled()
})

it('should dynamically call native methods on elements', () => {
  const $ = qe('.selector')
  $.setAttribute('data-test', 'value')

  expect($.elements[0]).toHaveAttribute('data-test', 'value')
  expect($.elements[1]).toHaveAttribute('data-test', 'value')

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
  expect(attrValues).toEqual(['value', 'value'])
})

it('should remove attributes using removeAttribute', () => {
  const elements = qe('.selector')
  elements.setAttribute('data-test', 'value')
  elements.removeAttribute('data-test')

  elements.elements.forEach(element => {
    expect(element.hasAttribute('data-test')).toBe(false)
  })
})
