import styled from 'styled-components'

export const PageWrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`

export const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

export const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.brandPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.brandPrimaryHover};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.brandPrimaryDisabled};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.borderFocus};
    outline-offset: 2px;
  }
`

export const SecondaryButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.textLink};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.textLinkHover};
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.borderFocus};
    outline-offset: 2px;
  }
`

export const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

export const WarningBox = styled.div`
  background: ${({ theme }) => theme.colors.statusErrorSubtle};
  border: 1px solid ${({ theme }) => theme.colors.borderError};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const CardLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const CardValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  word-break: break-all;
`

/* ── Wizard chrome ── */

export const StepLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`

export const ProgressDots = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Dot = styled.span<{ $active: boolean; $done: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $active, $done }) =>
    $active || $done ? theme.colors.brandPrimary : theme.colors.borderDefault};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`

/* ── Forms ── */

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const TextInput = styled.input`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`

export const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.statusError};
  margin: 0;
`

/* ── Recovery phrase grid ── */

export const PhraseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`

export const PhraseWord = styled.div`
  background: ${({ theme }) => theme.colors.backgroundCard};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: baseline;
`

export const WordIndex = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  min-width: 1.4em;
`

export const WordText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`

/* ── Verify step ── */

export const VerifyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`
