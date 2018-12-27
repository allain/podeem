export interface AugmentedNode extends Node {
  collect(node?: Node): { [key: string]: AugmentedNode }
}

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
  if (nodeData && nodeData[0] === '#') {
    node.nodeValue = ""
    return nodeData.slice(1)
  }
  return null
}

type PathSegment = { skip: number, name: string }

function extractRefPath(node: Node): PathSegment[] {
  const nextNode = createIterator(node)

  let segments: PathSegment[] = []
  let currentNode: Node | null = nextNode()

  for (let skip = 0; currentNode; currentNode = nextNode(), skip++) {
    const name = extractRefName(currentNode)
    if (name) {
      segments.push({ skip, name })
      skip = -1
    }
  }

  return segments
}

function buildCollector(content: Node) {
  const refPath = extractRefPath(content)
  return (node?: Node) => {
    const next = createIterator(node || content)

    return refPath.reduce((refs: { [name: string]: Node | null }, segment: PathSegment) => {
      let skip = segment.skip
      while (skip-- > 0) {
        next()
      }
      refs[segment.name] = next()
      return refs
    }, {})
  }
}


// Reused across all h calls
const compilerTemplate = document.createElement('template')

export default function h(strings: TemplateStringsArray, ...args: any[]): AugmentedNode {
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

  const result = content as AugmentedNode
  result.collect = buildCollector(content)
  return result
}
