import { marked, type Token, type TokensList } from 'marked';
import DOMPurify from 'dompurify';
import { mountPreview } from './previews';

export interface SectionSource {
  id: string;
  label: string;
  file: string;
  markdown: string;
}

export interface DocPage {
  id: string;
  title: string;
  tokens: TokensList;
  searchText: string;
  headings: PageHeading[];
}

export interface DocSection extends SectionSource {
  pages: DocPage[];
}

export interface PageHeading { id: string; title: string }

function safeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['form', 'input', 'button', 'textarea', 'select', 'style'],
    FORBID_ATTR: ['style'],
    ALLOW_DATA_ATTR: false,
    SANITIZE_NAMED_PROPS: true,
  });
}

function plainText(markdown: string): string {
  const element = document.createElement('div');
  element.innerHTML = safeHTML(marked.parseInline(markdown, { async: false }));
  return element.textContent?.trim() || '';
}

export function slug(text: string): string {
  return text.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'page';
}

function uniqueSlug(title: string, used: Set<string>): string {
  const base = slug(title);
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) candidate = `${base}-${suffix++}`;
  used.add(candidate);
  return candidate;
}

export function prepareSections(sources: SectionSource[]): DocSection[] {
  return sources.map((source) => {
    const tokens = marked.lexer(source.markdown, { gfm: true });
    const pages: DocPage[] = [];
    const used = new Set<string>();
    let title = 'Overview';
    let buffer: Token[] = [];
    let explicitPage = false;
    const flush = () => {
      if (!explicitPage && !buffer.some((token) => token.type !== 'space')) return;
      const pageTokens = Object.assign([...buffer], { links: tokens.links }) as TokensList;
      const usedHeadings = new Set<string>();
      const headings: PageHeading[] = [];
      for (const token of buffer) {
        if (token.type === 'heading' && token.depth === 3) {
          const title = plainText(token.text);
          headings.push({ id: `content-${uniqueSlug(title, usedHeadings)}`, title });
        }
      }
      pages.push({
        id: uniqueSlug(title, used), title, tokens: pageTokens, headings,
        searchText: `${title} ${plainText(buffer.map((token) => token.raw).join(''))}`.toLocaleLowerCase(),
      });
      buffer = [];
    };
    for (const token of tokens) {
      if (token.type === 'heading' && token.depth === 1) continue;
      if (token.type === 'heading' && token.depth === 2) {
        flush();
        title = plainText(token.text);
        explicitPage = true;
      } else buffer.push(token);
    }
    flush();
    if (!pages.length) {
      pages.push({ id: 'overview', title: 'Overview', tokens: Object.assign([], { links: tokens.links }), searchText: '', headings: [] });
    }
    return { ...source, pages };
  });
}

export function renderPage(page: DocPage, host: HTMLElement): { headings: PageHeading[]; cleanup: () => void } {
  const cleanups: Array<() => void> = [];
  const headings: PageHeading[] = [];
  const usedHeadings = new Set<string>();
  let chunk: Token[] = [];
  const flush = () => {
    if (!chunk.length) return;
    const holder = document.createElement('div');
    holder.className = 'markdown-content';
    holder.innerHTML = safeHTML(marked.parser(Object.assign(chunk, { links: page.tokens.links }), { async: false }));
    for (const table of holder.querySelectorAll('table')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Scrollable documentation table');
      table.replaceWith(wrapper);
      wrapper.append(table);
    }
    for (const heading of holder.querySelectorAll('h3')) {
      const title = heading.textContent || '';
      const id = `content-${uniqueSlug(title, usedHeadings)}`;
      heading.id = id;
      heading.tabIndex = -1;
      headings.push({ id, title });
    }
    for (const link of holder.querySelectorAll('a')) {
      if (/^https?:\/\//i.test(link.getAttribute('href') || '')) link.rel = 'noopener noreferrer';
    }
    host.append(holder);
    chunk = [];
  };
  for (const token of page.tokens) {
    if (token.type !== 'code' || token.lang !== 'preview') {
      chunk.push(token);
      continue;
    }
    flush();
    const id = token.text.trim();
    const figure = document.createElement('figure');
    figure.className = 'preview-block';
    const caption = document.createElement('figcaption');
    caption.className = 'preview-caption';
    caption.textContent = 'Component preview';
    const stage = document.createElement('div');
    stage.className = 'preview-stage';
    figure.append(caption, stage);
    host.append(figure);
    const cleanup = mountPreview(id, stage);
    if (cleanup) cleanups.push(cleanup);
    else {
      stage.classList.add('preview-unavailable');
      stage.textContent = `Preview “${id}” is not registered. Add an implementation to src/previews.ts.`;
    }
  }
  flush();
  return { headings, cleanup: () => cleanups.forEach((cleanup) => cleanup()) };
}
