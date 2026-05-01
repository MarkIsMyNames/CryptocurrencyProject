import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import { ConfigError } from './ConfigError'
import en from './locales/en.json'

function renderConfigError(message: string) {
  render(
    <ThemeProvider theme={theme}>
      <ConfigError message={message} />
    </ThemeProvider>,
  )
}

describe('ConfigError', () => {
  it('displays the config error title', () => {
    renderConfigError('Missing required environment variable: VITE_CONTRACT_ADDRESS')
    expect(screen.getByText(en.configError.title)).toBeInTheDocument()
  })

  it('displays the error message', () => {
    const msg = 'Missing required environment variable: VITE_CONTRACT_ADDRESS'
    renderConfigError(msg)
    expect(screen.getByText(msg)).toBeInTheDocument()
  })

  it('displays the setup hint', () => {
    renderConfigError('some error')
    expect(screen.getByText(en.configError.hint)).toBeInTheDocument()
  })

  it('displays a non-Error string message', () => {
    renderConfigError('string error')
    expect(screen.getByText('string error')).toBeInTheDocument()
  })
})
