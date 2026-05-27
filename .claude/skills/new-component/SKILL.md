---
name: new-component
description: Scaffold a new design system component with CVA variants, TypeScript props, and a Storybook story matching the project's existing patterns.
---

Create a new design system component under `src/design-system/components/<Name>/`.

## File structure to create

1. `src/design-system/components/<Name>/<Name>.tsx`
2. `src/design-system/components/<Name>/<Name>.stories.tsx`

Then add an export line to `src/design-system/components/index.ts`.

## Component conventions (follow exactly)

- Import `cva` and `VariantProps` from `class-variance-authority`
- Import `cn` from `@/utils/cn`
- Define `const <name>Variants = cva(...)` with at least a `variant` and/or `size` key
- Export `interface <Name>Props extends React.HTML*Attributes<HTMLElement>, VariantProps<typeof <name>Variants> {}`
- Use `forwardRef` when the element needs a ref (interactive elements); skip for display-only elements
- Set `<Name>.displayName = '<Name>'` when using forwardRef
- CSS values must use design tokens: `var(--color-*)`, `var(--shadow-*)` — avoid raw hex or arbitrary Tailwind values

## Story conventions (follow exactly)

- Storybook 8 CSF3 format
- `title: 'Design System/<Name>'`
- `parameters: { layout: 'centered' }`
- `tags: ['autodocs']`
- `argTypes` for every variant/size/boolean prop with matching `control` type
- Required stories: `Default`, `AllVariants` (render all variants side-by-side), one story per meaningful state

## Component name

$ARGUMENTS
