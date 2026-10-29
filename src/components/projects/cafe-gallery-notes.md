# Cafe Flex screenshot update

Five user-supplied captures are used: Quick Sale (191806), Current Sale (192717), Menu & Item Management (192648), Sales History (192623), and Business Dashboard (193200).

Final full-size assets and matching `-thumb.webp` files are in `public/images/projects/cafe-flex/`: `quick-sale.webp`, `current-sale.webp`, `menu-management.webp`, `sales-history.webp`, and `dashboard-new.webp`. The supplied screenshots remain unchanged in the user's CafeFlex screenshots folder. Metadata is in `src/data/cafe-flex-screenshots.ts`.

## Image cleanup

Built-in image editing mode was used for one transparent background extraction per supplied file. No API/CLI fallback. To preserve actual product evidence, only the cleaned alpha silhouette is transferred to the original capture: generated app pixels are discarded. The original RGB data, prices, dates, labels, icons and layout are retained. A pixel comparison verifies no RGB changes in the retained original image. The last image's bottom IDE toolbar is excluded below the complete phone. Transparent cutouts are exported losslessly, with small optimized thumbnails.

Final prompt set (same request, one call for each of the five inputs):

> Precise background extraction edit of a real Cafe Flex Android screenshot. Remove ONLY the desktop/IDE background and stray text outside the phone silhouette, including the bottom IDE toolbar. Keep the complete phone display and black/red device frame. Preserve every actual application pixel, text, label, price, date, number, icon, layout and status/navigation bar. No UI redesign or invented data. Make the exterior genuinely transparent. Keep the phone in exactly the same position and scale as the original canvas; do not add shadows or extra padding. Output a clean transparent phone cutout.

## Presentation

The existing Cafe Flex project card opens a popup with one full screenshot at a time, previous/next controls, counter, thumbnails and a full-size image link. Keyboard arrows navigate; Escape closes; Tab stays in the popup; focus and background scrolling return on close. Thumbnails scroll only their own strip. Images outside the card teaser are mounted only when the popup is opened. No autoplay or screenshot expansion below the projects.

BillSahi, contact settings, project descriptions and education are unchanged by this update.

## Verification

TypeScript, ESLint and the final production build passed. Browser checks against production covered all five full-size images, selected thumbnails, next/previous wrapping, keyboard arrows, Escape/close/reopen, Tab focus containment, focus restoration, background scroll locking, unchanged project-section height, 1440/820/390/320 viewport widths and reduced motion. No page runtime errors were observed. Edited assets and desktop/mobile gallery screenshots were visually inspected. The temporary test servers were stopped. These checks are local Chromium checks, not physical-device or deployed-site verification.
