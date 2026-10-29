'use client';

import { useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import DeveloperWorkspace3D from './DeveloperWorkspace3D';
import './hero.css';

export default function HeroSection() {
  const target=useRef<HTMLElement>(null);
  return <section ref={target} className="hero container cinematic-hero" id="home">
    <div className="hero-text workspace-introduction">
      <span className="graduate-label">COMPUTER SCIENCE GRADUATE</span>
      <h1 aria-label="Shaik Mohammad Nowman">{['Shaik','Mohammad','Nowman'].map((word,index)=><span className={'workspace-name-line'+(index===2?' accent':'')} key={word}><span style={{animationDelay:`${120+index*100}ms`}}>{word}</span></span>)}</h1>
      <p className="workspace-designation">Software Developer <span>| Web &amp; Mobile Applications</span></p>
      <p className="workspace-description">Computer Science graduate building practical web and mobile applications, with a focus on creating useful, reliable software solutions.</p>
      <div className="hero-actions"><a className="button primary" href="#projects">Explore Projects <ArrowRight size={17}/></a><a className="button secondary" href="#contact">Contact Me <ArrowUpRight size={16}/></a></div>
      <div className="workspace-availability"><span className="status-light"/>Open to Opportunities</div>
    </div>
    <DeveloperWorkspace3D target={target}/>
  </section>;
}
