import puppeteer from "puppeteer";

export async function htmlToPng(html: string, width = 800, height = 600) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      // "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: ["load", "networkidle0"] });

    // get the bounding box of the body
    const elementHandle = await page.$("body > *");
    const bbox = await elementHandle?.boundingBox();

    let clip: any | undefined;

    if (bbox) {
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
    await browser.close();
  }
}
