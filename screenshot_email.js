const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 1000 });
  const fileUrl = 'file://' + path.resolve('pea_brain_email.html');
  await page.goto(fileUrl);
  await page.screenshot({ path: 'public/manual/email_preview.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to public/manual/email_preview.png');
})();
