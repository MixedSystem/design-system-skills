# Pattern library

Patterns assemble shared components into a user task. Each pattern records its inputs, normal flow, error behavior, state changes, and implementation boundary. The examples below use `src/components.ts` through the registry in `src/previews.ts`.

## Form validation

Use a short form with persistent labels, field-level errors, and one clear submit action. Validate on submit so an untouched field does not immediately show an error. Keep submitted values visible when validation fails.

```preview
form-pattern
```

### Composition and flow

This pattern composes two shared text fields, a primary submit button, a secondary clear button, and a stable feedback region. It requires a display name with at least two trimmed characters and a nonempty email value accepted by the browser's email input validation.

Submitting invalid values displays the relevant field errors, announces that the profile was not saved, and focuses the first invalid input. Submitting valid values shows a local success message. Clear resets the form and its errors, then focuses the first field.

### State coverage

Inspect empty, partially completed, invalid, corrected, successful, and cleared states. Validate keyboard order and Enter submission. Enlarge text and use a narrow viewport to verify that labels, error messages, actions, and focus indicators remain visible.

### Product boundary

This is a local interaction example. It sends no request and stores no values outside the mounted page. It does not implement server validation, account creation, email verification, permissions, or persistent profile storage. In a real product, document those behaviors, prevent duplicate submissions while a request is pending, preserve values after recoverable failures, and announce the actual result.

## Filtering

Use search and a category choice to narrow a small local collection. Keep the active filter values visible and distinguish an empty result from a loading or error state.

```preview
filter-pattern
```

### Composition and behavior

The pattern composes the shared search field, custom select, feedback region, and result list. Search performs a case-insensitive match on component names. Category and search apply together. Results update as the user edits the query or commits a category choice.

The result count uses a stable status region. A zero-result state explains how to broaden the filters. There is no loading state because this starter filters an in-memory collection without making a request.

### State coverage

Inspect the initial list, a matching search, a category filter, combined filters, zero results, and clearing the query. Verify that typing never moves focus into the results and that closing the category list returns focus predictably. Long result names and narrow layouts must wrap without overlapping metadata.

### Product boundary

For remote search, specify request cancellation or ordering, pending and failure states, pagination, and how filter state survives navigation. Do not represent an unimplemented remote state with static copy that implies working data behavior.
