import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = path.dirname(fileURLToPath(import.meta.url));

const themeSource = readFileSync(path.join(dirname, 'src/theme.ts'), 'utf8')
const backgroundPage = themeSource.match(/backgroundPage:\s*'([^']+)'/)?.[1]
if (!backgroundPage) throw new Error('Could not extract backgroundPage from src/theme.ts')

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
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
        globals: true
      }
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});