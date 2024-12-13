import fetch from "node-fetch";

const CONCURRENT_REQUESTS = 10;
const TOTAL_REQUESTS = 60;

const testCase = {
  jsx: `
    const App = ({ data }) => (
      <div className={"container"}>
        <h1>Hello, {data.name} !!!</h1>
        <p>This is a test.</p>
        <p>测试测试测试测试</p>
      </div>
    );`,
  html: "",
  style: `
    .container {
        padding: 40px 50px;
        background: #f5f5f5;
        border-radius: 16px;
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
    }`,
  data: {
    name: "World",
  },
  width: 800,
  height: 600,
};

async function sendRequest() {
  try {
    const response = await fetch("http://localhost:3000/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testCase),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function runBatch(requests) {
  return Promise.all(requests.map(() => sendRequest()));
}

async function main() {
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENT_REQUESTS) {
    const batch = new Array(
      Math.min(CONCURRENT_REQUESTS, TOTAL_REQUESTS - i),
    ).fill(null);
    await runBatch(batch);
  }

  const duration = (Date.now() - startTime) / 1000;
  console.log(`Total time: ${duration} seconds`);
  console.log(`Requests per second: ${TOTAL_REQUESTS / duration}`);
}

main();
