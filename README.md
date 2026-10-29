# Nowman - Developer Portfolio

Personal Next.js portfolio for Shaik Mohammad Nowman. Intended production domain: **https://nowman.site**.

The site uses a dark emerald/teal theme, a portrait hero with orbiting skill badges, responsive navigation, animated education milestones, actual project screenshots, a downloadable resume, and an EmailJS contact form.

## Stack

- Next.js 15 App Router, React 19, TypeScript
- Motion for React and CSS animations
- Lucide icons and Next.js Image
- EmailJS browser REST integration

Use Node.js 22 and npm for local work and the Hostinger runtime. `package-lock.json` records the resolved dependency versions.

## Local setup

```powershell
npm ci
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Open http://localhost:3000. Fill the three EmailJS values in `.env.local` to enable sending. Retain existing configuration if that file is already present.

## Production checks

```powershell
npm run typecheck
npm run lint
npm run build
npm run start
```

Stop development servers using this checkout before building: concurrent development and production builds share `.next` and can conflict. Use `npm run start` after a successful build; `npm run dev` is for development.

## Deploy to Hostinger

This checkout needs **Node.js hosting**, including Next.js Image optimization. It is not configured as a static export; copying the project into `public_html` is insufficient.

Confirm that your plan offers **Node.js Web Apps**. Hostinger documents managed support on Business and Cloud plans; your specific plan has not been verified. See the [official deployment guide](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

1. In hPanel, create a Web App using the portfolio GitHub repository or a source ZIP.
2. Select Next.js and Node.js 22. Use the directory containing `package.json` as the app root.
3. Check detected settings against this project:

| Setting | Value |
| --- | --- |
| Install | `npm ci` |
| Build | `npm run build` |
| Start, if requested | `npm run start` |
| Next.js build directory | `.next` |

4. Add the EmailJS environment variables before building.
5. Deploy, connect `nowman.site`, and verify HTTPS.

For VPS hosting, manage the Node process and reverse proxy separately. Static-only hosting needs a separately prepared export and image strategy.

## Source upload contents

Include `src/`, `public/`, `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `next-env.d.ts`, and `eslint.config.mjs`. Keep this README and `.env.example` with the source.

Exclude `node_modules/`, `.next/`, `.git/`, `.env.local`, `tmp/`, and temporary cache backups from a source ZIP. Hostinger should build the app from source. `output/` contains local exports and is not required to run the site. PDF generation scripts are only needed when editing the resume.

This workspace has not been initialized as a Git repository. If using GitHub deployment, create a repository for the **portfolio**; the Cafe Flex repository is a separate project.

## EmailJS configuration

Add these values locally and in Hostinger's app environment settings:

```dotenv
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_contact_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

The form sends exactly:

```ts
const templateParams = {
  from_name: formData.name,
  reply_to: formData.email,
  subject: formData.subject,
  message: formData.message,
};
```

The contact template's recipient should be your inbox. Use `{{reply_to}}` for Reply-To. To enable automatic acknowledgements, link the reply template in the contact template's **Auto-Reply** tab and address replies to `{{reply_to}}`. Account identifiers are kept in the ignored local environment file; do not add an EmailJS private key or email password.

If EmailJS origin restrictions are enabled, allow `https://nowman.site` and any `www` or temporary preview origin you actually use. `NEXT_PUBLIC_*` values are embedded at build time, so rebuild after changing them. Without configuration, sending is disabled and the form offers LinkedIn instead.

See [EmailJS setup and verification notes](emailjs-setup.md). Real inbox delivery and the auto-reply link remain unverified; mocked success responses do not establish delivery.

## Current project content

### BillSahi

- Business management across the web and Android.
- Web: Next.js, TypeScript, MongoDB. Android: React Native.
- Desktop application remains **Under Development**.
- Actual dashboard preview and a five-screen popup gallery: dashboard, inventory, retail POS, purchase history, and product reports.
- Public project repository and live-demo links are not configured.

### Cafe Flex

- Android POS with local storage and TCP networking over Wi-Fi or a hotspot.
- Source-verified engineering details describe heartbeat checks, capped reconnection backoff, and persisted pending commands. No latency or performance metrics are claimed.
- Five owner-supplied captures: Quick Sale, Current Sale, Menu & Item Management, Sales History, and Business Dashboard.
- Public source: [Cafe-Flex-POS](https://github.com/Shaik090/Cafe-Flex-POS).
- Cloud connectivity and QR customer ordering remain planned.

Both screenshot viewers open as popups, with navigation, thumbnails, keyboard controls, focus restoration, and background scroll locking. No gallery expands below the cards.

## Editing guide

| Location | Purpose |
| --- | --- |
| `src/components/Portfolio.tsx` | Sections, skills, project content, navigation, social links |
| `src/components/PortfolioMotion.tsx` | Reveals, hero depth, scroll progress, education timeline |
| `src/components/ContactForm.tsx` | EmailJS form and template parameter mapping |
| `src/components/projects/` | Screenshot viewers and gallery styles |
| `src/data/billsahi-screenshots.ts` | BillSahi screenshot metadata |
| `src/data/cafe-flex-screenshots.ts` | Cafe Flex screenshot metadata |
| `src/app/globals.css` | Layout, theme, responsive styles |
| `src/app/motion.css` | Motion effects and reduced-motion behavior |
| `src/app/layout.tsx` | Page title and metadata |
| `src/app/icon.svg` | Browser icon and export source |
| `public/resume.pdf` | Downloadable one-page, selectable-text resume |
| `scripts/build_resume.py` | Resume generation source |
| `output/logo/` | Profile PNG, transparent PNG, and SVG logo downloads |

The active hero uses the portrait/orbit composition in `Portfolio.tsx`, not the experimental Three.js workspace under `src/components/hero/`. Active portraits are `nowman-hero-face-v2.png` and `nowman-about-face-v2.png`: AI-styled edits based on the supplied photo, not pixel-identical originals. The original photo remains separately retained.

The site supports reduced motion and repeatable viewport reveals. External Google Fonts have system fallbacks. Footer branding remains, while duplicate footer navigation has been removed.

## Verification and launch status

Recent local checks covered production builds, TypeScript, ESLint, screenshot loading, popup navigation, keyboard focus, form validation and simulated EmailJS requests, reduced motion, and representative desktop/tablet/mobile widths. These are local Chromium checks, not physical-device or deployed-site guarantees. Run the production checks again after subsequent changes.

Before announcing the live site:

- Confirm Hostinger's successful production deployment and the correct domain/HTTPS configuration.
- Check both screenshot galleries, certificate PDFs, social links, and the resume download on the hosted site.
- Submit a clearly labelled, authorized contact test and confirm inbox receipt and the expected auto-reply.
- Check mobile navigation and horizontal overflow on an actual phone.

Canonical/social-sharing metadata and a sitemap are optional remaining SEO refinements. No deployment or DNS changes have been performed by this README update.

## Reference documentation

- [Next.js 15 deployment options](https://nextjs.org/docs/15/app/getting-started/deploying)
- [Hostinger Node.js Web Apps](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- [EmailJS setup](emailjs-setup.md)
- [BillSahi gallery notes](src/components/projects/gallery-notes.md)
- [Cafe Flex image cleanup and gallery notes](src/components/projects/cafe-gallery-notes.md)
