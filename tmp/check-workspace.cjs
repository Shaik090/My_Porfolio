const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/DELL/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const {expect}=require('C:/Users/DELL/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/@playwright/test');
(async()=>{
 const browser=await chromium.launch({args:['--enable-unsafe-swiftshader','--use-angle=swiftshader']});
 try{
 const errors=[];
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['warning','error'].includes(m.type())&&!m.text().startsWith('You have Reduced Motion enabled'))errors.push(m.text())});
 await page.addInitScript(()=>{
  window.__draws=0;window.__cls=0;
  for(const name of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){const original=WebGL2RenderingContext.prototype[name];WebGL2RenderingContext.prototype[name]=function(...args){window.__draws++;return original.apply(this,args)}}
  new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__cls+=e.value})).observe({type:'layout-shift',buffered:true});
 });
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await expect(page.getByRole('heading',{name:'Shaik Mohammad Nowman',exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'Explore Projects',exact:true})).toHaveAttribute('href','#projects');
 await expect(page.getByRole('link',{name:'Contact Me',exact:true})).toHaveAttribute('href','#contact');
 await expect(page.locator('.developer-workspace')).toHaveAttribute('data-workspace-mode','webgl',{timeout:20000});
 await page.waitForTimeout(2600);
 const canvas=page.locator('.workspace-canvas canvas');
 assert.ok(await page.evaluate(()=>window.__draws)>0,'No real WebGL draw calls');
 const before=await canvas.screenshot();const box=await canvas.boundingBox();
 await page.mouse.move(box.x+box.width*.85,box.y+box.height*.3);await page.waitForTimeout(500);
 const after=await canvas.screenshot();assert.notDeepEqual(before,after,'Pointer interaction did not change canvas');
 await page.mouse.move(25,130);await page.waitForTimeout(1400);
 const idleSamples=[];for(let i=0;i<4;i++){const first=await page.evaluate(()=>window.__draws);await page.waitForTimeout(140);idleSamples.push((await page.evaluate(()=>window.__draws))-first)}
 assert.ok(idleSamples.some(n=>n===0),'Renderer did not settle to demand mode');
 console.log('Real desktop WebGL, mouse response and idle demand rendering passed.',idleSamples);
 await page.screenshot({path:'tmp/workspace-final-desktop.png'});
 await page.evaluate(()=>scrollTo({top:300,behavior:'instant'}));
 await expect.poll(()=>page.locator('.workspace-canvas').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m42)).toBeLessThan(-2);
 await page.locator('#contact').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
 const offscreen=await page.evaluate(()=>window.__draws);await page.waitForTimeout(1200);assert.equal(await page.evaluate(()=>window.__draws),offscreen,'Offscreen renderer kept drawing');
 console.log('Scroll transforms and offscreen rendering pause passed.');
 for(const width of [1024,820,390,320]){
  await page.setViewportSize({width,height:900});await page.goto('http://localhost:3000',{waitUntil:'networkidle'});await page.waitForTimeout(1100);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+' overflow');
  if(width<900){await expect(page.locator('.developer-workspace')).toHaveAttribute('data-workspace-mode','fallback');await expect(page.locator('.workspace-fallback')).toBeVisible();assert.equal(await page.locator('.workspace-canvas canvas').count(),0)}
  if(width===390){await page.getByRole('button',{name:'Open menu'}).click();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Open menu'})).toBeFocused();await page.screenshot({path:'tmp/workspace-final-mobile-hero.png'});await page.locator('.developer-workspace').screenshot({path:'tmp/workspace-final-mobile-art.png'});}
 }
 console.log('Desktop/tablet/mobile widths and lightweight mobile fallback passed.');
 const reduced=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const rp=await reduced.newPage();rp.on('pageerror',e=>errors.push(e.message));rp.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await rp.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await expect(rp.locator('.developer-workspace')).toHaveAttribute('data-workspace-mode','fallback');assert.equal(await rp.locator('canvas').count(),0);assert.equal(await rp.locator('.workspace-name-line>span').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 console.log('Reduced motion before hydration: immediate content and complete fallback, no WebGL.');
 const unsupported=await browser.newPage({viewport:{width:1440,height:1000}});await unsupported.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...rest){return String(type).includes('webgl')?null:original.call(this,type,...rest)}});await unsupported.goto('http://localhost:3000',{waitUntil:'networkidle'});await unsupported.waitForTimeout(800);await expect(unsupported.locator('.workspace-fallback')).toBeVisible();assert.equal(await unsupported.locator('.workspace-canvas canvas').count(),0);console.log('Unsupported WebGL fallback passed.');
 const cls=await page.evaluate(()=>window.__cls);assert.ok(cls<.05);console.log('Measured current-page CLS:',cls);
 const pdf=await page.request.get('http://localhost:3000/resume.pdf');assert.equal(pdf.status(),200);
 assert.deepEqual(errors,[]);console.log('Resume, no hydration/runtime errors, and no unexpected console warnings passed.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
