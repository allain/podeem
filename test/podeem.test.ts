import h from "../src/podeem"

describe("podeem", () => {
  it('exports a single function', () =>
    expect(h).toBeInstanceOf(Function)
  )

  it('builds a Node factory function', () => {
    const builder = h`<h1>#Testing</h1>`
    expect(builder).toBeInstanceOf(Function)
    expect(builder()).toBeInstanceOf(Node)
  })

  it('builds new instance on repeated calls', () => {
    const builder = h`<h1>#Testing</h1>`
    expect(builder()).not.toBe(builder())
  })

  it('throws on invalid template', () =>
    expect(() => h``).toThrowError('invalid template')
  )

  it('builder exposes collect method', () => {
    const builder = h`<h1 #arg>#body</h1>`
    expect(builder.collect).toBeInstanceOf(Function)
  })

  it('collect method collects references', () => {
    const builder = h`<h1 #arg>#body</h1>`
    const built = builder()
    const refs = builder.collect(built)
    expect(Object.keys(refs)).toEqual(['arg', 'body'])
    expect(refs.arg.nodeName).toEqual('H1')
    expect(refs.body.nodeName).toEqual('#text')
  })

  it('handles collect without references', () => {
    const builder = h`<h1>Static</h1>`
    const built = builder()
    expect(builder.collect(built)).toEqual({})
  })

  it('collect can be used with any clones', () => {
    const builder = h`<h1 #a>Static</h1>`

    const builds = [builder(), builder(), builder()]
    const collectedRefKeys = builds.map(builder.collect).map(Object.keys)
    expect(collectedRefKeys).toEqual([['a'], ['a'], ['a']])
  })
})
