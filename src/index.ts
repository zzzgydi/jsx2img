import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { prepareHTML } from "./utils/transform-jsx.js";
import { htmlToPng } from "./utils/html-to-png.js";
import { browserPool } from "./utils/browser-pool.js";
import { testCase } from "./mock.js";

const app = new Hono();

app.use(logger());

app.get("/health", (c) => {
  return c.text("ok");
});

app.post("/convert", async (c) => {
  const { jsx, html, style, data, width, height } = await c.req.json();
  // const { jsx, html, style, data, width, height } = testCase;

  // check
  if (!jsx && !html) {
    return c.text("Missing jsx or html", 400);
  }

  const contentHtml = await prepareHTML(jsx, html, style, data);

  const pngBuffer = await htmlToPng(contentHtml, width, height);

  const base64 = `data:image/png;base64,${Buffer.from(pngBuffer).toString(
    "base64",
  )}`;

  return c.text(base64);
});

async function gracefulShutdown() {
  console.log("Shutting down...");
  await browserPool.drain();
  process.exit(0);
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

const port = process.env.PORT || 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});
