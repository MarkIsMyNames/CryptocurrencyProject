import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { theme } from './theme'
import { WalletProvider } from './context/WalletContext'
import App from './App'
import strings from './locales/en.json'

document.title = strings.brand

export function renderApp(root: HTMLElement) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <WalletProvider>
            <App />
          </WalletProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}
