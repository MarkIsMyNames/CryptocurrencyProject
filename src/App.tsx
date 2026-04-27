import { Routes, Route, Navigate } from 'react-router-dom'
import { GlobalStyle, AppHeader, WalletStatusWrapper } from './App.styles'
import { Navbar } from './components/Navbar/Navbar'
import { WalletStatus } from './components/WalletStatus/WalletStatus'
import { CreateWallet } from './pages/CreateWallet/CreateWallet'
import { Balance } from './pages/Balance/Balance'
import { BuyTicket } from './pages/BuyTicket/BuyTicket'
import { RedeemTicket } from './pages/RedeemTicket/RedeemTicket'
import { routes } from './config'

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
        <Route path={routes.root} element={<Navigate to={routes.createWallet} replace />} />
        <Route path={routes.createWallet} element={<CreateWallet />} />
        <Route path={routes.balance} element={<Balance />} />
        <Route path={routes.buyTicket} element={<BuyTicket />} />
        <Route path={routes.redeem} element={<RedeemTicket />} />
      </Routes>
    </>
  )
}
