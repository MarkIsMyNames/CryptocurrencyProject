import { useEffect } from 'react'
import { addons } from 'storybook/preview-api'
import { STORY_RENDERED } from 'storybook/internal/core-events'

export function applyPseudoStateClasses(
  canvasElement: Element,
  pseudo: Record<string, unknown>,
): void {
  const { rootSelector, ...config } = pseudo
  const root =
    (typeof rootSelector === 'string' ? document.querySelector(rootSelector) : null) ??
    canvasElement
  Object.entries(config).forEach(([state, selector]) => {
    if (selector === true) {
      root.classList.add(`pseudo-${state}-all`)
    } else if (typeof selector === 'string') {
      root.querySelectorAll(selector).forEach((el) => {
        el.classList.add(`pseudo-${state}`)
      })
    } else if (Array.isArray(selector)) {
      ;(selector as string[]).forEach((sel) => {
        root.querySelectorAll(sel).forEach((el) => {
          el.classList.add(`pseudo-${state}`)
        })
      })
    }
  })
}

export function StoryRenderedEmitter({ id, children }: { id: string; children: React.ReactNode }) {
  useEffect(() => {
    addons.getChannel().emit(STORY_RENDERED, id)
  })
  return <>{children}</>
}
