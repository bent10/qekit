# qekit

A lightweight and chainable library for easy DOM manipulation in modern browsers.

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
      <div class="foo"><strong>Foo</strong></div>
      <div class="foo"><em>Bar</em></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/qekit/dist/index.umd.js"></script>
    <script>
      // import qe from 'qekit'

      // selects all elements with the class "foo"
      const $ = qe('.foo') // qe('.foo', '.container')

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
  const items = qe('.item', container)
  ```

- **QeKitInstance:**

  ```js
  const container = qe('#container')
  const items = qe('.item', container)
  ```

- **CSS selector string:**

  ```js
  const items = qe('.item', '#container')
  ```

> [!NOTE]
>
> The `parent` parameter is used only when the first argument (`selectors`) is a CSS selector string; otherwise, it is ignored.

### Class manipulation

```js
$.addClass('bar') // adds the class "bar" to all selected elements
$.removeClass('bar') // removes the class "bar"
$.toggleClass('baz') // toggles the class "baz"
$.hasClass('baz') // returns true if all elements have the class "baz"
```

### Event handling

```js
const handler = event => {
  // do something...
}

$.on('click', handler) // / handle the click event

$.off('click', handler) // removes the event listener

$.trigger('customEvent') // triggers a custom event
```

### Native Element methods

`qekit` automatically attaches native Element methods to the returned object. This allows you to directly call methods like `setAttribute`, `getAttribute`, `closest`, `before`, `after`, `remove`, etc.

```js
$.setAttribute('data-id', '123')

const value = $.getAttribute('data-id')
console.log(value)
```

### Chaining

```js
$.addClass('active').on('click', () => {})

$.elements.forEach(el => {
  console.log(el.outerHTML)
})
```

## API

### `qe(selectors: string | HTMLElement | NodeList | HTMLCollection | null, parent: Element | Document | string | QeKitInstance | null = document): QeKitInstance`

Selects DOM elements based on the provided CSS selectors and returns a `QeKitInstance`.

### `QeKitInstance` methods

- **`addClass(classname: string): QeKitInstance`**: Adds a class or classes to each selected element.
- **`removeClass(classname: string): QeKitInstance`**: Removes a class or classes from each selected element.
- **`toggleClass(classname: string): QeKitInstance`**: Toggles a class or classes on each selected element.
- **`hasClass(classname: string): boolean`**: Checks if the class exists on all selected elements.
- **`on<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): QeKitInstance`**: Adds an event listener to each selected element.
- **`off<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): QeKitInstance`**: Removes an event listener from each selected element.
- **`trigger(type: string, init?: EventInit): QeKitInstance`**: Triggers an event on each selected element.
- **Native Element Methods**: All native Element methods are available directly on the `QeKitInstance`.

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
