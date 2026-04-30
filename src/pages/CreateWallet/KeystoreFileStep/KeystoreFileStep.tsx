import en from '../../../locales/en.json'
import {
  PageWrapper,
  Subtitle,
  Form,
  InputGroup,
  Label,
  TextInput,
  ErrorText,
  ButtonRow,
  SecondaryButton,
} from '../CreateWallet.styles'

interface KeystoreFileStepProps {
  fileError: string | null
  onFileSelect: (file: File) => void
  onBack: () => void
}

export function KeystoreFileStep({ fileError, onFileSelect, onBack }: KeystoreFileStepProps) {
  return (
    <PageWrapper>
      <Subtitle>{en.createWallet.keystoreFileInstruction}</Subtitle>
      <Form>
        <InputGroup>
          <Label htmlFor="keystore-file">{en.createWallet.keystoreFileLabel}</Label>
          <TextInput
            id="keystore-file"
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                onFileSelect(file)
              }
            }}
          />
        </InputGroup>
        {fileError !== null && <ErrorText>{fileError}</ErrorText>}
      </Form>
      <ButtonRow>
        <SecondaryButton type="button" onClick={onBack}>
          {en.createWallet.backBtn}
        </SecondaryButton>
      </ButtonRow>
    </PageWrapper>
  )
}
