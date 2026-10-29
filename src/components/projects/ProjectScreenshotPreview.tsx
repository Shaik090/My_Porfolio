'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Expand, X, ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';

type Screenshot = { src: string; title: string; description: string };

export default function ProjectScreenshotPreview({ title, screenshots }: { title: string; screenshots: readonly Screenshot[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loadedScreen, setLoadedScreen] = useState('');
  const thumbnails = useRef<HTMLDivElement>(null);
  const screen = screenshots[index];
  const move = (direction: number) => setIndex(current => (current + direction + screenshots.length) % screenshots.length);
  useEffect(() => {
    const strip = thumbnails.current;
    const selected = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !selected) return;
    const left = selected.offsetLeft - strip.offsetLeft;
    if (left < strip.scrollLeft) strip.scrollLeft = left;
    else if (left + selected.offsetWidth > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = left + selected.offsetWidth - strip.clientWidth;
  }, [index, open]);
  const dialog = useRef<HTMLDialogElement>(null);
  const position = useRef({ top: 0, left: 0 });
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    const restore = { ...position.current, behavior: 'instant' as const };
    element?.showModal();
    document.body.style.overflow = 'hidden';
    window.scrollTo(restore);
    return () => { element?.close(); document.body.style.overflow = overflow; window.scrollTo(restore); };
  }, [open]);
  return <>
    <button type="button" className="project-art actual-project-image actual-mobile-image" aria-label={`View ${title} screenshots`} aria-haspopup="dialog" onClick={() => { position.current = { top: window.scrollY, left: window.scrollX }; setIndex(0); setOpen(true); }}>
      <span className="project-proof-teaser"><Image src={screenshots[0].src} alt={`${title}: actual ${screenshots[0].title} screen`} fill sizes="100px"/></span>
      <span className="project-proof-teaser secondary" aria-hidden="true"><Image src={screenshots[2].src} alt="" fill sizes="100px"/></span>
      <span className="actual-preview-label"><Expand size={14}/> Explore Screenshots ({screenshots.length})</span>
    </button>
    <dialog ref={dialog} className="project-proof-modal" aria-labelledby="project-proof-title" onClose={() => setOpen(false)} onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); return; }
      if (event.key !== 'Tab') return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>('button,a[href]');
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
    }}>
      {open && <div className="project-proof-content"><div className="project-proof-heading"><h3 id="project-proof-title">{title} / Actual app screenshot</h3><button type="button" aria-label="Close app screenshot" onClick={() => dialog.current?.close()}><X size={22}/></button></div>
        <div className="project-proof-stage" aria-busy={loadedScreen !== screen.src}>{loadedScreen !== screen.src && <span className="project-proof-loading" role="status">Loading screenshot preview...</span>}<Image key={screen.src} src={screen.src} alt={`${title}: ${screen.title}. ${screen.description}`} fill sizes="(max-width:760px) 75vw, 320px" loading="eager" quality={95} onLoad={() => setLoadedScreen(screen.src)}/></div>
        <div className="project-proof-caption"><div aria-live="polite" aria-atomic="true"><h4>{screen.title}</h4><p>{screen.description}</p></div><div className="project-proof-navigation"><button type="button" aria-label={`Previous ${title} screenshot`} onClick={() => move(-1)}><ArrowLeft size={18}/></button><span>{index + 1} / {screenshots.length}</span><button type="button" aria-label={`Next ${title} screenshot`} onClick={() => move(1)}><ArrowRight size={18}/></button></div></div>
        <div className="project-proof-thumbnails" ref={thumbnails} role="group" aria-label={`${title} screenshot thumbnails`}>{screenshots.map((item, i) => <button type="button" key={item.src} aria-label={`Show ${title} ${item.title}`} aria-pressed={i === index} onClick={() => setIndex(i)}><Image src={item.src.replace('.webp','-thumb.webp')} alt="" width={70} height={150}/><span>{item.title}</span></button>)}</div>
        <a href={screen.src} target="_blank" rel="noopener noreferrer" aria-label="Open full-size screenshot (opens in a new tab)">Open full-size screenshot <ArrowUpRight size={16}/></a>
      </div>}
    </dialog>
  </>;
}
