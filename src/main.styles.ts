import styled from 'styled-components'
import { theme } from './theme'

export const ErrorPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${theme.colors.backgroundPage};
  font-family: monospace;
`

export const ErrorBox = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
`

export const ErrorTitle = styled.h2`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.statusError};
  font-size: ${theme.fontSizes.xl};
`

export const ErrorDetail = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`

export const ErrorHint = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`
