---
name: design-system
description: >-
  Build, extend, or repair a project-owned design system when creating app or
  website UI, adding or redesigning screens, styling shared controls, fixing UI
  consistency or interaction problems, or consolidating repeated interface
  patterns. Apply to these tasks even when the user does not mention a skill or
  design system. Reuse existing conventions and implement app-specific styles,
  a reusable component library, and task patterns. Document the implemented
  system in spec/design-system/ and provide browsable Markdown documentation
  with runnable component states. Adapt to the actual platform and framework.
  Exclude work with no UI impact.
---

# Design System

Implement one coherent system for the requested UI: a style guide backed by
shared design values, a component library backed by reusable implementations,
and a pattern library backed by the app's actual compositions and flows.
Keep these three layers consistent with code and documented in the project.
This skill defines a workflow, not a preset aesthetic or implementation stack.

## Apply the right scope

- Use this workflow for relevant UI work without waiting for an explicit skill
  invocation. For a small UI fix, inspect the existing system and update only
  affected rules, components, patterns, and documentation. Do not rebuild the
  whole system or conduct a new design exercise for every edit.
- Take visual direction from the user's instructions and supplied designs.
  Reuse compatible project conventions. Where direction is absent, derive it
  from the app's users, tasks, content, devices, and input methods; state material
  assumptions without claiming user research that was not performed.
- Implement only foundations, controls, and patterns needed by the requested
  work. If the user requests screens or an app, establish or extend the shared
  system first and continue building those screens with it. A system-only request
  does not authorize unrelated screens, product features, or branding work.
- Keep the skill's instructions in English. Project documentation, application
  copy, and explanations follow the user's language and project conventions.
- Keep design instructions in this file. Do not add designer profiles, named
  brand comparisons, research catalogs, community anecdotes, or historical
  practice reports. Resolve any necessary technical research into applicable
  implementation decisions; do not substitute a source collection for design.

## 1. Inspect before designing

Read project instructions, specifications, styling sources, shared components,
public interfaces, consumers, layouts, previews, and relevant tests. Check the
platform, framework, devices, language, and accessibility requirements; follow
the project's code-discovery conventions. Run scoped source and rendered lint
before changing existing UI to capture the actual failing state. For new UI,
configure lint from the design contract and run it as soon as implementation exists.

At the start of UI work and after a context reset, reload the relevant specification
and implementation. Resolve exact tokens, exports, variants, and dependencies;
do not invent APIs or treat stale documentation as executable truth. Reconcile
the affected contract when documentation and source disagree.

Reuse suitable components and dependencies; avoid competing themes, kits, or
purposeless wrappers. Preserve public behavior unless the request requires
migration; update affected callers together. Keep unrelated instructions intact.

Use the requested stack. If an undecided platform prevents runnable work, ask one
focused question and continue independent requirements. Do not impose a framework,
token syntax, styling library, package manager, or preview tool.

Identify the requested tasks and the system gaps they expose. Use real content
length, language, action frequency, information density, and input constraints
to decide what to build. A shared control can be useful before its second use
when it establishes required reusable behavior; a one-off layout need not become
a universal abstraction.

## 2. Resolve the visual and interaction direction

Choose shape, surface depth, density, typography, color emphasis, imagery, and
motion independently, then make them work together. Rounded corners and flat
surfaces can coexist. Do not map an industry to a fixed style or reuse one kit
with a different accent color for every app.

Connect each material choice to the task: readable content, recognizable actions,
scan order, grouping, input comfort, or appropriate emphasis. Define hierarchy
through alignment, spacing, type, and contrast before adding decoration. Use
depth to communicate layers or interaction where useful; do not add shadows to
every surface. Different component roles may need different corner treatments.

Choose a coherent direction and record its practical reasons and tradeoffs.
Compare alternatives only when a material question remains; do not create an
unsolicited approval step. Check the direction in a representative composition
using real shared components and realistic content. Keep this in the development
preview if application screens are outside scope.

