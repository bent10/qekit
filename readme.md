# qekit

A lightweight (`2.73 kB │ gzip: 1.15 kB`) and chainable library for easy DOM manipulation in modern browsers.

- [Installation](#installation)
- [Usage](#usage)
  - [Contextual selection](#contextual-selection)
  - [Accessing elements by index and collection](#accessing-elements-by-index-and-collection)
  - [Class manipulation](#class-manipulation)
  - [Siblings](#siblings)
  - [Event handling](#event-handling)
  - [Native Element methods](#native-element-methods)
  - [Array methods](#array-methods)
  - [Chaining](#chaining)
- [API](#api)
  - [`qe()`](#qe)
  - [Methods](#methods)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install this module using npm or yarn:

```bash
npm i qekit
# or
yarn add qekit
```

Alternatively, you can also include this module directly in your HTML file from [CDN](https://www.jsdelivr.com/package/npm/qekit?tab=files&path=dist):

| Type | URL                                                    |
| :--- | :----------------------------------------------------- |
| ESM  | `https://cdn.jsdelivr.net/npm/qekit/+esm`              |
| CJS  | `https://cdn.jsdelivr.net/npm/qekit/dist/index.cjs`    |
| UMD  | `https://cdn.jsdelivr.net/npm/qekit/dist/index.umd.js` |

## Usage

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QeKit</title>
  </head>
  <body>
    <div class="container">
      <div class="item"><strong>Foo</strong></div>
      <div class="item"><em>Bar</em></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/qekit/dist/index.umd.js"></script>
    <script>
      // import qe from 'qekit'

      // selects all elements with the class "item"
      const $ = qe('.item') // qe('.item', '.container')

      // rest of examples...
    </script>
  </body>
</html>
```

> [!NOTE]
>
> `qekit` allows you to select elements using different types of selectors:
>
> - **CSS Selector String**: `qe('.foo')`
> - **HTMLElement**: `qe(document.querySelector('#foo'))`
> - **NodeList/HTMLCollection**: `qe(document.querySelectorAll('.foo'))`

### Contextual selection

Target elements within a specific container or DOM subtree:

- **HTMLElement:**

  ```js
  const container = document.querySelector('#container')
  const $ = qe('.item', container)
  ```

- **QeKitInstance:**

  ```js
  const $container = qe('#container')
  const $ = qe('.item', $container)
  ```

- **CSS selector string:**

  ```js
  const $ = qe('.item', '#container')
  ```

> [!NOTE]
>
> The `parent` parameter is used only when the first argument (`selectors`) is a CSS selector string; otherwise, it is ignored.

### Accessing elements by index and collection

Since `v1.3.0`

`qekit` allows you to easily access elements within a selection:

- **`get(index?)`**: Returns the element(s) at the specified index or all elements if no index is provided.

  ```js
  const $ = qe('.item')

  // get all elements
  const elems = $.get()
  // get the first element
  const first = $.get(0)
  // get the third element
  const third = $.get(2)
  // try to get a non-existent element
  const notExist = $.get(10) // returns null
  ```

- **`first()`**: Returns a new `QeKitInstance` of the first element.

  ```js
  const $ = qe('.item')
  const $first = $.first()
  ```

- **`last()`**: Returns a new `QeKitInstance` of the last element.

  ```js
  const $ = qe('.item')
  const $last = $.last()
  ```

- **`eq(index?)`**: Returns a new `QeKitInstance` with only the element at the specified index.

  ```js
  const $ = qe('.item')
  const $third = $.eq(2)
  ```

### Class manipulation

```js
$.addClass('bar') // adds the class "bar" to all selected elements
$.removeClass('bar') // removes the class "bar"
$.toggleClass('baz') // toggles the class "baz"
$.hasClass('baz') // returns true if all elements have the class "baz"
```

### Siblings

Since `v1.3.0`

Select all sibling elements of the selected elements:

```js
$.eq(1).addClass('.active').siblings().removeClass('.active')
```

### Event handling

```js
const handler = event => {
  // do something...
}

$.on('click', handler) // handle the click event
$.off('click', handler) // removes the event listener

// trigger a custom event with data
$.trigger('customEvent', { message: 'Hello from custom event!', value: 123 })
// ... in your event listener ...
$.on('customEvent', event => {
  console.log(event.detail.message) // Output: "Hello from custom event!"
  console.log(event.detail.value) // Output: 123
})
```

### Native Element methods

`qekit` automatically attaches native Element methods to the returned object. This allows you to directly call methods like `setAttribute`, `getAttribute`, `closest`, `before`, `after`, `remove`, etc.

```js
$.setAttribute('data-id', '123')

const value = $.getAttribute('data-id')
console.log(value)
```

### Array methods

Since `v1.3.0`

`qekit` now lets you chain array methods directly on the returned object, allowing for more fluent operations on the selected elements.

```js
$.map(el => parseInt(el.textContent, 10) * 2)
```

### Chaining

```js
$.eq(1)
  .addClass('active')
  .on('click', () => {
    // do something with second item
  })

$.filter(el => el.classList.contains('active')).forEach(
  el => (el.style.color = 'red')
)
```

## API

### `qe()`

Selects DOM elements based on the provided CSS selectors and returns a `QeKitInstance`.

```js
qe<T extends Element = HTMLElement>(
  selectors:
    | string
    | Element
    | Element[]
    | NodeList
    | HTMLCollection
    | EventTarget
    | null,
  parent: Element | Document | string | QeKitInstance | null = document
): QeKitInstance
```

### Methods

- **`get(index?: number): T | T[] | null`**: Gets the selected element(s) at the specified index or the whole collection if index is not provided.

  - If `index` is provided and within the bounds of the elements, it returns the element at that index.
  - If `index` is not provided, it returns an array containing all the selected elements.
  - If `index` is out of bounds, it returns `null`.

- **`first(): QeKitInstance`**: Gets the first selected element.
- **`last(): QeKitInstance`**: Gets the last selected element.
- **`eq(index: number): QeKitInstance`**: Returns the element at the specified index or null if the index is out of bounds.
- **`addClass(classname: string): QeKitInstance`**: Adds a class or classes to each selected element.
- **`removeClass(classname: string): QeKitInstance`**: Removes a class or classes from each selected element.
- **`toggleClass(classname: string): QeKitInstance`**: Toggles a class or classes on each selected element.
- **`hasClass(classname: string): boolean`**: Checks if the class exists on all selected elements.
- **`siblings(selector?: string): QeKitInstance`**: Returns a new QeKitInstance containing all sibling elements (optionally filtered by a selector).
- **`on<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): QeKitInstance`**: Adds an event listener to each selected element.
- **`off<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): QeKitInstance`**: Removes an event listener from each selected element.
- **`trigger<T = any>(type: string | CustomEvent<T>, init?: CustomEventInit<T>): QeKitInstance`**: Triggers an event on each selected element, optionally passing an Event object (e.g., CustomEvent with data).
- **Native Element Methods**: All native Element methods are available directly on the `QeKitInstance`.
- **Array Methods**: All standard array methods (`map`, `filter`, `forEach`, `reduce`, `some`, `every`, `find`, `findIndex`) are chainable on the `QeKitInstance`.

## Contributing

We 💛&nbsp; issues.

When committing, please conform to [the semantic-release commit standards](https://www.conventionalcommits.org/). Please install `commitizen` and the adapter globally, if you have not already.

```bash
npm i -g commitizen cz-conventional-changelog
```

Now you can use `git cz` or just `cz` instead of `git commit` when committing. You can also use `git-cz`, which is an alias for `cz`.

```bash
git add . && git cz
```

## License

![GitHub](https://img.shields.io/github/license/bent10/qekit)

A project by [Stilearning](https://stilearning.com) &copy; 2024.
