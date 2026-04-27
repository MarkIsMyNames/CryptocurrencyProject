import React from 'react'
import type { Preview } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../src/theme'

const preview: Preview = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default preview
