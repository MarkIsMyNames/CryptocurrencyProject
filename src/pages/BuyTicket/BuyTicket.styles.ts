import styled from 'styled-components'

export const PageWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
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

export const BuyButton = styled.button`
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

export { StatusMessage, ConnectPrompt } from '../../styles/shared.styles'
