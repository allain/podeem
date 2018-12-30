const indexOfChild = (node, child) =>
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
  let path = []
  for (let i = 0; i < parents.length - 1; i++) {
    path.push(indexOfChild(parents[i + 1], parents[i]))
  }
  return path.reverse()
}

function extractCollectors (root) {
  let collectors = {}

  let n

  function addCollector (name, n) {
    if (collectors[name]) throw new Error(`duplicate reference ${name}`)
    collectors[name] = extractPath(root, n)
  }

  const iterator = document.createNodeIterator(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  )
  while ((n = iterator.nextNode())) {
    if (
      n.nodeType === Node.TEXT_NODE &&
      n.nodeValue &&
      n.nodeValue[0] === '#'
    ) {
      addCollector(n.nodeValue.substr(1), n)
      n.nodeValue = ''
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      const attr = Array.from(n.attributes).find(attr => attr.name[0] === '#')
      if (attr) {
        addCollector(attr.name.substr(1), n)
        n.removeAttributeNode(attr)
      }
    }
  }

  return collectors
}

const buildCollector = collectors => node => {
  const result = {}

  for (let name of Object.keys(collectors)) {
    let currentNode = node
    for (let index of collectors[name]) {
      currentNode = currentNode.childNodes.item(index)
    }
    result[name] = currentNode
  }

  return result
}

export default template => buildCollector(extractCollectors(template))
