# Design System Skills

A framework-independent skill for implementing and documenting an app-specific
design system: style guide, reusable component library, and pattern library.
Follows the [Agent Skills specification](https://agentskills.io/specification).

## Installation

Run this command from the project where you want to use the skill:

```sh
npx skills@latest add MixedSystem/design-system-skills --skill design-system
```

Requires Node.js 22.20 or later, Git, and access to this private GitHub repository.
The [Skills CLI](https://github.com/vercel-labs/skills#private-repositories) uses
your existing Git, GitHub CLI, or SSH authentication. Use an account with access
to `MixedSystem/design-system-skills` before running the command.

Select your agent when prompted, or specify it with `--agent`. Installation is
project-local by default; add `--global` to make it available across projects.

```sh
# Codex, current project
npx skills@latest add MixedSystem/design-system-skills --skill design-system --agent codex

# Codex, all projects
npx skills@latest add MixedSystem/design-system-skills --skill design-system --agent codex --global

# Claude Code, current project
npx skills@latest add MixedSystem/design-system-skills --skill design-system --agent claude-code
```

Use `--copy` if your environment requires files instead of symlinks. Check the
installed project skills with `npx skills@latest list`, or add `--global` to list
global installations.

For manual installation, copy the complete `skills/design-system/` directory to
your agent's documented skill directory, keeping `SKILL.md`, `agents/`,
`scripts/`, and `assets/` together. Exclude any locally generated `node_modules/`
and `dist/` directories. Follow the agent client's reload instructions if the
new skill is not discovered immediately.

## Usage

Ask your agent to create app or website UI, add or redesign screens, style shared
controls, or fix UI consistency and interaction problems. The skill inspects the
existing system, defines app-specific design values, implements reusable
components and patterns, documents them, and runs scoped design lint. Existing
systems receive targeted updates.

Automatic selection depends on your agent discovering the installed skill and
supporting implicit invocation. You can also explicitly ask it to use the
`design-system` skill. [Read the full instructions](skills/design-system/SKILL.md).

## Target-project deliverables

The skill implements real shared styles, components, and necessary patterns in
the project's chosen stack. It leaves the maintained specification at:

```text
spec/design-system/
  README.md
  style-guide.md
  component-library.md
  pattern-library.md
```

The specification records actual decisions and source locations, values and
units, component APIs and states, pattern flows, setup and usage, and preview
opening steps. Project documentation and agent instructions point to it so
future work can reuse the system independently.

A project-owned docs app reads these Markdown files and renders the actual
library and supported states. Requested application screens use the same
implementation. System-only requests remain scoped to the system and its docs
and previews.

## Markdown documentation app

[Open the reusable docs app starter](skills/design-system/assets/docs-app/).
It provides a blurred top navigation bar for Style Guide, Component Library,
and Pattern Library, a sidebar derived from the selected document's second-level
headings, and interactive component previews alongside the Markdown content.
The header displays the actual app name as plain text, without a generic docs
title, decorative icon, or starter/version badge. Document headings and functional
control icons remain available.
The starter documents its own shared styles, components, and patterns so its
interface and library can be inspected immediately.

The starter is a TypeScript web app built with Vite. It is a reference
implementation, not a required application stack. Integrate the same structure
into an existing docs site or app when that avoids duplicate tooling. Otherwise,
copy the complete starter into the target project, for example at
`docs/design-system/`, excluding `node_modules/` and `dist/`.

From that copied directory, install the locked dependencies and launch the app:

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

The development URL is `http://127.0.0.1:8860`. The server uses a strict port and
stops if it is occupied; free that port or explicitly choose another with
`npm run dev -- --port 8862`. Build with type checking and inspect the production
build with:

```sh
npm run build
npm run preview -- --host 127.0.0.1
```

The preview server uses strict port `8861`; override it with
`npm run preview -- --port 8863` if necessary. Stop either server with Control-C.
The generated `dist/` directory is the static deployment output; a production
site does not require a document-writing server.

Adapt the copied files to the target project:

| File | Project-specific changes |
| --- | --- |
| `docs.config.ts` | Set `appName` to the actual app name and point `specDirectory` at the canonical Markdown directory. From `docs/design-system/`, use `../../spec/design-system`. Configure the three category labels and their `style-guide.md`, `component-library.md`, and `pattern-library.md` source files. |
| `src/theme.css` | Replace the starter's visual values with imports or aliases of the actual app's canonical tokens. Adapt color, typography, spacing, corners, height, surfaces, and keyboard-focus indicators together. |
| `src/styles.css` | Adapt reference-page layout and responsive behavior while retaining readable text, visible focus, and an opaque fallback for the blurred header. |
| `src/previews.ts` | Register preview IDs that import the app's actual components, styles, and providers. Replace starter-only registrations with real supported variants, sizes, states, and patterns. |
| `src/components.ts` | Contains the starter's own reusable controls. When integrating a different app's design system, use that app's public component imports instead of copying these controls as lookalikes. |

Write documentation in the canonical Markdown files. Use `##` headings for
sidebar entries, ordinary fenced blocks for readable usage examples, and a
`preview` fence containing one registered ID to mount a working example:

````markdown
## Buttons

Describe the implemented button contract and supported states.

```preview
buttons
```
````

Preview IDs resolve through the trusted TypeScript registry; Markdown is not
executed as application code. Unknown IDs display an error instead of silently
showing a substitute. Keep raw Markdown downloads available so authors and
agents can use the specification independently of the web viewer. Edit files
with the project's normal editor; the viewer does not write Markdown from the
browser. Rebuild after document changes before publishing static output.

Verify category navigation, subsection links, narrow-screen sidebar access,
keyboard focus, the blurred header's real contrast, Markdown updates, and real
component interactions. A native library should link to its native preview
target rather than present a web recreation as the actual component. Record
the copied app's setup and opening steps in `spec/design-system/README.md`.

Design Tab/keyboard focus for the target app. Choose and document its treatment,
color, thickness, separation, and shape for actions, fields, navigation, menus,
and focusable scroll regions. A border change, a flush zero-gap ring, an inset
indicator, a separated outer ring, or an appropriate underline may suit different
components. No positive gap or starter pixel value is mandatory. Keep focus
distinguishable from selected or current states and visible on invalid controls.
Use platform focus visibility
(such as web `:focus-visible`), coherent focus order/return, and no positive
`tabindex` or global Tab handler for visual highlighting. Preserve usable indicators, including in
forced-colors/high-contrast modes; focus must appear immediately and optional
motion must honor reduced-motion preferences.

## Executable design lint

Lint must run during UI creation, repair, and design validation. Capture a scoped
source/rendered baseline before changing existing UI; for new UI, configure
checks from the design contract and run them as soon as implementation exists.
Repeat after affected shared controls and compositions change, after fixes, and
before handoff. Installing the tools or passing a build does not satisfy this.

The package includes two read-only TypeScript tools:

- [design_lint.ts](skills/design-system/scripts/design_lint.ts) checks explicitly
  selected CSS files and their canonical design tokens.
- [rendered_lint.ts](skills/design-system/scripts/rendered_lint.ts) exports
  `lintRenderedDesign(config, document = globalThis.document)` for the real
  development preview or browser test harness, with configuration and report
  types for consumers.

Copy the complete `skills/design-system/scripts/` tool package into the target
project's `tools/design-lint/` directory, including both TypeScript files,
`package.json`, `package-lock.json`, and `tsconfig.json`. Exclude installed
dependencies and generated build output. Document local paths, configuration,
dependencies, and commands in `spec/design-system/README.md`. The copied package
runs without this skill. Keep project-specific settings and measurements in
that project; neither tool rewrites source or fixes issues automatically.

Use Node.js 22.17 or later. From the target project root, install the locked
development dependencies and check both tools:

```sh
npm --prefix tools/design-lint ci
npm --prefix tools/design-lint run typecheck
```

### CSS source adapter

The source command executes the TypeScript entry point through the package's
local runner. After installing the copied package, run it from the target
project root:

```sh
npm --silent --prefix tools/design-lint run lint:source -- --root "$PWD" --config spec/design-system/lint.json --format json --strict
```

`--root` is required. Use the absolute project root because the package runner
executes inside `tools/design-lint/`. `--config` defaults to
`spec/design-system/lint.json` and is relative to that root. `--format` accepts
`text` (default) or `json`.
`--strict` makes warnings blocking. Configure the following JSON fields:

| Field | Contract |
| --- | --- |
| `version` | Required integer `1`. |
| `include` | Required nonempty array of explicit CSS globs relative to the root. Each glob must match. |
| `token_files` | Required nonempty array of CSS globs identifying canonical token definitions; every match must remain included after exclusions. |
| `exclude` | Optional array of globs to remove from source coverage. |
| `external_tokens` | Optional array of `--name` identifiers supplied externally; referenced external definitions produce coverage warnings. |
| `allowed_values` | Optional object mapping a property to arrays of intentional complete literal values; allowances do not authorize missing tokens. |
| `exceptions` | Optional array of objects with exactly `file`, `property`, `value`, and `reason`. Files and complete values must match exactly; wildcard exceptions are rejected and unused exceptions produce warnings. |
| `duplicate_token_reviews` | Optional array of objects with exactly `value`, `tokens`, and `reason`. `tokens` lists every canonical `{ file, name }` pair for the complete equal-value group, with at least two distinct token names. Explain the independent semantic roles. Changed values, ownership, or membership invalidate the review; unused reviews warn. |
| `tracked_files` | Optional object mapping existing root-relative files to reviewed SHA-256 digests. Changed bytes produce a drift warning; accepting a new baseline requires review. |

Unknown fields, invalid types, path traversal, symlinks, unsupported source-file
matches, and empty coverage are rejected. Canonical token files may define raw
custom-property values; ordinary declarations in those files remain checked.
Do not label every stylesheet canonical merely to suppress unmanaged tokens.

Checks cover undefined references, including nested fallbacks, unambiguous alias
cycles, unmanaged definitions, raw design values, potential duplicate values,
and tracked-file drift. Alias-cycle analysis compares dependency sets across
definitions, including fallback references. Responsive literals can differ
without introducing an alias ambiguity; differing dependency sets still warn.
Supported local imports already in the explicit scan have source coverage;
external, unscanned, or unsupported import forms retain warnings. Imports are
not fetched recursively and their cascade is not evaluated. Unsupported
extensions and external tokens also warn. Exact-value token suggestions require
semantic-role confirmation before use. Preserve independent semantic tokens
instead of introducing an artificial alias merely to silence a duplicate warning.
Escaped CSS identifiers also produce coverage warnings because this adapter
does not decode them for complete token or property analysis.

Raw-value checks cover selected colors, numeric spacing/dimensions, typography,
borders/radii/shadows, opacity/layers, and motion values. They do not classify
every CSS keyword; structural choices such as `cover` are outside these rules.

Reports include rule, severity, file, line, column, file/declaration coverage,
summary, and limitations. Exit `0` means no blocking findings; warnings can still
exist without `--strict`. Exit `1` means rule errors or strict-mode warnings;
exit `2` means configuration, parsing, or coverage failure. Runtime or dependency
loader failures also exit unsuccessfully, but may occur before a structured
report is available. Use strict mode for required CI checks and inspect all
reported limitations.

The maintained docs starter includes `spec/design-system/lint.json` with its
complete owned CSS scope, exact structural-value exceptions, and reviewed
semantic duplicates. From this repository root, run its strict source check:

```sh
npm --prefix skills/design-system/scripts run typecheck
npm --silent --prefix skills/design-system/scripts run lint:source -- --root "$PWD/skills/design-system/assets/docs-app" --format json --strict
```

Keep this configuration with the copied app and review it when adapting tokens
or styles.

### Rendered web adapter

Import `rendered_lint.ts` through the target project's TypeScript build and use
its exported `RenderedLintConfig` and `RenderedLintReport` types where useful.
Browsers execute the generated module, so compile or bundle the source through
the existing preview or test build; do not load a TypeScript file directly in a
browser or commit generated JavaScript as another maintained implementation.
The caller must await `document.fonts.ready`, establish the viewport, and drive
real interaction states before each call. The module neither launches a browser
nor performs clicks, keyboard operations, or state transitions.

The config requires `version: 1` and a nonempty `targets` array. Optional fields
are `scenario` (a nonempty description of the captured state), `tolerance`
(0–2 CSS pixels, default 0.5), and `checkPageOverflow` (default `true`). Each target
requires a real `selector` and at least one of the following checks:

| Target field | Contract |
| --- | --- |
| `minWidth`, `minHeight` | Positive minimum bounding-box dimensions in CSS pixels, chosen from the project's specification. |
| `expected` | CSS-pixel metrics: `width`, `height`, `fontSize`, `lineHeight`, `paddingInlineStart`, `paddingInlineEnd`, `paddingTop`, `paddingBottom`, `marginInlineStart`, `marginInlineEnd`, `marginTop`, `marginBottom`, `rowGap`, `columnGap`, `borderTopWidth`, `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth`, `borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomLeftRadius`, and `borderBottomRightRadius`. Margins accept finite negative values; other metrics must be nonnegative. Unresolved `auto` margins require review. |
| `states` | Boolean expectations for `disabled`, `readOnly`, `expanded`, `selected`, `checked`, `pressed`, `busy`, `invalid`, or `focused`. These describe observed DOM state, not verified behavior. |
| `contrastMinimum` | Required text contrast ratio from 1 to 21 for the selected text role. The adapter does not automatically classify large text or apply exceptions. |
| `dropdown` | An object with `labelSelector`, `arrowSelector`, and nonnegative `minimumGap`; both selectors must identify exactly one visible descendant. Checks the logical trailing padded arrow slot, label separation, vertical centering of the arrow box, and supported SVG artwork in either reading direction. |

Dropdown centering uses the trigger's content box after borders and padding.
The check measures the icon box and the visible SVG artwork separately: an SVG
viewport can be centered while its actual path is shifted downward. Use a
balanced inline SVG with an appropriate view box and center its slot with grid
or flex alignment. A text arrow or generated glyph does not establish artwork
centering and produces a review warning. Complex or transformed artwork also
requires review; do not hide drift with an arbitrary offset or treat a centered
wrapper as sufficient evidence. Optical balance still needs visual inspection.

For an open dropdown, also target the popup/list and every option. Set `expected`
padding, margins, height, line height, gaps, and borders from the reviewed specification
or canonical tokens, not from the possibly faulty element's measured styles.
Run the checks inside the actual docs or app consumer so inherited prose list
padding and row formatting cannot go unnoticed. Use focused harness assertions
for unsupported metrics such as markers, balanced edge insets, and popup
viewport containment; these are not additional rendered-lint configuration keys.

For focus styling, run source/rendered lint after real Tab and Shift+Tab input,
then use harness assertions and visual review for the documented indicator's
applicable border, outline, underline, or surface properties, shape, contrast,
and clipping. Zero separation is valid when it matches the app's contract and
the indicator remains visible. Check selected/invalid
combinations, constrained layouts, and supported high-contrast/reduced-motion
modes. `states.focused` reports DOM focus only; it does not prove a visible or
usable indicator, and outline/focus-ring fields are not supported config keys.

The returned object contains captured context, coverage, measurements,
diagnostics, summary, limitations, and `status`: `pass` for no detected findings,
`review` for warnings, or `fail` for errors. Treat both `review` and `fail` as
requiring action in a mandatory check. Missing targets fail; hidden or unsupported
samples do not count as clean passes. Repeat the audit for relevant component
sizes, states, viewports, and reading directions through the existing harness.

The CSS adapter does not scan native UI, preprocessors, CSS-in-JS, templates, or
design-file data, and does not evaluate full CSS grammar or cascade availability.
The DOM adapter inspects the current document only, without iframe or shadow-root
traversal. Contrast is limited to uniform sRGB text on resolved solid ancestor
backgrounds. Geometry is not proof of an unobstructed hit area. Use suitable
project-specific adapters and actual interaction, accessibility, and visual
checks for uncovered behavior. If a required adapter cannot run, identify the
unchecked scope and report incomplete validation instead of silently skipping
it or presenting another adapter's pass as coverage. A clean report is not proof
that a design has no problems.
