'use client';

import Image from 'next/image';
import ContactForm from './ContactForm';
import BillSahiGallery from './projects/BillSahiGallery';
import ProjectScreenshotPreview from './projects/ProjectScreenshotPreview';
import { cafeFlexScreenshots } from '../data/cafe-flex-screenshots';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { LazyMotion, m, MotionConfig, useInView, useReducedMotion } from 'motion/react';
import { MOTION, RevealController, ScrollProgress, HeroScrollVisual, ProjectScrollVisual, EducationTimeline } from './PortfolioMotion';
import { Eye, X, ArrowRight, ArrowUpRight, ArrowLeft, Download, Mail, MapPin, Monitor, Laptop, Smartphone, Code2, Database, GitBranch, Server, CheckCircle2, GraduationCap, BookOpen, FileText, Linkedin, Github, Send, Braces, Layers, FlaskConical, Lightbulb, Terminal, Award } from 'lucide-react';

const loadMotionFeatures = () => import('./motion-features').then(module => module.default);

const NAV=[{href:'#home',label:'Home'},{href:'#about',label:'About'},{href:'#projects',label:'Projects'},{href:'#skills',label:'Skills'},{href:'#education',label:'Education'},{href:'#certifications',label:'Certifications'},{href:'#contact',label:'Contact'}];
const skillGroups=[
 {title:'Languages',icon:Code2,tags:['Java','Python','JavaScript','TypeScript','SQL']},
 {title:'Frontend',icon:Layers,tags:['HTML5','CSS3','ReactJS','Next.js','EJS']},
 {title:'Backend & APIs',icon:Server,tags:['Node.js','Express.js','REST APIs']},
 {title:'Database & Tools',icon:Database,tags:['MongoDB','Git','GitHub']},
 {title:'Testing & Workflow',icon:FlaskConical,tags:['Functional testing','AI-assisted development']},
];
function Logo(){return <a className="brand" href="#home" aria-label="Nowman, home"><span className="brand-icon brand-symbol" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" width="32" height="32"><defs><linearGradient id="initial-gradient" x1="12" y1="12" x2="52" y2="53" gradientUnits="userSpaceOnUse"><stop stopColor="#b6ffe0"/><stop offset=".5" stopColor="#26f2ac"/><stop offset="1" stopColor="#00bca8"/></linearGradient></defs><path d="m32 4 24 14v28L32 60 8 46V18L32 4Z" fill="#0b2726" stroke="#42cba3" strokeWidth="1.5"/><path d="M19 45V19h7l13 19V19h7v26h-7L26 26v19h-7Z" fill="url(#initial-gradient)"/><path d="M20 50Q32 56 44 49" stroke="#67ffce" strokeWidth="1.7" strokeLinecap="round"/><path d="M47 13l1.2 2.8L51 17l-2.8 1.2L47 21l-1.2-2.8L43 17l2.8-1.2Z" fill="#c1ffe6"/></svg></span><span>Nowman<span className="accent">.</span></span></a>}
function Header(){
 const [open,setOpen]=useState(false);
 const [active,setActive]=useState('home');
 const [scrolled,setScrolled]=useState(false);
 const [mobile,setMobile]=useState(false);
 const headerRef=useRef<HTMLElement>(null);
 const navRef=useRef<HTMLElement>(null);
 const toggleRef=useRef<HTMLButtonElement>(null);
 const navigationLock=useRef(0);
 const lockTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const refreshSpy=useRef<()=>void>(()=>{});
 const spyActive=useRef('home');
 const reduce=useReducedMotion();
 useEffect(()=>{
  const header=headerRef.current!;
  const sections=Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
  let positions:{id:string;top:number}[]=[];
  let frame=0;
  let lastScrolled=false;
  let headerHeight=header.offsetHeight;
  const measure=()=>{
   headerHeight=header.offsetHeight;
   document.documentElement.style.setProperty('--header-offset',`${headerHeight+16}px`);
   positions=sections.map(section=>({id:section.id,top:section.getBoundingClientRect().top+window.scrollY}));
  };
  const update=()=>{
   frame=0;
   const y=window.scrollY;
   if(lastScrolled!==(y>50)){lastScrolled=y>50;setScrolled(lastScrolled);}
   if(performance.now()<navigationLock.current)return;
   const marker=y+headerHeight+Math.min(window.innerHeight*.16,140);
   let id='home';
   for(const section of positions){if(section.top<=marker)id=section.id;else break;}
   const atBottom=y+window.innerHeight>=document.documentElement.scrollHeight-3;
   if(atBottom)id='contact';
   if(id!==spyActive.current&&!atBottom){
    const previousIndex=positions.findIndex(section=>section.id===spyActive.current);
    const nextIndex=positions.findIndex(section=>section.id===id);
    const boundary=positions[Math.max(previousIndex,nextIndex)]?.top;
    if(boundary!==undefined&&Math.abs(marker-boundary)<10)return;
   }
   if(spyActive.current!==id){spyActive.current=id;setActive(id);}
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  refreshSpy.current=schedule;
  const unlock=()=>{navigationLock.current=0;schedule()};
  const onKey=(event:KeyboardEvent)=>{if(['PageDown','PageUp','Home','End','ArrowDown','ArrowUp',' '].includes(event.key))unlock()};
  const onHash=()=>{const id=window.location.hash.slice(1);if(positions.some(p=>p.id===id))setActive(id);schedule()};
  const resize=new ResizeObserver(()=>{measure();schedule()});
  sections.forEach(section=>resize.observe(section));resize.observe(header);
  measure();update();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',measure);
  window.addEventListener('scrollend',unlock);
  window.addEventListener('wheel',unlock,{passive:true});
  window.addEventListener('touchstart',unlock,{passive:true});
  window.addEventListener('keydown',onKey);
  window.addEventListener('hashchange',onHash);
  return()=>{if(lockTimer.current)clearTimeout(lockTimer.current);refreshSpy.current=()=>{};cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);window.removeEventListener('scrollend',unlock);window.removeEventListener('wheel',unlock);window.removeEventListener('touchstart',unlock);window.removeEventListener('keydown',onKey);window.removeEventListener('hashchange',onHash)};
 },[]);
 useEffect(()=>{
  const query=window.matchMedia('(max-width:1050px)');
  const update=()=>{setMobile(query.matches);if(!query.matches)setOpen(false)};
  update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
  if(!open||!mobile)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const first=navRef.current?.querySelector<HTMLAnchorElement>('a');first?.focus({preventScroll:true});
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();setOpen(false);toggleRef.current?.focus()}
   if(event.key==='Tab'){
    const links=Array.from(navRef.current!.querySelectorAll<HTMLAnchorElement>('a'));
    const controls=[...links,toggleRef.current!];
    const current=controls.indexOf(document.activeElement as HTMLAnchorElement);
    event.preventDefault();
    const next=(current+(event.shiftKey?-1:1)+controls.length)%controls.length;controls[next]?.focus();
   }
  };
  document.addEventListener('keydown',onKey);
  return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',onKey)};
 },[open,mobile]);
 const navigate=(id:string)=>{
  navigationLock.current=performance.now()+1800;spyActive.current=id;setActive(id);setOpen(false);
  if(lockTimer.current)clearTimeout(lockTimer.current);
  lockTimer.current=setTimeout(()=>{navigationLock.current=0;refreshSpy.current();},1850);
  if(mobile){toggleRef.current?.focus({preventScroll:true});}
 };
 return <header ref={headerRef} className={'site-header'+(scrolled?' is-scrolled':'')}><div className="container nav-inner"><Logo/><nav ref={navRef} className={'nav-links '+(open?'open':'')} id="main-nav" aria-label="Main navigation" inert={mobile&&!open}>
 {NAV.map((n,index)=><a href={n.href} key={n.href} className={active===n.href.slice(1)?'active':''} aria-current={active===n.href.slice(1)?'location':undefined} style={{'--nav-index':index} as CSSProperties} onClick={()=>navigate(n.href.slice(1))}>{n.label}{active===n.href.slice(1)&&<m.span className="nav-active-indicator" layoutId="active-navigation" initial={false} transition={{duration:reduce?0:MOTION.navigation,ease:MOTION.ease}} aria-hidden="true"/>}</a>)}
 </nav><a className="button primary nav-resume" href="/resume.pdf" download="Shaik_Mohammad_Nowman_Resume.pdf">Download Resume <Download size={15}/></a><button ref={toggleRef} className={'menu-button '+(open?'is-open':'')} type="button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(!open)}><span className="menu-glyph" aria-hidden="true"><i/><i/><i/></span></button></div></header>
}
function Heading({kicker,title,accent,copy}:{kicker:string;title:string;accent:string;copy?:string}){return <div className="section-heading"><div><span className="eyebrow">{'//'} &nbsp;{kicker}</span><h2><span className="heading-reveal">{title} <em>{accent}</em></span></h2>{copy&&<p>{copy}</p>}</div></div>}
function AnimatedName(){const target=useRef<HTMLHeadingElement>(null);const visible=useInView(target,{amount:0.2});return <h1 ref={target} className="animated-name holographic-name" data-name-visible={visible}>{['Shaik','Mohammad','Nowman'].map((word,index)=><span className={'hero-line'+(index===2?' accent':'')} key={word}><span className="hero-holo-word" style={{'--holo-index':index} as CSSProperties}>{word}{index<2?' ':''}</span></span>)}</h1>}
function AnimatedWords({text,start=0}:{text:string;start?:number}){return <span className="animated-words">{text.split(' ').map((word,index)=><span className="hero-word-mask" key={index}><span className="hero-word" style={{'--word-index':index,'--word-start':`${start}ms`} as CSSProperties}>{word}</span>{index<text.split(' ').length-1?' ':''}</span>)}</span>}

