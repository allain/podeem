function createIterator(node: Node) {
  const i = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
  return () => i.nextNode()
}

function extractRefName(node: Node): string | null {
  if ('attributes' in node) {
    let el: Element = node as Element
    const attr = Array.from(el.attributes).find(a => a.name[0] === '#')
    return attr ? el.removeAttributeNode(attr).name.slice(1) : null
  }

  let nodeData = node.nodeValue
  if (!nodeData || nodeData[0] !== '#') {
    return null
  }

  node.nodeValue = ''
  return nodeData.slice(1)
}

type PathSegment = { skip: number, name: string }

function extractRefPath(node: Node): PathSegment[] {
  const nextNode = createIterator(node)

  let segments = []
  let currentNode = nextNode()

  let skip = 0
  while (currentNode) {
    const name = extractRefName(currentNode)
    if (name) {
      segments.push({ skip, name })
      skip = -1
    }
    skip++
    currentNode = nextNode()
  }

  return segments
}

// Reused across all h calls
const compilerTemplate = document.createElement('template')

export default function h(strings: TemplateStringsArray, ...args: any[]) {
  const template = String.raw(strings, ...args)
    .replace(/>\n+/g, '>')
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
    .replace(/\n\s+/g, '<!-- -->')

  compilerTemplate.innerHTML = template
  const content: Node | null = compilerTemplate.content.firstChild
  if (!content) {
    throw new Error('invalid template')
  }

  const refPath = extractRefPath(content)

  const result = () => content.cloneNode(true)

  result.collect = function collect(node: Node) {
    const next = createIterator(node)

    const refs: { [name: string]: Node } = {}

    for (let { skip, name } of refPath) {
      while (skip-- > 0) next()

      const el = next()
      if (el !== null) {
        refs[name] = el
      }
    }

    return refs
  }
  return result
}