Use functional copy: labels, instructions, content, status, and recovery actions.
Do not invent slogans, promotional subtitles, statistics, or filler text.
Do not add unrequested decorative animation, autoplay, parallax, or entrances.
Motion defaults to none. Requested or necessary functional motion must have a
clear purpose and a reduced-motion behavior.

## 3. Implement the style guide

Resolve design choices into actual values in the project's canonical styling
resources. Use its existing facilities; do not require a token format, multiple
token layers, fixed spacing scale, or extra themes. Shared values must drive real
components, not exist only in a document. Structural values such as zero or full
width do not require tokens by default.

Maintain a searchable map of the actual shared values: exact identifier, value
or alias, unit, semantic purpose, supported context/theme, and canonical source.
Preserve meaningful aliases when the project uses them; do not collapse equal
values that serve different roles. Choose a token by its purpose, not only by
numeric or color similarity. Trace aliases to their definitions before use.

Document the implemented values, units, usage rules, and source locations for
each relevant category in `spec/design-system/style-guide.md`:

| Category | Required decisions |
| --- | --- |
| Layout | Content width, gutters, columns/alignment, section rhythm, containment, overflow, responsive changes, and safe areas where relevant. Base breakpoints on content and operation, not arbitrary device labels. |
| Typography | Actual font and fallback, language coverage, text roles, size/unit, weight, line height, tracking, reading width, wrapping/truncation, and enlarged-text behavior. Use a hierarchy suited to the content. |
| Color | Semantic foreground/background/border/focus/status roles, actual allowed color pairs, state treatments, and non-color cues. Define theme behavior only when supported. |
| Spacing | Distinguish internal padding, gaps between related elements, and separation between groups. Define values and when each applies; keep equivalent relationships consistent. |
| Dimensions | Width policies, height roles, size profiles, icon bounds, target areas, and growth with content. Distinguish fixed, minimum, preferred, maximum, and automatic dimensions. |
| Shape and surface | Borders, corner treatments, surface hierarchy, shadow or elevation purpose, and stacking rules. Explicitly record when depth or shadows are absent. |
| Keyboard focus | App-specific indicator treatment, color, thickness, separation, and shape for actions, fields, navigation, menus, and focusable scroll regions. Choose border-integrated, flush, inset, separated, or another suitable treatment. Define visibility, state precedence, clipping/occlusion safeguards, and high-contrast behavior. |
| Imagery and icons | Purpose, aspect ratio, cropping, alignment, missing-content treatment, and accessible meaning for assets actually used. |
| Motion | Whether motion is absent; otherwise purpose, trigger, duration, easing, interruption, and reduced-motion behavior. |

Use deliberate size profiles instead of isolated button heights. For each
implemented profile, specify its intended context, minimum or fixed height,
inline/block padding, text role and line height, border, icon size, label gap,
width policy, hit area, and growth behavior. Derive values from content, font
metrics, density, and input needs. Keep peer controls in the same context aligned.
Primary and secondary emphasis need not imply different sizes. Apply a different
size only for a documented role or context, not a screen-specific visual patch.

Separate text line boxes, visible control bounds, interactive target areas,
repeated rows, navigation regions, and containers. Allow controls and layouts to
grow for long labels, errors, translation, and enlarged text. Do not use a fixed
height that clips required content or overlap neighboring hit areas to simulate
larger targets. Keep platform units distinct; CSS pixels, points, and density-
independent units are not interchangeable universal measurements.

Set contrast, input-target, text-scaling, and focus criteria appropriate to the
platform and the project's accessibility target. If the project has no target,
select applicable current technical criteria before implementation and document
measurable contrast, minimum target area, text enlargement, reflow, and visible,
unobscured focus requirements. Preserve each criterion's units and exceptions;
do not invent compliance thresholds or import another platform's dimensions.
Measure real foreground and background combinations, including overlays and
state changes; palette swatches alone are insufficient. Do not use color as the
sole indicator of state.

