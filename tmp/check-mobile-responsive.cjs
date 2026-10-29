const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('C:/Users/DELL/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const { expect } = require('C:/Users/DELL/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/@playwright/test');
const base = process.env.AUDIT_URL || 'http://localhost:3100';
const widths = process.env.AUDIT_WIDTHS ? process.env.AUDIT_WIDTHS.split(',').map(Number) : [320, 360, 390, 430, 600, 768, 1024, 1440];
const sections = ['home', 'about', 'projects', 'skills', 'education', 'certifications', 'contact'];
const results = [];
async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), label);
}
async function openFromCurrentPosition(page, button) {
  await button.scrollIntoViewIfNeeded();
  await page.waitForTimeout(750);
  const top = await page.evaluate(() => scrollY);
  const box = await button.boundingBox();
  if (page.viewportSize().width <= 1050) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  else await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  return top;
}
async function checkWidth(browser, width) {
  const mobile = width <= 1050;
  const page = await browser.newPage({ viewport: { width, height: 900 }, hasTouch: mobile, isMobile: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  const errors = [];
  const failedResources = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) failedResources.push(`${response.status()} ${new URL(response.url()).pathname}`); });
  let deliveries = 0;
  await page.route('https://api.emailjs.com/**', async route => { deliveries++; await route.fulfill({ status: 200, body: 'OK' }); });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  const header = await page.locator('.site-header').boundingBox();
  await noOverflow(page, `initial ${width}`);
  assert.equal(await page.locator('canvas').count(), 0);
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  assert.ok(!/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(?:\D|$)/i.test(viewport));
  const name = (await page.locator('h1').textContent()).replace(/\s+/g, ' ').trim();
  assert.equal(name, 'Shaik Mohammad Nowman');
  const portrait = await page.locator('.portrait-stage').boundingBox();
  const chips = await page.locator('.orbit-skill').evaluateAll(nodes => nodes.map(node => {
    const r = node.getBoundingClientRect(); return { text: node.textContent, left: r.left, right: r.right, width: r.width };
  }));
  if (mobile) {
    assert.ok(header.height >= 64 && header.height <= 72);
    for (const chip of chips) assert.ok(chip.left >= portrait.x - 1 && chip.right <= portrait.x + portrait.width + 1, `clipped chip ${width}: ${chip.text}`);
    assert.equal(await page.locator('.hero-ambient-rig').getAttribute('data-animate'), 'false');
    assert.equal(await page.locator('#sender-email').evaluate(node => getComputedStyle(node).fontSize), '16px');
    assert.equal(await page.locator('.reference-portrait').evaluate(node => getComputedStyle(node).backgroundImage.includes('mobile.webp')), true);
    const toggle = page.getByRole('button', { name: 'Open menu', exact: true });
    const toggleBox = await toggle.boundingBox();
    assert.ok(toggleBox.width >= 44 && toggleBox.height >= 44);
    await toggle.click();
    const nav = page.locator('#main-nav');
    await expect(nav.locator('a').first()).toBeFocused();
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    assert.equal(await nav.locator('a').count(), 8);
    for (let i = 0; i < 9; i++) await page.keyboard.press('Tab');
    await expect(nav.locator('a').first()).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Close menu', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    assert.ok(await nav.evaluate(node => node.inert));
    await toggle.click();
    await page.mouse.click(5, 890);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    const download = page.waitForEvent('download');
    await nav.getByRole('link', { name: 'Download Resume' }).click();
    assert.equal((await download).suggestedFilename(), 'Shaik_Mohammad_Nowman_Resume.pdf');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  } else {
    await expect(page.locator('.mobile-menu-resume')).toBeHidden();
    await expect(page.locator('.nav-resume')).toBeVisible();
  }
  for (const id of sections) {
    if (mobile) await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await page.locator(`#main-nav a[href="#${id}"]`).click();
    await expect(page.locator(`#main-nav a[href="#${id}"]`)).toHaveAttribute('aria-current', 'location');
    await expect.poll(() => page.locator(`#${id}`).evaluate(node => {
      const top = node.getBoundingClientRect().top;
      return top >= document.querySelector('.site-header').getBoundingClientRect().bottom - 1 && top < innerHeight;
    }), { timeout: 5000 }).toBe(true);
    await page.waitForTimeout(750);
    await noOverflow(page, `${id} ${width}`);
    const clipped = await page.locator(`#${id} h1,#${id} h2,#${id} h3`).evaluateAll(nodes => nodes.filter(node => {
      if (!node.getClientRects().length) return false;
      const range = document.createRange(); range.selectNodeContents(node);
      return Array.from(range.getClientRects()).some(r => r.left < -1 || r.right > innerWidth + 1);
    }).map(node => node.textContent));
    assert.deepEqual(clipped, [], `clipped headings ${width} ${id}`);
    if ([320, 390, 768].includes(width) && ['home', 'education', 'certifications', 'contact'].includes(id)) {
      await page.screenshot({ path: `tmp/mobile-final-${id}-${width}.png` });
    }
  }
  // Manual scrolling also updates the navigation; a click is not the only trigger.
  await page.evaluate(() => scrollTo({ top: document.querySelector('#skills').getBoundingClientRect().top + scrollY - 90, behavior: 'instant' }));
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#main-nav a[href="#skills"]')).toHaveAttribute('aria-current', 'location');
  const columns = await page.locator('.projects-list').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length);
  assert.equal(columns, width <= 900 ? 1 : 2);
  if (mobile) {
    for (const selector of ['.hero-actions .button', '.project-controls button', '.project-details summary', '.certificate-eye']) {
      const sizes = await page.locator(selector).evaluateAll(nodes => nodes.map(node => ({ w: node.getBoundingClientRect().width, h: node.getBoundingClientRect().height })));
      assert.ok(sizes.every(size => size.w >= 44 && size.h >= 44), `${selector} touch targets ${width}`);
    }
  }
  const billButton = page.getByRole('button', { name: 'Explore Screenshots', exact: true });
  const openingTop = await openFromCurrentPosition(page, billButton);
  const gallery = page.locator('#billsahi-screenshots');
  await expect(gallery).toHaveAttribute('open', '');
  await noOverflow(page, `BillSahi popup ${width}`);
  const thumbs = gallery.locator('.bs-gallery-thumbnails button');
  assert.equal(await thumbs.count(), 5);
  await thumbs.last().click();
  await expect(thumbs.last()).toHaveAttribute('aria-pressed', 'true');
  await gallery.getByRole('button', { name: 'Next BillSahi screenshot', exact: true }).click();
  await expect(thumbs.first()).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(thumbs.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await gallery.getByRole('button', { name: 'View Larger', exact: true }).click();
  const lightbox = page.locator('.bs-gallery-lightbox');
  await expect(lightbox).toHaveAttribute('open', '');
  if (mobile) {
    await lightbox.getByRole('button', { name: 'Zoom in', exact: true }).click();
    const pane = lightbox.locator('.bs-lightbox-image');
    await expect.poll(() => pane.evaluate(node => {
      const action = getComputedStyle(node).touchAction;
      return action === 'manipulation' || action.includes('pinch-zoom');
    })).toBe(true);
    await expect.poll(() => pane.locator('img').evaluate(img => img.complete && img.naturalWidth > 0), { timeout: 20000 }).toBe(true);
    assert.ok(await pane.evaluate(node => node.scrollWidth > node.clientWidth));
    await pane.evaluate(node => { node.scrollLeft = 250; });
    assert.ok(await pane.evaluate(node => node.scrollLeft >= 250));
    await pane.focus();
    const title = await lightbox.locator('h3').textContent();
    await page.keyboard.press('ArrowRight');
    assert.equal(await lightbox.locator('h3').textContent(), title, 'arrow pans instead of changing a zoomed image');
    await noOverflow(page, `zoomed screenshot ${width}`);
    if (width === 390) await page.screenshot({ path: 'tmp/mobile-qa-billsahi-zoom-390.png' });
    await lightbox.getByRole('button', { name: 'Fit to screen', exact: true }).click();
  } else await expect(lightbox.locator('.mobile-screenshot-zoom')).toBeHidden();
  await lightbox.getByRole('button', { name: 'Next screenshot in larger viewer', exact: true }).click();
  await expect(thumbs.nth(2)).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(lightbox).not.toHaveAttribute('open');
  await expect(gallery).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(gallery).not.toHaveAttribute('open');
  await expect(billButton).toBeFocused();
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - openingTop) < 2, 'popup restores document position');
  const cafe = page.getByRole('button', { name: 'View Cafe Flex screenshots', exact: true });
  await openFromCurrentPosition(page, cafe);
  const cafeDialog = page.locator('.project-proof-modal');
  await expect(cafeDialog).toHaveAttribute('open', '');
  const cafeThumbs = cafeDialog.locator('.project-proof-thumbnails button');
  assert.equal(await cafeThumbs.count(), 5);
  await cafeThumbs.last().click();
  await expect(cafeThumbs.last()).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(cafeThumbs.nth(3)).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => cafeDialog.locator('.project-proof-stage img').evaluate(img => img.complete && img.naturalWidth > 0), { timeout: 20000 }).toBe(true);
  await noOverflow(page, `Cafe Flex popup ${width}`);
  if (width === 390) { await cafeDialog.evaluate(node => { node.scrollTop = 0; }); await page.screenshot({ path: 'tmp/mobile-qa-cafe-390.png' }); }
  await page.keyboard.press('Escape');
  await expect(cafe).toBeFocused();
  for (let i = 0; i < 2; i++) {
    const eye = page.locator('.certificate-eye').nth(i);
    await openFromCurrentPosition(page, eye);
    const certificate = page.locator('.certificate-modal');
    await expect(certificate).toHaveAttribute('open', '');
    await expect.poll(() => certificate.locator('.certificate-large-image img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    const pdf = await page.request.get(new URL(await certificate.locator('.certificate-pdf-link').getAttribute('href'), base).href);
    assert.equal(pdf.status(), 200);
    assert.equal((await pdf.body()).subarray(0, 4).toString(), '%PDF');
    await noOverflow(page, `certificate ${i} ${width}`);
    await page.keyboard.press('Escape');
    await expect(eye).toBeFocused();
  }
  await page.locator('#contact-message').scrollIntoViewIfNeeded();
  await page.getByLabel('Your name', { exact: true }).fill('Mobile audit');
  await page.getByLabel('Your email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Subject', { exact: true }).fill('Local responsive test');
  await page.getByLabel('Your message', { exact: true }).fill('This request is intercepted locally and never delivered.');
  await page.getByRole('button', { name: 'Send Message', exact: true }).click();
  await expect(page.locator('.message-form-status')).toContainText('sent successfully');
  assert.equal(deliveries, 1);
  await noOverflow(page, `form ${width}`);
  assert.deepEqual(errors, [], `runtime errors ${width}`);
  assert.deepEqual(failedResources, [], `failed resources ${width}`);
  const images = await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => /nowman-(hero|about).*(png|webp)/.test(entry.name)).map(entry => new URL(entry.name).pathname));
  if (mobile) assert.ok(images.every(name => !name.endsWith('.png')), `original portraits loaded ${width}: ${images.join(', ')}`);
  results.push({ width, headerHeight: header.height, projectColumns: columns, imageResources: images, runtimeErrors: errors.length, checks: 'navigation, anchors, active state, targets, galleries, zoom, certificates, form and overflow passed' });
  console.log(`PASS ${width}px`);
  await page.close();
}
(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of widths) await checkWidth(browser, width);
    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', hasTouch: true });
    await reduced.goto(base, { waitUntil: 'networkidle' });
    await reduced.waitForTimeout(500);
    assert.equal(await reduced.locator('.hero-holo-word').first().evaluate(node => getComputedStyle(node).animationName), 'none');
    const hidden = await reduced.locator('[data-reveal]').evaluateAll(nodes => nodes.filter(node => getComputedStyle(node).opacity !== '1').length);
    assert.equal(hidden, 0, 'reduced-motion content is visible');
    await noOverflow(reduced, 'reduced motion');
    await reduced.setViewportSize({ width: 600, height: 360 });
    await reduced.getByRole('button', { name: 'Open menu', exact: true }).click();
    const nav = reduced.locator('#main-nav');
    assert.ok(await nav.evaluate(node => node.scrollHeight > node.clientHeight), 'short landscape menu scrolls');
    await nav.locator('.mobile-menu-resume').focus();
    await expect(nav.locator('.mobile-menu-resume')).toBeInViewport();
    await reduced.keyboard.press('Escape');
    await noOverflow(reduced, 'landscape');
    results.push({ reducedMotion: 'visible content, no hero animation', shortLandscapeMenu: 'scrollable and keyboard accessible' });
    fs.writeFileSync('tmp/mobile-responsive-checks.json', JSON.stringify(results, null, 2));
    console.log('PASS reduced motion and short landscape. EmailJS requests intercepted; no real email sent.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); fs.writeFileSync('tmp/mobile-responsive-checks.json', JSON.stringify({ completed: results, error: error.message }, null, 2)); process.exitCode = 1; });
