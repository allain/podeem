type RefMap = { [name: string]: Node }
type Collectors = { [name: string]: number[] }

const childIndex = (node: Node, child: Node) => Array.from(node.childNodes).findIndex(n => n === child)
const lineage = (descendant: Node, ancestor: Node): Node[] => {
  const path = [descendant]
  let currentNode: Node | null = descendant
  while (currentNode && currentNode !== ancestor) {
    currentNode = currentNode.parentNode
    if (currentNode)
      path.push(currentNode)
  }
  return path
}

const extractPath = (root: Node, descendant: Node) => {
  const parents = lineage(descendant, root)
  const path = []
  for (let i = 0; i < parents.length - 1; i++) {
    path.push(childIndex(parents[i + 1], parents[i]))
  }
  return path.reverse()
}

function extractCollectors(root: Node): { [name: string]: number[] } {
  const iterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)

  let collectors: Collectors = {}

  let n: Node | null
  while (n = iterator.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE && n.nodeValue && n.nodeValue[0] === '#') {
      collectors[n.nodeValue.substr(1)] = extractPath(root, n)
      n.nodeValue = ''
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      const el = n as Element
      const attr = Array.from(el.attributes).find((attr: Attr) => attr.name[0] === '#')
      if (attr) {
        collectors[attr.name.substr(1)] = extractPath(root, n)
        el.removeAttributeNode(attr)
      }
    }
  }

  return collectors
}

const collector = (collectors: Collectors) =>
  (node: Node): RefMap =>
    Object.keys(collectors).reduce((result, name) => ({
      ...result, [name]:
        collectors[name].reduce((currentNode, index) => currentNode.childNodes.item(index), node)
    }), {})

const compilerTemplate = document.createElement('template')

export default function h(strings: TemplateStringsArray, ...args: any[]) {
  compilerTemplate.innerHTML = String.raw(strings, ...args)
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
    .replace(/\n\s+/g, '<!-- -->')

  const content = compilerTemplate.content.firstChild as Node

  const result = () => content.cloneNode(true)
  result.collect = collector(extractCollectors(content))
  return result
}