Design keyboard focus as part of the app's visual language, using its surfaces,
control shapes, density, and emphasis hierarchy. Do not preserve the starter's
ring or apply one generic treatment to every element without checking context.
Choose the treatment and its separation per app and component family: emphasize
the existing border, attach a ring directly to the control with zero gap, place
an indicator inside the control, separate an outer ring from it, or use an
appropriate underline or surface treatment. These are options, not required
variants. Do not require a positive offset, a minimum external gap, or the
starter's pixel values. Document zero separation explicitly for a flush design.
Keep the indicator recognizable across component families and check its fit in
scroll containers and clipped menus. If focus changes border thickness, preserve
the control's layout and content geometry rather than shifting nearby elements.
Document the actual values and appearance on selected/current, invalid, and
expanded controls. Focus identifies the keyboard target; it must remain distinct
from persistent selection or current-location styling and must not hide errors.

Use platform focus behavior and keyboard-focus visibility mechanisms, such as
`:focus-visible` on the web; do not intercept Tab globally to simulate a custom
focus system. Preserve a usable native indicator until its replacement works,
avoid positive `tabindex`, and keep reading order, tab sequence, composite navigation,
initial focus, and focus restoration coherent. Explicitly style programmatic
focus destinations when users need to locate them. Make focus appear immediately
without motion-dependent cues. Preserve visibility in forced-colors/high-contrast
modes and honor reduced-motion preferences for any optional focus transition.

## 4. Build the reusable component library

Deliver working components through a documented public import or access path,
with shared style ownership and required setup. An existing module, folder, or
native target is sufficient; a registry package or monorepo is not required.
Keep reusable controls separate from screen-specific services, routing, and
business rules. App-specific compositions can have a narrower reuse boundary.

For each component used by the requested work, define and implement:

- Purpose, appropriate and inappropriate use, source location, public interface, inputs, events,
  content slots or equivalents, and state ownership.
- Supported variants and size profiles, anatomy, alignment, padding, gaps,
  label/icon placement, width and growth rules, and composition constraints.
- Applicable states, transitions, appearance, semantics, allowed actions, and
  focus/value behavior. Include only states the component actually supports.
- Accessible name, role, value, keyboard/pointer/touch behavior, and assistive-
  technology semantics appropriate to the platform.
- Required styles, providers, assets, setup, supported extension points, and
  guidance for consumers. Link to source instead of duplicating full definitions.

Record important relationships: the shared values and components a control uses,
and the patterns or consumers that use it. Keep these links scoped and accurate
so a change exposes its affected consumers without duplicating the codebase.
Run source and rendered lint after implementing or changing each affected shared
control and its representative composition; fix findings before expanding its use.

Do not use "active" as an undefined catch-all. Distinguish enabled, hovered,
focused, momentarily pressed, toggled/selected, current location, disabled,
read-only, busy, invalid, and expanded. Define meaningful combinations and
precedence: focus must remain visible on invalid or selected controls; a busy
action must explain repeat-input behavior and recovery; disabling must prevent
activation. A read-only value is not automatically disabled.

Apply the relevant behavioral rules:

- **Actions:** distinguish navigation from mutation and momentary actions from
  toggles. Give icon-only controls an accessible name. Keep keyboard activation,
  disabled guards, repeat-input handling, and completion/failure behavior coherent.
- **Fields:** keep a persistent label; placeholders do not replace labels.
  Associate help and errors with the field, define validation timing, preserve
  entered values after recoverable failure, and support the platform's input,
  composition, autofill, and submission behavior where applicable.
- **Selection:** distinguish value selection, multi-selection, and action menus.
  Define open/close, current value, navigation versus commitment, selection,
  dismissal, focus restoration, empty data, and disabled options where supported.
- **Overlays:** distinguish modal and non-modal behavior; define initial focus,
  background interaction, dismissal, scroll ownership, and focus return. Keep
  keyboard focus within an open modal; do not trap focus in a non-modal popup.
  Keep the overlay usable within the viewport and preserve work where needed.
- **Feedback and collections:** distinguish loading, empty, filtered-empty,
  failure, and success when relevant. Communicate next steps or recovery without
  adding unsupported features. Repeated items use consistent structure and
  preserve meaningful navigation versus selection behavior.

### Custom selection controls

