import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigError } from './ConfigError'
import strings from './locales/en.json'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error(strings.configError.rootNotFound)

function showConfigError(el: HTMLElement, err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  createRoot(el).render(createElement(ConfigError, { message }))
}

import('./AppEntry')
  .then(({ renderApp }) => {
    renderApp(rootEl)
  })
  .catch((err: unknown) => {
    showConfigError(rootEl, err)
  })
