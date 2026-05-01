import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const testEnv = Object.fromEntries(
  readFileSync(join(import.meta.dirname, '.env.example'), 'utf8')
    .split('\n')
    .filter((line) => line.includes('=') && !line.startsWith('#'))
    .map((line) => {
      const [key, ...rest] = line.split('=')
      return [key.trim(), rest.join('=').trim()]
    })
)

const themeSource = readFileSync(join(import.meta.dirname, 'src/theme.ts'), 'utf8')
const backgroundPage = themeSource.match(/backgroundPage:\s*'([^']+)'/)?.[1]
if (!backgroundPage) throw new Error('Could not extract backgroundPage from src/theme.ts')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-theme-colors',
      transformIndexHtml: (html: string) => html.replace('background:#0f1117', `background:${backgroundPage}`),
    },
  ],
  test: {
    projects: [{
      extends: true,
      test: {
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['e2e/**', '.worktrees/**'],
        environment: 'jsdom',
        setupFiles: ['./src/test-setup.ts'],
        globals: true,
        env: testEnv,
      }
    }, {
      extends: true,
      plugins: [storybookTest({ configDir: join(import.meta.dirname, '.storybook') })],
      test: {
        name: 'storybook',
        env: testEnv,
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{ browser: 'chromium' }]
        }
      }
    }]
  }
});
