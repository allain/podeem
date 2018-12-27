import h from "../src/podeem"

describe("podeem", () => {
  it('exports a single function', () =>
    expect(h).toBeInstanceOf(Function)
  )

  it('builds DOM nodes', () =>
    expect(h`<h1>#Testing</h1>`).toBeInstanceOf(HTMLElement)
  )

  it('throws on invalid template', () =>
    expect(() => h``).toThrowError('invalid template')
  )

  it('augments node with collect method', () => {
    const augmented = h`<h1 #arg>#body</h1>`
    expect(augmented.collect).toBeInstanceOf(Function)
    const collected = augmented.collect()
    expect(Object.keys(collected)).toEqual(['arg', 'body'])
    expect(collected.arg.nodeName).toEqual('H1')
    expect(collected.body.nodeName).toEqual('#text')
  })

  it('handles collect without slots', () => {
    const augmented = h`<h1>Static</h1>`
    expect(augmented.collect).toBeInstanceOf(Function)
    const collected = augmented.collect(augmented)
    expect(Object.keys(collected)).toEqual([])
  })
})
