# Podeem

A small libary for writing high performance Web UIs. 

Based on the excellent work in [stage0](https://github.com/Freak613/stage0).

### Usage

```js
import {h, when, reconcile } from 'podeem'

// Define the template
const Demo = h`<div>
  <h1>#message</h1>
  <button #greet>Greet</button>
</div>`

const demo = Demo() // create a DOM node using the template above

const { message, greet } = Demo.collect(demo)
message.nodeValue = 'Hello World'

when.click(greet, e => message.nodeValue='Hello Again')
// or: when.click(greet, e => message.nodeValue='Hello Again')

document.body.appendChild(demo)
```

### Features

