import { createButton, createFeedback, createField, createSelect, node } from './components';

type Cleanup = () => void;
type Preview = (host: HTMLElement) => Cleanup | void;

const caption = (text: string): HTMLParagraphElement => node('p', 'preview-caption', text);
const themeValue = (token: string): string => getComputedStyle(document.documentElement).getPropertyValue(token).trim() || '(not defined)';
const row = (...children: Node[]): HTMLDivElement => {
  const element = node('div', 'preview-row');
  element.append(...children);
  return element;
};
const labelled = (label: string, child: Node): HTMLDivElement => {
  const element = node('div', 'preview-state');
  element.append(caption(label), child);
  return element;
};

const previews: Record<string, Preview> = {
  palette(host) {
    const grid = node('div', 'preview-grid');
    for (const [name, token] of [
      ['Canvas', '--ds-bg'], ['Surface', '--ds-surface'],
      ['Text', '--ds-ink'], ['Secondary text', '--ds-muted'],
      ['Border', '--ds-border'], ['Control boundary', '--ds-control-border'], ['Accent', '--ds-accent'],
      ['Accent surface', '--ds-accent-soft'], ['Error', '--ds-danger'],
      ['Success', '--ds-success'],
    ]) {
      const card = node('div', 'preview-swatch');
      const paint = node('div', 'preview-swatch__paint');
      paint.style.backgroundColor = `var(${token})`;
      const meta = node('div', 'preview-swatch__meta');
      meta.append(node('strong', '', name), node('code', '', token), node('span', '', themeValue(token!)));
      card.append(paint, meta);
      grid.append(card);
    }
    host.append(grid, caption('These are starter values. Update the theme and this specification together for the target app.'));
  },
  typography(host) {
    const stack = node('div', 'preview-stack');
    for (const [role, className, text] of [
      [`Display / ${themeValue('--ds-text-display')}`, 'preview-type--display', 'Design system'],
      [`Heading / ${themeValue('--ds-text-xl')}`, 'preview-type--heading', 'Component library'],
      [`Body / ${themeValue('--ds-text-md')}`, 'preview-type--body', 'Document the behavior next to the implementation.'],
      [`Label / ${themeValue('--ds-text-sm')}`, 'preview-type--label', 'Display name'],
      [`Code / ${themeValue('--ds-text-sm')}`, 'preview-type--code', `--ds-control-md: ${themeValue('--ds-control-md')}`],
    ]) {
      stack.append(labelled(role!, node('p', `preview-type ${className}`, text)));
    }
    host.append(stack);
  },
  spacing(host) {
    const stack = node('div', 'preview-stack');
    Array.from({ length: 8 }, (_, index) => index + 1).forEach(index => {
      const line = node('div', 'preview-space');
      const bar = node('div', 'preview-space__bar');
      bar.style.width = `var(--ds-space-${index})`;
      line.append(node('code', '', `--ds-space-${index}`), bar, node('span', '', themeValue(`--ds-space-${index}`)));
      stack.append(line);
    });
    host.append(stack);
  },
  radii(host) {
    const grid = node('div', 'preview-grid');
    for (const name of ['sm', 'md', 'lg'] as const) {
      const sample = node('div', 'preview-radius', themeValue(`--ds-radius-${name}`));
      sample.style.borderRadius = `var(--ds-radius-${name})`;
      grid.append(labelled(`--ds-radius-${name}`, sample));
    }
    host.append(grid, caption('Borders establish surfaces. Reserve the shadow for temporary layers such as an open listbox.'));
  },
  layout(host) {
    const sample = node('div', 'preview-layout');
    const top = node('div', 'preview-layout__cell preview-layout__cell--top', 'Top navigation');
    const side = node('div', 'preview-layout__cell preview-layout__cell--side', 'Section navigation');
    const content = node('div', 'preview-layout__cell preview-layout__cell--main', 'Document and live component');
    sample.append(top, side, content);
    host.append(sample, caption('The shell follows the documentation hierarchy. The content column must remain readable when navigation collapses.'));
  },
  buttons(host) {
    const lifecycle = new AbortController();
    const signal = lifecycle.signal;
    const status = createFeedback('Use a button to inspect its behavior.');
    const activate = (label: string): void => { status.textContent = `${label} activated.`; };
    host.append(row(...(['sm', 'md', 'lg'] as const).map(size => labelled(
      `${size.toUpperCase()} / ${themeValue(`--ds-control-${size}`)}`,
      createButton({ label: 'Save changes', size, signal, onClick: () => activate(size.toUpperCase()) }),
    ))));
    host.append(row(
      createButton({ label: 'Primary', signal, onClick: () => activate('Primary') }),
      createButton({ label: 'Secondary', variant: 'secondary', signal, onClick: () => activate('Secondary') }),
      createButton({ label: 'Quiet', variant: 'quiet', signal, onClick: () => activate('Quiet') }),
      createButton({ label: 'Delete', variant: 'danger', signal, onClick: () => activate('Delete example') }),
    ));
    const toggle = createButton({ label: 'Pin component', variant: 'secondary', pressed: false, signal, onClick: () => {
      const next = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', String(next));
      status.textContent = next ? 'Component pinned in this preview.' : 'Component unpinned in this preview.';
    } });
    host.append(row(
      labelled('Disabled', createButton({ label: 'Unavailable', disabled: true })),
      labelled('Busy', createButton({ label: 'Saving…', busy: true })),
      labelled('Toggle', toggle),
    ), status, caption('Hover, press, or use Tab to inspect real input states. Busy is a static state specimen; it does not send a request.'));
    return () => lifecycle.abort();
  },
  focus(host) {
    const lifecycle = new AbortController();
    const signal = lifecycle.signal;
    const selected = createButton({ label: 'Pinned', pressed: true, signal, onClick: () => {
      selected.setAttribute('aria-pressed', String(selected.getAttribute('aria-pressed') !== 'true'));
    } });
    const field = createField({ label: 'Component name', value: 'Button' });
    const invalid = createField({ label: 'Contact email', value: 'invalid-address', error: 'Enter a valid email address.' });
    const readOnly = createField({ label: 'Component ID', value: 'button-primary', readOnly: true });
    const choice = createSelect({ label: 'Component size', value: 'md', options: [
      { value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' },
    ] });
    const grid = node('div', 'preview-grid');
    grid.append(field.element, invalid.element, readOnly.element, choice.element);
    const stack = node('div', 'preview-stack');
    stack.append(caption('Use Tab and Shift+Tab to inspect focus. Open the size selector with Enter, move with arrow keys, and close with Escape.'),
      row(selected, createButton({ label: 'Unavailable', disabled: true })), grid);
    host.append(stack);
    return () => { lifecycle.abort(); choice.destroy(); };
  },
  fields(host) {
    const grid = node('div', 'preview-grid');
    const fields = [
      createField({ label: 'Display name', placeholder: 'Enter a name', help: 'Shown on your local profile preview.' }),
      createField({ label: 'Contact email', type: 'email', value: 'invalid-address', error: 'Enter an email address such as name@example.com.' }),
      createField({ label: 'Account ID', value: 'local-preview-01', readOnly: true, help: 'Read-only text can be focused and copied.' }),
      createField({ label: 'Team name', value: 'Unavailable', disabled: true, help: 'Disabled controls do not accept input.' }),
    ];
    grid.append(...fields.map(field => field.element));
    host.append(grid);
  },
  select(host) {
    const status = createFeedback('Selected size: Medium.');
    const options = [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }];
    const size = createSelect({ label: 'Component size', options, value: 'md', help: 'Use arrow keys to move, Enter to choose, and Escape to close.', onChange: value => {
      status.textContent = `Selected size: ${options.find(option => option.value === value)!.label}.`;
    } });
    const disabled = createSelect({ label: 'Unavailable choice', options, value: 'md', disabled: true });
    const long = createSelect({ label: 'Long option label', options: [{ value: 'long', label: 'A longer label for a constrained preview column' }, { value: 'short', label: 'Short label' }] });
    const grid = node('div', 'preview-grid');
    grid.append(size.element, disabled.element, long.element);
    host.append(grid, status, caption('The SVG path and its 18 px slot share the same center. The arrow remains at the logical inline end.'));
    return () => [size, disabled, long].forEach(select => select.destroy());
  },
  feedback(host) {
    host.append(createFeedback('No changes have been submitted.'), createFeedback('Changes saved in this preview.', 'success'), createFeedback('Fix the highlighted field before continuing.', 'error'));
  },
  'form-pattern'(host) {
    const lifecycle = new AbortController();
    const form = node('form', 'ds-form');
    form.noValidate = true;
    const name = createField({ label: 'Display name', name: 'displayName', required: true, autocomplete: 'off', help: 'Required. Use at least two characters.' });
    const email = createField({ label: 'Contact email', name: 'email', type: 'email', required: true, autocomplete: 'off', help: 'Required. Used only in this local preview.' });
    const feedback = createFeedback('This example keeps values in memory and sends no requests.');
    const actions = node('div', 'ds-form__actions');
    const submit = createButton({ label: 'Save profile', type: 'submit' });
    const reset = createButton({ label: 'Clear', variant: 'secondary', signal: lifecycle.signal, onClick: () => {
      form.reset();
      name.setError('');
      email.setError('');
      feedback.className = 'ds-feedback ds-feedback--info';
      feedback.textContent = 'Fields cleared. No data was stored.';
      name.input.focus();
    } });
    actions.append(submit, reset);
    form.append(name.element, email.element, actions, feedback);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const nameError = name.input.value.trim().length < 2 ? 'Enter a display name with at least two characters.' : '';
      const emailError = email.input.value.trim() === '' || email.input.validity.typeMismatch ? 'Enter a valid email address.' : '';
      name.setError(nameError);
      email.setError(emailError);
      if (nameError || emailError) {
        feedback.className = 'ds-feedback ds-feedback--error';
        feedback.textContent = 'Profile was not saved. Review the highlighted fields.';
        (nameError ? name.input : email.input).focus();
      } else {
        feedback.className = 'ds-feedback ds-feedback--success';
        feedback.textContent = `Profile preview saved for ${name.input.value.trim()}. Reloading clears this example.`;
      }
    }, { signal: lifecycle.signal });
    host.append(form);
    return () => lifecycle.abort();
  },
  'filter-pattern'(host) {
    const lifecycle = new AbortController();
    const search = createField({ label: 'Find a component', type: 'search', placeholder: 'Search by name' });
    const items = [
      { name: 'Button', category: 'Actions' }, { name: 'Text field', category: 'Inputs' },
      { name: 'Select', category: 'Inputs' }, { name: 'Feedback', category: 'Feedback' },
    ];
    const results = node('ul', 'ds-results');
    const summary = createFeedback('');
    const empty = node('p', 'ds-empty', 'No components match these filters. Clear the search or choose another category.');
    empty.hidden = true;
    const category = createSelect({ label: 'Category', options: [
      { value: 'all', label: 'All categories' }, ...['Actions', 'Inputs', 'Feedback'].map(value => ({ value, label: value })),
    ], onChange: () => render() });
    function render(): void {
      const query = search.input.value.trim().toLocaleLowerCase();
      const filtered = items.filter(item => (!query || item.name.toLocaleLowerCase().includes(query)) && (category.getValue() === 'all' || category.getValue() === item.category));
      results.replaceChildren(...filtered.map(item => {
        const result = node('li', 'ds-result');
        result.append(node('strong', '', item.name), node('span', '', item.category));
        return result;
      }));
      summary.textContent = `${filtered.length} ${filtered.length === 1 ? 'component' : 'components'} found.`;
      empty.hidden = filtered.length !== 0;
    }
    search.input.addEventListener('input', render, { signal: lifecycle.signal });
    const controls = node('div', 'preview-grid');
    controls.append(search.element, category.element);
    host.append(controls, summary, results, empty);
    render();
    return () => { lifecycle.abort(); category.destroy(); };
  },
};

export const availablePreviewIds: readonly string[] = Object.freeze(Object.keys(previews));

export function mountPreview(id: string, host: HTMLElement): Cleanup | undefined {
  if (!Object.hasOwn(previews, id)) return undefined;
  const preview = previews[id];
  if (!preview) return undefined;
  host.classList.add('preview-stack');
  const cleanup = preview(host);
  return () => { cleanup?.(); host.replaceChildren(); };
}
