# component-conventions.md

## Common props
- size: sm | md | lg
- variant: solid | outline | ghost | subtle
- disabled: boolean
- loading: boolean
- className?: string

## Controlled/uncontrolled
- Use `value` + `onValueChange` for controlled mode
- Use `defaultValue` for uncontrolled mode
- Never mix internal hidden state with external source of truth without explicit design

## Ref
- Interactive components must forward refs
- Ref should point to the primary focusable DOM element

## Events
- Prefer `onOpenChange`, `onValueChange`, `onCheckedChange`
- Avoid mixing DOM-native names and custom semantic names inconsistently

## Slots
- Prefer `startIcon` / `endIcon` for simple components
- Prefer compound components for complex widgets:
  - Dialog.Root
  - Dialog.Trigger
  - Dialog.Content
  - Dialog.Title
  - Dialog.Description
  - Dialog.Close

## Styling
- Prefer CSS variables backed by tokens
- Use `data-*` attributes for state styling:
  - data-state="open|closed"
  - data-disabled
  - data-loading

## Accessibility
- Semantic HTML first
- ARIA only when needed
- Document keyboard behavior in stories/docs/tests