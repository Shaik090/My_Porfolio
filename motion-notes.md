# Portfolio motion system

This change preserves the current portfolio layout, typography, imagery, project content and resume.

## Implementation

- `src/components/PortfolioMotion.tsx`: shared timing tokens, one viewport observer for once-only reveals, progressive education timeline, and Motion scroll progress. Content is visible before enhancement, without JavaScript, during printing, and immediately with reduced motion.
- `src/components/motion-features.ts`: asynchronously loaded Motion layout features. CSS handles ordinary hover/focus interactions and viewport reveals.
- `src/app/motion.css`: all motion refinements, reduced-motion overrides, desktop pointer gating, mobile distances, staggered menu and hero entrance. No global will-change, particle engine, artificial scrolling, magnetic effects, or pointer-following listeners.
- `Header` in `Portfolio.tsx`: transform-based independent hover underlines plus a shared Motion active indicator, cached section offsets, requestAnimationFrame scheduling, 10px boundary hysteresis, passive listeners, ResizeObserver updates and cleanup. React state changes only when active section or the 50px sticky threshold changes. Native anchors preserve hashes/history and use the measured sticky-header offset.
- Mobile navigation: reversible CSS reveal, 60ms item stagger, transformed menu glyph, inert hidden links, focus cycling, Escape/focus return, scroll locking, and stable scrollbar space.
- Project details retain native details/summary behavior, keyboard activation, and touch support. Entry fades in; closing fades out before the native disclosure closes. Repeated activation cancels the pending close. Reordering uses layout transforms, with reduced-motion bypass.
- `eslint.config.mjs`: restores the missing ESLint 9 configuration using existing Next.js presets.

## Local verification

- TypeScript: passed.
- ESLint: passed with zero warnings.
- Production build: passed, statically prerendered home page, 166 kB reported first-load JS. Motion adds to the previous bundle; no unrelated dependency upgrades were made.
- Browser QA against production: desktop anchor targets and sticky offsets; independent active/hover underlines; scroll-spy; hash deep links and back navigation; scroll progress; timeline progress; project reordering; native keyboard disclosures.
- Navigation at 1050, 820, 390 and 320px: focus cycle, Escape, focus return, scroll lock/release, selection, inert closed links and no horizontal overflow.
- Touch emulation: menu navigation and project disclosure passed.
- Reduced-motion emulation: visible content, no ambient animation, nonanimated native scrolling, functioning active state and navigation.
- Browser runtime: no hydration errors, console warnings or JavaScript errors in production. Motion's expected reduced-motion notice appears in development only.
- Desktop CLS sample: approximately 0.0005.
- Local 1.8-second scroll sample: 105 frame intervals, p95 about 17ms, zero long tasks. This is headless Chromium evidence, not a Lighthouse score or physical-device performance guarantee.
- Visual screenshots reviewed locally for hover/active navigation and the unchanged layout.

Physical phone/tablet testing, Safari/Firefox testing, and deployed-site performance testing were not performed.

## References consulted

- https://motion.dev/docs/react-layout-animations
- https://motion.dev/docs/react-use-scroll
- https://motion.dev/docs/react-accessibility


## Scroll-driven refinement

The next iteration reuses the same observer, navigation and motion module. Hero text, project copy, category labels and actions remain stationary in document flow.

- Hero: an independent, spring-smoothed visual layer translates upward by at most 28px, scales down by at most 3.5%, and fades by at most 40% across the hero's scroll range. A separate low-opacity glow moves at a different rate. The existing entrance animation remains on the parent layer.
- Projects: only the artwork layer translates by +/-7px, with at most 1.8% scale change; a separate background glow moves by +/-9px. Existing once-only card reveals now sequence title, description, masked mockup (30px / 0.96 scale on desktop), badges at 70ms intervals, and the action. CSS handles the entrances; Motion values handle continuous transforms.
- Mobile and coarse pointers: parallax intensity drops to 35%; mockup entry distance drops to 16px with 0.98 starting scale.
- Education: one continuous Motion value draws the line from 0 to 1 between the timeline reaching 75% of the viewport and its end reaching 65%. This replaces the old observer-driven steps and fixed-duration line transition. The current milestone updates only at threshold crossings.
- Page progress: a damped spring smooths the existing scaleX indicator, with 0 and 1 endpoints.
- Reduced motion: parallax and fading are disabled, reveals are immediately visible and the full education line is shown. A stable server snapshot avoids a reduced-motion hydration mismatch; CSS enforces the preference before hydration.

