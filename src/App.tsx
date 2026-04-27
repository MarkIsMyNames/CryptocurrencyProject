import { Routes, Route, Navigate } from 'react-router-dom'
import { GlobalStyle, AppHeader, WalletStatusWrapper } from './App.styles'
import { Navbar } from './components/Navbar/Navbar'
import { WalletStatus } from './components/WalletStatus/WalletStatus'
import { CreateWallet } from './pages/CreateWallet/CreateWallet'
import { Balance } from './pages/Balance/Balance'
import { BuyTicket } from './pages/BuyTicket/BuyTicket'
import { RedeemTicket } from './pages/RedeemTicket/RedeemTicket'

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
