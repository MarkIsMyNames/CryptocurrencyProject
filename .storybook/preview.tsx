import type { Preview } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '../src/theme'
import { Status } from '../src/config'

export default {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    a11y: {
      test: Status.error,
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
