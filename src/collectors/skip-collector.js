// tracks references by tracking the number of nodes to be skipped between references

function createIterator (node) {
  const i = document.createNodeIterator(
    node,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
  )
  return () => i.nextNode()
}

function extractRefName (node) {
  if ('attributes' in node) {
    const attr = Array.from(node.attributes).find(a => a.name[0] === '#')
    return attr ? node.removeAttributeNode(attr).name.slice(1) : null
  }

  let nodeData = node.nodeValue
  if (nodeData && nodeData[0] === '#') {
    node.nodeValue = ''
    return nodeData.slice(1)
  }
  return null
}

function extractCollectors (node) {
  const nextNode = createIterator(node)

  let segments = []
  let currentNode = nextNode()

  for (let skip = 0; currentNode; currentNode = nextNode(), skip++) {
    const name = extractRefName(currentNode)
    if (name) {
      if (segments.find(s => s.name === name)) {
        throw new Error(`duplicate reference ${name}`)
      }

      segments.push({ skip, name })
      skip = -1
    }
  }

  return segments
}

const buildCollector = collectors => node => {
  const next = createIterator(node)

  return collectors.reduce((refs, segment) => {
    let skip = segment.skip
    while (skip-- > 0) next()

    refs[segment.name] = next()
    return refs
  }, {})
}

export default template => buildCollector(extractCollectors(template))
