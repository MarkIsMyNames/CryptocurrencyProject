import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
`

export const NavBrand = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandPrimary};
`

export const NavLinks = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  list-style: none;
  margin: 0;
  padding: 0;
`

export const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.textLink};
  }

  &[aria-current='page'] {
    color: ${({ theme }) => theme.colors.brandPrimary};
    font-weight: 600;
  }
`
