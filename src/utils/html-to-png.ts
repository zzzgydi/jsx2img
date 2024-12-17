import puppeteer from "puppeteer";
import { browserPool } from "./browser-pool.js";

export async function htmlToPng(html: string, width = 800, height = 600) {
  let browser: puppeteer.Browser = null!;
  let page: puppeteer.Page = null!;

  try {
    browser = await browserPool.acquire();
    page = await browser.newPage();

    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: ["load"] });

    // get the bounding box of the body
    const elementHandle = await page.$("body > *");
    const bbox = await elementHandle?.boundingBox();

    let clip: any | undefined;

    if (bbox && bbox.width > 0 && bbox.height > 0) {
      clip = {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
      };
    }

    // use transparent screenshot
    const screenshot = await page.screenshot({
      type: "png",
      omitBackground: true,
      clip,
    });

    return screenshot;
  } finally {
    if (page) {
      await page.close().catch(console.error);
    }
    if (browser) {
      await browserPool.release(browser);
    }
  }
}
