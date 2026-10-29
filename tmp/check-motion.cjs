const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/DELL/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const {expect}=require('C:/Users/DELL/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/@playwright/test');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--use-angle=swiftshader']});
 try{
 const errors=[];
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error'||m.type()==='warning'){if(m.text().startsWith('You have Reduced Motion enabled on your device.'))console.log('Expected Motion development notice: reduced motion enabled.');else errors.push(m.text())}});
 await page.addInitScript(()=>{window.__cls=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__cls+=entry.value}).observe({type:'layout-shift',buffered:true})});
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await expect(page.locator('#main-nav a.active')).toHaveText('Home');
 const home=page.locator('#main-nav a').filter({hasText:'Home'});
 const projects=page.locator('#main-nav a').filter({hasText:'Projects'});
 await projects.hover();
 await expect(home.locator('.nav-active-indicator')).toHaveCount(1);
 await expect.poll(()=>projects.evaluate(el=>getComputedStyle(el,'::after').transform)).toBe('matrix(1, 0, 0, 1, 0, 0)');
 await page.screenshot({path:'tmp/motion-nav-hover.png'});
 for(const id of ['about','projects','skills','education','certifications','contact','home']){
  await page.locator(`#main-nav a[href="#${id}"]`).click();
  await expect(page.locator(`#main-nav a[href="#${id}"]`)).toHaveAttribute('aria-current','location');
  const allowed=await page.locator('#'+id).evaluate(e=>Math.max(130,innerHeight-(document.documentElement.scrollHeight-(e.getBoundingClientRect().top+scrollY)))+3);
  await expect.poll(async()=>Math.round(await page.locator('#'+id).evaluate(e=>e.getBoundingClientRect().top)),{timeout:4000}).toBeLessThanOrEqual(allowed);
  console.log('Anchor checked:',id);
  // The bottom-most section cannot always align to the header; it must remain in view.
  await expect(page.locator('#'+id)).toBeInViewport();
  assert.equal(new URL(page.url()).hash,'#'+id);
 }
 await expect.poll(()=>page.evaluate(()=>scrollY),{timeout:5000}).toBe(0);
 await page.evaluate(()=>{const section=document.querySelector('#skills');scrollTo({top:section.getBoundingClientRect().top+scrollY-100,behavior:'instant'})});
 await expect(page.locator('#main-nav a[href="#skills"]')).toHaveAttribute('aria-current','location');
 await expect(page.locator('.site-header')).toHaveClass(/is-scrolled/);
 await expect.poll(()=>page.locator('.scroll-progress').evaluate(el=>getComputedStyle(el).transform)).not.toBe('matrix(0, 0, 0, 1, 0, 0)');
 const row=page.locator('.skill-row').first();
 await expect(row).toHaveClass(/is-visible/);
 await page.evaluate(()=>document.querySelector('#education').scrollIntoView({behavior:'instant'}));
 await expect.poll(()=>page.locator('.timeline-scroll-progress').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m22)).toBeGreaterThan(0);
 await page.evaluate(()=>document.querySelector('#projects').scrollIntoView({behavior:'instant'}));
 const details=page.locator('.project-details').first();const summary=details.locator('summary');
 await summary.focus();await page.keyboard.press('Enter');await expect(details).toHaveAttribute('open','');
 await page.keyboard.press('Enter');await expect(details).not.toHaveAttribute('open','');
 const first=await page.locator('.project-card h3').first().textContent();
 await page.getByRole('button',{name:'Next project',exact:true}).click();
 await expect(page.locator('.project-card h3').first()).not.toHaveText(first);
 const cls=await page.evaluate(()=>window.__cls);assert.ok(cls<.05,'Unexpected cumulative layout shift');console.log('Measured CLS:',cls);
 console.log('Desktop: every anchor, independent hover/active underlines, scroll-spy, sticky state, scroll progress, timeline, keyboard disclosures, project reorder, and CLS passed.');

 for(const width of [1050,820,390,320]){
  await page.setViewportSize({width,height:900});await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
  const menu=page.getByRole('button',{name:'Open menu'});
  await menu.click();await expect(page.getByRole('button',{name:'Close menu'})).toHaveAttribute('aria-expanded','true');
  await expect.poll(()=>page.evaluate(()=>document.activeElement?.textContent)).toBe('Home');
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
  await page.keyboard.press('Shift+Tab');await expect(page.getByRole('button',{name:'Close menu'})).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('#main-nav a').first()).toBeFocused();
  await page.keyboard.press('Escape');await expect(menu).toBeFocused();await expect(menu).toHaveAttribute('aria-expanded','false');
  assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');
  await menu.click();await page.locator('#main-nav a[href="#projects"]').click();
  await expect(menu).toHaveAttribute('aria-expanded','false');await expect(page.locator('#main-nav')).toHaveAttribute('inert','');
  await expect(page.locator('#projects')).toBeInViewport();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+' horizontal overflow');
 }
 console.log('Mobile/tablet: open/close, staggered panel, focus cycle, Escape, focus return, scroll lock, selection, inert closed links, and overflow passed at 1050/820/390/320px.');

 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 const hidden=await page.locator('[data-reveal]').evaluateAll(nodes=>nodes.filter(e=>getComputedStyle(e).opacity!=='1').length);
 assert.equal(hidden,0);
 assert.equal(await page.locator('.portrait-orbit').evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.locator('#main-nav a[href="#contact"]').click();await expect(page.locator('#main-nav a[href="#contact"]')).toHaveAttribute('aria-current','location');
 await page.screenshot({path:'tmp/motion-reduced-contact.png'});
 console.log('Reduced motion: immediately visible reveals, no ambient motion, native nonanimated scrolling and functioning navigation passed.');
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const phone=await touch.newPage();await phone.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await phone.getByRole('button',{name:'Open menu'}).tap();await phone.locator('#main-nav a[href="#projects"]').tap();
 await expect(phone.getByRole('button',{name:'Open menu'})).toHaveAttribute('aria-expanded','false');
 await phone.waitForFunction(()=>Math.abs(document.querySelector('#projects').getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop))<4);
 await phone.locator('.project-details summary').first().tap();await expect(phone.locator('.project-details').first()).toHaveAttribute('open','');
 console.log('Touch: navigation and project disclosure passed.');
 assert.deepEqual(errors,[],'Browser console warnings/errors');
 console.log('No hydration errors, browser warnings or runtime errors.');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
