---
name: Rush UI
description: 面向后台与管理端产品的简洁、自信 React 组件系统。
colors:
  surface: "#fffaf1"
  canvas: "#f6efe3"
  ink: "#1d1a16"
  ink-hover: "#342f2a"
  accent: "#c56a1b"
  accent-muted: "#f2d3b3"
  accent-muted-hover: "#ebc59b"
  accent-text: "#5f3309"
  border: "#d6c6b2"
  border-strong: "#8f7c67"
  border-hover: "#6f5f50"
  error: "#b42318"
typography:
  display:
    fontFamily: "Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0"
  headline:
    fontFamily: "Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0"
  title:
    fontFamily: "Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0"
  body:
    fontFamily: "Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0"
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2.5rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2.5rem"
  button-subtle:
    backgroundColor: "{colors.accent-muted}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2.5rem"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
    width: "2.5rem"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 0.875rem"
    height: "2.5rem"
  surface-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Rush UI

## 1. Overview

**Creative North Star: "The Confident Console"**

Rush UI should feel like a carefully built control surface for serious admin work: direct, composed, and quietly distinctive. It is not trying to surprise users with invented affordances; it earns trust through precise state handling, legible density, and a restrained visual vocabulary that still has taste.

The system's personality is simple, innovative, confident, and aesthetically deliberate. Its product UI should be familiar enough for dashboard builders to adopt quickly, but it must not collapse into AntD clone territory. The signature is in the spacing, API restraint, state clarity, warm-but-controlled palette, and a component vocabulary that treats accessibility as part of the design.

**Key Characteristics:**

- Restrained product UI with one warm accent used as a signal, not decoration.
- Pill-shaped action buttons paired with sharply legible, low-radius input fields.
- Warm neutral surfaces, dark ink text, and visible borders for durable admin interfaces.
- State-first motion: 160ms transitions for hover, focus, loading, and disabled feedback.
- Documentation examples should show real admin tasks, not isolated cosmetic samples.

## 2. Colors

Rush UI uses a warm neutral console palette: low-chroma canvas and surface colors support long admin sessions, while a copper accent marks emphasis without dominating the interface.

### Primary

- **Copper Command**: the primary accent for subtle actions, highlights, focus halo tint, and selected-state support. It should stay rare; if every component is copper, none of them are important.

### Neutral

- **Warm Surface**: the main component surface. Use it for cards, input backgrounds, and elevated documentation examples.
- **Quiet Canvas**: the app/page background layer. Use it to separate full-page shells from component surfaces.
- **Deep Ink**: the primary text and solid action color. It carries confidence without resorting to saturated brand color.
- **Ink Hover**: the hover state for solid actions.
- **Warm Border**: the default stroke for inputs, cards, and outline buttons.
- **Strong Border**: the stronger stroke for outline controls and high-contrast separators.
- **Border Hover**: the hover/focus-adjacent border for interactive controls.
- **Error Red**: reserved for invalid fields and destructive/error feedback.

### Named Rules

**The Accent Rarity Rule.** Copper is a product signal, not decoration. Keep it under 10% of any screen unless the surface is explicitly an onboarding or brand moment.

**The Ink Authority Rule.** Primary actions use Deep Ink by default. This prevents the palette from becoming a generic orange admin theme and keeps the interface self-assured.

## 3. Typography

**Display Font:** Avenir Next with Segoe UI and system sans-serif fallbacks  
**Body Font:** Avenir Next with Segoe UI and system sans-serif fallbacks  
**Label/Mono Font:** No separate mono system is established yet

**Character:** One confident sans-serif stack carries the whole product. The type system should feel clean and operational, with enough weight for headings and enough restraint for dense component labels.

### Hierarchy

- **Display** (700, 2rem, 1.2): documentation hero and page-level statements only. Do not use fluid display type for component surfaces.
- **Headline** (700, 1.5rem, 1.25): section headings in docs and component documentation.
- **Title** (700, 1.125rem, 1.35): card and component example headings.
- **Body** (400, 0.9375rem, 1.5): explanatory prose, component descriptions, and general interface copy. Keep long prose to roughly 65-75ch.
- **Label** (600, 0.875rem, 1): buttons, compact labels, and dense control text. Letter spacing remains 0.

### Named Rules

**The Product Sans Rule.** Do not introduce display fonts into labels, buttons, inputs, tables, or control surfaces. The component library should feel like a tool, not a campaign.

