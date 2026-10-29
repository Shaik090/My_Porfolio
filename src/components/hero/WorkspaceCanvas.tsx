'use client';

import { Suspense, useEffect, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, RoundedBox, useTexture } from '@react-three/drei';
import { useMotionValueEvent, type MotionValue } from 'motion/react';
import { Group, MathUtils, OrthographicCamera, SRGBColorSpace, type Mesh, type Material, type Texture } from 'three';

type ModelProps={objectRef:RefObject<Group|null>;texture:Texture};
const GRAPHITE='#13292f';
function Body({size,radius=.07}:{size:[number,number,number];radius?:number}) {
  return <RoundedBox args={size} radius={radius} smoothness={2} bevelSegments={2}><meshStandardMaterial color={GRAPHITE} metalness={.65} roughness={.3} transparent/></RoundedBox>;
}
function Screen({texture,width,height,z}:{texture:Texture;width:number;height:number;z:number}) {
  return <mesh position={[0,0,z]}><planeGeometry args={[width,height]}/><meshBasicMaterial map={texture} toneMapped={false} transparent/></mesh>;
}
function WorkspaceLaptop({objectRef,texture}:ModelProps) {
  return <group ref={objectRef} scale={.001}>
    <Body size={[3.55,2.24,.13]}/><Screen texture={texture} width={3.3} height={1.98} z={.071}/>
    <group position={[0,-1.13,.52]}><Body size={[3.75,.09,1.24]} radius={.035}/>
      <mesh position={[0,.051,.02]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[2.7,.65]}/><meshStandardMaterial color="#203b3e" transparent/></mesh>
      {[0,1,2,3].map(row=><mesh key={row} position={[0,.054,-.22+row*.14]}><boxGeometry args={[2.45,.008,.035]}/><meshStandardMaterial color="#3c655f" transparent/></mesh>)}
      <mesh position={[0,.056,.43]}><boxGeometry args={[.75,.008,.2]}/><meshStandardMaterial color="#30514e" transparent/></mesh>
    </group>
    <mesh position={[0,1.065,.073]}><circleGeometry args={[.016,8]}/><meshBasicMaterial color="#44dba3" transparent/></mesh>
  </group>;
}
function WorkspacePhone({objectRef,texture}:ModelProps) {
  return <group ref={objectRef} scale={.001}>
    <Body size={[1.1,2.15,.13]} radius={.11}/><Screen texture={texture} width={.95} height={1.94} z={.075}/>
    <mesh position={[0,.94,.081]}><boxGeometry args={[.32,.055,.012]}/><meshBasicMaterial color="#061317" transparent/></mesh>
    <mesh position={[.565,.3,0]}><boxGeometry args={[.025,.25,.04]}/><meshStandardMaterial color="#437e70" transparent/></mesh>
  </group>;
}
function WorkspacePanel({objectRef,texture,size}:{objectRef:RefObject<Group|null>;texture:Texture;size:[number,number]}) {
  return <group ref={objectRef} scale={.001}><Body size={[size[0]+.1,size[1]+.1,.07]} radius={.055}/><Screen texture={texture} width={size[0]} height={size[1]} z={.041}/></group>;
}

