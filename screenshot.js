import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  // type a message
  await page.type('textarea', 'First message');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
  console.log("Screenshot saved to screenshot.png");
})();
