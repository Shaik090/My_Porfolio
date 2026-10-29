# BillSahi screenshot gallery

The actual BillSahi dashboard screenshot and project overview are the default experience. The optional gallery opens in a centered modal popup without expanding the Projects section. Cafe Flex subsequently received its own actual app screenshot in the verified portfolio refinement.

## Selected screenshots

Dashboard (171922), Inventory (172013), Retail POS (172138), Purchase History (172424), Product Reports (172755). These show five distinct workflows. Similar sales/purchase forms and histories were omitted; customer/staff screens with additional contact details were also omitted.

Final assets: `public/images/projects/billsahi/{dashboard,inventory,retail-pos,purchase-history,product-reports}.webp`, with matching `-thumb.webp` files. Metadata lives in `src/data/billsahi-screenshots.ts`.

All full-size assets preserve source dimensions. Source files in the user's Screenshots folder are untouched. Only the lower-right system overlay and lower-left account email area are cleaned/redacted. Full-resolution lossless WebP exports retain source pixels outside those regions. Original files containing the email are not copied into public assets.

## Image cleanup

Built-in image generation/editing tool mode was used; no API/CLI fallback. Generated full-screen reinterpretations are not presented as screenshots. The original pixels and narrowly bounded cleanup masks preserve the actual UI. Flat background matching avoids resampling seams around the removed system overlay; the account email receives an explicit neutral redaction bar.

Final prompt for Product Reports:

> Edit target: the supplied actual BillSahi application screenshot. This is a precise cleanup, NOT a redesign. Remove ONLY the gray 'Activate Windows / Go to Settings to activate Windows.' system watermark at bottom right, restoring the plain pale background underneath. Redact ONLY the account email in the bottom-left account pill with a short neutral solid bar. Preserve exact original framing, aspect ratio, all UI layout, typography, icons, labels, prices, figures, data, colors, and every other pixel as closely as possible. Do not generate or invent any features, replace text, crop, or resize. Output the cleaned screenshot as a local image asset.

Final prompt for the other four images (one edit per input):

> Precisely clean this actual application screenshot, do not redesign it. Remove ONLY bottom-right gray Activate Windows / Go to Settings to activate Windows system watermark, reconstructing underlying background and preserving any application content. Redact ONLY the account email in the bottom-left account pill with a short neutral solid bar. Every other UI element, text, figure, price, icon, color, layout and framing must remain identical to input. No invented interface, no cropping, no restyling. Save cleaned image asset.

## Interaction

No screenshot images are mounted/requested while collapsed. The gallery uses a native modal dialog, a subtle entrance animation, and reduced-motion support. Closing unmounts its images and controls. Thumbnail navigation scrolls only its own strip. The native modal includes arrow keys, explicit Tab cycling, Escape, a close button, backdrop dismissal, focus restoration, and background scroll locking. No autoplay, scroll hijacking, or new carousel dependency.

Desktop remains marked under development; the screenshots are labeled as the existing web application. This work does not deploy the portfolio.

## Verification

TypeScript, ESLint, and the final Next.js production build passed. Chromium checks against the production server covered: no screenshot requests while collapsed, repeated expand/collapse, next/previous navigation and wrapping, thumbnails, large-image loading, keyboard arrows/Tab/Escape, restored focus and scrolling, unchanged Cafe Flex text, 1440/820/390/320 viewport widths, reduced motion, and no page/console/hydration errors. The measured layout-shift sum during this browser run was 0. Desktop and mobile screenshots were visually inspected. These are local Chromium checks, not physical-device or deployed-site tests. The temporary test server was stopped afterward.

The popup supports background scroll locking, backdrop dismissal, Escape, focus cycling and focus return. The larger screenshot viewer is nested and closes independently, leaving the gallery popup open.

Popup update verified against the final production build: pointer click opens without changing project height or document scroll position; close/Escape/focus cycling, repeat opening, independent nested viewer closing, mobile layout, and reduced motion passed. The temporary production server was stopped after testing.
