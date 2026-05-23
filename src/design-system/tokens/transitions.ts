export const transitions = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  easing: {
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    gentle: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

export const transitionBase = `transition-all duration-[250ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]`
