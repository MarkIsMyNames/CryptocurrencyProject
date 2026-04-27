import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect } from 'vitest'
import { theme } from '../../theme'
import { Navbar } from './Navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <Navbar />
      </ThemeProvider>
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  it('renders all navigation links', () => {
    renderNavbar()
    expect(screen.getByText('Create Wallet')).toBeInTheDocument()
    expect(screen.getByText('Check Balance')).toBeInTheDocument()
    expect(screen.getByText('Buy Ticket')).toBeInTheDocument()
    expect(screen.getByText('Redeem Ticket')).toBeInTheDocument()
  })

  it('has no accessibility violations', () => {
    const { container } = renderNavbar()
    expect(container.querySelector('nav')).toBeInTheDocument()
  })
})
