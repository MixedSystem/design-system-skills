import docs from 'virtual:design-system-docs';
import { prepareSections, renderPage, slug, type DocPage, type DocSection, type PageHeading } from './content';
import './styles.css';

const sections = prepareSections(docs.sections);
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('The documentation app requires an #app element.');

app.innerHTML = `
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="docs-header">
    <a class="brand" aria-label="Documentation home">
      <span class="brand-name"></span>
    </a>
    <nav class="top-nav" aria-label="Design system sections"></nav>
    <div class="header-tools">
      <a class="source-link" title="Download the source Markdown file"><svg viewBox="0 0 20 20" aria-hidden="true" fill="none"><path d="M6 2.5h5.5l3 3V17.5H5V2.5h1Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M11 2.5v4h3.5M7.5 10h4.5m-4.5 3h4.5" stroke="currentColor" stroke-width="1.4"/></svg><span>Markdown</span></a>
      <button class="mobile-menu" type="button" aria-controls="docs-sidebar" aria-expanded="false" aria-label="Open navigation"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 5h13M3.5 10h13M3.5 15h13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
    </div>
  </header>
  <button class="sidebar-backdrop" type="button" aria-label="Close navigation" tabindex="-1" hidden></button>
  <div class="docs-shell">
    <aside class="docs-sidebar" id="docs-sidebar" aria-label="Documentation navigation">
      <div class="sidebar-search"><label class="sr-only" for="docs-search">Search documentation</label><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.25" stroke="currentColor" stroke-width="1.5"/><path d="m12.5 12.5 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><input id="docs-search" type="search" placeholder="Search documentation" autocomplete="off" spellcheck="false"><kbd aria-hidden="true">/</kbd></div>
      <p class="search-status sr-only" role="status" aria-live="polite"></p>
      <nav class="sidebar-nav" aria-label="Section pages"></nav>
    </aside>
    <main class="docs-main" id="main-content" tabindex="-1"></main>
    <aside class="docs-toc" aria-label="On this page"></aside>
  </div>`;

function query<T extends Element>(selector: string): T {
  const element = app!.querySelector<T>(selector);
  if (!element) throw new Error(`Missing documentation element: ${selector}`);
  return element;
}

const brand = query<HTMLAnchorElement>('.brand');
const topNav = query<HTMLElement>('.top-nav');
const sidebar = query<HTMLElement>('.docs-sidebar');
const sidebarNav = query<HTMLElement>('.sidebar-nav');
const search = query<HTMLInputElement>('#docs-search');
const searchStatus = query<HTMLElement>('.search-status');
const main = query<HTMLElement>('.docs-main');
const toc = query<HTMLElement>('.docs-toc');
const sourceLink = query<HTMLAnchorElement>('.source-link');
const menuButton = query<HTMLButtonElement>('.mobile-menu');
const backdrop = query<HTMLButtonElement>('.sidebar-backdrop');
const mobile = window.matchMedia('(max-width: 860px)');
let activeSection = sections[0]!;
let activePage = activeSection.pages[0]!;
let cleanupPage: (() => void) | undefined;
let sourceURL: string | undefined;
let menuOpen = false;
let renderedRoute = '';
let headings: PageHeading[] = [];

function route(section: DocSection, page: DocPage, anchor?: string): string {
  return `#/${encodeURIComponent(section.id)}/${encodeURIComponent(page.id)}${anchor ? `/${encodeURIComponent(anchor)}` : ''}`;
}

function currentRoute(): { section: DocSection; page: DocPage; anchor?: string; valid: boolean } {
  let parts: string[];
  try { parts = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent); }
  catch { parts = []; }
  const section = sections.find((entry) => entry.id === parts[0]);
  const page = section?.pages.find((entry) => entry.id === parts[1]);
  return { section: section || sections[0]!, page: page || (section || sections[0]!).pages[0]!, anchor: parts[2], valid: Boolean(section && page && parts.length <= 3) };
}

query<HTMLElement>('.brand-name').textContent = docs.appName;
brand.setAttribute('aria-label', `${docs.appName} documentation home`);
brand.title = docs.appName;
brand.href = route(sections[0]!, sections[0]!.pages[0]!);
for (const section of sections) {
  const link = document.createElement('a');
  link.textContent = section.label;
  link.href = route(section, section.pages[0]!);
  link.dataset.section = section.id;
  topNav.append(link);
}

