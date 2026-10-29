# Cinematic developer workspace hero

The hero alone now uses a real, locally generated 3D developer workspace. Navigation, About, Projects, Skills, Education, Certifications, Contact, the resume and the existing About portrait remain intact.

## Components

- `src/components/hero/HeroSection.tsx`: SSR-rendered introduction, complete-word masked name entrance, designation, requested description, Explore Projects / Contact Me links and availability indicator.
- `DeveloperWorkspace3D.tsx`: deferred client-only import, near-viewport loading, capability detection, page visibility, reduced-motion/mobile gating, error boundary and fallback switching.
- `WorkspaceCanvas.tsx`: React Three Fiber demand renderer, Drei rounded devices and lightweight lines, local screen textures, staged assembly, interpolated pointer/scroll transforms and an intermittent code cursor.
- `HeroFallback.tsx`: complete static/CSS workspace using the same local screen artwork, shown before the renderer is ready and on mobile, coarse pointers, reduced motion, low CPU count, unsupported WebGL, scene errors or context loss.
- `hero.css`: scoped hero styles and mobile composition.
- `public/images/workspace/*.svg`: programmatic illustrative code, phone, BillSahi and Cafe Flex screens. No external models, remote fonts, stock imagery or fake business/performance metrics are used in the scene. BillSahi desktop remains under development.

## Rendering and resource behavior

Canvas DPR is capped at 1.5. A small set of rounded boxes, planes, local textures and directional lights is used without post-processing, bloom, environment downloads or shadow maps. After the staged entrance, frames are requested for input changes and the code cursor (once per second). Pointer movement changes refs, not React state. Scroll values invalidate the renderer only while the scene is visible. Cursor timers are cleared offscreen or in a hidden tab. Rendering settles instead of running an unrestricted idle frame loop.

The WebGL dependency graph is dynamically imported with SSR disabled. The fallback and hero text are available in server HTML. Below 900px, on coarse pointers, or with reduced motion, the WebGL component is not mounted. Three.js 0.182 is pinned to a version compatible with the current React Three Fiber Clock usage, avoiding the newer Clock deprecation warning. Existing Next.js/React dependencies were not upgraded.

## Verification

- TypeScript, ESLint and production build passed.
- Real WebGL draws and pointer-driven pixel changes were verified in headless Chromium with software WebGL enabled.
- Demand rendering was sampled after settling: three consecutive idle windows had no new draw calls; a fourth window rendered for the intentional cursor update. Rendering stopped while offscreen.
- Scroll-driven movement, desktop/tablet layouts, 390px and 320px mobile layouts, no horizontal overflow, native anchor navigation, active underline, mobile menu, keyboard focus, Escape, touch interaction, project disclosures and resume response passed.
- Reduced motion enabled before hydration rendered content immediately and used the complete non-WebGL composition, with no hydration mismatch.
- Unsupported WebGL and a deliberately lost live context both returned to the visible fallback.
- Hero text was confirmed in the server response. Layout shift measured 0 in the sampled production checks.
- The default screenshot-heavy browser run emitted native GPU ReadPixels stall messages. The repeat with software WebGL configured passed without unexpected console warnings or application errors; these capture-related driver warnings are not hidden by the application.
- Desktop WebGL and mobile fallback screenshots were reviewed for alignment, clipping, panel overlap and text hierarchy.
- Next.js first-load JS report: 176 kB versus the prior 169 kB. Additional WebGL chunks load on demand; the two largest were approximately 101 kB and 85 kB encoded over the local production server, separately from initial route assets. This is not a claim that all desktop JavaScript is only 176 kB.

Physical-device GPU/battery testing, Safari/Firefox testing, deployed-network performance, Lighthouse scoring and real-world low-end phone testing were not performed. Mobile deliberately uses the lightweight fallback rather than assuming adequate GPU performance.

## Primary documentation consulted

- https://r3f.docs.pmnd.rs/advanced/scaling-performance
- https://drei.docs.pmnd.rs/shapes/rounded-box
- https://nextjs.org/docs/app/guides/lazy-loading
