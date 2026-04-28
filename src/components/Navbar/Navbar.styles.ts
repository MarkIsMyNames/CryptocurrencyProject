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
  color: ${({ theme }) => theme.colors.textLink};
`

export const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
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
    color: ${({ theme }) => theme.colors.textLink};
    font-weight: 600;
  }
`