interface SceneProps {active:boolean;progress:MotionValue<number>;pointer:RefObject<{x:number;y:number}>;wake:RefObject<()=>void>;onReady:()=>void}
function WorkspaceScene({active,progress,pointer,wake,onReady}:SceneProps) {
  const [code,phone,billsahi,cafe]=useTexture(['/images/workspace/code.svg','/images/workspace/phone.svg','/images/workspace/billsahi.svg','/images/workspace/cafe.svg']);
  const root=useRef<Group>(null);const laptop=useRef<Group>(null);const mobile=useRef<Group>(null);const bill=useRef<Group>(null);const coffee=useRef<Group>(null);
  const cursor=useRef<Mesh>(null);
  const time=useRef(0);const complete=useRef(false);
  const materials=useRef<Material[][]>([]);
  const {invalidate,camera,size}=useThree();
  useEffect(()=>{
    for(const texture of [code,phone,billsahi,cafe]){texture.colorSpace=SRGBColorSpace;texture.anisotropy=2;texture.needsUpdate=true;}
    materials.current=[laptop,mobile,bill,coffee].map(ref=>{const list:Material[]=[];ref.current?.traverse(node=>{const material=(node as Mesh).material;if(material)list.push(...(Array.isArray(material)?material:[material]));});return list;});
    onReady();invalidate();
  },[code,phone,billsahi,cafe,onReady,invalidate]);
  useEffect(()=>{wake.current=invalidate;return()=>{wake.current=()=>{};}},[wake,invalidate]);
  useEffect(()=>{const ortho=camera as OrthographicCamera;ortho.zoom=Math.min(size.width/6.2,size.height/4.5);ortho.position.set(0,1.25,9);ortho.lookAt(0,0,0);ortho.updateProjectionMatrix();invalidate();},[camera,size.width,size.height,invalidate]);
  useMotionValueEvent(progress,'change',()=>{if(active)invalidate();});
  useEffect(()=>{if(!active)return;invalidate();const timer=setInterval(()=>{if(cursor.current){cursor.current.visible=!cursor.current.visible;invalidate();}},1000);return()=>clearInterval(timer);},[active,invalidate]);
  useFrame((_,delta)=>{
    if(!active||!root.current)return;
    const dt=Math.min(delta,.04);time.current+=dt;
    const scroll=progress.get();const desiredX=pointer.current.x*.065;const desiredY=-.10+pointer.current.y*.045+scroll*.045;
    root.current.rotation.y=MathUtils.damp(root.current.rotation.y,desiredX,7,dt);
    root.current.rotation.x=MathUtils.damp(root.current.rotation.x,desiredY,7,dt);
    root.current.position.y=MathUtils.damp(root.current.position.y,-scroll*.18,7,dt);
    const refs=[laptop,mobile,bill,coffee];
    const positions=[[-.55,.05,0],[1.6,-.4,.95],[1.37,1.25,-.38],[-1.75,-1.22,1.6]];
    const rotations=[[.025,-.11,-.035],[.04,-.24,-.07],[.02,-.20,.03],[.04,.12,-.08]];
    let assembling=false;
    refs.forEach((ref,index)=>{
      const node=ref.current;if(!node)return;
      const p=MathUtils.clamp((time.current-.12-index*.16)/.95,0,1);const ease=1-Math.pow(1-p,3);
      node.scale.setScalar(.88+.12*ease);
      node.position.set(positions[index][0],positions[index][1]+(1-ease)*.22,positions[index][2]-(1-ease)*.55+scroll*(index%2===0?-.12:.12));
      node.rotation.set(rotations[index][0]+(1-ease)*.06,rotations[index][1],rotations[index][2]);
      if(!complete.current)materials.current[index]?.forEach(material=>{material.opacity=ease;});
      if(p<1)assembling=true;
    });
    complete.current=!assembling;
    if(assembling||Math.abs(root.current.rotation.y-desiredX)>.0002||Math.abs(root.current.rotation.x-desiredY)>.0002||Math.abs(root.current.position.y+scroll*.18)>.0002)invalidate();
  });
  return <>
    <ambientLight intensity={1.25}/><directionalLight position={[1,4,6]} intensity={2.6} color="#d3f8eb"/><directionalLight position={[-4,1,2]} intensity={2} color="#2bf1a8"/><directionalLight position={[4,-1,2]} intensity={1.4} color="#24bbcb"/>
    <group ref={root} rotation={[-.1,0,0]}>
      <WorkspaceLaptop objectRef={laptop} texture={code}/><WorkspacePhone objectRef={mobile} texture={phone}/><WorkspacePanel objectRef={bill} texture={billsahi} size={[1.9,1.235]}/><WorkspacePanel objectRef={coffee} texture={cafe} size={[1.6,.96]}/>
      <Line points={[[-1.7,-.75,.15],[-2.35,-.65,.25],[-2.35,-1.2,.5],[-1.7,-1.25,.5]]} color="#39cfa5" lineWidth={.8} transparent opacity={.3}/>
      <Line points={[[.85,.8,-.2],[2.35,.8,-.2],[2.35,-.1,.3],[1.8,-.1,.7]]} color="#36c6bd" lineWidth={.8} transparent opacity={.28}/>
      <mesh ref={cursor} position={[-1.76,-.38,.085]}><planeGeometry args={[.014,.065]}/><meshBasicMaterial color="#8bf4c1" transparent/></mesh>
    </group>
  </>;
}

export default function WorkspaceCanvas({active,progress,onReady,onFailure}:{active:boolean;progress:MotionValue<number>;onReady:()=>void;onFailure:()=>void}) {
  const pointer=useRef({x:0,y:0});const wake=useRef(()=>{});const bounds=useRef<DOMRect|null>(null);const host=useRef<HTMLDivElement>(null);
  return <div className="workspace-webgl-host" ref={host} onPointerEnter={event=>{if(event.pointerType==='mouse')bounds.current=host.current!.getBoundingClientRect();}} onPointerMove={event=>{if(event.pointerType!=='mouse'||!bounds.current)return;const rect=bounds.current;pointer.current.x=MathUtils.clamp((event.clientX-rect.left)/rect.width*2-1,-1,1);pointer.current.y=MathUtils.clamp((event.clientY-rect.top)/rect.height*2-1,-1,1);wake.current();}} onPointerLeave={()=>{pointer.current={x:0,y:0};bounds.current=null;wake.current();}} onPointerCancel={()=>{pointer.current={x:0,y:0};wake.current();}}>
    <Canvas orthographic camera={{zoom:85,position:[0,1.25,9],near:.1,far:30}} dpr={[1,1.5]} frameloop="demand" gl={{antialias:true,alpha:true,powerPreference:'low-power'}} onCreated={({gl})=>{gl.setClearColor('#030c10',0);gl.domElement.addEventListener('webglcontextlost',onFailure,{once:true});}} fallback={null}>
      <Suspense fallback={null}><WorkspaceScene active={active} progress={progress} pointer={pointer} wake={wake} onReady={onReady}/></Suspense>
    </Canvas>
  </div>;
}
