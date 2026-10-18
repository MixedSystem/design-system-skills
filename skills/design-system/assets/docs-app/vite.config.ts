import { readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, normalizePath, type Plugin } from 'vite';
import docsConfig from './docs.config.ts';

const root = dirname(fileURLToPath(import.meta.url));
const virtualId = 'virtual:design-system-docs';
const resolvedId = `\0${virtualId}`;

function documentation(): Plugin {
  const specDirectory = realpathSync(resolve(root, docsConfig.specDirectory));
  const seen = new Set<string>();
  const sources = docsConfig.sections.map((section) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id) || seen.has(section.id)) {
      throw new Error(`Documentation section IDs must be unique lowercase slugs: ${section.id}`);
    }
    seen.add(section.id);
    if (!section.label.trim() || !section.file.endsWith('.md') || isAbsolute(section.file)) {
      throw new Error(`Invalid documentation section: ${section.id}`);
    }
    const file = realpathSync(resolve(specDirectory, section.file));
    const withinSpec = relative(specDirectory, file);
    if (withinSpec === '..' || withinSpec.startsWith(`..${sep}`) || isAbsolute(withinSpec)) {
      throw new Error(`Documentation source must be inside specDirectory: ${section.file}`);
    }
    return { ...section, path: file };
  });
  if (!sources.length || !docsConfig.appName.trim()) {
    throw new Error('Documentation requires an app name and at least one section.');
  }
  return {
    name: 'project-design-system-docs',
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id !== resolvedId) return;
      const sections = sources.map(({ path, ...section }) => {
        this.addWatchFile(path);
        const markdown = readFileSync(path, 'utf8');
        if (!markdown.trim()) throw new Error(`Documentation source is empty: ${section.file}`);
        return { ...section, markdown };
      });
      return `export default ${JSON.stringify({ appName: docsConfig.appName, sections })}`;
    },
    hotUpdate({ file, timestamp }) {
      if (!sources.some((source) => normalizePath(source.path) === normalizePath(file))) return;
      const module = this.environment.moduleGraph.getModuleById(resolvedId);
      if (module) this.environment.moduleGraph.invalidateModule(module, new Set(), timestamp, true);
      this.environment.hot.send({ type: 'full-reload' });
      return [];
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [documentation()],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
});
