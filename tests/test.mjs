import fs from "fs";
import fetch from "node-fetch";

async function sendRequest() {
  const response = await fetch("http://localhost:3000/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsx: 'const App = () => { return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-blue-300 to-green-300"><div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all hover:scale-105 relative"><h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">JSX to IMG</h1><p className="text-gray-600 text-center mb-6">Generate Images with JSX and Tailwind CSS</p><div className="absolute bottom-4 right-4"><p className="text-sm text-gray-500">github.com/zzzgydi</p></div></div></div>  );};',
      width: 600,
      height: 400,
      options: {
        tailwind: true,
      },
    }),
  });
  return response.text();
}

function base64ToPNG(base64Str, filePath) {
  const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(filePath, imageBuffer);
}

async function main() {
  const startTime = Date.now();
  const base64 = await sendRequest();
  base64ToPNG(base64, "tests/example.png");

  const duration = (Date.now() - startTime) / 1000;
  console.log(`Total time: ${duration} seconds`);
}

main();
