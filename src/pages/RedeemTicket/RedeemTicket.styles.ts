import styled from 'styled-components'

export const PageWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

export const TicketCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: left;
`

export const FieldLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

export const FieldValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  word-break: break-all;
`

interface TicketStatusBadgeProps {
  $valid: boolean
}

export const TicketStatusBadge = styled.span<TicketStatusBadgeProps>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme, $valid }) =>
    $valid ? theme.colors.statusSuccess : theme.colors.statusError};
  background: ${({ theme, $valid }) =>
    $valid ? theme.colors.statusSuccessSubtle : theme.colors.statusErrorSubtle};
  border: 1px solid
    ${({ theme, $valid }) =>
      $valid ? theme.colors.statusSuccess : theme.colors.statusError};
`

export const RedeemButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.brandPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.brandPrimaryHover};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.brandPrimaryDisabled};
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }
`

interface StatusMessageProps {
  $type: 'success' | 'error' | 'pending'
}

export const StatusMessage = styled.p<StatusMessageProps>`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
  color: ${({ theme, $type }) => {
    if ($type === 'success') return theme.colors.statusSuccess
    if ($type === 'error') return theme.colors.statusError
    return theme.colors.statusPending
  }};
  background: ${({ theme, $type }) => {
    if ($type === 'success') return theme.colors.statusSuccessSubtle
    if ($type === 'error') return theme.colors.statusErrorSubtle
    return theme.colors.backgroundCard
  }};
  border: 1px solid
    ${({ theme, $type }) => {
      if ($type === 'success') return theme.colors.statusSuccess
      if ($type === 'error') return theme.colors.statusError
      return theme.colors.statusPending
    }};
`

export const ConnectPrompt = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`