Targeted browser tests sampled timeline progress at 0/25/50/75/100%, verified spring progress endpoints, compared desktop/mobile hero movement, checked that project text document coordinates remain fixed, and rechecked overflow and reduced motion. Existing navigation, keyboard and touch QA is retained.

Scroll-driven production verification: TypeScript, ESLint and production build passed (168 kB first-load JS). Both navigation/accessibility and dedicated scroll tests passed against the production server. Timeline samples were approximately 0, 0.253, 0.505, 0.753 and 1. Both progress-bar endpoints passed; reduced-motion hydration, touch interaction, stable project text and four responsive widths passed. Measured CLS was below 0.001 in these local samples. Settled desktop and mobile screenshots were visually reviewed. No new package was required. Physical-device and cross-browser validation remain unperformed.


## Hero 3D refinement

The hero visual now has an inner CSS 3D scene, separate from the scroll and entrance layers. Pointer input on desktop uses Motion values and damped springs: maximum 4-degree horizontal / 3-degree vertical tilt. Pointer exit/cancel returns the scene to neutral. Bounds are measured on pointer entry rather than every pointer event; pointer movement does not update React state or add global listeners. Portrait, orbit, code panel and fact card occupy separate depth planes. Low-opacity orbit/floor rings and a soft sheen reinforce depth. No WebGL library, new dependency or portrait edit was added.

Mobile/coarse-pointer and reduced-motion modes flatten the scene and disable pointer tilt/rings. Existing scroll transformations are retained independently. Browser checks passed for desktop tilt/reset, reduced motion, fresh mobile rendering and existing scroll behavior, with no horizontal overflow or unexpected console/runtime errors. Portrait assets remain unchanged. TypeScript and ESLint passed.

Hero idle-motion correction: the earlier pointer-only effect looked static without mouse input and was disabled on touch devices. Added an automatic 10-second 3D drift rig and an independently rotating six-face emerald cube, with a lighter 12-second mobile drift. Intersection visibility pauses the rig/cube offscreen. Reduced motion and print disable the automatic animation. Tested that computed cube transforms change without pointer input, the rig pauses offscreen, mobile renders correctly without overflow, and reduced motion disables motion. Portrait pixels and all text remain unchanged.


## Letter, skill-orbit and button refinement

Replaced the decorative cube with four named technology badges: Next.js, React, TypeScript and MongoDB, reflecting the portfolio's web application stack. Badges orbit over 28 seconds, with matching counter-rotation to keep names upright. The existing visibility gate pauses both orbit layers offscreen. Reduced motion shows four stationary badges. Mobile uses a smaller orbit to contain labels within the portrait area.

The hero name now uses a staggered 3D letter entrance (32ms stagger, 650ms ease-out). The heading retains the full accessible name, with decorative per-letter spans hidden from assistive technology. Reduced-motion and print render the letters immediately.

Button-styled links, native buttons, project disclosures and contact actions have consistent press/focus feedback. Desktop primary buttons gain a one-pass light sweep, arrow controls move directionally, and contact/disclosure controls receive restrained emphasis. Native semantics, focus outlines and touch activation remain intact. Hover gradients retain contrast throughout the transition.

Local checks passed for accessible heading, 19 animated letters, four orbit badges, absence of the cube, changing orbit transforms, button sheen, mobile overflow, reduced motion, navigation, focus trapping, touch and project disclosures. No portrait, project content or resume changes were made.

Latest active hero: restored the portrait composition at the user request. Replaced letter bounce with a whole-word holographic assembly entrance, a continuously repeating emerald spectral scan, and a restrained traced edge on Nowman. The cursor-responsive lighting reuses the existing pointer springs, with no new global pointer listeners. Name text remains stationary after its entrance, accessible as one heading, and the continuous scan pauses offscreen. Skill orbit, designation and shared button interactions remain. Reduced motion disables the assembly, scan and reactive-light movement. The unused workspace experiment is retained in its separate component folder but is not imported or loaded by the current portfolio.

Holographic-hero validation: targeted Chromium checks confirmed a single accessible name heading, continuous changes in the spectral scan without refresh, no remaining bounce spans, responsive wrapping at 390px/320px, and disabled scans under reduced motion. Added a scheduled scroll-spy refresh after the navigation lock expires as a fallback for interrupted native scrolling. Regression tests now wait for native anchor scroll completion before switching to scripted/manual scroll or touch activation.

Final restored-hero production pass: build and lint/type validation passed at 169 kB first-load JS. The targeted holographic test and the corrected full navigation/keyboard/touch/reduced-motion regression suite passed against the production server, without hydration errors or unexpected browser warnings. Physical-device and cross-browser testing remain unperformed.