function Hero(){const target=useRef<HTMLElement>(null);return <section ref={target} className="hero container" id="home"><div className="hero-text"><span className="graduate-label">COMPUTER SCIENCE GRADUATE</span><AnimatedName/><p className="hero-designation"><span className="status-light" aria-hidden="true"/>Software Developer<span className="designation-specialty">Web &amp; Mobile Applications</span></p><p className="hero-lead"><AnimatedWords text="Building practical solutions with" start={350}/>{' '}<br className="desktop-break"/><AnimatedWords text="code and curiosity." start={550}/></p><p className="hero-description"><AnimatedWords text="Computer Science graduate with project experience in web and mobile applications. Turning everyday problems into thoughtful, useful software." start={650}/></p><div className="hero-actions"><a href="#projects" className="button primary">View My Work <ArrowRight size={17}/></a><a href="#contact" className="button secondary">Contact Me <ArrowUpRight size={16}/></a></div><div className="hero-contact"><span className="status-light"/> Open to opportunities <a href="https://github.com/Shaik090" target="_blank" rel="noopener noreferrer" aria-label="Nowman on GitHub (opens in a new tab)"><Github size={19}/></a><a href="#contact-message" aria-label="Send Nowman a message"><Mail size={19}/></a></div></div><div className="portrait-stage"><HeroScrollVisual target={target}><div className="portrait-orbit"/><div className="reference-portrait" role="img" aria-label="Styled portrait of Shaik Mohammad Nowman based on his original photograph"/><span className="hand-note">Let&apos;s<br/>Build<br/>Together <ArrowUpRight size={30}/></span><div className="hero-code" aria-hidden="true"><span>{'// a little about me'}</span><br/>const developer = {'{'}<br/>&nbsp; name: &apos;Nowman&apos;,<br/>&nbsp; focus: &apos;Build &amp; Learn&apos;<br/>{'}'};</div><div className="hero-facts"><div><span><Layers size={21}/></span><p><b>2</b>Projects</p></div><div><span><Braces size={21}/></span><p><b>Web + Mobile</b>Development</p></div><div><span><GraduationCap size={21}/></span><p><b>2025</b>Graduate</p></div></div></HeroScrollVisual></div></section>}
function About(){return <section id="about" className="section about-section"><div className="container"><div className="about-layout"><div className="about-copy"><Heading kicker="ABOUT ME" title="Turning Ideas" accent="Into Real Projects"/><p>Computer Science graduate with a strong interest in building web and mobile applications. I enjoy solving real-world problems, learning new technologies, and creating useful solutions.</p></div><div className="about-portrait" role="img" aria-label="Styled portrait of Shaik Mohammad Nowman based on his original photograph"/><span className="hand-note about-note">Code<br/>Learn<br/>Build<br/>Grow <ArrowUpRight size={27}/></span></div><div className="about-values">{[{icon:Smartphone,text:'Application Development'},{icon:CheckCircle2,text:'Testing & Quality Assurance'},{icon:Lightbulb,text:'Problem Solving'},{icon:BookOpen,text:'Continuous Learning'}].map(({icon:Icon,text})=><div key={text}><span><Icon size={24}/></span><p>{text}</p></div>)}</div></div></section>}
function BillSahiVisual(){return <div className="project-art actual-project-image" role="img" aria-label="Actual BillSahi web application dashboard"><Image src="/images/projects/billsahi/dashboard.webp" alt="BillSahi business dashboard with sales, inventory and operational alerts" fill quality={90} sizes="(max-width:480px) 90vw, (max-width:1100px) 43vw, 460px"/><span className="actual-preview-label">ACTUAL WEB APPLICATION</span></div>}
function CafeVisual(){return <ProjectScreenshotPreview title="Cafe Flex" screenshots={cafeFlexScreenshots}/>}

