import type { Preview } from '@storybook/react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'warm-white',
      values: [
        { name: 'warm-white', value: '#FAF9F6' },
        { name: 'beige', value: '#EDE7DD' },
        { name: 'charcoal', value: '#2E2E2E' },
      ],
    },
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