const header = query<HTMLElement>('.docs-header');
let headerOffset = 0;
function updateHeaderOffset(): void {
  const height = Math.ceil(header.getBoundingClientRect().height);
  if (height > 0 && height !== headerOffset) {
    headerOffset = height;
    document.documentElement.style.setProperty('--docs-header-offset', `${height}px`);
  }
}
updateHeaderOffset();
const headerObserver = new ResizeObserver(updateHeaderOffset);
headerObserver.observe(header, { box: 'border-box' });
import.meta.hot?.dispose(() => headerObserver.disconnect());

function setMenu(open: boolean, restoreFocus = false): void {
  menuOpen = open && mobile.matches;
  sidebar.classList.toggle('is-open', menuOpen);
  document.body.classList.toggle('menu-open', menuOpen);
  menuButton.setAttribute('aria-expanded', String(menuOpen));
  menuButton.setAttribute('aria-label', menuOpen ? 'Close navigation' : 'Open navigation');
  sidebar.inert = mobile.matches && !menuOpen;
  main.inert = menuOpen;
  toc.inert = menuOpen;
  topNav.inert = menuOpen;
  brand.inert = menuOpen;
  sourceLink.inert = menuOpen;
  backdrop.hidden = !menuOpen;
  if (menuOpen) search.focus();
  else if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => setMenu(!menuOpen, true));
backdrop.addEventListener('click', () => setMenu(false, true));
mobile.addEventListener('change', () => {
  const sidebarHadFocus = sidebar.contains(document.activeElement);
  const toggleHadFocus = document.activeElement === menuButton;
  setMenu(false);
  if (mobile.matches && sidebarHadFocus) menuButton.focus();
  else if (!mobile.matches && toggleHadFocus) search.focus();
});
setMenu(false);

function renderSidebar(): void {
  const term = search.value.trim().toLocaleLowerCase();
  const matches = term
    ? sections.flatMap((section) => section.pages.filter((page) => page.searchText.includes(term) || section.label.toLocaleLowerCase().includes(term)).map((page) => ({ section, page })))
    : activeSection.pages.map((page) => ({ section: activeSection, page }));
  sidebarNav.replaceChildren();
  const label = document.createElement('p');
  label.className = 'sidebar-heading';
  label.textContent = term ? 'Search results' : activeSection.label;
  sidebarNav.append(label);
  for (const { section, page } of matches) {
    const link = document.createElement('a');
    link.className = 'sidebar-item';
    link.href = route(section, page);
    const isActive = section.id === activeSection.id && page.id === activePage.id;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    const title = document.createElement('span');
    title.textContent = page.title;
    link.append(title);
    if (term) {
      const category = document.createElement('small');
      category.className = 'search-category';
      category.textContent = section.label;
      link.append(category);
    }
    sidebarNav.append(link);
  }
  if (!matches.length) {
    const message = document.createElement('p');
    message.className = 'search-empty';
    message.textContent = 'No matching documentation. Try a different term.';
    sidebarNav.append(message);
  }
  searchStatus.textContent = term ? `${matches.length} matching ${matches.length === 1 ? 'page' : 'pages'}.` : '';
}

search.addEventListener('input', renderSidebar);
sidebarNav.addEventListener('click', (event) => {
  if (!(event.target instanceof Element) || !event.target.closest('a')) return;
  if (menuOpen) { setMenu(false); main.focus({ preventScroll: true }); }
});

function renderToc(): void {
  toc.replaceChildren();
  if (!headings.length) return;
  const label = document.createElement('p');
  label.className = 'toc-heading';
  label.textContent = 'On this page';
  const nav = document.createElement('nav');
  for (const heading of headings) {
    const link = document.createElement('a');
    link.href = route(activeSection, activePage, heading.id);
    link.textContent = heading.title;
    nav.append(link);
  }
  toc.append(label, nav);
}

function renderNavigation(): void {
  const pages = sections.flatMap((section) => section.pages.map((page) => ({ section, page })));
  const index = pages.findIndex(({ section, page }) => section.id === activeSection.id && page.id === activePage.id);
  const navigation = document.createElement('nav');
  navigation.className = 'page-navigation';
  navigation.setAttribute('aria-label', 'Documentation pages');
  for (const [offset, label] of [[-1, 'Previous'], [1, 'Next']] as const) {
    const entry = pages[index + offset];
    if (!entry) { navigation.append(document.createElement('span')); continue; }
    const link = document.createElement('a');
    link.className = `page-navigation-link ${offset < 0 ? 'previous' : 'next'}`;
    link.href = route(entry.section, entry.page);
    const caption = document.createElement('small');
    caption.textContent = label;
    const title = document.createElement('span');
    title.textContent = entry.page.title;
    link.append(caption, title);
    navigation.append(link);
  }
  main.append(navigation);
}