const projects=[
 {id:'billsahi',category:'Web + Mobile Application',title:'BillSahi',subtitle:'Multi-platform business management',description:'A multi-platform business management solution designed to simplify billing, inventory, sales, purchases, and daily business operations.',tags:['Next.js','TypeScript','MongoDB','React Native'],visual:BillSahiVisual,sourceUrl:null},
 {id:'cafe-flex',category:'Android Application',title:'Cafe Flex',subtitle:'Local-first cafe management',description:'An Android POS with local device storage and TCP connections over Wi-Fi or a mobile hotspot. Staff commands are queued locally and retried after reconnection.',tags:['React Native','TypeScript','TCP / LAN'],visual:CafeVisual,sourceUrl:'https://github.com/Shaik090/Cafe-Flex-POS'},
];
function ProjectDetails({children}:{children:React.ReactNode}){
 const ref=useRef<HTMLDetailsElement>(null);
 const closing=useRef<Animation|null>(null);
 const reduce=useReducedMotion();
 useEffect(()=>()=>{closing.current?.cancel()},[]);
 const toggle=(event:React.MouseEvent<HTMLElement>)=>{
  const node=ref.current!;
  if(!node.open||reduce)return;
  event.preventDefault();
  if(closing.current){closing.current.cancel();closing.current=null;return;}
  const content=node.querySelector('.details-content') as HTMLElement;
  const animation=content.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-5px)'}],{duration:160,easing:'ease-out'});
  closing.current=animation;
  animation.onfinish=()=>{node.open=false;closing.current=null};
 };
 return <details ref={ref} className="project-details"><summary onClick={toggle}>View Details <ArrowRight size={14}/></summary><div className="details-content">{children}</div></details>
}
function Projects(){const reduce=useReducedMotion();const [offset,setOffset]=useState(0);const [galleryOpen,setGalleryOpen]=useState(false);const galleryToggle=useRef<HTMLButtonElement>(null);const galleryPosition=useRef({top:0,left:0});const closeGallery=()=>{setGalleryOpen(false);galleryToggle.current?.focus({preventScroll:true})};const ordered=[...projects.slice(offset),...projects.slice(0,offset)];return <section id="projects" className="section projects-section"><div className="container"><div className="projects-heading"><Heading kicker="PROJECTS" title="Featured" accent="Projects" copy="Real-world projects that showcase my work in web and mobile development and practical problem solving."/><div className="project-controls"><button type="button" aria-label="Previous project" onClick={()=>setOffset((offset+projects.length-1)%projects.length)}><ArrowLeft size={19}/></button><button type="button" aria-label="Next project" onClick={()=>setOffset((offset+1)%projects.length)}><ArrowRight size={19}/></button></div></div><div className="projects-list">{ordered.map(({id,category,title,subtitle,description,tags,visual:Visual,sourceUrl})=><m.article layout={!reduce} transition={{layout:{duration:MOTION.reveal,ease:MOTION.ease}}} className={'project-card '+id} key={id}><div className="project-preview"><ProjectScrollVisual><Visual/></ProjectScrollVisual><span className="preview-category">{category}</span></div><div className="project-info"><h3>{title}</h3><p className="project-lead">{subtitle}</p><p className="project-detail">{description}</p>{id==='billsahi'&&<div className="platform-pills"><span><Laptop size={12}/> Web</span><span><Smartphone size={12}/> Android</span><span className="development"><Monitor size={12}/> Desktop · Under Development</span></div>}{id==='cafe-flex'&&<p className="project-roadmap"><strong>Planned:</strong> Cloud connectivity and QR table ordering.</p>}<div className="tag-row">{tags.map(tag=><span key={tag} className="tag">{tag}</span>)}</div><ProjectDetails><p>{id==='billsahi'?'Web: Next.js, TypeScript and MongoDB. MongoDB schemas define user-scoped compound indexes for product SKU, stock and sales-date lookups, with unique invoice numbers per user. Android: React Native. Desktop is under development.':id==='cafe-flex'?'Local networking uses react-native-tcp-socket with framed messages and heartbeat checks. Reconnection uses capped exponential backoff; pending commands persist locally and are flushed after reconnecting. These are implemented mechanisms, not measured latency claims. Cloud connectivity and QR-based customer ordering remain planned.':description}</p></ProjectDetails>{sourceUrl&&<a className="project-source-link" href={sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${title} source code on GitHub (opens in a new tab)`}><Github size={16} aria-hidden="true"/> View Source <ArrowUpRight size={15} aria-hidden="true"/></a>}{id==='billsahi'&&<button ref={galleryToggle} type="button" className="bs-screenshots-toggle" aria-haspopup="dialog" aria-expanded={galleryOpen} aria-controls="billsahi-screenshots" onClick={()=>{galleryPosition.current={top:window.scrollY,left:window.scrollX};setGalleryOpen(!galleryOpen)}}>{galleryOpen?'Hide Screenshots':'Explore Screenshots'}<ArrowUpRight size={16} style={{rotate:galleryOpen?'180deg':'0deg'}} aria-hidden="true"/></button>}</div></m.article>)}</div><BillSahiGallery open={galleryOpen} onClose={closeGallery} openingPosition={galleryPosition.current}/></div></section>}
function Skills(){return <section id="skills" className="section skills-section"><div className="container"><div className="skills-heading"><Heading kicker="SKILLS" title="Technical" accent="Skills" copy="Technologies and tools I work with to build and test practical applications."/><span className="learning-pill"><span className="status-light"/> Always Learning</span></div><div className="skill-rows">{skillGroups.map(({title,icon:Icon,tags})=><div className="skill-row" key={title}><h3><Icon size={18}/>{title}</h3><div className="skill-items">{tags.map((tag,i)=><div className="technology" key={tag} style={{'--tech-index':i} as CSSProperties}><span className={'technology-symbol tech-'+tag.toLowerCase().replace(/[^a-z]/g,'')} aria-hidden="true">{tag==='MongoDB'?<Database size={25}/>:tag==='Git'||tag==='GitHub'?<GitBranch size={25}/>:tag.includes('testing')?<FlaskConical size={24}/>:tag==='ReactJS'?<span className="react-symbol">⚛</span>:tag==='AI-assisted development'?<Terminal size={24}/>:tag==='Next.js'?'N':tag==='HTML5'?'5':tag==='CSS3'?'3':tag==='JavaScript'?'JS':tag==='TypeScript'?'TS':tag==='Python'?'Py':tag==='Java'?'J':tag==='SQL'?<Database size={24}/>:tag==='Node.js'?'node':tag==='Express.js'?'ex':tag==='REST APIs'?<Braces size={24}/>:tag==='EJS'?'EJS':<Icon size={22}/>}</span><span>{tag}</span></div>)}</div></div>)}</div></div></section>}
function Education(){return <section id="education" className="section education-section"><div className="container"><Heading kicker="EDUCATION" title="My Academic" accent="Journey"/><div className="education-layout"><EducationTimeline>{[{year:'2025',icon:GraduationCap,title:'B.Tech in Computer Science and Engineering',school:'Rajeev Gandhi Memorial College of Engineering, Nandyal',grade:'CGPA: 7.44'},{year:'2018',icon:BookOpen,title:'Intermediate MPC',school:'Narayana Junior College, Tirupati',grade:'Percentage: 94.7%'},{year:'2016',icon:FileText,title:'SSC / Class 10',school:'Viswa Bharathi High School, Punganur',grade:'CGPA: 8.2'}].map(({year,icon:Icon,title,school,grade},index)=><div className="academic-item" key={year}><span className="academic-year">{year}</span><span className="academic-icon"><Icon size={25}/></span><div className="academic-copy"><h3>{title}</h3><p>{school}</p><span className="academic-grade">{grade}</span></div><span className="academic-scan" aria-hidden="true"/><span className="academic-step" aria-hidden="true">0{index+1}</span></div>)}</EducationTimeline><div className="education-art" aria-hidden="true"><div className="cap-halo"/><GraduationCap className="education-cap" size={190} strokeWidth={.7}/><span className="hand-note">A Strong<br/>Foundation<br/>for a Better<br/>Tomorrow <ArrowUpRight size={35}/></span></div></div></div></section>}
function Certifications() {
  const certificates = [
    { icon: Award, title: 'Full Stack Development', provider: 'Apna College', file: 'full-stack-development', width: 1440, height: 1019 },
    { icon: Terminal, title: 'Python for Beginners', provider: 'Cisco Networking Academy', file: 'python-for-beginners', width: 1440, height: 976 },
  ];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedFile, setLoadedFile] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = selectedIndex === null ? null : certificates[selectedIndex];
  useEffect(() => {
    if (selectedIndex === null) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex]);
  return <section id="certifications" className="section certifications-section"><div className="container">
    <Heading kicker="CERTIFICATIONS" title="Courses &" accent="Certifications"/>
    <div className="cert-list">{certificates.map(({ icon: Icon, title, provider, file }, index) =>
      <div className="cert-card certificate-card" key={file}>
        <div className="cert-summary"><span className="cert-icon"><Icon size={30}/></span><div><h3>{title}</h3><p>{provider}</p></div>
          <button className="certificate-eye" type="button" title="Preview certificate" aria-label={`Preview ${title} certificate`} aria-haspopup="dialog" onClick={() => setSelectedIndex(index)}><Eye size={21} aria-hidden="true"/><span>Preview</span></button>
        </div>
      </div>
    )}</div>
    <dialog ref={dialog} className="certificate-modal" aria-labelledby="certificate-preview-title" onClose={() => setSelectedIndex(null)} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
    }}>
      {selected && <div className="certificate-modal-content">
        <div className="certificate-modal-heading"><div><span>Certificate preview</span><h3 id="certificate-preview-title">{selected.title}</h3><p>{selected.provider}</p></div><button type="button" className="certificate-close" aria-label="Close certificate preview" onClick={() => dialog.current?.close()}><X size={22}/></button></div>
        <div className="certificate-large-image" aria-busy={loadedFile !== selected.file}>
          {loadedFile !== selected.file && <span className="certificate-placeholder" role="status"><Eye size={32}/><span>Preview</span></span>}
          <Image key={selected.file} src={`/certificates/${selected.file}.webp`} alt={`${selected.title} course completion certificate for Shaik Mohammad Nowman`} width={selected.width} height={selected.height} sizes="(max-width: 760px) 94vw, 1100px" onLoad={() => setLoadedFile(selected.file)}/>
        </div>
        <a className="certificate-pdf-link" aria-label="Open original PDF (opens in a new tab)" href={`/certificates/${selected.file}.pdf`} target="_blank" rel="noopener noreferrer">Open original PDF <ArrowUpRight size={17}/></a>
      </div>}
    </dialog>
  </div></section>;
}
function Contact(){return <section id="contact" className="section contact-section"><div className="container contact-layout"><div><Heading kicker="CONTACT" title="Let’s Work" accent="Together" copy="I'm always open to discussing new opportunities, interesting projects, or just talking about technology."/><div className="contact-cards"><a href="https://www.linkedin.com/in/shaik-nowman" target="_blank" rel="noopener noreferrer" aria-label="Nowman on LinkedIn (opens in a new tab)"><span><Linkedin size={24}/></span><div><strong>LinkedIn</strong><small>Connect with me</small></div></a><a href="https://github.com/Shaik090" target="_blank" rel="noopener noreferrer" aria-label="View Nowman?s GitHub profile (opens in a new tab)"><span><Github size={24}/></span><div><strong>GitHub</strong><small>Explore my repositories</small></div></a><div><span><MapPin size={24}/></span><div><strong>Andhra Pradesh, India</strong><small>Based in India</small></div></div></div><ContactForm/></div><div className="send-art" aria-hidden="true"><span className="hand-note">Open to<br/>Opportunities <ArrowUpRight size={30}/></span><Send size={140} strokeWidth={1}/><span className="flight-path"/></div></div></section>}
function Footer(){return <footer className="footer"><div className="container footer-inner"><a className="footer-brand" href="#home">Nowman<span className="accent">.</span></a><p>Built with passion <span> | </span> © {new Date().getFullYear()} Shaik Mohammad Nowman</p></div></footer>}
export default function Portfolio(){return <LazyMotion features={loadMotionFeatures} strict><MotionConfig reducedMotion="user"><ScrollProgress/><RevealController/><Header/><main><Hero/><About/><Projects/><Skills/><Education/><Certifications/><Contact/></main><Footer/></MotionConfig></LazyMotion>}
