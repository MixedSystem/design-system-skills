# Style guide

These values describe the documentation starter. Select the target app's own visual direction and reuse its existing design tokens before adapting this example. A documentation shell must describe the app's system without imposing a new one on it.

## Color

Use semantic roles so a color change updates components consistently. The starter uses a pale canvas, white document surfaces, dark text, and an indigo interactive accent. Status colors supplement clear text; color alone does not communicate an error or success.

```preview
palette
```

### Token contract

| Token | Value | Intended role |
| --- | --- | --- |
| `--ds-bg` | `#f8fafc` | Page canvas |
| `--ds-surface` | `#ffffff` | Document and control surfaces |
| `--ds-ink` | `#17212f` | Primary text |
| `--ds-muted` | `#526173` | Secondary text and supporting descriptions |
| `--ds-border` | `#dbe2ea` | Subtle surface separators; not the sole interactive boundary |
| `--ds-control-border` | `#8793a4` | Visible input and select boundaries |
| `--ds-accent` | `#3549db` | Primary actions and selected navigation |
| `--ds-focus` | `#3549db` | Independent keyboard-focus indicator color |
| `--ds-accent-soft` | `#eef0ff` | Selected and supporting accent surfaces |
| `--ds-danger` | `#a52836` | Error text and destructive action |
| `--ds-success` | `#16714b` | Success feedback |

Use `--ds-ink` on `--ds-surface` for ordinary text and white text on the solid accent for primary actions. Do not assume every token pair is interchangeable. Check actual foreground and background combinations after adapting the theme, including text on the blurred top bar and disabled states. This document does not claim an accessibility certification.

### Source and consumers

`src/theme.css` defines these custom properties. `src/styles.css` applies them to the shell and the shared components. The palette preview in `src/previews.ts` reads its displayed values from the current theme. Update the Markdown token contract whenever their definitions change.

## Typography

Use the host system's sans-serif font stack through `--ds-font` and its monospace stack through `--ds-mono`. A product font may replace these stacks when it is already licensed and available in the target app. Do not fetch a new font solely to reproduce this starter.

```preview
typography
```

| Role | Size | Intended use |
| --- | --- | --- |
| Display | 40 px | Page title on a roomy viewport |
| Heading | 28 px | Major content heading |
| Body | 16 px | Documentation and control text |
| Label | 14 px | Field labels and supporting navigation |
| Code | 14 px | Token names and short code samples |

The body line-height is 1.6 and the tight heading line-height is 1.2. Source: `src/theme.css` and the typography rules in `src/styles.css`.

Preserve semantic heading order independently of visual size. Use a readable line height and allow labels and descriptions to wrap. Controls use minimum heights so text enlargement does not force clipping. Code and tables may scroll within their own regions when their structure requires it; the entire page must not overflow horizontally.

## Spacing

Use the scale below for repeated layout relationships. Structural values such as zero, full available width, and automatic margins remain ordinary CSS values. Create a new token only when a repeated design decision needs a shared name.

```preview
spacing
```

| Token | Value | Starter use |
| --- | --- | --- |
| `--ds-space-1` | 4 px | Tight label details |
| `--ds-space-2` | 8 px | Icon and label separation |
| `--ds-space-3` | 12 px | Compact internal padding |
| `--ds-space-4` | 16 px | Standard control and group spacing |
| `--ds-space-5` | 24 px | Related content blocks |
| `--ds-space-6` | 32 px | Section separation |
| `--ds-space-7` | 48 px | Large content grouping |
| `--ds-space-8` | 64 px | Spacious page grouping |

Use the same gap for the same relationship. Do not choose a larger gap simply because a viewport is wider. Dense applications may adopt a different scale, but controls must retain usable pointer targets and readable separation.

## Layout

The top bar contains the three documentation categories. The sidebar contains pages from the active category. The main column contains one document page, its tables, and its live previews.

```preview
layout
```

### Responsive behavior

Keep the document column readable and allow the navigation to adapt before it compresses the content. On narrow screens, expose sidebar navigation through an explicit control. The active category and page remain discoverable. Tables and code blocks contain their own horizontal overflow. Preview grids collapse to a single column instead of shrinking controls below their usable size.

The top bar uses a translucent surface with backdrop blur. Provide an opaque or sufficiently solid fallback so text and focus indicators remain readable when backdrop filtering is unavailable. The blur is a shell treatment; it is not a requirement for the target application's screens.

The header's 76 px desktop and 132 px narrow-screen heights are minimums. Navigation labels may wrap and increase the actual height when space is constrained or text is enlarged. A resize observer measures the rendered header and updates `--docs-header-offset`; sticky navigation, the mobile menu, and anchor positioning use that measured offset rather than assuming a fixed header height. The header displays the actual application name from `docs.config.ts` as text, without a decorative icon or version badge. The name may truncate visually while retaining its full accessible name.

### Heights and alignment

