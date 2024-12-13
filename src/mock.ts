export const testCase = {
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
