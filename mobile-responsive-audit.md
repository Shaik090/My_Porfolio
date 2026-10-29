# Mobile responsiveness audit

Local audit completed on 29 October 2026. This update refines the existing portfolio and preserves its approved desktop composition, content, project status and EmailJS configuration.

Follow-up refinements: the phone portrait now appears above the introduction, and the initially static technology strip has been replaced with compact orbiting skill badges at the owner's request. Decorative mobile parallax remains disabled; the orbit pauses offscreen and respects reduced motion. The measurements below describe the original audit.

The current hero is the portrait/orbit implementation, not the unmounted Three.js experiment. BillSahi retains the latest approved popup with five selected screenshots; the older eleven-screen expandable specification was not reintroduced.

## Findings and changes

| Actual issue | Improvement |
| --- | --- |
| Mobile/tablet header was 79px high; the resume competed with navigation | 69px header with a 44px menu control; resume moved into the mobile menu |
| Small 32px social controls and 36–40px menu controls | 44px minimum controls; project disclosure rows also have 44px targets |
| Two narrow project cards at 600px; project descriptions were 11–12px | Single column through 900px, 15px descriptions and readable badges |
| Mobile form fields used 13px text | 16px fields, clear labels, stacked phone layout and compact submit button |
| Hero panels and moving orbit competed with the portrait on small screens | Intentional phone stack, quieter tablet composition, static technology strip and smaller portrait area |
| Mobile loaded the original PNG portrait assets | Same approved portraits resized and encoded as WebP; originals retained for desktop |
| Desktop-sized motion included parallax and layered text animation | Mobile uses a 14px/440ms reveal, shorter stagger, simple name entrance and no decorative parallax or continuous hero orbit |
| A technology badge's independent CSS translate clipped it after the orbit became a row | Reset independent translate and verify all four badges stay inside their container |
| BillSahi card image sizes still assumed two columns at small-tablet widths | Corrected image sizing for the new single-column layout |
| Web screenshots fit a phone but their details remained too small | Mobile/tablet larger viewer can show the full-resolution image in a contained, scrollable pane with fit-to-screen reset and pinch zoom permitted |
| A newly selected Cafe Flex image could briefly leave an empty preview | Accessible loading state; BillSahi loading state also follows zoom resolution changes |

The mobile menu retains Escape handling, focus wrapping, inert closed links, active section tracking, scroll locking and header-aware anchors. A backdrop closes it without navigating. Thumbnail strips and enlarged screenshots scroll independently of the page. Education keeps its progress timeline with reduced indentation and vertical mobile entrances. Certificate cards retain their eye buttons and original PDF links.

## Portrait asset measurements

| Assets | Combined file bytes |
| --- | ---: |
| Original hero and about PNG files | 3,074,125 |
| Mobile hero and about WebP derivatives | 139,274 |

This is a 95.5% reduction in those two asset files. Resource checks confirmed that tested mobile/tablet pages requested the WebP versions rather than the original PNGs. This is an asset-size measurement, not a claim about real-device LCP or download speed. No facial features, pose or styling were regenerated for this update.

## Browser verification

Tests ran against the local production server in Chromium, with touch emulation at mobile/tablet widths.

| Width | Header height | Project columns | Result |
| ---: | ---: | ---: | --- |
| 320px | 69px | 1 | Passed |
| 360px | 69px | 1 | Passed |
| 390px | 69px | 1 | Passed |
| 430px | 69px | 1 | Passed |
| 600px | 69px | 1 | Passed |
| 768px | 69px | 1 | Passed |
| 1024px | 69px | 2 | Passed |
| 1440px | 83px | 2 | Passed |

Checks covered:

- No horizontal document overflow at initial load, every section, popups or enlarged screenshot zoom; no clipped headings or hero technology badges.
- Menu open/close, backdrop dismissal, Escape, full Tab/Shift+Tab loop, hidden-link inertness and resume download.
- Every navigation anchor, sticky-header clearance, active state after clicks and active state after manual scrolling.
- BillSahi popup selection, counter changes, arrow keys, larger viewer, zoom/pan, fit reset, independent nested Escape handling, focus return and document scroll restoration.
- Cafe Flex popup, selection, arrow keys, image loading and focus return.
- Both certificate previews, loaded images, original PDF responses and focus restoration.
- Contact submission at every width using intercepted EmailJS requests; a separate check covered invalid input, the exact four template parameters, pending state, success reset, failure preservation and retry.
- Reduced-motion visibility and disabled name animation, plus scrollable navigation at 600×360 landscape.
- No page runtime exceptions or failed local resource responses during the viewport checks.

Static desktop comparison used reduced motion to remove animation timing differences. Before/after captures had the same 1440×4828 dimensions. Outside Next.js's development indicator, the maximum color-channel difference was 1/255; the production server does not show that development indicator.

## Code and documentation

- `src/app/responsive.css`: centralized phone/tablet layout and motion overrides, loaded by `src/app/layout.tsx`.
- `src/components/Portfolio.tsx`: mobile navigation, backdrop, resume placement, responsive project image sizing and corrected GitHub accessible label.
- `src/components/PortfolioMotion.tsx`: compact-screen motion intensity and reveal staggering.
- `src/components/projects/BillSahiGallery.tsx`: contained mobile zoom, resolution-aware loading state and popup arrow navigation.
- `src/components/projects/ProjectScreenshotPreview.tsx`: screenshot loading status.
- `public/images/nowman-hero-mobile.webp` and `public/images/nowman-about-mobile.webp`: optimized derivatives.
- `README.md`: editing guide and responsive behavior notes.

`npm run typecheck`, `npm run lint` and `npm run build` passed. The production build reported 79.1kB for the page and 182kB first-load JavaScript. No styling framework or runtime dependency was added.

## Verification limits

These are local browser-emulation results. Physical Android/iPhone testing, Safari behavior, field Web Vitals and sustained frame rate on a midrange phone remain unverified. No active WebGL canvas was found in the mounted portfolio. The mobile hero keeps the approved portrait and simplifies its existing effects.

No real EmailJS message was sent. Provider delivery, inbox receipt, auto-reply configuration and deployed-site behavior still require a controlled live check. No Hostinger deployment or DNS change was made by this audit.
