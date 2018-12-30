import { h, when } from '../src/podeem'

describe('podeem', () => {
  it('exports a single function', () => expect(h).toBeInstanceOf(Function))

  it('builds a Node factory function', () => {
    const builder = h`<h1>#Testing</h1>`
    expect(builder).toBeInstanceOf(Function)
    expect(builder()).toBeInstanceOf(Node)
  })

  it('builds new instance on repeated calls', () => {
    const builder = h`<h1>#Testing</h1>`
    expect(builder()).not.toBe(builder())
  })

  it('builder exposes collect method', () => {
    const builder = h`<h1 #arg>#body</h1>`
    expect(builder.collect).toBeInstanceOf(Function)
  })

  it('collect method collects references', () => {
    const build = h`<h1 #arg>#body</h1>`
    const built = build()
    const refs = build.collect(built)
    expect(Object.keys(refs)).toEqual(['arg', 'body'])
    expect(refs.arg.nodeName).toEqual('H1')
    expect(refs.body.nodeName).toEqual('#text')
  })

  it('handles collect without references', () => {
    const build = h`<h1>Static</h1>`
    const built = build()
    expect(build.collect(built)).toEqual({})
  })

  it('collect can be used with any clones', () => {
    const build = h`<h1 #a>Static</h1>`

    const builds = [build(), build(), build()]
    const collectedRefKeys = builds.map(build.collect).map(Object.keys)
    expect(collectedRefKeys).toEqual([['a'], ['a'], ['a']])
  })

  it('exposes when function', () => expect(when).toBeInstanceOf(Function))
})
