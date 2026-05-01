import strings from './locales/en.json'
import { ErrorPage, ErrorBox, ErrorTitle, ErrorDetail, ErrorHint } from './main.styles'

interface Props {
  message: string
}

export function ConfigError({ message }: Props) {
  return (
    <ErrorPage>
      <ErrorBox>
        <ErrorTitle>{strings.configError.title}</ErrorTitle>
        <ErrorDetail>{message}</ErrorDetail>
        <ErrorHint>{strings.configError.hint}</ErrorHint>
      </ErrorBox>
    </ErrorPage>
  )
}
