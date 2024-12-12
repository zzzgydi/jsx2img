import fs from "fs";
import path from "path";

let preactCode: string;

export const readPreactCode = () => {
  if (preactCode) return preactCode;

  preactCode = fs.readFileSync(
    path.join(process.cwd(), "lib/preact.min.js"),
    "utf8",
  );

  return preactCode;
};
