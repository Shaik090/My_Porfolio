'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode, type RefObject, type PointerEvent, type CSSProperties } from 'react';
import { m, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';

export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,
  navigation: 0.28,
  reveal: 0.56,
  stagger: 0.08,
};

/** Motion values update the progress transform without rendering React on scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 240, damping: 35, restDelta: 0.0001 });
  return <m.div className="scroll-progress" style={{ scaleX: smoothProgress }} aria-hidden="true" />;
}

/** Progressive enhancement: content is visible without JS and with reduced motion. */
export function RevealController() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>([
      '.section-heading', '.about-copy > p', '.about-portrait', '.about-values > div',
      '.project-card', '.skill-row', '.academic-item', '.education-art',
      '.reference-portrait', '.hero-facts', '.cert-preview-image',
      '.cert-card', '.contact-cards > a', '.contact-cards > div', '.contact-cta', '.send-art',
    ].join(',')));
    const reveal = (node: HTMLElement) => {
      node.classList.add('is-visible');
    };
    const showAll = () => nodes.forEach(reveal);
    const setup = () => {
      observer?.disconnect();
      if (media.matches || !('IntersectionObserver' in window)) { showAll(); return; }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const node = entry.target as HTMLElement;
          if (entry.isIntersecting) reveal(node);
          else if (!node.contains(document.activeElement) &&
            (entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= window.innerHeight - 24)) {
            node.classList.remove('is-visible');
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      nodes.forEach(node => {
        // Keep the initial viewport readable and replay entrances after content leaves view.
        const siblings = Array.from(node.parentElement?.children || []);
        const index = Math.max(0, siblings.indexOf(node));
        node.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 80}ms`);
        node.dataset.reveal = node.classList.contains('project-card') ? 'project' : 'content';
        const bounds = node.getBoundingClientRect();
        node.classList.toggle('is-visible', bounds.top < window.innerHeight - 24 && bounds.bottom > 0);
        observer!.observe(node);
      });
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      nodes.filter(node => node.contains(target)).forEach(reveal);
    };
    setup();
    media.addEventListener('change', setup);
    document.addEventListener('focusin', onFocus);
    window.addEventListener('beforeprint', showAll);
    return () => {
      observer?.disconnect();
      media.removeEventListener('change', setup);
      document.removeEventListener('focusin', onFocus);
      window.removeEventListener('beforeprint', showAll);
      nodes.forEach(node => { delete node.dataset.reveal; node.style.removeProperty('--reveal-delay'); });
    };
  }, []);
  return null;
}


const subscribeReduced = (callback: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getServerReduced = () => false;
function useClientReducedMotion() {
  // The server and hydration snapshot must match. CSS enforces the preference immediately.
  return useSyncExternalStore(subscribeReduced, getReduced, getServerReduced);
}

const subscribeSmall = (callback: () => void) => {
  const query = window.matchMedia('(max-width: 760px), (pointer: coarse)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getSmall = () => window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
const getServerSmall = () => false;
function useScrollIntensity() {
  const small = useSyncExternalStore(subscribeSmall, getSmall, getServerSmall);
  const reduced = useClientReducedMotion();
  return { reduced, intensity: small ? 0.35 : 1 };
}

/** Separate layer keeps the entrance animation and all heading text independent. */
export function HeroScrollVisual({ target, children }: { target: RefObject<HTMLElement | null>; children: ReactNode }) {
  const { reduced, intensity } = useScrollIntensity();
  const surface = useRef<HTMLDivElement>(null);
  const inView = useInView(surface, { amount: 0.1 });
  const bounds = useRef<DOMRect | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 160, damping: 24, mass: 0.7 });
  const rotateY = useSpring(pointerX, { stiffness: 160, damping: 24, mass: 0.7 });
  const sheenX = useTransform(rotateY, [-4, 4], [-28, 28]);
  const sheenY = useTransform(rotateX, [-3, 3], [18, -18]);
  const reset = () => { pointerX.set(0); pointerY.set(0); bounds.current = null; };
  const canTilt = (event: PointerEvent<HTMLDivElement>) => !reduced && intensity === 1 && event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const enter = (event: PointerEvent<HTMLDivElement>) => {
    if (canTilt(event)) bounds.current = surface.current!.getBoundingClientRect();
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!canTilt(event) || !bounds.current) return;
    const rect = bounds.current;
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    pointerX.set(x * 4); pointerY.set(-y * 3);
  };
  useEffect(() => { if (reduced || intensity < 1) { pointerX.set(0); pointerY.set(0); } }, [reduced, intensity, pointerX, pointerY]);
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });
  const y = useTransform(progress, [0, 1], [0, -28 * intensity]);
  const scale = useTransform(progress, [0, 1], [1, 1 - 0.035 * intensity]);
  const opacity = useTransform(progress, [0, 1], [1, 1 - 0.4 * intensity]);
  const glowY = useTransform(progress, [0, 1], [0, 16 * intensity]);
  return <m.div ref={surface} className="hero-scroll-layer" onPointerEnter={enter} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} style={{ y: reduced ? 0 : y, scale: reduced ? 1 : scale, opacity: reduced ? 1 : opacity }}>
    <m.div className="hero-scroll-glow" style={{ y: reduced ? 0 : glowY }} aria-hidden="true" />
    <m.div className="hero-depth-scene" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformPerspective: 1100 }}>
      <div className="hero-ambient-rig" data-animate={inView && !reduced}>
      <m.span className="hero-reactive-light" style={{x:reduced?0:sheenX,y:reduced?0:sheenY}} aria-hidden="true"/>
      <span className="hero-floor-ring" aria-hidden="true" />
      <span className="hero-depth-ring" aria-hidden="true" />
      <ul className="hero-skill-orbit" aria-label="Featured technologies">
        {[
          { name: 'Next.js', mark: 'N', className: 'next' },
          { name: 'React', mark: '\u269b', className: 'react' },
          { name: 'TypeScript', mark: 'TS', className: 'typescript' },
          { name: 'MongoDB', mark: 'M', className: 'mongodb' },
        ].map((skill, index) => <li className="skill-orbit-slot" key={skill.name} style={{ '--orbit-delay': `${index * -7}s` } as CSSProperties}>
          <span className={`orbit-skill orbit-${skill.className}`}><b aria-hidden="true">{skill.mark}</b><span>{skill.name}</span></span>
        </li>)}
      </ul>
      {children}
      <m.span className="hero-depth-sheen" style={{ x: reduced ? 0 : sheenX }} aria-hidden="true" />
      </div>
    </m.div>
  </m.div>;
}

/** Only project artwork moves; text, category labels and actions stay stationary. */
export function ProjectScrollVisual({ children }: { children: ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const { reduced, intensity } = useScrollIntensity();
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 32, restDelta: 0.001 });
  const y = useTransform(progress, [0, 1], [7 * intensity, -7 * intensity]);
  const scale = useTransform(progress, [0, 1], [1, 1 + 0.018 * intensity]);
  const glowY = useTransform(progress, [0, 1], [-9 * intensity, 9 * intensity]);
  return <div className="project-scroll-viewport" ref={target}>
    <m.div className="project-scroll-glow" style={{ y: reduced ? 0 : glowY }} aria-hidden="true" />
    <m.div className="project-scroll-visual" style={{ y: reduced ? 0 : y, scale: reduced ? 1 : scale }}>{children}</m.div>
  </div>;
}

/** Continuous progress replaces the previous observer-driven stepped timeline. */
export function EducationTimeline({ children }: { children: ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(-1);
  const reduced = useClientReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start 75%', 'end 65%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });
  const headPosition = useTransform(progress, [0, 1], ['0%', '100%']);
  useEffect(() => {
    const timeline = target.current;
    const nodes = timeline?.querySelectorAll<HTMLElement>('.academic-item');
    nodes?.forEach((node, index) => {
      node.dataset.current = String(index === 0);
    });
    if (!timeline || !nodes?.length) return;
    const measure = () => {
      const center = (node: HTMLElement) => {
        const marker = getComputedStyle(node, '::before');
        return node.offsetTop + parseFloat(marker.top) + parseFloat(marker.height) / 2;
      };
      timeline.style.setProperty('--education-track-top', `${center(nodes[0])}px`);
      timeline.style.setProperty('--education-track-bottom', `${timeline.clientHeight - center(nodes[nodes.length - 1])}px`);
    };
    const resize = new ResizeObserver(measure);
    resize.observe(timeline);
    measure();
    return () => resize.disconnect();
  }, []);
  useMotionValueEvent(scrollYProgress, 'change', progress => {
    const milestones = target.current?.querySelectorAll<HTMLElement>('.academic-item');
    if (!milestones?.length) return;
    const index = Math.min(milestones.length - 1, Math.floor(progress * milestones.length));
    if (index === activeIndex.current) return;
    activeIndex.current = index;
    milestones.forEach((node, i) => { node.dataset.current = String(i === index); });
  });
  return <div className="academic-timeline" ref={target}>
    <span className="education-progress-track" aria-hidden="true">
      <m.span className="timeline-scroll-progress" style={{ scaleY: reduced ? 1 : progress }}/>
      <m.span className="education-progress-head" style={{ top: reduced ? '100%' : headPosition }}/>
    </span>
    {children}
  </div>;
}
