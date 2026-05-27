---
name: new-story
description: Generate a Storybook story file for an existing component that is missing one, covering all props, variants, and meaningful states.
---

Read the component at the given path and generate a `.stories.tsx` file next to it.

## Story conventions (follow exactly)

- Storybook 8 CSF3 format (`satisfies Meta<typeof Component>` or `const meta: Meta<typeof Component>`)
- Infer `title` from the component's directory: `Design System/<Name>` for design-system components, `Components/<Category>/<Name>` for feature components
- `parameters: { layout: 'centered' }`
- `tags: ['autodocs']`
- `argTypes` for every variant/size/boolean prop with matching `control` type (`select`, `boolean`, `text`, etc.)
- Required stories:
  - `Default` — most common usage with minimal args
  - `AllVariants` — render every variant side-by-side in a flex container with `bg-[var(--color-surface)]` background
  - One story per meaningful interactive or loading state (e.g. `LoadingState`, `DisabledState`, `ErrorState`)
- Use realistic content (coffee-shop domain: product names, prices, order details) — not "foo" or "test"

## Component path

$ARGUMENTS
