const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/DELL/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const {expect}=require('C:/Users/DELL/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/@playwright/test');
(async()=>{
 const browser=await chromium.launch();
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['warning','error'].includes(m.type())&&!m.text().startsWith('You have Reduced Motion enabled'))errors.push(m.text())});
 await page.addInitScript(()=>{window.__cls=0;new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__cls+=e.value})).observe({type:'layout-shift',buffered:true})});
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 const transform=selector=>page.locator(selector).first().evaluate(e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return {x:m.m41,y:m.m42,scale:e.classList.contains('timeline-scroll-progress')?m.m22:m.m11,opacity:Number(getComputedStyle(e).opacity)}});
 const scroll=async y=>{await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y)};
 await expect.poll(async()=>(await transform('.scroll-progress')).scale).toBeLessThan(.001);
 await scroll(350);
 await expect.poll(async()=>(await transform('.hero-scroll-layer')).y).toBeLessThan(-4);
 const desktop=await transform('.hero-scroll-layer');assert.ok(desktop.y>=-29&&desktop.scale>=.96&&desktop.opacity>=.59);
 assert.equal(await page.locator('.hero-text').evaluate(e=>getComputedStyle(e).transform),'none');
 await page.screenshot({path:'tmp/scroll-hero-desktop.png'});
 console.log('Hero desktop:',desktop);
 await page.setViewportSize({width:390,height:844});await scroll(350);
 await expect.poll(async()=>(await transform('.hero-scroll-layer')).y).toBeGreaterThan(desktop.y);
 const mobile=await transform('.hero-scroll-layer');assert.ok(Math.abs(mobile.y)<10);
 console.log('Hero mobile motion is reduced:',mobile);
 await page.setViewportSize({width:1440,height:1000});
 const preview=page.locator('.project-preview').first();
 const top=await preview.evaluate(e=>e.getBoundingClientRect().top+scrollY);
 await scroll(top-800);
 await expect.poll(async()=>(await transform('.project-scroll-visual')).y).toBeGreaterThan(0);
 const projectBefore=await transform('.project-scroll-visual');
 const textBefore=await page.locator('.project-detail').first().evaluate(e=>e.getBoundingClientRect().top+scrollY);
 await scroll(top-40);
 await expect.poll(async()=>(await transform('.project-scroll-visual')).y).toBeLessThan(projectBefore.y-2);
 const projectAfter=await transform('.project-scroll-visual');assert.ok(Math.abs(projectAfter.y)<8&&projectAfter.scale<=1.02);
 const textAfter=await page.locator('.project-detail').first().evaluate(e=>e.getBoundingClientRect().top+scrollY);assert.ok(Math.abs(textAfter-textBefore)<1);
 await expect(page.locator('.project-card').first()).toHaveClass(/is-visible/);
 await page.screenshot({path:'tmp/scroll-projects-desktop.png'});
 console.log('Project artwork changes while text remains fixed:',{projectBefore,projectAfter});
 const timeline=await page.locator('.academic-timeline').evaluate(e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight}));
 const viewport=1000;
 const start=timeline.top-viewport*.75;
 const end=timeline.top+timeline.height-viewport*.65;
 const values=[];
 for(const p of [0,.25,.5,.75,1]){
  await scroll(start+(end-start)*p);
  await expect.poll(async()=>Math.abs((await transform('.timeline-scroll-progress')).scale-p)).toBeLessThan(.03);
  values.push((await transform('.timeline-scroll-progress')).scale);
 }
 assert.ok(values[1]>0&&values[1]<.4&&values[2]>.4&&values[2]<.6);
 assert.equal(await page.locator('.academic-item[data-current=true]').count(),1);
 await page.screenshot({path:'tmp/scroll-timeline-desktop.png'});
 console.log('Continuous timeline at 0/25/50/75/100%:',values);
 await scroll(0);await expect.poll(async()=>(await transform('.scroll-progress')).scale).toBeLessThan(.001);
 await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
 await expect.poll(async()=>(await transform('.scroll-progress')).scale).toBeGreaterThan(.999);
 console.log('Spring progress reaches both endpoints.');
 await page.emulateMedia({reducedMotion:'reduce'});await scroll(350);
 await expect.poll(async()=>(await transform('.hero-scroll-layer')).y).toBe(0);
 assert.equal((await transform('.hero-scroll-layer')).scale,1);
 assert.equal((await transform('.hero-scroll-layer')).opacity,1);
 assert.equal((await transform('.project-scroll-visual')).y,0);
 assert.equal((await transform('.timeline-scroll-progress')).scale,1);
 console.log('Reduced motion: no parallax/fading; full timeline readable.');
 await page.emulateMedia({reducedMotion:'no-preference'});
 for(const width of [1440,820,390,320]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+' overflow')}
 console.log('No horizontal overflow at 1440/820/390/320px.');
 const cls=await page.evaluate(()=>window.__cls);console.log('Measured CLS:',cls);assert.ok(cls<.05);
 assert.deepEqual(errors,[]);console.log('No hydration errors, runtime errors or unexpected console warnings.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
