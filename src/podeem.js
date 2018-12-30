import buildCollector from './collectors/path-collector'

export { default as when } from './when'
export { default as reconciler } from './reconciler'

const compilerTemplate = document.createElement('template')

export function h (strings, ...args) {
  compilerTemplate.innerHTML = String.raw(strings, ...args)
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
    .replace(/\n\s+/g, '<!-- -->')

  const content = compilerTemplate.content.firstChild

  const result = () => content.cloneNode(true)
  result.collect = buildCollector(content)
  return result
}
