const nativeToSyntheticEvent = (event, name) => {
  let dom = event.target
  while (dom !== null) {
    const eventHandler = dom[`__${name}`]
    if (eventHandler) {
      eventHandler()
      return
    }
    dom = dom.parentNode
  }
}

const CONFIGURED_SYNTHETIC_EVENTS = new Set()
function when (name, target, handler) {
  if (!CONFIGURED_SYNTHETIC_EVENTS.has(name)) {
    document.addEventListener(name, event =>
      nativeToSyntheticEvent(event, name)
    )
    CONFIGURED_SYNTHETIC_EVENTS.add(name)
  }

  target[`__${name}`] = handler
}

for (let event of ['click']) {
  when[event] = (target, handler) => when(event, target, handler)
}

export default when
