const { chromium }=require('C:/Users/DELL/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [name,w,h] of [['desktop',1440,1000],['tablet',820,1180],['mobile',390,844],['small-mobile',320,740]]){
  await page.setViewportSize({width:w,height:h});await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  if(overflow)throw Error(name+' horizontal overflow');
  if(await page.locator('h1').count()!==1)throw Error('Missing heading');
  await page.screenshot({path:`tmp/portfolio-${name}-final.png`,fullPage:true});
  if(name==='desktop')await page.screenshot({path:'tmp/portfolio-hero-final.png'});
  if(name==='mobile'){
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.locator('#main-nav').getByRole('link',{name:'Skills',exact:true}).click();
   if(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')!=='false')throw Error('Menu did not close');
  }
  console.log(name+': no horizontal overflow; screenshot captured');
 }
 await page.setViewportSize({width:1440,height:1000});
 const before=await page.locator('.project-card h3').first().innerText();
 await page.getByRole('button',{name:'Next project',exact:true}).click();
 if(before===await page.locator('.project-card h3').first().innerText())throw Error('Project rotation failed');
 await page.locator('.project-details summary').first().click();
 if(await page.locator('.project-details').first().getAttribute('open')===null)throw Error('Details not open');
 const pdf=await page.request.get('http://localhost:3000/resume.pdf');
 if(pdf.status()!==200 || !(await pdf.body()).subarray(0,4).equals(Buffer.from('%PDF')))throw Error('Resume download invalid');
 if(errors.length)throw Error(errors.join('\n'));
 console.log('Menu, project rotation, details, resume response and browser runtime checks passed.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
