import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { VideoHeroSection } from './VideoHeroSection'

const meta: Meta<typeof VideoHeroSection> = {
  title: 'Components/Hero/VideoHeroSection',
  component: VideoHeroSection,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <MemoryRouter><div className="bg-[var(--color-surface)]"><Story /></div></MemoryRouter>],
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof VideoHeroSection>

export const Default: Story = {
  args: {
    youtubeId: 'Z6Dx-o3vfJY',
    title: 'Experience The Process.',
    subtitle: 'From bean to cup, every step is a testament to our dedication to quality and flavor.',
    ctaPrimary: { label: 'Shop Coffee', to: '/coffee' },
    ctaSecondary: { label: 'Our Story', to: '/about' },
  },
}
