# Verified portfolio refinements

## Hero and footer

Hero text now has one DOM copy. AnimatedName uses the actual text nodes as its accessible name; the gradient animates the glyph fill without generated content. AnimatedWords no longer renders a separate visually hidden duplicate. Footer section navigation was removed; header navigation and footer branding remain.

## Project evidence

BillSahi's card uses the previously supplied actual dashboard, and the selected screenshot popup remains available. Cafe Flex's lossless dashboard asset is sourced from `E:/Business Project/cafe-flex-pos-v0.3/vm-dashboard.png`, visually checked for contact information, and can be opened in a full-size dialog. Source screenshot is unchanged.

BillSahi source verification: `E:/Major Project/HisabDesk/hisabdesk/src/models/Product.ts` defines compound userId indexes for name, category, stock and SKU; `Sale.ts` defines userId/date and a unique userId/invoiceNumber index. Portfolio copy describes schema definitions rather than production index installation or benchmark results.

Cafe Flex source verification: `E:/Business Project/cafe-flex-pos-v0.3/src/services/localNetworkService.ts` imports react-native-tcp-socket, frames messages, sends heartbeats, schedules capped exponential reconnect backoff, persists pending commands and flushes after reconnecting. This is source verification, not a new installed-device or measured network performance test. No latency, user-count or performance numbers were invented. Older README statements about networking are superseded by the current service implementation for this description.

Public GitHub repository listing checked via `https://api.github.com/users/Shaik090/repos?per_page=100` on 2026-10-28. No public project repositories were verified for BillSahi/Cafe Flex; local BillSahi remotes alone are not proof of public access. Direct BillSahi deployment GET timed out. Neither repository links nor a live-demo claim were invented. User-provided public repository URLs or release assets can be added when available.

## Skills and privacy

Functional testing is retained. The learning-qualified regression entry was removed rather than relabeled as unverified unit/integration testing. OpenAI Codex skill label is replaced with AI-assisted development. No new testing tools or LLM API integration claim is added.

Contact now uses the user's supplied LinkedIn URL and existing email, replacing the public phone number. The downloadable one-page PDF is regenerated from the existing source with the same contact and wording updates. There is no pretend contact form without a configured delivery service. Education dates are unchanged and private personal context is not published.

## Validation

The final clean production build passed with Next.js type/lint validation. Chromium checks against the production server verified one hero name and tagline DOM copy, a unique accessible h1 name, no generated duplicate name text, actual project images loading, Cafe Flex full-size modal and BillSahi gallery opening/closing, focus return, removed footer navigation and public phone link, correct supplied LinkedIn link, supported skill labels, 1440/820/390/320 viewports and reduced motion, with no page runtime errors. The resume was rendered and visually inspected; selectable text, one-page layout, clickable LinkedIn, absence of phone and learning-qualified wording were checked. Project apps themselves, physical devices, live business network performance and production delivery were not retested. No deployment was performed. Temporary portfolio servers were stopped.
