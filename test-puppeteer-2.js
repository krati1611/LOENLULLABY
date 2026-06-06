const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:8082/test-pano.html');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'puppeteer-screenshot-2.png' });
  await browser.close();
})();
