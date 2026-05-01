# darkdictator.com

A personal CRT-terminal-aesthetic site dressed as a fictional dystopian state network. The
in-universe voice is cold, clinical, bureaucratic — Orwell crossed with RoboCop.
References to *1984*, *Equilibrium*, *Gattaca*, *Minority Report*, *RoboCop*,
*Demolition Man*, *Fahrenheit 451*, *THX 1138*, *The Running Man* are seeded throughout
the copy without ever being named. The horror lives in what isn't said.

This is **Daniel's site**, served at `darkdictator.com` via Laragon (Apache vhost
in `e:/vlaragon/etc/apache2/sites-enabled/darkdictator.conf` pointing at `dist/`).

---

## Tech stack

- **React 19** + **Vite 8** — that's it. No router, no CSS-in-JS, no state management
  library, no UI kit. Plain CSS in `src/App.css`.
- **Web Audio API** for all sound effects — synthesised at runtime, no audio assets shipped.
- **Google Fonts** for the VT323 pixel font, loaded via `<link>` in `index.html`.

The project was originally Daniel's first React project (he came from PHP / Eleventy /
Bootstrap). Keep that in mind: explanations should be accessible, and the codebase
intentionally avoids advanced React patterns (no context, no reducers, no custom hooks
beyond what's already there).

---

## File map

```
darkdictator.com/
├── src/
│   ├── App.jsx           ← logic: routing, key handlers, audio, easter egg, components
│   ├── App.css           ← all visual styling (CRT effects, layout, animations)
│   ├── content.js        ← every word the user sees. Edit text HERE, not in App.jsx
│   └── main.jsx          ← entry point: imports App.css and mounts App
├── public/
│   └── favicon.svg       ← placeholder S+ from the original slum project (TODO: redesign)
├── _reference/           ← archived original Soviet-themed sources from the slum lineage
│   ├── slum-plus-soviet.jsx     ← original Claude Web JSX file (renders via Babel Standalone)
│   ├── slum.html                ← standalone reference build (open in browser directly)
│   └── grok.html                ← alternate reference from earlier exploration
├── darkdictator-content.md           ← content brief for the 5 main pages
├── darkdictator-secret-404-403.md    ← content brief for secret page + 404/403
├── index.html            ← Google Fonts (VT323) preconnect + stylesheet
├── package.json
├── vite.config.js        ← Vite default config — outputs to dist/
├── eslint.config.js
└── dist/                 ← build output, served by Apache
```

---

## Editing rules

| What you want to change | File to touch |
|---|---|
| Any text the user sees | `src/content.js` — never hardcode strings in App.jsx |
| Visual styling, colors, animations, layout | `src/App.css` |
| Component behavior, interactions, navigation logic | `src/App.jsx` |
| Add a new sound effect | Top of `src/App.jsx`, next to existing `playClick` / `playClank` / `playBoot` / `playDeny` / `playAlert` |
| Theme palette | `:root` CSS variables at the top of `App.css` (`--green-bright`, `--red-dim`, etc.) — change variable values, never the individual rules that consume them |
| Add a new section / page | Add to `SECTIONS` array in `content.js`, add a content object (e.g. `NEWPAGE_PAGE`), add a renderer component in `App.jsx` to `CONTENT_MAP` |

**The single most important convention**: text and code are separated. If you're touching
copy, you should be in `content.js` exclusively. If `App.jsx` shows up in a copy-edit
diff, something went wrong.

---

## The 5 pages

Driven by the `SECTIONS` array in `content.js`. Each has a content object also in
`content.js` (`SYSTEM_PAGE`, `DIRECTIVES_PAGE`, etc.) and a generic React renderer in
`App.jsx` that loops over the data.

1. **SYSTEM** — status feed + welcome. Random rotating top-line phrase from `STATUS_PHRASES`.
2. **DIRECTIVES** — list of state orders, each with id / effective-date / body / status.
   One is `bodyRedacted: true` which renders solid block characters.
3. **RECORDS** — citizen database fragments. Movie character cameos.
4. **TRANSMISSIONS** — intercepted comms. Each entry has `lines` of `[voice, text]` pairs.
5. **COMPLIANCE** — interactive form. Submit triggers a fake confirmation with a
   cascading "at this time." faded-repetition glitch (CSS classes `.fade-step-1` /
   `.fade-step-2`).

---

## Easter egg

Type **`OBEY`** or **`1984`** anywhere on the page → red intrusion overlay with leaked
classified content. ESC closes it (the in-universe label says "[DISABLED]" but the key
actually works — practical exit beats lore consistency).

- Triggers live in the `SECRET_TRIGGERS` array in `content.js`. Add more triggers by
  appending strings to that array.
- Detection logic is a rolling keyboard buffer in `App.jsx` (`useEffect` with the
  `secretHandler`). It captures every printable keypress, uppercases, keeps the last N
  chars, checks if the buffer ends with any trigger.
- Activates `red-mode` class on `.crt-container` — see `App.css` for how that retints the
  scanlines, vignette, scrollbar, and rolling band to red.

---

## CRT effect stack

All in `App.css`. Layered top-to-bottom in z-order:

| Layer | Selector | Effect |
|---|---|---|
| Bezel housing | `.crt-housing` | Dark grey/blue plastic gradient + SVG `feTurbulence` grain noise |
| Screen frame | `.crt-screen-frame` | Black inset recess, `transform: perspective(1800px) rotateX(2.2deg)` for 3D tilt |
| Glass reflection | `.crt-screen-frame::after` | Top-half white gradient with `mix-blend-mode: screen` |
| Scanlines | `.crt-container::before` | Dark horizontal stripes with subtle green tint |
| Vignette | `.crt-container::after` | Asymmetric ellipse — darker top/bottom (mimics tube bulge) |
| Rolling scan band | `.crt-roll` | 8s `top: -25% → 110%` animation |
| RGB shadow mask | `.crt-mask` | 3px×3px R/G/B subpixel pattern, `mix-blend-mode: multiply` |
| Animated noise | `.crt-noise` | `feTurbulence` SVG, screen blend, slowly shifting position |
| Phosphor bloom | `.phosphor-trail` text-shadow | 4 layers of green glow at increasing radius |
| Chromatic aberration | text-shadow + `drop-shadow` filter | Red/cyan offset fringes on text |
| Cursor | `.crt-container { cursor: url(...) }` | Custom inline-SVG green pixel arrow + block pointer |

The earlier WebGL barrel-distortion experiment was abandoned — `feDisplacementMap`
gives jaggy output (no bilinear filtering) and a true radial barrel needs a precomputed
displacement map. The CSS-trick stack (perspective + border-radius + asymmetric vignette)
is what shipped.

---

## Mobile vs desktop

Breakpoint: `600px`.

- **Desktop (>600px)**: bezel housing wraps the screen, fixed 4:3 aspect ratio,
  `.content-area` scrolls internally with custom green scrollbar (top-bar, nav, footer
  stay locked).
- **Mobile (≤600px)**: bezel collapses entirely (naked terminal), normal page scroll,
  fixed bottom button bar (`◄ ENTER ►`) replaces keyboard navigation. CRT effects
  (mask, aberration, bloom) extended to the mobile button bar via `.mobile-controls::after`
  pseudo-element.

The mobile media query in `App.css` is one big block at the bottom that overrides whatever
the desktop styles set. If something is "too big on mobile" or "missing on mobile", look
there first.

---

## Build & deploy

```bash
npm run dev        # Vite dev server on port 5173
npm run build      # outputs to dist/
npm run preview    # local preview of built dist/
```

Apache vhost (`darkdictator.conf`) serves `dist/` directly — no SSR, no Node on the
server, just static files. After `npm run build`, refresh `darkdictator.com` and the new
build is live (because Apache reads from the rebuilt `dist/` folder).

---

## Outstanding ideas (not yet built)

- **Favicon redesign** — the placeholder `S+` is left over from the slum project.
  Daniel marked this as "circle back later".
- **404 + 403 pages** — content already drafted in
  `darkdictator-secret-404-403.md`. Implementation needs React Router (currently single-page,
  no routing) or Apache `RewriteRule`s to point unknown URLs back at the SPA with a query
  param. Both pages should use an **amber-tinted variant** of red mode (per Daniel) — neither
  green-CRT-normal nor full red-alert, somewhere in between to feel "system error" not
  "intruder detected".
- **Dim-text readability fix** — `var(--green-dim)` set to `#1a9a1a` (was darker, brightened
  to compensate for the multiply-blend mask). Some small dim text (status badges, secondary
  labels) is still hard to read with the full CRT stack on top. Daniel accepted this for now.
- **True WebGL barrel distortion** — explored, decided against. The cost (DOM-to-texture
  pipeline, expensive shader, jaggy text) outweighs the benefit (extra ~10% bulge).

---

## Conventions worth knowing

- **Indentation: tabs.** Not spaces. The whole file uses tabs throughout. Match it.
- **Inline SVG everywhere.** Cursors, mask pattern, noise pattern, plastic grain — all
  written as `data:image/svg+xml;utf8,...` URL-encoded strings in `App.css`. No SVG
  asset files shipped.
- **CSS variables drive theme.** `--green-bright`, `--green`, `--green-mid`, `--green-dim`,
  `--green-dark`, `--bg`, `--glow`, `--red`, `--red-dim`, `--red-glow`. Change palette by
  changing variable values; never modify the individual rules that consume them.
- **Components are pure renderers.** Section components in `App.jsx` loop over data
  from `content.js`. Never hardcode strings in JSX. If you need a new piece of text,
  add a key to `content.js` first, then read it from there.
- **Audio on first interaction only.** Browsers block audio until the user clicks. The
  boot sequence's first `playClick` won't fire until the user clicks somewhere — this is
  expected, not a bug.
- **No git remote.** Daniel keeps personal projects local-only. Don't try to push.

---

## Reference / lineage

This project started as the **slum** project at `e:/www/sub/slum/` — a Soviet-themed
"SLUM+ Cultural Terminal" originally generated by Claude Web. The lineage:

1. Original generation: `_reference/slum-plus-soviet.jsx` — a single 760-line JSX file
   from Claude Web with all CSS inline, all content hardcoded, audio engine, boot
   sequence, intrusion easter egg.
2. Ported to Vite: scaffolded a React project, wrapped in CRT bezel, added scanlines,
   bloom, aberration, mask, scrollbar styling, mobile breakpoint, clickable LED reset
   button.
3. Refactored + reskinned (this project): CSS extracted to `App.css`, content extracted
   to `content.js`, Soviet copy replaced with Dark Dictator copy from
   `darkdictator-content.md`.

If you're confused about why a particular CSS rule or animation exists, the slum HTML
in `_reference/` is the cleanest standalone version to compare against.

The two `darkdictator-*.md` content briefs in the project root are the source documents
for the copy. They include movie reference annotations (which lines reference which film)
that are useful when expanding the content.
