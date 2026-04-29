import 'dotenv/config'
import hardhatEthers from '@nomicfoundation/hardhat-ethers'
import { configVariable, defineConfig } from 'hardhat/config'

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: {
    profiles: {
      default: { version: '0.8.20' },
    },
  },
  networks: {
    sepolia: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('SEPOLIA_RPC_URL'),
      accounts: [configVariable('DEPLOY_PRIVATE_KEY')],
    },
  },
})
