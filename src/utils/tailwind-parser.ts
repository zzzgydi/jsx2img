import postcss from "postcss";
import tailwindcss from "tailwindcss";

const css = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
`;

export async function parseTailwindCSS(jsx: string) {
  const result = await postcss([
    tailwindcss({
      content: [{ raw: jsx, extension: "tsx" }],
      theme: {
        extend: {},
      },
    }),
  ]).process(css, {
    from: undefined,
  });

  return result.css;
}

export async function parseTailwindCSSFromHTML(html: string) {
  const result = await postcss([
    tailwindcss({
      content: [{ raw: html, extension: "html" }],
      theme: {
        extend: {},
      },
    }),
  ]).process(css, {
    from: undefined,
  });
  return result.css;
}
