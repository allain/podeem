import buildCollector from './collectors/path-collector'
// import skipCollector from './collectors/skip-collector'

const compilerTemplate = document.createElement('template')

function h (strings, ...args) {
  compilerTemplate.innerHTML = String.raw(strings, ...args)
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
    .replace(/\n\s+/g, '<!-- -->')

  const content = compilerTemplate.content.firstChild

  const result = () => content.cloneNode(true)
  result.collect = buildCollector(content)
  return result
}

export default h
