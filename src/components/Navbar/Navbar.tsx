import { NavLink as RouterNavLink } from 'react-router-dom'
import strings from '../../locales/en.json'
import { Nav, NavBrand, NavLinks, NavLink } from './Navbar.styles'

export function Navbar() {
  return (
    <Nav>
      <NavBrand>EventTicket</NavBrand>
      <NavLinks>
        <li>
          <NavLink as={RouterNavLink} to="/create-wallet">
            {strings.nav.createWallet}
          </NavLink>
        </li>
        <li>
          <NavLink as={RouterNavLink} to="/balance">
            {strings.nav.balance}
          </NavLink>
        </li>
        <li>
          <NavLink as={RouterNavLink} to="/buy-ticket">
            {strings.nav.buyTicket}
          </NavLink>
        </li>
        <li>
          <NavLink as={RouterNavLink} to="/redeem">
            {strings.nav.redeem}
          </NavLink>
        </li>
      </NavLinks>
    </Nav>
  )
}
