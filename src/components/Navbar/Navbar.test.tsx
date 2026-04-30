import { customRender, screen } from '../../test-utils'
import { describe, it, expect } from 'vitest'
import en from '../../locales/en.json'
import { routes } from '../../config'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('renders brand name', () => {
    customRender(<Navbar />)
    expect(screen.getByText(en.brand)).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    customRender(<Navbar />)
    expect(screen.getByText(en.nav.createWallet)).toBeInTheDocument()
    expect(screen.getByText(en.nav.balance)).toBeInTheDocument()
    expect(screen.getByText(en.nav.buyTicket)).toBeInTheDocument()
    expect(screen.getByText(en.nav.redeem)).toBeInTheDocument()
  })

  it('renders a nav element', () => {
    const { container } = customRender(<Navbar />)
    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('active link has aria-current=page', () => {
    customRender(<Navbar />, { initialEntries: [routes.balance] })
    expect(screen.getByRole('link', { name: en.nav.balance })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: en.nav.createWallet })).not.toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('nav links point to correct routes', () => {
    customRender(<Navbar />)
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
