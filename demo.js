const express = require("express");
const puppeteer = require("puppeteer");
const { S3 } = require("@aws-sdk/client-s3");
const bodyParser = require("body-parser");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const esbuild = require("esbuild");
const fs = require("fs");

const app = express();

// 配置中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 读取 Preact 源码
const preactCode = fs.readFileSync(
  path.join(__dirname, "./lib/preact@10.25.2.min.js"),
  "utf8",
);

// S3 配置
const s3 = new S3({
  region: "your-region",
  credentials: {
    accessKeyId: "your-access-key",
    secretAccessKey: "your-secret-key",
  },
});

const S3_BUCKET = "your-bucket-name";

// HTML to PNG 转换函数
async function htmlToPng(html, width = 800, height = 600) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    // 获取实际内容的大小
    const elementHandle = await page.$("body > *");
    const bbox = await elementHandle.boundingBox();

    // 使用透明截图设置
    const screenshot = await page.screenshot({
      type: "png",
      omitBackground: true, // 关键设置：使背景透明
      clip: {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
      },
    });

    return screenshot;
  } finally {
    await browser.close();
  }
}

async function transformJSX(jsx) {
  try {
    const result = await esbuild.transform(jsx, {
      loader: "jsx",
      jsxFactory: "h",
      jsxFragment: "Fragment",
      minify: true,
    });
    return result.code;
  } catch (error) {
    throw new Error(`JSX transformation failed: ${error.message}`);
  }
}

// 上传到 S3
async function uploadToS3(buffer, fileName) {
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: buffer,
    ContentType: "image/png",
  };

  try {
    const result = await s3.putObject(params);
    return `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw error;
  }
}

testCase = {
  jsx: `
        <div className={"container"}>
            <h1>Hello, {data.name} !!!</h1>
            <p>This is a test.</p>
        </div>
    `,
  html: `
          <div class="container">
              <h1>Hello, World!</h1>
              <p>This is a test.</p>
          </div>
          <div class="container">
              <h1>Hello, World!</h1>
              <p>This is a test.</p>
          </div>
          <div class="container">
              <h1>Hello, World!</h1>
              <p>This is a test.</p>
              <p>This is a test.</p>
              <p>This is a test.</p>
              <p>This is a test.</p>
              <p>This is a test.</p>
              <p>This is a test.</p>
              <p>This is a test.</p>
              <p>This is a test.</p>
              <p>This is a test.</p>
              <p>This is a test.</p>
              <p>This is a test.</p>
          </div>
      `,
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
  width: 400,
  height: 300,
};

// API 端点
app.post("/convert", async (req, res) => {
  try {
    // const { html, style, data, width, height } = req.body;
    const { jsx, html, style, data, width, height } = testCase;

    let contentHtml = html;
    let transformedCode = "";
    if (jsx) {
      const app = `
            const data = ${JSON.stringify(data || {})};
            const App = (data) => {
                return (${jsx});
            };
        `;
      transformedCode = await transformJSX(app);
      contentHtml = `
        <div id="root"></div>
        <script>

          ${preactCode}

          const { h, render } = preact;
          
          ${transformedCode}

          render(h(App, { data }), document.getElementById('root'));
        </script>
      `;
    }

    // 组合完整的 HTML
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; }
            html, body {
                background: transparent !important;
                margin: 0;
                padding: 0;
                border-radius: 40px;
            }
            ${style || ""}
          </style>
        </head>
        <body>
          ${contentHtml}
        </body>
      </html>
    `;

    // 转换为图片
    const pngBuffer = await htmlToPng(fullHtml, width, height);

    // 图片buffer转base64
    const base64 = `data:image/png;base64,${Buffer.from(pngBuffer).toString(
      "base64",
    )}`;

    // 生成唯一文件名
    // const fileName = `${uuidv4()}.png`;

    // // 上传到 S3
    // const fileUrl = await uploadToS3(pngBuffer, fileName);

    res.json({
      success: true,
      //   url: fileUrl,
      transformedCode,
      base64,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
