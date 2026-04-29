import styled from 'styled-components'

export const PageWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`

export { Title, Subtitle } from '../../styles/shared.styles'

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
  color: ${({ theme, $valid }) => ($valid ? theme.colors.statusSuccess : theme.colors.statusError)};
  background: ${({ theme, $valid }) =>
    $valid ? theme.colors.statusSuccessSubtle : theme.colors.statusErrorSubtle};
  border: 1px solid
    ${({ theme, $valid }) => ($valid ? theme.colors.statusSuccess : theme.colors.statusError)};
`

export { StatusMessage, ConnectPrompt, PrimaryActionButton } from '../../styles/shared.styles'
