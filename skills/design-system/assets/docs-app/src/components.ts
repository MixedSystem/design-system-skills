/** Starter components. Replace these imports with the target project's library. */
let sequence = 0;
const uniqueId = (prefix: string): string => `${prefix}-${++sequence}`;

export function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export interface ButtonOptions {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
  busy?: boolean;
  pressed?: boolean;
  onClick?: (event: MouseEvent) => void;
  signal?: AbortSignal;
}

export function createButton(options: ButtonOptions): HTMLButtonElement {
  const button = node('button', `ds-button ds-button--${options.variant ?? 'primary'} ds-button--${options.size ?? 'md'}`, options.label);
  button.type = options.type ?? 'button';
  button.disabled = Boolean(options.disabled || options.busy);
  if (options.busy) button.setAttribute('aria-busy', 'true');
  if (options.pressed !== undefined) button.setAttribute('aria-pressed', String(options.pressed));
  if (options.onClick) button.addEventListener('click', options.onClick, { signal: options.signal });
  return button;
}

export interface FieldOptions {
  label: string;
  value?: string;
  placeholder?: string;
  help?: string;
  error?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'search';
  name?: string;
  autocomplete?: string;
}

export function createField(options: FieldOptions): {
  element: HTMLDivElement;
  input: HTMLInputElement;
  setError: (message: string) => void;
} {
  const element = node('div', 'ds-field');
  const id = uniqueId('field');
  const label = node('label', 'ds-field__label', options.label);
  label.htmlFor = id;
  const input = node('input', 'ds-field__input');
  input.id = id;
  input.type = options.type ?? 'text';
  input.value = options.value ?? '';
  input.placeholder = options.placeholder ?? '';
  input.readOnly = options.readOnly ?? false;
  input.disabled = options.disabled ?? false;
  input.required = options.required ?? false;
  if (options.name) input.name = options.name;
  if (options.autocomplete) input.setAttribute('autocomplete', options.autocomplete);
  element.append(label, input);
  let helpId = '';
  if (options.help) {
    const help = node('p', 'ds-field__help', options.help);
    help.id = `${id}-help`;
    helpId = help.id;
    element.append(help);
  }
  const error = node('p', 'ds-field__error');
  error.id = `${id}-error`;
  error.hidden = true;
  element.append(error);
  const setError = (message: string): void => {
    error.textContent = message;
    error.hidden = !message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    const describedBy = [helpId, message ? error.id : ''].filter(Boolean).join(' ');
    if (describedBy) input.setAttribute('aria-describedby', describedBy);
    else input.removeAttribute('aria-describedby');
  };
  setError(options.error ?? '');
  return { element, input, setError };
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectOptions {
  label: string;
  options: readonly SelectOption[];
  value?: string;
  help?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function createSelect(options: SelectOptions): {
  element: HTMLDivElement;
  trigger: HTMLButtonElement;
  getValue: () => string;
  destroy: () => void;
} {
  if (!options.options.length) throw new Error('Select requires at least one option.');
  if (new Set(options.options.map(option => option.value)).size !== options.options.length) throw new Error('Select option values must be unique.');
  const lifecycle = new AbortController();
  const eventOptions = { signal: lifecycle.signal };
  const element = node('div', 'ds-select');
  const id = uniqueId('select');
  const label = node('label', 'ds-select__label', options.label);
  label.id = `${id}-label`;
  label.htmlFor = id;
  const trigger = node('button', 'ds-select__trigger');
  trigger.id = id;
  trigger.type = 'button';
  trigger.disabled = options.disabled ?? false;
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-controls', `${id}-list`);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-labelledby', `${label.id} ${id}-value`);
  const valueLabel = node('span', 'ds-select__value');
  valueLabel.id = `${id}-value`;
  const arrow = node('span', 'ds-select__arrow');
  arrow.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 18 18');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('fill', 'none');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M5 7l4 4 4-4');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.6');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.append(path);
  arrow.append(svg);
  trigger.append(valueLabel, arrow);
  const list = node('ul', 'ds-select__list');
  list.id = `${id}-list`;
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-labelledby', label.id);
  list.hidden = true;
  let selected = Math.max(0, options.options.findIndex(option => option.value === options.value));
  let active = selected;
  const items = options.options.map((option, index) => {
    const item = node('li', 'ds-select__option', option.label);
    item.id = `${id}-option-${index}`;
    item.setAttribute('role', 'option');
    item.tabIndex = -1;
    item.addEventListener('click', () => choose(index), eventOptions);
    list.append(item);
    return item;
  });
  const reflectValue = (): void => {
    valueLabel.textContent = options.options[selected]!.label;
    items.forEach((item, index) => item.setAttribute('aria-selected', String(index === selected)));
  };
  const close = (returnFocus = false): void => {
    list.hidden = true;
    element.removeAttribute('data-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus && trigger.isConnected) trigger.focus({ preventScroll: true });
  };
  const positionList = (): void => {
    if (list.hidden) return;
    list.style.maxHeight = '';
    list.style.marginTop = '';
    list.style.marginBottom = '';
    const style = getComputedStyle(list);
    const gap = Number.parseFloat(style.marginTop) || 0;
    const maximum = Number.parseFloat(style.maxHeight) || window.innerHeight;
    const border = (Number.parseFloat(style.borderTopWidth) || 0) + (Number.parseFloat(style.borderBottomWidth) || 0);
    const desired = Math.min(list.scrollHeight + border, maximum);
    const bounds = trigger.getBoundingClientRect();
    const inset = Math.max(gap, 4);
    const below = Math.max(0, window.innerHeight - bounds.bottom - gap - inset);
    const above = Math.max(0, bounds.top - gap - inset);
    const openAbove = below < desired && above > below;
    list.style.top = openAbove ? 'auto' : '100%';
    list.style.bottom = openAbove ? '100%' : 'auto';
    list.style.marginTop = openAbove ? '0px' : `${gap}px`;
    list.style.marginBottom = openAbove ? `${gap}px` : '0px';
    list.style.maxHeight = `${Math.min(maximum, openAbove ? above : below)}px`;
  };
  const focusOption = (index: number): void => {
    active = (index + items.length) % items.length;
    const item = items[active]!;
    item.focus({ preventScroll: true });
    const itemBounds = item.getBoundingClientRect();
    const listBounds = list.getBoundingClientRect();
    const visibleTop = listBounds.top + list.clientTop;
    const visibleBottom = visibleTop + list.clientHeight;
    if (itemBounds.top < visibleTop) list.scrollTop -= visibleTop - itemBounds.top;
    else if (itemBounds.bottom > visibleBottom) list.scrollTop += itemBounds.bottom - visibleBottom;
  };
  const open = (index = selected): void => {
    if (trigger.disabled) return;
    list.hidden = false;
    element.setAttribute('data-open', 'true');
    trigger.setAttribute('aria-expanded', 'true');
    positionList();
    focusOption(index);
  };
  function choose(index: number): void {
    const changed = selected !== index;
    selected = index;
    reflectValue();
    close(true);
    if (changed) options.onChange?.(options.options[selected]!.value);
  }
  trigger.addEventListener('click', () => list.hidden ? open() : close(), eventOptions);
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open(selected);
    }
  }, eventOptions);
  let search = '';
  let lastTypedAt = 0;
  list.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(active + (event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusOption(event.key === 'Home' ? 0 : items.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(active);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    } else if (event.key === 'Tab') {
      // Restore the trigger before the browser calculates the next tab stop.
      close(true);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      search = now - lastTypedAt > 600 ? event.key : search + event.key;
      lastTypedAt = now;
      const match = options.options.findIndex(option => option.label.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()));
      if (match >= 0) focusOption(match);
    }
  }, eventOptions);
  element.addEventListener('focusout', event => {
    if (!element.contains(event.relatedTarget as Node | null)) close();
  }, eventOptions);
  document.addEventListener('pointerdown', event => {
    if (!element.contains(event.target as Node)) close();
  }, eventOptions);
  window.addEventListener('resize', positionList, eventOptions);
  document.addEventListener('scroll', event => {
    if (event.target !== list) positionList();
  }, { ...eventOptions, capture: true });
  const control = node('div', 'ds-select__control');
  control.append(trigger, list);
  element.append(label, control);
  if (options.help) {
    const help = node('p', 'ds-select__help', options.help);
    help.id = `${id}-help`;
    trigger.setAttribute('aria-describedby', help.id);
    element.append(help);
  }
  reflectValue();
  return { element, trigger, getValue: () => options.options[selected]!.value, destroy: () => lifecycle.abort() };
}

export function createFeedback(
  message: string,
  tone: 'info' | 'success' | 'error' = 'info',
): HTMLDivElement {
  const element = node('div', `ds-feedback ds-feedback--${tone}`, message);
  element.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  element.setAttribute('aria-atomic', 'true');
  return element;
}
