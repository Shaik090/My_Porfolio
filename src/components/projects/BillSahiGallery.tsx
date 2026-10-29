'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Expand, Images, X } from 'lucide-react';
import { billsahiImagePath, billsahiScreenshots } from '../../data/billsahi-screenshots';
import './billsahi-gallery.css';

export default function BillSahiGallery({ open, onClose, openingPosition }: { open: boolean; onClose: () => void; openingPosition: { top: number; left: number } }) {
  const popup = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    const element = popup.current;
    const overflow = document.body.style.overflow;
    const position = { ...openingPosition, behavior: 'instant' as const };
    element?.showModal();
    document.body.style.overflow = 'hidden';
    window.scrollTo(position);
    return () => { element?.close(); document.body.style.overflow = overflow; window.scrollTo(position); };
  }, [open, openingPosition]);
  return <dialog ref={popup} id="billsahi-screenshots" className="bs-gallery-popup" aria-labelledby="bs-gallery-title"
    onCancel={event => { if (event.target === event.currentTarget) { event.preventDefault(); onClose(); } }}
    onClose={event => { if (event.target === event.currentTarget && open) onClose(); }}
    onKeyDown={event => {
      if (event.key !== 'Tab' || (event.target as HTMLElement).closest('dialog') !== event.currentTarget) return;
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
    {open && <ScreenshotViewer onClose={onClose}/>}
  </dialog>;
}

function ScreenshotViewer({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [large, setLarge] = useState(false);
  const [loadedLarge, setLoadedLarge] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const thumbnails = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const screen = billsahiScreenshots[index];
  const move = (direction: number) => setIndex(current => (current + direction + billsahiScreenshots.length) % billsahiScreenshots.length);

  useEffect(() => {
    // Scroll only the thumbnail strip; never move the document to change images.
    const strip = thumbnails.current;
    const selected = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !selected) return;
    const left = selected.offsetLeft - strip.offsetLeft;
    if (left < strip.scrollLeft) strip.scrollTo({ left, behavior: reduced ? 'instant' : 'smooth' });
    else if (left + selected.offsetWidth > strip.scrollLeft + strip.clientWidth)
      strip.scrollTo({ left: left + selected.offsetWidth - strip.clientWidth, behavior: reduced ? 'instant' : 'smooth' });
  }, [index, reduced]);

  useEffect(() => {
    if (!large) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; };
  }, [large]);

  const controls = (lightbox = false) => <div className="bs-gallery-navigation">
    <button type="button" aria-label={lightbox ? 'Previous screenshot in larger viewer' : 'Previous BillSahi screenshot'} onClick={() => move(-1)}><ArrowLeft size={19}/></button>
    <span>{index + 1} <span>/ {billsahiScreenshots.length}</span></span>
    <button type="button" aria-label={lightbox ? 'Next screenshot in larger viewer' : 'Next BillSahi screenshot'} onClick={() => move(1)}><ArrowRight size={19}/></button>
  </div>;

  return <section className="bs-gallery" aria-labelledby="bs-gallery-title">
    <div className="bs-gallery-heading"><div><span className="bs-gallery-eyebrow"><Images size={14}/> INSIDE BILLSAHI</span><h3 id="bs-gallery-title">A closer look at the web app</h3><p>Five selected screens from the application.</p></div><button type="button" className="bs-gallery-icon" aria-label="Close BillSahi screenshots" onClick={onClose}><X size={20}/></button></div>
    <div className="bs-gallery-browser">
      <div className="bs-browser-toolbar"><span aria-hidden="true"><i/><i/><i/></span><span>BillSahi / Web Application</span><span className="bs-browser-status">SCREENSHOTS</span></div>
      <div className="bs-gallery-stage">
        <AnimatePresence initial={false} mode="wait">
          <m.div key={screen.file} className="bs-gallery-slide" initial={{ opacity: 0, x: reduced ? 0 : 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -10 }} transition={{ duration: reduced ? 0 : .16 }}>
            <Image src={billsahiImagePath(screen.file)} alt={`BillSahi web application: ${screen.title}. ${screen.description}`} fill loading="eager" quality={90} sizes="(max-width:760px) 90vw, (max-width:1264px) 85vw, 1080px"/>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
    <div className="bs-gallery-caption"><div aria-live="polite" aria-atomic="true"><h4>{screen.title}</h4><p>{screen.description}</p></div>{controls()}<button type="button" className="bs-gallery-larger" onClick={() => setLarge(true)}><Expand size={16}/> View Larger</button></div>
    <div className="bs-gallery-thumbnails" ref={thumbnails} role="group" aria-label="Choose a BillSahi screenshot">
      {billsahiScreenshots.map((item, itemIndex) => <button type="button" key={item.file} aria-label={`Show ${item.title}`} aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)}>
        <Image src={billsahiImagePath(item.file, true)} alt="" width={240} height={117} sizes="120px"/><span>{item.title}</span>
      </button>)}
    </div>
    <p className="bs-gallery-note">Web application screens. Account email redacted for privacy. Desktop application under development.</p>
    <dialog ref={dialog} className="bs-gallery-lightbox" aria-labelledby="bs-lightbox-title" onClose={() => setLarge(false)} onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowLeft' ? -1 : 1); }
      if (event.key === 'Tab') {
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
    }}>
      {large && <div className="bs-lightbox-content"><div className="bs-lightbox-heading"><div aria-live="polite"><span>BillSahi / Web Application</span><h3 id="bs-lightbox-title">{screen.title}</h3></div><button type="button" className="bs-gallery-icon" aria-label="Close screenshot viewer" onClick={() => dialog.current?.close()}><X size={23}/></button></div>
        <div className="bs-lightbox-image" aria-busy={loadedLarge !== screen.file}>
          {loadedLarge !== screen.file && <span className="bs-screenshot-loading" role="status">Loading screenshot preview...</span>}
          <Image key={screen.file} src={billsahiImagePath(screen.file)} alt={`Full-size BillSahi ${screen.title}`} fill loading="eager" sizes="96vw" quality={95} onLoad={() => setLoadedLarge(screen.file)}/>
        </div>
        {controls(true)}
      </div>}
    </dialog>
  </section>;
}
