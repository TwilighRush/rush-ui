# AGENTS.md

## Project
This repository is a React component library for admin and dashboard web apps. All in Chinese

## Stack
- React
- TypeScript
- pnpm workspace
- Vite for package build
- Storybook for docs
- Vitest for tests
- Changesets for releases
- Less for css

## Architecture rules
- Public npm package lives in packages/react
- tokens and utils are internal workspace packages unless explicitly exported
- Keep public API minimal and stable
- Do not add dependencies without justification

## Component rules
- Every exported component must have:
  - implementation
  - stories
  - tests
  - typed props
  - accessibility notes
- Prefer controlled/uncontrolled dual support where appropriate
- Forward refs on all interactive primitives
- Support className as an escape hatch
- Prefer CSS variables for theming
- Avoid leaking internal DOM structure into public API

## Accessibility rules
- Keyboard interactions are required for interactive components
- Use semantic HTML first, ARIA second
- Focus management is part of the component, not the consumer
- Follow WAI-ARIA APG patterns for Dialog, Tabs, Menu, Tooltip, etc.

## Testing rules
- Test behavior, not implementation details
- Cover disabled, loading, error, and keyboard behavior
- Add story cases for edge states

## Definition of done
A task is done only if:
1. code compiles
2. lint passes
3. tests pass
4. stories render
5. public exports are updated
6. docs/examples are updated if API changed
7. changeset is added when public API changes