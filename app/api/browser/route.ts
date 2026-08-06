import { NextResponse } from 'next/server';
import Browserbase from '@browserbasehq/sdk';
import { chromium } from 'playwright-core';

export async function POST(req: Request) {
  try {
    const { action, sessionId, url, selector, text } = await req.json();

    const apiKey = process.env.BROWSERBASE_API_KEY;
    const projectId = process.env.BROWSERBASE_PROJECT_ID;

    if (!apiKey) {
      return NextResponse.json({ error: 'BROWSERBASE_API_KEY is missing' }, { status: 400 });
    }

    if (action === 'start') {
      if (!projectId) {
        return NextResponse.json({ error: 'BROWSERBASE_PROJECT_ID is missing in .env' }, { status: 400 });
      }

      const bb = new Browserbase({ apiKey });
      const session = await bb.sessions.create({ projectId, keepAlive: true });

      // Wait for session to initialize by briefly connecting and grabbing the actual page ID
      const browser = await chromium.connectOverCDP(`wss://connect.browserbase.com?apiKey=${apiKey}&sessionId=${session.id}`);
      const contexts = browser.contexts();
      const context = contexts[0];
      const pages = context.pages();
      const page = pages.length > 0 ? pages[0] : await context.newPage();

      // We get the actual page target ID via CDP if we wanted the perfect debug URL, but Browserbase provides a generic one:
      const connectUrl = await bb.sessions.debug(session.id);
      await browser.close();

      return NextResponse.json({
        sessionId: session.id,
        debugUrl: connectUrl.debuggerUrl
      });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required for browser actions' }, { status: 400 });
    }

    // Connect to the active Browserbase session
    const browser = await chromium.connectOverCDP(`wss://connect.browserbase.com?apiKey=${apiKey}&sessionId=${sessionId}`);
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();

    let result = 'Success';

    if (action === 'goto' && url) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      result = `Navigated to ${url}`;
    } else if (action === 'click' && selector) {
      await page.click(selector);
      result = `Clicked element ${selector}`;
    } else if (action === 'type' && selector && text) {
      await page.fill(selector, text);
      result = `Typed into ${selector}`;
    } else if (action === 'extract') {
      result = await page.evaluate(() => document.body.innerText);
    } else if (action === 'scroll') {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      result = 'Scrolled down';
    }

    // Disconnect without killing the browser
    await browser.close();

    return NextResponse.json({ result });

  } catch (error: any) {
    console.error('Browser API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
