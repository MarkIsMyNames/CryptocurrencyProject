import type { Preview } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../src/theme'

export default {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    a11y: {
      test: 'error',
      config: {
        rules: [{ id: 'color-contrast', reviewOnFail: false }],
      },
    },
    backgrounds: {
      values: [{ name: 'dark', value: theme.colors.backgroundPage }],
    },
  },
  initialGlobals: {
    backgrounds: { value: theme.colors.backgroundPage },
  },
} satisfies Preview
