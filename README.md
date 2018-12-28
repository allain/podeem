# Podeem

A small libary for writing high performance Web UIs. 

Based on the excellent work in [stage0](https://github.com/Freak613/stage0).

### Usage

```js
import h from 'podeem'

// Define the template
const View = h`<div>
  <h1>#message</h1>
  <button #greet>Greet</button>
</div>`

const view = View() // create a DOM node using the template above

const { message, greet } = View.collect(view)
message.nodeValue = 'Hello World'
greet.__click = () => alert('Hello')

document.body.appendChild(view)
```

### Features