Use an existing accessible app-owned custom control or implement shared custom
appearance and behavior. A default OS/browser picker, or a styled trigger that
opens an unstyled native popup, does not satisfy an app-owned dropdown. Preserve
semantic button/input behavior and platform accessibility; do not replace
everything with generic elements.

Give the trigger a flexible label region and a separate nonshrinking arrow slot
at logical inline-end. Reserve shared inline padding and a label/icon gap.
On the web, a `minmax(0, 1fr) auto` grid or equivalent flex arrangement prevents
the arrow from falling at the start or being pushed outside the control. Allow
the label to shrink or wrap according to its documented policy; do not use spaces
inside text, an unconstrained pseudo-element, or unexplained absolute offsets
to position the arrow. Direction changes must preserve logical trailing placement.

Center the arrow vertically in the trigger's content area, accounting for borders
and block padding. Center the visible icon geometry within its own viewport too;
a centered wrapper can still contain a visibly low arrow. Prefer a balanced vector
icon from the project's icon set. Do not use a text glyph as a shortcut for a
chevron: font baselines and line boxes do not establish visible icon alignment.
Keep inline vector icons block-level within a centered, nonshrinking slot. Check
the actual artwork at each supported size rather than applying an arbitrary
vertical offset to hide a misaligned glyph or viewBox.

Define popup anchoring, viewport containment, scrolling, layer order, and focus
behavior. Specify list inset, option padding, row height/gap, text alignment, and
selected/focused backgrounds. Isolate component internals from Markdown/prose
styles: generic list padding, margins, markers, and line heights must not alter
popup geometry. Verify balanced edge insets and text/highlight alignment in the
actual consumer, not only an isolated component. Implement and exercise keyboard
opening/navigation/commitment, Escape/dismissal, and pointer selection using the
correct interaction model. Check long values, narrow/short viewports, enlarged
text, direction changes, and open/closed states; measure the arrow and popup.

## 5. Build the pattern library

Document repeatable user tasks assembled from the shared components, not a
second component inventory. Include only patterns used by the requested app.
A pattern may be a documented composition rule; create a shared implementation
only when consumers actually need common behavior. Do not extract every screen
or move business logic into generic controls merely to fill a pattern catalog.

For each implemented pattern, document in `spec/design-system/pattern-library.md`:

- Purpose, when to use it, entry conditions, and actual source or usage locations.
- Component composition, content hierarchy, alignment, and responsive adaptation.
- Data and state ownership, interaction sequence, transitions, and completion.
- Applicable loading, empty, validation, error, retry, cancellation, and recovery
  behavior; preserve user input or context where the task requires it.
- Keyboard order, focus movement/return, announcements, and navigation behavior.
- Permitted variations and what must stay consistent across its consumers.

Relevant patterns may include form completion, search/filter/sort, collection
browsing, confirmation, navigation/detail transitions, or asynchronous feedback.
Their presence depends on the request; this list does not require adding these
features. If no cross-component task pattern exists yet, document that boundary
and the actual supported composition rules instead of inventing one.

Implement requested screens through the library and these patterns. Let screens
arrange shared components without copying internal styling or interactions.
Extend the shared source for real common requirements; do not override its size
or state rules independently on each screen.

## 6. Keep the design system in the project specification

Create or update the following project-owned documentation. Preserve unrelated
content already in `spec/`; use this design-system namespace to avoid collisions.

```text
spec/
  design-system/
    README.md
    style-guide.md
    component-library.md
    pattern-library.md
```

- **README.md:** system scope, product/platform context, chosen direction and
  practical rationale, canonical code/style locations, links to the other three
  documents, setup, public usage path, preview opening steps, and change rules.
- **style-guide.md:** implemented values and usage rules from section 3, including
  actual layout, typography, color pairs, spacing, height, and size decisions.
- **component-library.md:** implemented inventory and contracts from section 4,
  public access/setup, concise valid usage, state behavior, and preview locations.
- **pattern-library.md:** actual task compositions and behavior from section 5,
  their source/consumers, and supported variations.

