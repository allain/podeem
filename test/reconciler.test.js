import reconciler from '../src/reconciler'

const template = document.createElement('template')
function dom (html) {
  template.innerHTML = html
  return template.content.firstChild
}

describe('reconciler', () => {
  it('exports a function', () => expect(reconciler).toBeInstanceOf(Function))

  it('populates children', () => {
    const parent = dom('<div>')

    const r = reconciler(
      parent,
      n => document.createTextNode(`${n}`),
      (node, n) => (node.nodeValue = n)
    )

    r([1, 2, 3])
    expect(parent.childNodes.length).toEqual(3)
  })

  it('can update children', () => {
    const parent = dom('<div>')

    const r = reconciler(
      parent,
      n => document.createTextNode(n),
      (node, n) => (node.nodeValue = n)
    )

    r([1, 2, 3])
    r([1, 2, 3, 4])
    expect(parent.childNodes.length).toEqual(4)
  })
})
