# Documentation system

This starter shows an implemented design system through Markdown documents and live component previews. Its visual values are example decisions for this documentation app. Adapt the shell and examples to the target product's existing theme, library, content, and interaction requirements before using it as that product's documentation.

The top navigation selects Style guide, Component library, or Pattern library. The sidebar lists the second-level headings in the selected document. Third-level headings organize the current page. Write content in these files and use a `preview` fence containing a registered preview ID to mount a real component from the preview registry.

## Run the documentation app

Run these commands from the copied documentation app directory containing `package.json`. Use Node.js 22.17 or newer and the accompanying package lock file.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:8860`. Markdown and source edits update the development app. To check types, create a production build, and inspect that build locally:

```sh
npm run build
npm run preview
```

The production preview is served at `http://127.0.0.1:8861`. The generated `dist/` directory is the static site output. The local servers bind to the loopback address. No skill installation is required to edit, run, or build this app after copying it.

## Adapt the app

`docs.config.ts` at the documentation app root sets `appName`, category labels, source files, and `specDirectory`. Set `appName` to the actual application name. The header displays that name as text, without a generic docs title, decorative logo, or version badge. The default `./spec/design-system` path is resolved from that app root. When the docs app lives at `<project>/docs/design-system`, set `specDirectory` to `../../spec/design-system` to read the project's canonical specification. Retain one source of truth rather than maintaining a second copy of the project documents.

Edit `src/theme.css` to use the target app's tokens and `src/styles.css` for its documentation shell. Replace the factories imported by `src/previews.ts` with the target app's component library, and keep its preview IDs and Markdown contracts aligned. Restart the development server after changing documentation configuration. Rebuild before publishing updated static output.

## Document ownership

| File | Purpose |
| --- | --- |
| `style-guide.md` | Values, layout, hierarchy, density, surfaces, and movement decisions |
| `component-library.md` | Public component contracts, variants, states, and input behavior |
| `pattern-library.md` | Compositions that solve a user task using shared components |
| `lint.json` | Explicit source coverage, structural-value exceptions, and reviewed semantic token duplicates |
| `src/components.ts` | Working starter component implementations |
| `src/previews.ts` | Registry connecting preview IDs to implementations and compositions |

Update values and behavior in the implementation and the associated Markdown together. Keep source paths accurate when the starter is moved into an existing app. Replace the starter component imports with the app's public component API; the documentation must not develop a separate imitation of production components.

## Authoring a page

Create one second-level heading for each sidebar page. Describe the purpose, intended use, values, states, limitations, and source location. Add tables for comparable values. Use third-level headings for subsections. Keep essential instructions beside the preview that demonstrates them.

To include a preview, add a fenced code block with the language `preview` and one registered ID as its content. Supported starter IDs are `palette`, `typography`, `spacing`, `layout`, `radii`, `focus`, `buttons`, `fields`, `select`, `feedback`, `form-pattern`, and `filter-pattern`.

The preview registry runs application code. Markdown prose does not execute arbitrary scripts. Add new component behavior in the registry and import the actual shared implementation there.

## Verification and maintenance

`lint.json` scans both `src/theme.css` and `src/styles.css`. Its structural
exceptions describe accessibility hiding, viewport-relative sizing, popup
anchoring, and relative stacking. Its duplicate-token reviews preserve separate
color, spacing, typography, radius, icon, and surface responsibilities even when
their current values coincide. Keep exact values and complete canonical
file/name groups aligned with the implementation; stale reviews fail strict mode.

While this app is inside the distributed skill, run from this app directory:

```sh
npm --prefix ../../scripts run typecheck
npm --silent --prefix ../../scripts run lint:source -- --root "$PWD" --format json --strict
```

For a standalone copy, copy the complete lint tool package to the app's
`tools/design-lint/` directory without installed dependencies or build output.
Install with `npm --prefix tools/design-lint ci` and replace `../../scripts`
in these commands with `tools/design-lint`. Keep `lint.json` at
`spec/design-system/lint.json`, or pass its new location with `--config`.
Run strict source lint before and after UI changes; warnings require action.

Check document routes, selected navigation states, keyboard access, small screens, zoom, and long labels after changing the shell. Check relevant component states with real pointer and keyboard input. Record the scope and outcome of verification in the target project's usual development workflow; a visible preview alone is not proof of accessibility or usable behavior.

This starter has no account service, persistence, or publishing backend. Markdown files are the editable source. Form examples hold input only in the current page and do not send requests.