| Token | Minimum height | Usage |
| --- | --- | --- |
| `--ds-control-sm` | 36 px | Compact desktop actions with adequate surrounding space |
| `--ds-control-md` | 44 px | Default controls and form actions |
| `--ds-control-lg` | 52 px | Prominent actions where the layout calls for them |

The 36 px size is a contextual desktop option, not a universal target-size guarantee. Use the larger size or enlarge the actual hit area when touch use, motor access needs, adjacent target spacing, or the target platform requires it. Content may increase control height. Align label and icon boxes using layout rules rather than text baselines.

The shell width is capped by `--docs-shell-width` at 1600 px. `--docs-reading-width` limits introductory prose to 66 ch. Form compositions use `--ds-form-width` at 460 px, and select popups use `--ds-select-max-height` at 260 px with viewport-aware constraints. `--docs-backdrop` defines the mobile menu overlay as `rgb(23 33 47 / 24%)`. These values are owned by `src/theme.css`.

## Shape and surface

Use the starter's three radius roles consistently. Adapt them together if the target app calls for a flatter, more rounded, or otherwise distinct visual language.

```preview
radii
```

| Token | Value | Intended role |
| --- | --- | --- |
| `--ds-radius-sm` | 6 px | Controls and small details |
| `--ds-radius-md` | 10 px | Compact surfaces |
| `--ds-radius-lg` | 16 px | Large preview and document surfaces |

Surface borders are subtle separators. Interactive controls also rely on their own boundary, text, and states. Reserve floating shadows for temporary layers such as an open listbox; ordinary documentation blocks do not need decorative elevation.

## Focus

Keyboard focus follows this documentation app's indigo accent, compact navigation,
and 6 px control corners. These choices belong to this app; derive different
values and treatments when adapting the design system to another product.
The outer gap below describes this starter, not a required minimum. Another app
may emphasize its field border, attach an indicator directly to the field with
zero gap, or use an inset or other suitable treatment. Document and verify the
chosen appearance against that app's own design contract.

```preview
focus
```

### Focus contract

| Role | Treatment |
| --- | --- |
| Buttons, fields, select triggers, and ordinary links | A 2 px solid `--ds-focus` outline with a 2 px outer gap. The gap intentionally tracks `--ds-focus-width` through `--ds-focus-offset`. Control outlines follow the control's own corner shape. |
| Top navigation, sidebar items, contents links, and listbox options | The same outline with `--ds-focus-inset`, an offset of -2 px. Keeping the ring inside the row avoids clipping and overlap in compact lists. |
| Scrollable documentation tables | An inset ring contained within the table region's existing corners. |
| Programmatic page and subsection destinations | Underline the destination heading using `--ds-focus-width` and an 8 px text offset. The page container has no perimeter ring; its heading provides the visible destination cue. |
| Forced-color mode | Use the system `Highlight` color through `--ds-focus-forced`. Retain real outlines and allow system color adjustment. |

`src/theme.css` owns the focus values; `src/styles.css` applies the role-specific
treatments. Input borders also use the focus color while focused, except invalid
fields retain their error border and message. Their outer focus ring remains
visible. A selected button or navigation item retains its selected appearance
under the ring. The selected listbox value uses the accent surface; a different
keyboard-active option uses the canvas surface and an inset ring, without
committing that value. Disabled controls stay outside normal Tab order; read-only
fields remain focusable. Use `:focus-visible` so the browser can preserve keyboard
and text-entry focus indications. Do not introduce a global Tab listener to
simulate focus or animate the indicator.

### Verification

Use real Tab and Shift+Tab through navigation and previews. Check Enter/Space,
listbox arrow keys, Escape and focus return, selected-plus-focused and
invalid-plus-focused states, narrow layouts, and scrolled containers. The ring
must remain visible, preserve text and component geometry, and contrast at least
3:1 with adjacent surfaces in the supported default palette. Check forced-color
mode in a supporting browser separately. The focus indicator appears immediately
and stays visible until focus leaves, including when motion is reduced.

Run source and rendered lint. `states.focused` confirms only DOM focus; use
additional runtime assertions for `:focus-visible`, computed outline color,
width and offset, preserved error/selection cues, and clipping. Inspect the
rendered shape and contrast in context rather than treating a focus-state pass
as visual verification.

## Motion

Navigating to a different documentation page fades its body from 0.8 to 1 opacity over 160 ms with ease-out easing. The values are defined by `--docs-page-enter-opacity`, `--docs-page-enter-duration`, and `--docs-page-enter-easing` in `src/theme.css`. The header and navigation remain stable. Content and focus update immediately; the effect does not delay navigation or move the layout.

Initial loading and links to headings within the current page do not start the effect. Another page change replaces the previous body and its animation immediately. No animation fill state remains after completion. The effect runs only when `prefers-reduced-motion` is `no-preference`; reduced-motion users receive the new content immediately. Dropdown and other control state changes remain immediate.

This transition is an explicit choice for the example docs app, not a required style for generated applications. Adapt motion to the target app's requirements and preserve a usable reduced-motion alternative.