function markdownRoute(href: string): string | undefined {
  if (href.startsWith('#/') || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return;
  let destination: URL;
  let requested: string;
  let pathname: string;
  try {
    destination = new URL(href, `https://project-docs.invalid/${activeSection.file}`);
    requested = decodeURIComponent(destination.hash.slice(1));
    pathname = decodeURI(destination.pathname);
  } catch { return; }
  if (destination.search) return;
  const section = sections.find((entry) => decodeURI(new URL(entry.file, 'https://project-docs.invalid/').pathname) === pathname);
  if (!section) return;
  let page = section.pages.find((entry) => entry.id === requested || slug(entry.title) === requested);
  let heading: PageHeading | undefined;
  if (!page && requested) {
    const candidates = section === activeSection ? [activePage, ...section.pages.filter((entry) => entry !== activePage)] : section.pages;
    page = candidates.find((entry) => {
      heading = entry.headings.find((item) => item.id === requested || item.id.replace(/^content-/, '') === requested || slug(item.title) === requested);
      return Boolean(heading);
    });
  }
  if (!page && !requested) page = section.pages[0];
  if (page) return route(section, page, heading?.id);
}

function render(focus: boolean): void {
  const selected = currentRoute();
  activeSection = selected.section;
  activePage = selected.page;
  if (!selected.valid) history.replaceState(null, '', route(activeSection, activePage));
  const pageRoute = route(activeSection, activePage);
  if (pageRoute !== renderedRoute) {
    cleanupPage?.();
    renderedRoute = pageRoute;
    main.replaceChildren();
    const header = document.createElement('header');
    header.className = 'page-header';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'page-eyebrow';
    eyebrow.textContent = activeSection.label;
    const title = document.createElement('h1');
    title.textContent = activePage.title;
    header.append(eyebrow, title);
    const article = document.createElement('article');
    article.className = 'article';
    if (focus) article.classList.add('page-enter');
    main.append(header, article);
    const rendered = renderPage(activePage, article);
    headings = rendered.headings;
    cleanupPage = rendered.cleanup;
    for (const link of article.querySelectorAll<HTMLAnchorElement>('a[href]')) {
      const destination = markdownRoute(link.getAttribute('href')!);
      if (destination) link.setAttribute('href', destination);
    }
    const firstParagraph = article.firstElementChild?.classList.contains('markdown-content') ? article.firstElementChild.firstElementChild : null;
    if (firstParagraph?.tagName === 'P') firstParagraph.classList.add('page-description');
    document.title = `${activePage.title} · ${docs.appName}`;
    for (const link of topNav.querySelectorAll<HTMLAnchorElement>('a')) {
      const active = link.dataset.section === activeSection.id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    if (sourceURL) URL.revokeObjectURL(sourceURL);
    sourceURL = URL.createObjectURL(new Blob([activeSection.markdown], { type: 'text/markdown;charset=utf-8' }));
    sourceLink.href = sourceURL;
    sourceLink.download = activeSection.file.split('/').at(-1) || `${activeSection.id}.md`;
    sourceLink.setAttribute('aria-label', `Download ${activeSection.label} Markdown`);
    renderSidebar();
    renderToc();
    renderNavigation();
    setMenu(false);
    if (focus) { main.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }
  }
  if (selected.anchor) {
    const heading = headings.find((entry) => entry.id === selected.anchor);
    const element = heading && document.getElementById(heading.id);
    if (element) {
      element.scrollIntoView({ block: 'start' });
      if (focus) element.focus({ preventScroll: true });
    }
  }
}

query<HTMLAnchorElement>('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  setMenu(false);
  main.focus();
  main.scrollIntoView({ block: 'start' });
});

document.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) return;
  const editing = event.target instanceof HTMLElement && (event.target.matches('input, textarea, select') || event.target.isContentEditable);
  if (event.key === '/' && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    if (mobile.matches) setMenu(true);
    search.focus();
  }
  if (event.key === 'Escape' && menuOpen) {
    event.preventDefault();
    setMenu(false, true);
  } else if (event.key === 'Escape' && document.activeElement === search && search.value) {
    search.value = '';
    renderSidebar();
  }
  if (event.key === 'Tab' && menuOpen) {
    const targets = [menuButton, ...sidebar.querySelectorAll<HTMLElement>('input, a[href], button:not([disabled])')];
    const index = targets.indexOf(document.activeElement as HTMLElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); targets.at(-1)?.focus(); }
    else if (!event.shiftKey && (index === targets.length - 1 || index < 0)) { event.preventDefault(); targets[0]?.focus(); }
  }
});

window.addEventListener('hashchange', () => render(true));
render(false);