Fill these documents with actual project decisions and paths, not instructions
to a future author, placeholder tables, or copied theory. Link to canonical
implementation resources with project-relative paths. Keep documentation and
implementation synchronized when shared values, APIs, or behaviors change.

Treat the specification as maintained working context for both people and agents.
Record relevant dependency versions and canonical source paths. When a shared
source or dependency changes, inspect its impact on values, APIs, states, and
consumers before updating the affected specification. Optional file fingerprints
can flag this review; a changed hash is not proof of a visual regression, and
refreshing a hash is not a substitute for reviewing the change.

These files replace standalone handoff guides. Migrate older content and links
in scope; keep compatibility pointers only where needed. Do not duplicate rules
in a competing `UI_COMPONENTS.md` or `DESIGN_GUIDE.md`.

Link `spec/design-system/README.md` from the project's README or documentation
entry point. Add a short pointer in the applicable agent instruction file to
read this specification and reuse its values, components, and patterns before
UI work. Preserve unrelated instructions. If no entry point or agent instruction
file exists, create only the minimal relevant link or instruction. On later runs,
update these entries rather than adding competing specifications.

Source, setup, specification, and previews must work without this skill or chat.
Never import runtime code from a skill directory or require skill invocation.

## 7. Provide browsable documentation and working previews

Make the implemented design system inspectable through a project-owned docs app.
Author the canonical documents in `spec/design-system/` as Markdown; read them
directly instead of copying their content into web pages. The docs app presents
documentation and real components; it does not require a browser editor or a
server that writes files. Keep the Markdown usable without the viewer.

Use an existing documentation site or app stack when suitable. Otherwise adapt
the maintained [docs app starter](assets/docs-app/) into the target project,
for example at `docs/design-system/`, excluding dependencies and build output.
Its TypeScript implementation is a reference asset, not a required framework for
the app. Point `docs.config.ts` at the actual specification directory; for that
example location, `specDirectory` is `../../spec/design-system`. Do not leave a
generated project reading the starter's own specification or importing runtime
code from an installed skill. Link a native library's actual preview target;
a web imitation is not a working native component preview.

Set `appName` to the actual app name and display it as plain header text; omit a
generic docs title, decorative logo/icon, and starter/version badge. Keep headings
and functional control icons. Use a blurred top bar for Style Guide, Component
Library, and Pattern Library. These read `style-guide.md`, `component-library.md`, and
`pattern-library.md`; their second-level headings form the sidebar entries.
Keep category and subsection navigation linked, addressable, and keyboard usable.
Adapt sidebar access on narrow screens without obscuring content or losing focus.
Keep navigation visible without covering headings or focused controls. Provide a
readable opaque fallback when blur is unavailable or transparency is unsuitable.

Design the docs to match the actual app: consume its canonical color, typography,
spacing, shape, height, and surface values instead of preserving the starter's
appearance. Choose docs reading width and density for reference material while
maintaining that visual relationship. Verify text and focus contrast against the
blurred header's actual backgrounds; transparency alone is not a design system.

Register previews by stable ID in `previews.ts`, importing the actual library,
styles, and providers. Markdown preview blocks select those IDs; they must not
execute arbitrary Markdown code. Keep ordinary fenced examples readable and
make unknown preview IDs visible errors. Do not present copied lookalikes or
static screenshots as the implemented components. Include supported variants,
size profiles, reproducible states, and representative task compositions. Exercise
real hover, focus, press, and value changes; label any simulated visual state.
Use local data and safe handlers, and keep development fixtures out of product flows.

Launch the docs app, check its navigation and previews, and verify its production
build when available. Confirm that editing Markdown changes the viewer, source
downloads remain available, and build output includes the intended documents.
Record setup/build/opening steps in `spec/design-system/README.md`; provide the
actual URL/entry point, running status, and unverified behavior. Screenshots supplement it.

## 8. Verify the implemented system and hand off

Run relevant checks and changed interactions in the real runtime; add focused
checks for new logic using suitable facilities. Inspect consumers and previews.
Exercise the documented public interface in an existing consumer outside the
gallery when available; otherwise use a minimal development-only consumer or
integration check. Do not add a product screen to a system-only request for this.

