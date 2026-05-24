import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite')
    const { resolve } = await import('path')
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': resolve(__dirname, '../src'),
          '@ds': resolve(__dirname, '../src/design-system'),
          '@components': resolve(__dirname, '../src/components'),
          '@pages': resolve(__dirname, '../src/pages'),
          '@hooks': resolve(__dirname, '../src/hooks'),
          '@store': resolve(__dirname, '../src/store'),
          '@api': resolve(__dirname, '../src/api'),
        },
      },
    })
  },
}

export default config
