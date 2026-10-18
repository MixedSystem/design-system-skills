# Component library

The live examples import the shared factories in `src/components.ts`. Patterns use those same factories. Replace them with the target project's real public components when adapting this starter, keeping the contracts and previews synchronized.

## Buttons

Use a button for an action. Use a link for navigation to another document or address. A label names the action the user is about to take.

```preview
buttons
```

### Sizes and hierarchy

| Size | Minimum height | Inline padding | Use |
| --- | --- | --- | --- |
| `sm` | 36 px | 12 px | Compact desktop tool actions with adequate spacing |
| `md` | 44 px | 16 px | Default action |
| `lg` | 52 px | 24 px | Prominent action in a suitable layout |

Buttons use a 6 px corner radius and an 8 px internal gap. Source: `src/theme.css`, `src/styles.css`, and `createButton` in `src/components.ts`.

The primary variant identifies the main action in a group. Secondary and quiet variants reduce emphasis. The danger variant is reserved for a destructive action; its appearance does not replace a clear label or any confirmation required by the action's consequences.

### Public contract

`createButton(options)` returns an `HTMLButtonElement`. Options include `label`, `size`, `variant`, `type`, `disabled`, `busy`, `pressed`, `onClick`, and an optional `AbortSignal`. The default type is `button`; forms explicitly request `submit`. A busy button is disabled and exposes `aria-busy="true"`. Toggle buttons expose `aria-pressed`.

The component uses a minimum height and allows a longer label to determine its final size. Text remains visible at enlarged text sizes. The small size requires an explicit density and input-context decision.

### States and checks

Inspect default, hover, pressed, keyboard focus, disabled, busy, and toggle states. Disabled and busy examples do not activate. Use Tab to inspect focus, then Enter or Space to activate an enabled button. A toggle's label stays stable while its pressed state changes.

Keyboard focus uses the outer ring defined in the style guide's Focus contract.
The ring follows the button shape and remains separate from selected or pressed
styling. Changing focus does not activate the action.

The busy specimen is intentionally static and sends no request. The danger specimen reports activation only; it does not delete anything.

## Text fields

Use persistent labels. A placeholder is an example or hint, not the field's only name. Keep help and error text next to the field that they describe.

```preview
fields
```

### Public contract

`createField(options)` returns `element`, `input`, and `setError(message)`. Options cover the visible label, input type, value, placeholder, help, initial error, required state, read-only state, disabled state, name, and autocomplete hint. Supported starter types are text, email, password, and search.

Calling `setError` updates visible text, `aria-invalid`, and `aria-describedby`. Clearing an error preserves the association with any help text. The field exposes its native input so the consuming pattern can bind events without inventing a second input model.

### States and dimensions

The default minimum control height is 44 px, with 12 px inline padding, 8 px block padding, and a 6 px corner radius. Source: `src/styles.css` and `createField` in `src/components.ts`. Inspect empty, populated, hover, focus, invalid, read-only, and disabled states. Read-only values remain focusable and copyable. Disabled controls do not accept input and are omitted from ordinary form submission.

Validation belongs to the form's task and data rules. The field renders a supplied error; it does not decide whether a particular business value is valid. The Form validation pattern shows when to validate and where focus moves.

Focused fields use the shared outer ring and focus border. An invalid field
keeps its error border and message beneath that ring. Read-only fields use the
same focus treatment; disabled fields do not enter sequential keyboard focus.

## Select

Use this custom listbox selector for a small, known set of mutually exclusive choices. It has a real button trigger and a separate listbox, with an SVG arrow at the logical inline end. It does not rely on a browser-rendered select arrow.

```preview
select
```

### Public contract

`createSelect(options)` returns `element`, `trigger`, `getValue()`, and `destroy()`. Supply a label, a nonempty list of unique `{ value, label }` options, an optional initial value, help text, disabled state, and an `onChange` handler. Without a matching initial value, the first option is selected. Call `destroy()` when removing a mounted preview to remove its listeners.

The caller owns persistence and form serialization. This starter is not an editable combobox and does not provide asynchronous search, grouping, multi-selection, virtualization, or native mobile picker behavior. Choose or implement an appropriate component when those behaviors are needed.

### Keyboard and focus

Click or use Enter, Space, Arrow Down, or Arrow Up on the trigger to open the list. Arrow keys move through options. Home and End move to the first and last option. Typing a short prefix moves to a matching label. Enter or Space commits the focused option. Escape closes without changing the selection and returns focus to the trigger. Tab closes the list and continues through the document. Clicking outside closes it.

The trigger uses an outer focus ring. Options use a 2 px inset ring with a -2 px
offset, keeping the indicator inside the popup's scrollable rows. The committed
selection retains its accent background; moving focus to another option uses
the neutral canvas background and ring without changing the selection.

The list uses `role="listbox"`; each item exposes `role="option"` and `aria-selected`. The trigger exposes `aria-haspopup`, `aria-controls`, and `aria-expanded`. These semantics and keyboard behaviors still require verification in the target browser and assistive-technology environment.

The popup opens above the trigger when there is insufficient room below and more room above. Its maximum height is limited to the available viewport space. Resizing or scrolling updates its placement while open. Keyboard navigation scrolls the option list to reveal the active item without scrolling the page.

### Geometry and states

The trigger has a 44 px minimum height, 12 px inline padding, 8 px block padding, and a 6 px corner radius. The arrow's box is 18 by 18 px. Its path is centered within an equally sized viewBox. Center the arrow slot in both axes and place it after the label using logical layout, so it follows the reading direction. Do not substitute a text glyph whose baseline makes its visible shape hang below the center. Source: `src/styles.css` and `createSelect` in `src/components.ts`.

The popup has 4 px padding on all sides, a 1 px border, and a 4 px trigger gap. Options have a 44 px minimum height, 12 px inline padding, 8 px block padding, and zero margins. Three single-line options produce a 142 px popup when viewport space permits. Long labels and enlarged text may increase row height; the 260 px maximum yields to available viewport space. The selected background spans the option row with equal left and right insets.

Markdown prose is scoped to `.markdown-content`; live previews are siblings outside that scope. Document list indentation and paragraph margins must not restyle shared controls. Run rendered lint on the opened popup and every option, checking padding, margins, height, and the trigger arrow against these values.

Inspect default, focused, open, selected, disabled, long-label, narrow-container, and right-to-left states. The selected label truncates visually when needed without overlapping the arrow, while its full text remains the trigger's accessible name and is visible in the open option list. Option labels may wrap. Check both the arrow box and the visible SVG path; centering one does not guarantee the other is centered.

## Feedback

Use concise status text to explain an outcome or the next required action. Include enough meaning in the text to remain understandable without the tone color.

```preview
feedback
```

### Public contract and states

`createFeedback(message, tone)` returns a feedback element. Supported tones are `info`, `success`, and `error`. Informational and success messages use `role="status"`; error specimens use `role="alert"`. Use a stable status region when a pattern updates its message repeatedly. Avoid creating multiple competing announcements for the same event.

Feedback is text content, not HTML. Messages composed from user input are inserted as text. Use field-level errors for specific input problems and a form-level message only when it adds useful context.

### Usage boundaries

These examples are inline feedback. They do not implement timed notifications, dismissal, progress tracking, or dialog behavior. A time-critical or blocking interaction needs a separately specified pattern with its own focus and recovery behavior.
