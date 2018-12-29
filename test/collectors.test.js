import pathCollector from '../src/collectors/path-collector'
import skipCollector from '../src/collectors/skip-collector'

const template = document.createElement('template')
function dom (html) {
  template.innerHTML = html
  return template.content.firstChild
}

describe('collectors', () => {
  const collectors = { path: pathCollector, skip: skipCollector }

  for (let [name, collector] of Object.entries(collectors)) {
    it(`${name} - creates function`, () =>
      expect(collector(dom('<div></div>'))).toBeInstanceOf(Function))

    it(`${name} - returns empty ref when executed on dom with no refs`, () => {
      const t = dom('<div></div>')
      expect(collector(t)(t)).toEqual({})
    })

    it(`${name} - returns proper ref when refering to root by attrib`, () => {
      const t = dom('<div #a></div>')
      const refs = collector(t)(t)
      expect(Object.keys(refs)).toEqual(['a'])
      expect(refs.a).toBeInstanceOf(Node)
      expect(refs.a.tagName).toEqual('DIV')
    })

    it(`${name} - returns proper ref when refering to nested by attrib`, () => {
      const t = dom('<div><p #a>Test</p></div>')
      const refs = collector(t)(t)
      expect(Object.keys(refs)).toEqual(['a'])
      expect(refs.a).toBeInstanceOf(Node)
      expect(refs.a.tagName).toEqual('P')
    })

    it(`${name} - can refer to text node within element`, () => {
      const t = dom('<div>#a</div>')
      const refs = collector(t)(t)
      expect(Object.keys(refs)).toEqual(['a'])
      expect(refs.a).toBeInstanceOf(Text)
    })

    it(`${name} - clears out ref attribute while building collector`, () => {
      const t = dom('<div #a>test</div>')
      collector(t)
      expect(t.attributes.length).toEqual(0)
    })

    it(`${name} - clears out body ref when building collector`, () => {
      const t = dom('<div>#a</div>')
      collector(t)
      expect(t.innerHTML).toEqual('')
    })

    it(`${name} - throws when refs collide`, () => {
      const t = dom('<div #a>#a</div>')
      expect(() => collector(t)).toThrow('duplicate reference a')
    })
  }
})
