import { describe, it, expect } from 'vitest'
import { decodeContractError } from './contract'
import strings from '../locales/en.json'

describe('decodeContractError', () => {
  it('returns unknownError for non-Error throws', () => {
    expect(decodeContractError('a string')).toBe(strings.errors.unknownError)
    expect(decodeContractError(null)).toBe(strings.errors.unknownError)
    expect(decodeContractError(42)).toBe(strings.errors.unknownError)
  })

  it('returns the raw message for unrecognised Error', () => {
    expect(decodeContractError(new Error('something unexpected'))).toBe('something unexpected')
  })

  it('decodes BAD_DATA as contractNotDeployed', () => {
    expect(decodeContractError(new Error('BAD_DATA'))).toBe(strings.errors.contractNotDeployed)
  })

  it('decodes could not decode result data as contractNotDeployed', () => {
    expect(decodeContractError(new Error('could not decode result data'))).toBe(
      strings.errors.contractNotDeployed,
    )
  })

  it('decodes IncorrectPayment as incorrectAmount', () => {
    expect(decodeContractError(new Error('IncorrectPayment()'))).toBe(
      strings.errors.incorrectAmount,
    )
  })

  it('decodes AlreadyOwnsTicket as alreadyOwned', () => {
    expect(decodeContractError(new Error('AlreadyOwnsTicket()'))).toBe(strings.errors.alreadyOwned)
  })

  it('decodes SoldOut as soldOut', () => {
    expect(decodeContractError(new Error('SoldOut()'))).toBe(strings.errors.soldOut)
  })

  it('decodes NoTicketToRedeem as noTicket', () => {
    expect(decodeContractError(new Error('NoTicketToRedeem()'))).toBe(strings.errors.noTicket)
  })

  it('decodes AlreadyOwnsTicket hex selector as alreadyOwned', () => {
    expect(
      decodeContractError(new Error('execution reverted (unknown custom error) data="0x1a43bf63"')),
    ).toBe(strings.errors.alreadyOwned)
  })

  it('decodes SoldOut hex selector as soldOut', () => {
    expect(
      decodeContractError(new Error('execution reverted (unknown custom error) data="0x52df9fe5"')),
    ).toBe(strings.errors.soldOut)
  })

  it('decodes NoTicketToRedeem hex selector as noTicket', () => {
    expect(
      decodeContractError(new Error('execution reverted (unknown custom error) data="0xe58c3a17"')),
    ).toBe(strings.errors.noTicket)
  })

  it('decodes user rejected as cancelled', () => {
    expect(decodeContractError(new Error('user rejected the request'))).toBe(
      strings.errors.cancelled,
    )
  })

  it('decodes INSUFFICIENT_FUNDS as insufficientFunds', () => {
    expect(decodeContractError(new Error('INSUFFICIENT_FUNDS'))).toBe(
      strings.errors.insufficientFunds,
    )
  })

  it('decodes insufficient funds as insufficientFunds', () => {
    expect(decodeContractError(new Error('insufficient funds for gas * price + value'))).toBe(
      strings.errors.insufficientFunds,
    )
  })

  it('decodes timeout as networkError', () => {
    expect(decodeContractError(new Error('timeout exceeded'))).toBe(strings.errors.networkError)
  })

  it('decodes SERVER_ERROR as networkError', () => {
    expect(decodeContractError(new Error('SERVER_ERROR'))).toBe(strings.errors.networkError)
  })

  it('decodes could not detect network as networkError', () => {
    expect(decodeContractError(new Error('could not detect network'))).toBe(
      strings.errors.networkError,
    )
  })
})
