const childIndex = (node, child) =>
  Array.from(node.childNodes).findIndex(n => n === child)
const lineage = (descendant, ancestor) => {
  const path = [descendant]
  let currentNode = descendant
  while (currentNode && currentNode !== ancestor) {
    currentNode = currentNode.parentNode
    if (currentNode) path.push(currentNode)
  }
  return path
}

const extractPath = (root, descendant) => {
  const parents = lineage(descendant, root)
  const path = []
  for (let i = 0; i < parents.length - 1; i++) {
    path.push(childIndex(parents[i + 1], parents[i]))
  }
  return path.reverse()
}

function extractCollectors (root) {
  const iterator = document.createNodeIterator(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  )

  let collectors = {}

  let n
  while ((n = iterator.nextNode())) {
    if (
      n.nodeType === Node.TEXT_NODE &&
      n.nodeValue &&
      n.nodeValue[0] === '#'
    ) {
      collectors[n.nodeValue.substr(1)] = extractPath(root, n)
      n.nodeValue = ''
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      const attr = Array.from(n.attributes).find(attr => attr.name[0] === '#')
      if (attr) {
        collectors[attr.name.substr(1)] = extractPath(root, n)
        n.removeAttributeNode(attr)
      }
    }
  }

  return collectors
}

const collector = collectors => node =>
  Object.keys(collectors).reduce((result, name) => {
    result[name] = collectors[name].reduce(
      (currentNode, index) => currentNode.childNodes.item(index),
      node
    )
    return result
  }, {})

const compilerTemplate = document.createElement('template')

function h (strings, ...args) {
  compilerTemplate.innerHTML = String.raw(strings, ...args)
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
    .replace(/\n\s+/g, '<!-- -->')

  const content = compilerTemplate.content.firstChild

  const result = () => content.cloneNode(true)
  result.collect = collector(extractCollectors(content))
  return result
}

export default h