Check task hierarchy, readable content, related-element spacing, long labels,
constrained layouts, enlarged text, applicable reading directions, and relevant
state combinations. Measure rendered control height, padding, borders, icon
bounds/gaps, target separation, content growth, contrast, and focus visibility
against the specification. A declared token is not evidence of rendered geometry.
Verify dropdown arrow placement and popup usability in the relevant conditions.

Use real keyboard and pointer input where supported. Check accessible names,
focus progression/return, value changes, disabled guards, busy/retry behavior,
and error recovery. Review Tab and Shift+Tab through the actual app, including
menus, scroll regions, route changes, and supported composite-control keys.
Check focus against each relevant surface and combined state for contrast,
shape, clipping, sticky-header occlusion, and enlarged-text/narrow-layout use;
also check supported forced-colors and reduced-motion modes. Keep static
inspection, modeled tests, browser/runtime measurements, assistive-technology
checks, and participant research distinct.
Do not infer user-tested usability or full accessibility from appearance or a
limited automated check.

### Run executable lint with explicit coverage

Lint execution is required during creation, repair, and design validation; merely
installing tools, writing a checklist, or running a build is not a lint run.
Use the bundled TypeScript [CSS source linter](scripts/design_lint.ts) and
[rendered web linter](scripts/rendered_lint.ts) for supported inputs. Copy their
package into project tooling and document repeatable commands/configuration in
`spec/design-system/README.md`; the read-only tools must work without this skill.
For native UI, CSS-in-JS, preprocessors, or design-file data, run an equivalent
tool or suitable adapter. If unavailable, state the exact unchecked scope and
block a clean validation claim; never silently skip it or report a CSS/DOM pass
for unsupported inputs. Keep the workflow framework-independent.

Configure the CSS adapter in `spec/design-system/lint.json`. Require `version: 1`,
explicit nonempty `include` and `token_files` CSS glob lists; token files must be
included. Optional keys are `exclude`, `external_tokens`, `allowed_values`,
`exceptions`, `duplicate_token_reviews`, and `tracked_files`. Declare the real
canonical token files, not every stylesheet, and scope the scan to maintained
project styles. Include every owned imported CSS file explicitly. The adapter
recognizes supported local imports already in that scope; external, uncovered,
or unsupported import forms and external tokens retain coverage warnings.
Import coverage does not prove cascade or runtime availability. Empty coverage
and malformed input must fail.

Use `allowed_values` only for intentional property-specific complete values.
An exception requires an exact file, property, complete value, and meaningful
reason. Do not suppress an entire directory or all warnings to make a report
green. `tracked_files` maps relevant source or lockfile paths to reviewed SHA-256
digests. Inspect drift and stale exceptions before updating their baselines.

Do not merge semantically independent tokens just because their values match.
After confirming an intentional duplicate, use `duplicate_token_reviews` with
the exact `value`, complete `tokens` list of `{ file, name }` pairs covering all
canonical definition files, and a `reason` explaining the distinct roles. A
changed value or group membership invalidates the review; stale reviews warn.
Responsive literal values have no alias dependencies. Differing dependency
sets across scopes still require runtime review and block strict source lint.

The tools require Node.js 22.17+ and the dependencies declared in the bundled
package manifest and lockfile. Keep both TypeScript sources, the manifest,
lockfile, and TypeScript configuration together, without copying installed
dependencies or generated build output. Install with the project's package
manager and run strict type checking before lint. For a copy at
`tools/design-lint/`, the package supports:

```sh
npm --prefix tools/design-lint ci
npm --prefix tools/design-lint run typecheck
npm --silent --prefix tools/design-lint run lint:source -- --root "$PWD" --config spec/design-system/lint.json --format json --strict
```

