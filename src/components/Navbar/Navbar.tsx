import { NavLink as RouterNavLink } from 'react-router-dom'
import strings from '../../locales/en.json'
import { routes } from '../../config'
import { Nav, NavBrand, NavLinks, NavLink } from './Navbar.styles'

export function Navbar() {
  return (
    <Nav>
      <NavBrand>{strings.brand}</NavBrand>
      <NavLinks>
        <li>
          <NavLink as={RouterNavLink} to={routes.createWallet}>
            {strings.nav.createWallet}
          </NavLink>
        </li>
        <li>
          <NavLink as={RouterNavLink} to={routes.balance}>
            {strings.nav.balance}
          </NavLink>
        </li>
        <li>
          <NavLink as={RouterNavLink} to={routes.buyTicket}>
            {strings.nav.buyTicket}
          </NavLink>
        </li>
        <li>
          <NavLink as={RouterNavLink} to={routes.redeem}>
            {strings.nav.redeem}
          </NavLink>
        </li>
      </NavLinks>
    </Nav>
  )
}
