import postcss from "postcss";
import tailwindcss from "tailwindcss";

export async function parseTailwindCSS(jsx: string) {
  const css = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `;

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
