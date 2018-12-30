import when from '../src/when'

const template = document.createElement('template')
function dom (html) {
  template.innerHTML = html
  return template.content.firstChild
}

describe('when', () => {
  it('exports a function', () => expect(when).toBeInstanceOf(Function))

  it('works on shallow dom', () => {
    const t = dom('<div>Test</div>')
    document.body.appendChild(t)
    when('click', t, e => (t.innerHTML = 'handled'))
    expect(t.dispatchEvent(new Event('click', { bubbles: true }))).toBeTruthy()
    expect(t.innerHTML).toEqual('handled')
  })

  it('works when children of target are clicked', () => {
    const t = dom('<div><div><div id="a">Test</div></div></div>')
    document.body.appendChild(t)
    const a = document.getElementById('a')

    when('click', t, e => (t.innerHTML = 'handled'))

    expect(a.dispatchEvent(new Event('click', { bubbles: true }))).toBeTruthy()
    expect(t.innerHTML).toEqual('handled')
  })

  it('exposes click method', () => expect(when.click).toBeInstanceOf(Function))

  it('click method works', () => {
    const t = dom('<div><div><div id="a">Test</div></div></div>')
    document.body.appendChild(t)
    const a = document.getElementById('a')

    when.click(t, e => (t.innerHTML = 'handled'))

    expect(a.dispatchEvent(new Event('click', { bubbles: true }))).toBeTruthy()
    expect(t.innerHTML).toEqual('handled')
  })
})
