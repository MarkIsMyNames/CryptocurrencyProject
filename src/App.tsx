import { Routes, Route, Navigate } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import styled from 'styled-components'
import { Navbar } from './components/Navbar/Navbar'
import { WalletStatus } from './components/WalletStatus/WalletStatus'
import { CreateWallet } from './pages/CreateWallet/CreateWallet'
import { Balance } from './pages/Balance/Balance'
import { BuyTicket } from './pages/BuyTicket/BuyTicket'
import { RedeemTicket } from './pages/RedeemTicket/RedeemTicket'

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: ${({ theme }) => theme.colors.backgroundPage};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: system-ui, -apple-system, sans-serif;
    min-height: 100vh;
  }
`

const AppHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const WalletStatusWrapper = styled.div`
  padding-right: ${({ theme }) => theme.spacing.xl};
`

export default function App() {
  return (
    <>
      <GlobalStyle />
      <AppHeader>
        <Navbar />
        <WalletStatusWrapper>
          <WalletStatus />
        </WalletStatusWrapper>
      </AppHeader>
      <Routes>
        <Route path="/" element={<Navigate to="/create-wallet" replace />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/buy-ticket" element={<BuyTicket />} />
        <Route path="/redeem" element={<RedeemTicket />} />
      </Routes>
    </>
  )
}
