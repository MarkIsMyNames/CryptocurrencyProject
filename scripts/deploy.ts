import '@nomicfoundation/hardhat-ethers'
import { network } from 'hardhat'
import { writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const MAX_SUPPLY = 1000
const TICKET_PRICE_WEI = 10_000_000_000_000_000n // 0.01 ETH

async function main() {
  const { ethers } = await network.create()
  const [deployer] = await ethers.getSigners()

  console.log(`Deploying from: ${deployer.address}`)

  const factory = await ethers.getContractFactory('EventTicket')
  const contract = await factory.deploy(MAX_SUPPLY, TICKET_PRICE_WEI, deployer.address)
  await contract.waitForDeployment()

  const address = await contract.getAddress()
  console.log(`EventTicket deployed to: ${address}`)

  const envPath = join(process.cwd(), '.env')
  const existing = readFileSync(envPath, 'utf8')
  const updated = existing.replace(/^VITE_CONTRACT_ADDRESS=.*/m, `VITE_CONTRACT_ADDRESS=${address}`)
  writeFileSync(envPath, updated)
  console.log(`.env updated with new contract address`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
