import styled from 'styled-components'

export const PageWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`

export { Title, Subtitle } from '../../styles/shared.styles'

export const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  }
`

export const InfoLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const InfoValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
`

export { StatusMessage, ConnectPrompt, PrimaryActionButton } from '../../styles/shared.styles'

export const TxCard = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

export const TxLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`

export const TxHash = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  word-break: break-all;
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`

export const TxLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLink};
  text-decoration: underline;
`
