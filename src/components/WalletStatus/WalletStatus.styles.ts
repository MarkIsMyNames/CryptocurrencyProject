import styled from 'styled-components'

export const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const StatusDot = styled.span<{ $connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme, $connected }) =>
    $connected ? theme.colors.statusSuccess : theme.colors.statusError};
`

export const StatusText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`
