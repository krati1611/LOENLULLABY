const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:8081/index.html');
  // Wait for the walkthrough section to be visible
  await page.waitForSelector('#walkthrough');
  // Scroll to the walkthrough section
  await page.evaluate(() => {
    document.querySelector('#walkthrough').scrollIntoView();
  });
  // Wait for Pannellum to initialize
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'puppeteer-screenshot.png' });
  await browser.close();
})();
