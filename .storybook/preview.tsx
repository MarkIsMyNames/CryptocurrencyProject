import type { Preview, StoryContext } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { addons } from 'storybook/preview-api'
import { STORY_RENDERED } from 'storybook/internal/core-events'
import { theme } from '../src/theme'
import { Status } from '../src/config'
import { StoryRenderedEmitter, applyPseudoStateClasses } from './StoryRenderedEmitter'

export default {
  decorators: [
    (Story, context) => (
      <StoryRenderedEmitter id={context.id}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Story />
          </ThemeProvider>
        </MemoryRouter>
      </StoryRenderedEmitter>
    ),
  ],
  afterEach: ({ canvasElement, parameters, id }: StoryContext) => {
    const pseudo = parameters.pseudo as Record<string, unknown> | undefined
    if (pseudo) {
      applyPseudoStateClasses(canvasElement, pseudo)
      addons.getChannel().emit(STORY_RENDERED, id)
    }
  },
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
    a11y: { manual: false },
    backgrounds: { value: theme.colors.backgroundPage },
  },
} satisfies Preview
