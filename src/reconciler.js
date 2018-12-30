export default (parent, createFn, updateFn, renderedData = []) => data => {
  if (data.length === 0) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
    renderedData = data.slice(0)
    return
  }

  if (renderedData.length > data.length) {
    let i = renderedData.length

    let tail = parent.lastChild

    let tmp
    while (i > data.length) {
      tmp = tail.previousSibling
      parent.removeChild(tail)
      tail = tmp
      i--
    }
  }

  let node = parent.firstChild

  let i = 0
  let n = data.length

  while (node && i < n) {
    updateFn(node, data[i++])
    node = node.nextSibling
  }

  while (i < n) {
    parent.appendChild(createFn(data[i++]))
  }

  renderedData = data.slice(0)
}
