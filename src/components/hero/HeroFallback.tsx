import Image from 'next/image';

/** Complete lightweight workspace, also rendered before WebGL has loaded. */
export default function HeroFallback() {
  return <div className="workspace-fallback">
    <div className="fallback-laptop"><div className="fallback-laptop-lid"><Image src="/images/workspace/code.svg" alt="" width={1200} height={720} priority/></div><span className="fallback-laptop-base"/></div>
    <div className="fallback-phone"><Image src="/images/workspace/phone.svg" alt="" width={480} height={920}/><span/></div>
    <div className="fallback-billsahi"><Image src="/images/workspace/billsahi.svg" alt="" width={800} height={520}/></div>
    <div className="fallback-cafe"><Image src="/images/workspace/cafe.svg" alt="" width={700} height={420}/></div>
    <svg className="fallback-connections" viewBox="0 0 600 520" fill="none" aria-hidden="true"><path d="M180 390 110 345 140 280M390 155 480 185 500 280" stroke="#2ddaa4" strokeWidth="1" strokeDasharray="4 6" opacity=".4"/></svg>
  </div>;
}
