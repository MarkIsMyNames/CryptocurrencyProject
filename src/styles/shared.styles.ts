import styled from 'styled-components'

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
