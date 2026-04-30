import '@nomicfoundation/hardhat-ethers'
import { network } from 'hardhat'
import { writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { requireEnv } from '../shared/requireEnv'

const MAX_SUPPLY = Number(requireEnv(process.env.VITE_MAX_SUPPLY, 'VITE_MAX_SUPPLY'))
const TICKET_PRICE_WEI = BigInt(requireEnv(process.env.VITE_TICKET_PRICE_WEI, 'VITE_TICKET_PRICE_WEI'))

async function main() {
  const { ethers } = await network.create() // Connects to the test network
  const [deployer] = await ethers.getSigners() // Assigns first signer to deployer

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

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
