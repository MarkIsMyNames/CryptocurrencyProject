import styled from 'styled-components'

export type StatusType = 'success' | 'error' | 'pending' | null

interface StatusMessageProps {
  $type: 'success' | 'error' | 'pending'
}

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

export const PrimaryActionButton = styled.button`
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
