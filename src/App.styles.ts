import { createGlobalStyle } from 'styled-components'
import styled from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: ${({ theme }) => theme.colors.backgroundPage};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: system-ui, -apple-system, sans-serif;
    min-height: 100vh;
  }
`

export const AppHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const WalletStatusWrapper = styled.div`
  padding-right: ${({ theme }) => theme.spacing.xl};
`
