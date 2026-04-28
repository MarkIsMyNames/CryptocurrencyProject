import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { routes } from '../../config'
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
  it('renders brand name', () => {
    renderNavbar()
    expect(screen.getByText(en.brand)).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderNavbar()
    expect(screen.getByText(en.nav.createWallet)).toBeInTheDocument()
    expect(screen.getByText(en.nav.balance)).toBeInTheDocument()
    expect(screen.getByText(en.nav.buyTicket)).toBeInTheDocument()
    expect(screen.getByText(en.nav.redeem)).toBeInTheDocument()
  })

  it('renders a nav element', () => {
    const { container } = renderNavbar()
    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('nav links point to correct routes', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: en.nav.createWallet })).toHaveAttribute(
      'href',
      routes.createWallet,
    )
    expect(screen.getByRole('link', { name: en.nav.balance })).toHaveAttribute(
      'href',
      routes.balance,
    )
    expect(screen.getByRole('link', { name: en.nav.buyTicket })).toHaveAttribute(
      'href',
      routes.buyTicket,
    )
    expect(screen.getByRole('link', { name: en.nav.redeem })).toHaveAttribute('href', routes.redeem)
  })
})
