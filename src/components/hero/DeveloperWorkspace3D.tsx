'use client';

import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { m, useInView, useScroll, useTransform } from 'motion/react';
import HeroFallback from './HeroFallback';

const WorkspaceCanvas = dynamic(() => import('./WorkspaceCanvas'), { ssr:false });

class WorkspaceBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?null:this.props.children;}
}

export default function DeveloperWorkspace3D({target}:{target:RefObject<HTMLElement|null>}) {
  const stage=useRef<HTMLDivElement>(null);
  const visible=useInView(stage,{amount:0.05});
  const entered=useInView(stage,{once:true,margin:'160px'});
  const [eligible,setEligible]=useState(false);
  const [ready,setReady]=useState(false);
  const [failed,setFailed]=useState(false);
  const [tabVisible,setTabVisible]=useState(true);
  const markReady=useCallback(()=>setReady(true),[]);
  const markFailed=useCallback(()=>{setFailed(true);setReady(false);},[]);
  const {scrollYProgress}=useScroll({target,offset:['start start','end start']});
  const y=useTransform(scrollYProgress,[0,1],[0,-22]);
  const opacity=useTransform(scrollYProgress,[0,.6,1],[1,.94,.45]);
  useEffect(()=>{
    const screen=matchMedia('(min-width:900px) and (pointer:fine)');
    const reduced=matchMedia('(prefers-reduced-motion:reduce)');
    let supported:boolean|undefined;
    let timer:ReturnType<typeof setTimeout>|undefined;
    const update=()=>{
      clearTimeout(timer);
      if(!screen.matches||reduced.matches||navigator.hardwareConcurrency<=2){setEligible(false);setReady(false);return;}
      timer=setTimeout(()=>{
        if(supported===undefined){try{const probe=document.createElement('canvas');const gl=probe.getContext('webgl2');supported=!!gl;gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{supported=false;}}
        setEligible(!!supported);
      },200);
    };
    const visibility=()=>setTabVisible(!document.hidden);
    update();visibility();screen.addEventListener('change',update);reduced.addEventListener('change',update);document.addEventListener('visibilitychange',visibility);
    return()=>{clearTimeout(timer);screen.removeEventListener('change',update);reduced.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  return <div className={'developer-workspace'+(ready&&!failed?' has-webgl':'')} ref={stage} role="img" aria-label="Illustrative developer workspace with a code laptop, Android phone, BillSahi dashboard and Cafe Flex panel" data-workspace-mode={ready&&!failed?'webgl':'fallback'}>
    <div className="workspace-atmosphere" aria-hidden="true"/>
    <div className="workspace-eyebrow"><span/> A DEVELOPER&apos;S WORKSPACE</div>
    <div className="workspace-composition">
      <HeroFallback/>
      {eligible&&entered&&!failed&&<WorkspaceBoundary onFailure={markFailed}><m.div className="workspace-canvas" style={{y,opacity}} aria-hidden="true"><WorkspaceCanvas active={visible&&tabVisible} progress={scrollYProgress} onReady={markReady} onFailure={markFailed}/></m.div></WorkspaceBoundary>}
    </div>
    <div className="workspace-caption"><span className="workspace-platforms">WEB <i/> ANDROID <i/> MULTI-PLATFORM</span><small>CONCEPT WORKSPACE · ILLUSTRATIVE INTERFACES</small></div>
  </div>;
}
