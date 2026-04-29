import { useEffect } from 'react'
import { addons } from 'storybook/preview-api'
import { STORY_RENDERED } from 'storybook/internal/core-events'
import * as React from 'react'

export function StoryRenderedEmitter({ id, children }: { id: string; children: React.ReactNode }) {
  useEffect(() => {
    addons.getChannel().emit(STORY_RENDERED, id)
  })
  return <>{children}</>
}