The source audit checks token references, unambiguous alias cycles, unmanaged
definitions, raw design values, potential duplicate values, and tracked-file
drift. It reports file/line/column, severity, coverage, and limitations. Exact-value
token suggestions are candidates requiring semantic review. Token existence
does not establish cascade or theme availability. Exit codes are `0` for no
blocking findings, `1` for rule errors or strict-mode warnings, and `2` for
configuration, parsing, or coverage failures. Dependency or runtime startup
failures also block the run and may occur before a structured report. Use strict mode for
required CI checks; do not interpret a non-strict warning-only exit as full pass.

Import `lintRenderedDesign` and its exported types from the copied TypeScript
module into the existing development preview or browser test harness. Use the
project's TypeScript build to produce browser-executable code; a browser does not
execute TypeScript source directly. After fonts settle and the caller
drives the intended viewport and real interaction state, pass `version: 1` and
nonempty `targets`. Each target names an actual `selector` and at least one of:
`minWidth`, `minHeight`, `expected` numeric CSS-pixel metrics, `states` booleans,
`contrastMinimum`, or `dropdown` with `labelSelector`, `arrowSelector`, and
`minimumGap`. Use values from the implemented specification, not universal sizes.
Record a `scenario` identifying the viewport/state being captured. Derive expected
values from reviewed specification/tokens, never faulty computed styles. For open
dropdowns, target popup/list and every option as well as the trigger: use `expected`
for documented padding, margins, row height, type, gaps, and borders to catch prose
CSS leakage. Add harness assertions for unsupported markers, balanced edge insets,
and viewport containment; do not invent config keys or claim automatic coverage.

For keyboard-focus changes, run source and rendered lint in the actual focused
states and supplement them with harness assertions and visual review for the
chosen indicator's applicable properties, shape, contrast, and clipping. Measure
border, outline, underline, or surface changes according to the implemented
contract; do not require an outline or reject a flush indicator just because it
has no external gap. `states.focused` only checks DOM focus; it does not validate
the indicator's appearance. The rendered
adapter does not currently accept outline or focus-ring configuration fields.

The DOM audit measures current bounds, configured padding/type/gap/border/radius
metrics, page overflow, declared states, supported text contrast, and logical
trailing dropdown placement in either reading direction. Check vertical arrow
alignment and supported vector artwork geometry as well as its wrapper; text
glyphs or unsupported artwork require visual review. It returns `pass`,
`review`, or `fail`, with measurements, diagnostics, coverage, and limitations.
Treat both `review` and `fail` as requiring action in a mandatory check. Missing
targets fail; hidden or unsupported samples never become clean passes. Contrast
requires uniform sRGB text and a resolved solid background; complex imagery,
overlays, wide-gamut colors, and unsupported effects need separate measurement.
Choose contrast criteria for each text role; this adapter does not classify
large text or apply accessibility exceptions automatically.

Run relevant sizes, states, directions, and constrained layouts in the actual
consumer, including docs prose around previews. Re-run source and rendered lint
after fixes and before handoff. Keep observed state separate from interaction
proof. Store transient reports by project convention, outside the skill package.
A clean report covers only configured inputs/rules, not complete visual quality,
usability, accessibility, or freedom from design bugs.

Fix failures in the shared source and repeat affected checks. Confirm that the
specification matches actual values and APIs, documented usage runs, preview
opening steps work, and no skill-file dependency remains. Record genuine
implementation limitations in the relevant specification; report checks actually
performed and unverified behavior in the handoff. Do not generate a separate
historical validation report as part of the design system.

Finish with the implemented/updated system, links to `spec/design-system/`, the
library's public access path, how to open the preview, checks performed, and any
remaining limitations. Do not install skills or publish a project unless the
user's request includes that work.

## Skill distribution boundary

Keep this skill package limited to its instructions, invocation metadata,
maintained TypeScript lint tools, and the reusable `assets/docs-app/` starter with
its own working specification and preview library. Include their required package
configuration and lockfiles. This starter is an intentional maintained asset;
unrelated sample apps, generated project specifications, evaluation cases,
fixtures, screenshots, recordings, and validation reports remain excluded.
Run skill evaluations in temporary workspaces outside it. This publishing rule
does not remove the target project's real component library, specification,
development preview, or appropriate tests; follow that project's conventions.