## 4. Elevation

Rush UI currently uses a hybrid depth model: most components rely on borders and tonal layering, while solid action buttons and documentation containers use restrained ambient shadows. Elevation should never become a decorative glow system.

### Shadow Vocabulary

- **Card Ambient** (`box-shadow: 0 10px 30px rgba(29, 26, 22, 0.08)`): documentation containers and broad surfaces only. Do not pair this with dense nested cards.
- **Action Lift** (`box-shadow: 0 10px 24px rgba(29, 26, 22, 0.14)`): solid action buttons and icon buttons where clickability needs emphasis.
- **Focus Ring** (`box-shadow: 0 0 0 4px rgba(197, 106, 27, 0.28)`): keyboard focus and focus-within states. This is interaction feedback, not decoration.

### Named Rules

**The Border-First Rule.** Inputs, outline buttons, cards, and dense admin surfaces should read through clear borders before shadows. Shadow is earned by action or high-level documentation framing.

## 5. Components

### Buttons

- **Shape:** full pill actions (`999px`) with fixed heights (`2rem`, `2.5rem`, `3rem`) and compact horizontal padding.
- **Primary:** Deep Ink background with Warm Surface text; used for the main action in a focused area.
- **Hover / Focus:** hover shifts to Ink Hover and moves up by 1px; keyboard focus adds the copper focus ring.
- **Secondary / Ghost / Tertiary:** outline uses Strong Border with transparent fill; ghost is text-forward; subtle uses Copper Muted with Accent Text for quiet emphasis.
- **Loading:** loading replaces the leading icon with a spinner and disables the button. The label may switch to `loadingText`.

### Cards / Containers

- **Corner Style:** documentation containers currently use a large rounded corner (`20px`); component primitives should stay tighter unless the surface is intentionally framed.
- **Background:** Warm Surface over Quiet Canvas.
- **Shadow Strategy:** Card Ambient is acceptable for top-level docs containers only.
- **Border:** Warm Border is the default structural line.
- **Internal Padding:** use `24px` for documentation containers and `16px` for denser product panels.

### Inputs / Fields

- **Style:** Warm Surface fill, Warm Border stroke, small radius (`6px`), and height-matched density (`2rem`, `2.5rem`, `3rem`).
- **Focus:** border shifts to Deep Ink and adds a copper focus ring around the control.
- **Error / Disabled:** invalid fields switch border and focus ring to Error Red; disabled fields reduce opacity and keep native disabled semantics.
- **Slots:** prefix/suffix icons are decorative by default; start/end addons support units, currency, and fixed suffixes without replacing labels.

### Navigation

No canonical navigation component exists yet. When one is added, use familiar product patterns: top bar, side nav, tabs, breadcrumbs, and command palettes. Active states should use Deep Ink, border/tonal contrast, or rare Copper Command; avoid full-saturation inactive items.

### Icon Buttons

- **Shape:** square control with pill radius (`999px`) and equal width/height.
- **Default:** ghost-like transparent surface with Deep Ink icon.
- **Variants:** solid, outline, ghost, and subtle mirror Button variants.
- **Accessibility:** every icon-only action must require `aria-label` or `aria-labelledby`.

## 6. Do's and Don'ts

### Do:

- **Do** keep public component APIs small, typed, and aligned with established `size`, `variant`, `disabled`, `loading`, and `className` conventions.
- **Do** use Deep Ink for primary actions and reserve Copper Command for emphasis, focus support, and selected-state accents.
- **Do** document disabled, loading, error, keyboard, and edge states in stories and tests for every exported interactive component.
- **Do** keep component surfaces familiar to admin users while making the spacing, state model, and visual polish distinctly Rush UI.
- **Do** use CSS variables backed by tokens for colors, radius, spacing, focus rings, and shadows.

### Don't:

- **Don't** create an AntD clone feel. Familiar management UI patterns are allowed; copied visual language, component rhythm, or API shape is not.
- **Don't** use template SaaS visuals: hero metrics, repeated identical card grids, decorative glass panels, wide soft shadows, or generic marketing copy.
- **Don't** use glassmorphism as the default component language. The current docs blur treatment is not a license to put blur into primitives.
- **Don't** use colored side-stripe borders, gradient text, oversized rounded cards, or nested cards as a default way to add interest.
- **Don't** let muted placeholder or helper text fall below readable contrast; form text must remain usable in long admin sessions.
