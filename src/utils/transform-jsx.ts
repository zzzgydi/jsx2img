import esbuild from "esbuild";
import { readPreactCode } from "./read-preact-code.js";

export async function transformJSX(jsx: string) {
  try {
    const result = await esbuild.transform(jsx, {
      loader: "jsx",
      jsxFactory: "h",
      jsxFragment: "Fragment",
      minify: true,
    });
    return result.code;
  } catch (error: any) {
    throw new Error(`JSX transformation failed: ${error.message}`);
  }
}

export async function prepareHTML(
  jsx: string,
  html: string,
  style: string,
  data: any,
) {
  let contentHtml = html;
  let transformedCode = "";

  const preactCode = readPreactCode();

  if (jsx) {
    transformedCode = await transformJSX(jsx);
    contentHtml = `<div id="root"></div>
      <script>
        ${preactCode}

        const { h, render } = preact;

        ${transformedCode}

        const _data = ${JSON.stringify(data || {})};

        render(h(App, { data: _data }), document.getElementById('root'));
      </script>`;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; }
          html, body {
              background: transparent !important;
              margin: 0;
              padding: 0;
          }
          ${style || ""}
        </style>
      </head>
      <body>
        ${contentHtml}
      </body>
    </html>
  `;
}
