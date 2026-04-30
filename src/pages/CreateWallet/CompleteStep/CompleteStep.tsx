import { Status } from '../../../config'
import en from '../../../locales/en.json'
import { StatusMessage } from '../../../styles/shared.styles'
import {
  PageWrapper,
  Title,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  Card,
  CardLabel,
  CardValue,
} from '../CreateWallet.styles'

export function CompleteStep({
  address,
  onDownload,
  onGoToBalance,
}: {
  address: string
  onDownload: () => void
  onGoToBalance: () => void
}) {
  return (
    <PageWrapper>
      <Title>{en.createWallet.steps.complete}</Title>
      <StatusMessage $type={Status.success}>{en.createWallet.walletCreated}</StatusMessage>
      <Card>
        <CardLabel>{en.createWallet.addressLabel}</CardLabel>
        <CardValue>{address}</CardValue>
      </Card>
      <ButtonRow>
        <SecondaryButton onClick={onDownload}>{en.createWallet.downloadBtn}</SecondaryButton>
        <PrimaryButton onClick={onGoToBalance}>{en.createWallet.goToBalance}</PrimaryButton>
      </ButtonRow>
    </PageWrapper>
  )
}
