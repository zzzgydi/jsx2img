import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { prepareHTML } from "./utils/transform-jsx.js";
import { htmlToPng } from "./utils/html-to-png.js";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const testCase = {
  jsx: `
    const App = () => (
      <div className={"container"}>
        <h1>Hello, {data.name} !!!</h1>
        <p>This is a test.</p>
      </div>
    );`,
  style: `
          .container {
              padding: 40px 50px;
              background: #f0f;
              border-radius: 40px;
          }
          h1 { color: blue; }
          p { 
              color: red;
              font-size: 16px;
              line-height: 1.5;
              padding: 10px 0;
              margin-bottom: 10px;
              text-align: left;
              border-bottom: 1px solid #ccc;
          }
      `,
  data: {
    name: "World",
  },
  width: 800,
  height: 600,
};

app.post("/convert", async (c) => {
  const { jsx, html, style, data, width, height } = await c.req.json();
  const contentHtml = await prepareHTML(jsx, html, style, data);

  const pngBuffer = await htmlToPng(contentHtml, width, height);

  const base64 = `data:image/png;base64,${Buffer.from(pngBuffer).toString(
    "base64",
  )}`;

  return c.text(base64);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
