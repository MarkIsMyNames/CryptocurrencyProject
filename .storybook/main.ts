import type { StorybookConfig } from '@storybook/react-vite'
import { theme } from '../src/theme.ts'

export default {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
  addons: ['@storybook/addon-a11y', 'storybook-addon-pseudo-states'],
  framework: '@storybook/react-vite',
  previewHead: (head) =>
    `${head ?? ''}<style>html,body,#storybook-root{background-color:${theme.colors.backgroundPage}}</style>`,
} satisfies StorybookConfig
